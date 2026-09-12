import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendTelegramNotification, formatNewOrderMessage } from '@/lib/telegram'
import { isEmailAdmin } from '@/lib/auth/admin'
import { isExcludedProduct } from '@/lib/utils'

export async function POST(request) {
  try {
    const supabase = await createClient()

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
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

    // Insert order with 'pending' status for bank transfer (pure insert avoids triggering recursive RLS on profiles)
    const { error: orderError } = await supabase
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

    if (orderError) {
      console.error('Failed to create order in database:', orderError)
      return NextResponse.json(
        { error: 'Không thể tạo đơn hàng trong hệ thống: ' + orderError.message },
        { status: 500 }
      )
    }

    // Send Telegram notification
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
      await sendTelegramNotification(telegramMessage)
    } catch (telegramErr) {
      console.error('Telegram dispatch error (non-fatal):', telegramErr)
    }

    return NextResponse.json({
      success: true,
      orderCode,
      totalPrice,
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
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check admin authority
    const { data: profile } = await supabase
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

    const { data: updatedOrder, error: updateError } = await supabase
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
