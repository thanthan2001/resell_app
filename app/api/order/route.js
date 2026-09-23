import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { sendTelegramNotification, formatNewOrderMessage } from '@/lib/telegram'
import { isEmailAdmin } from '@/lib/auth/admin'
import { isExcludedProduct } from '@/lib/utils'

/**
 * Robust authentication helper checking Bearer token first, then SSR cookies
 */
async function getAuthenticatedUser(request, supabase) {
  // 1. Try Bearer token in Authorization header
  const authHeader = request.headers.get('Authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim()
    if (token) {
      try {
        const serviceClient = createServiceClient()
        const { data: { user }, error } = await serviceClient.auth.getUser(token)
        if (!error && user) return user
      } catch (e) {
        // Fallback to cookie
      }
    }
  }

  // 2. Try cookie session
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (!error && user) return user
  } catch (e) {
    // Ignore
  }

  return null
}

/**
 * Fetch orders endpoint (for both user dashboard and admin)
 */
export async function GET(request) {
  try {
    const supabase = await createClient()
    const user = await getAuthenticatedUser(request, supabase)
    if (!user) {
      return NextResponse.json({ error: 'Vui lòng đăng nhập để xem đơn hàng' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const isAdminQuery = searchParams.get('admin') === 'true'

    const serviceClient = createServiceClient()

    if (isAdminQuery) {
      // Check admin authority
      const { data: profile } = await serviceClient
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      const isAdmin = profile?.role === 'admin' || isEmailAdmin(user.email)
      if (!isAdmin) {
        return NextResponse.json({ error: 'Forbidden: Yêu cầu quyền Quản trị viên' }, { status: 403 })
      }

      const { data: allOrders, error: adminErr } = await serviceClient
        .from('orders')
        .select('*, profiles!orders_user_id_fkey(display_name, email)')
        .order('created_at', { ascending: false })

      if (adminErr) {
        console.error('Admin fetch orders error:', adminErr)
        return NextResponse.json({ error: adminErr.message }, { status: 500 })
      }

      return NextResponse.json({ success: true, orders: allOrders || [] })
    }

    // Normal user: fetch only their orders
    const { data: userOrders, error: userErr } = await serviceClient
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (userErr) {
      console.error('User fetch orders error:', userErr)
      return NextResponse.json({ error: userErr.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, orders: userOrders || [] })
  } catch (error) {
    console.error('GET /api/order error:', error)
    return NextResponse.json({ error: error.message || 'Lỗi khi tải đơn hàng' }, { status: 500 })
  }
}

/**
 * Create new pending order endpoint
 */
export async function POST(request) {
  try {
    const supabase = await createClient()

    // Verify user is authenticated (Dual-Auth: Header or Cookie)
    const user = await getAuthenticatedUser(request, supabase)
    if (!user) {
      return NextResponse.json({ error: 'Vui lòng đăng nhập để tiếp tục' }, { status: 401 })
    }

    const body = await request.json()
    const {
      action = 'transfer',
      productId,
      productName,
      quantity = 1,
      unitPrice,
      customerEmail,
      orderCode: requestedCode,
    } = body

    if (!productId || !quantity || !unitPrice) {
      return NextResponse.json({ error: 'Thiếu thông tin sản phẩm hoặc giá' }, { status: 400 })
    }

    if (isExcludedProduct({ name: productName })) {
      return NextResponse.json({ error: 'Sản phẩm không hợp lệ hoặc đã ngừng kinh doanh' }, { status: 400 })
    }

    const totalPrice = Number(unitPrice) * Number(quantity)

    // Generate unique order code if not provided
    const orderCode = requestedCode || `ST-${Date.now().toString(36).toUpperCase()}`

    const customerName = user.user_metadata?.full_name || user.user_metadata?.name || ''
    const email = customerEmail || user.email

    // Insert order using Service Role client to bypass RLS and guarantee atomic insertion
    const serviceClient = createServiceClient()
    const { data: newOrder, error: orderError } = await serviceClient
      .from('orders')
      .insert({
        user_id: user.id,
        product_id: productId,
        product_name: productName || productId,
        quantity: Number(quantity),
        unit_price: Number(unitPrice),
        total_price: totalPrice,
        client_order_code: orderCode,
        status: 'pending',
        delivered_text: null,
      })
      .select()
      .single()

    if (orderError) {
      console.error('Failed to create order in database:', orderError)
      return NextResponse.json(
        { error: 'Không thể tạo đơn hàng trong hệ thống: ' + orderError.message },
        { status: 500 }
      )
    }

    // Send Telegram notification immediately to Admin
    let teleResult = null
    try {
      const telegramMessage = formatNewOrderMessage({
        orderCode,
        productName: productName || productId,
        quantity,
        unitPrice,
        totalPrice,
        customerEmail: email,
        customerName,
        bankAccount: process.env.NEXT_PUBLIC_BANK_ACCOUNT,
        bankId: process.env.NEXT_PUBLIC_BANK_ID,
      })
      teleResult = await sendTelegramNotification(telegramMessage)
      if (!teleResult?.success) {
        console.error('[POST /api/order] Telegram dispatch failed:', teleResult)
      } else {
        console.log('[POST /api/order] Telegram notification dispatched successfully for order:', orderCode)
      }
    } catch (telegramErr) {
      console.error('Telegram dispatch error (non-fatal):', telegramErr)
    }

    return NextResponse.json({
      success: true,
      order: newOrder,
      orderCode,
      totalPrice,
      telegramSent: teleResult?.success ?? false,
      status: 'pending',
      message: 'Đơn hàng đã được tạo thành công và đang chờ xác nhận thanh toán',
    })
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Lỗi hệ thống khi tạo đơn hàng' },
      { status: 500 }
    )
  }
}

/**
 * Admin order fulfillment / status update endpoint
 */
export async function PATCH(request) {
  try {
    const supabase = await createClient()
    const user = await getAuthenticatedUser(request, supabase)

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const serviceClient = createServiceClient()

    // Check admin authority
    const { data: profile } = await serviceClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const isAdmin = profile?.role === 'admin' || isEmailAdmin(user.email)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden: Yêu cầu quyền Quản trị viên' }, { status: 403 })
    }

    const body = await request.json()
    const { orderId, status = 'delivered', deliveredText } = body

    if (!orderId) {
      return NextResponse.json({ error: 'Thiếu mã đơn hàng orderId' }, { status: 400 })
    }

    const updatePayload = {
      status,
    }

    if (deliveredText !== undefined) {
      updatePayload.delivered_text = deliveredText
    }

    const { data: updatedOrder, error: updateError } = await serviceClient
      .from('orders')
      .update(updatePayload)
      .eq('id', orderId)
      .select()
      .single()

    if (updateError) {
      console.error('Update order error:', updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      message: status === 'delivered' ? 'Đã duyệt đơn và cập nhật tài khoản cho khách!' : 'Đã cập nhật trạng thái đơn hàng.',
    })
  } catch (error) {
    console.error('Admin PATCH order error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
