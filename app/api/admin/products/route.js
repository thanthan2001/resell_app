import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { isEmailAdmin } from '@/lib/auth/admin'
import { calculateResellPrice } from '@/lib/source-api'
import { isExcludedProduct } from '@/lib/utils'

const BASE_URL = process.env.SOURCE_API_BASE
const API_KEY = process.env.SOURCE_API_KEY

/**
 * Authentication helper checking Bearer token or SSR cookies
 */
async function authenticateAdmin(request) {
  const serviceClient = createServiceClient()

  // 1. Try Bearer token in Authorization header
  const authHeader = request.headers.get('Authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim()
    if (token) {
      const { data: { user }, error } = await serviceClient.auth.getUser(token)
      if (!error && user) {
        const { data: profile } = await serviceClient
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (profile?.role === 'admin' || isEmailAdmin(user.email)) {
          return { user, serviceClient }
        }
      }
    }
  }

  // 2. Try cookie session
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (!error && user) {
      const { data: profile } = await serviceClient
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role === 'admin' || isEmailAdmin(user.email)) {
        return { user, serviceClient }
      }
    }
  } catch (e) {
    // Ignore
  }

  return null
}

/**
 * GET /api/admin/products
 * Returns all canboso products joined with custom prices from product_cache
 */
export async function GET(request) {
  try {
    const auth = await authenticateAdmin(request)
    if (!auth) {
      return NextResponse.json({ error: 'Yêu cầu quyền Quản trị viên' }, { status: 403 })
    }

    const { serviceClient } = auth

    if (!BASE_URL || !API_KEY) {
      return NextResponse.json({ error: 'Chưa cấu hình SOURCE_API_BASE hoặc SOURCE_API_KEY' }, { status: 500 })
    }

    // 1. Fetch raw products from canboso
    const url = `${BASE_URL}/api/v2/telegram-buyer/products?key=${encodeURIComponent(API_KEY)}`
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      cache: 'no-store',
    })

    if (!res.ok) {
      return NextResponse.json({ error: `Lỗi kết nối canboso API (HTTP ${res.status})` }, { status: 502 })
    }

    const data = await res.json()
    const rawProducts = data.products || []
    const activeProducts = rawProducts.filter((p) => !isExcludedProduct(p))

    // 2. Fetch all overrides from Supabase product_cache
    const { data: cacheRows, error: cacheErr } = await serviceClient
      .from('product_cache')
      .select('*')

    if (cacheErr) {
      console.error('Error fetching product_cache:', cacheErr)
    }

    const overridesMap = new Map()
    if (Array.isArray(cacheRows)) {
      cacheRows.forEach((row) => overridesMap.set(row.id, row))
    }

    // 3. Merge products
    const products = activeProducts.map((p) => {
      const id = p.productId || p.id
      const costPrice = typeof p.price === 'object' && p.price !== null ? p.price.amount : (Number(p.price) || 0)
      const autoPrice = calculateResellPrice(costPrice)
      const override = overridesMap.get(id)

      const hasCustomPrice = override && override.sell_price !== null && Number(override.sell_price) > 0
      const customPrice = hasCustomPrice ? Number(override.sell_price) : null
      const sellPrice = hasCustomPrice ? customPrice : autoPrice
      const isVisible = override ? override.is_visible !== false : true

      let image = p.image || null
      if (image && !image.startsWith('http://') && !image.startsWith('https://')) {
        image = `${BASE_URL}/${image.replace(/^\/+/, '')}`
      }

      return {
        id,
        name: p.name,
        description: p.description || '',
        category: p.category || 'other',
        image,
        emoji: p.emoji || null,
        productType: p.productType || 'account',
        available: p.availability ? p.availability.available : (p.available !== undefined ? p.available : null),
        sold: p.availability ? p.availability.sold : (p.sold || 0),
        costPrice,
        autoPrice,
        customPrice,
        sellPrice,
        isCustomized: Boolean(hasCustomPrice),
        isVisible,
        lastSyncedAt: override?.last_synced_at || null,
      }
    })

    return NextResponse.json({
      success: true,
      products,
      totalCount: products.length,
      customizedCount: products.filter((p) => p.isCustomized).length,
      hiddenCount: products.filter((p) => !p.isVisible).length,
    })
  } catch (error) {
    console.error('Admin GET products error:', error)
    return NextResponse.json({ error: error.message || 'Lỗi máy chủ' }, { status: 500 })
  }
}

/**
 * POST /api/admin/products
 * Upsert custom price or visibility into product_cache
 */
export async function POST(request) {
  try {
    const auth = await authenticateAdmin(request)
    if (!auth) {
      return NextResponse.json({ error: 'Yêu cầu quyền Quản trị viên' }, { status: 403 })
    }

    const { serviceClient } = auth
    const body = await request.json()
    const { productId, sellPrice, isVisible = true, name, description, costPrice } = body

    if (!productId) {
      return NextResponse.json({ error: 'Thiếu mã productId' }, { status: 400 })
    }

    const parsedPrice = sellPrice !== null && sellPrice !== undefined && sellPrice !== '' && Number(sellPrice) > 0
      ? Math.round(Number(sellPrice))
      : null

    const payload = {
      id: productId,
      name: name || productId,
      description: description || null,
      price: costPrice ? Number(costPrice) : 0,
      sell_price: parsedPrice,
      is_visible: Boolean(isVisible),
      last_synced_at: new Date().toISOString(),
    }

    const { data, error } = await serviceClient
      .from('product_cache')
      .upsert(payload)
      .select()
      .single()

    if (error) {
      console.error('Error upserting product_cache:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data,
      message: parsedPrice
        ? `Đã cập nhật giá bán thành công: ${new Intl.NumberFormat('vi-VN').format(parsedPrice)}đ`
        : `Đã khôi phục giá theo công thức tự động`,
    })
  } catch (error) {
    console.error('Admin POST products error:', error)
    return NextResponse.json({ error: error.message || 'Lỗi máy chủ' }, { status: 500 })
  }
}

/**
 * DELETE /api/admin/products?id=...
 * Reset product to default formula price
 */
export async function DELETE(request) {
  try {
    const auth = await authenticateAdmin(request)
    if (!auth) {
      return NextResponse.json({ error: 'Yêu cầu quyền Quản trị viên' }, { status: 403 })
    }

    const { serviceClient } = auth
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('id')

    if (!productId) {
      return NextResponse.json({ error: 'Thiếu mã productId' }, { status: 400 })
    }

    const { error } = await serviceClient
      .from('product_cache')
      .delete()
      .eq('id', productId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Đã xóa tùy chỉnh, sản phẩm quay lại giá công thức tự động',
    })
  } catch (error) {
    console.error('Admin DELETE product error:', error)
    return NextResponse.json({ error: error.message || 'Lỗi máy chủ' }, { status: 500 })
  }
}
