import { formatCurrency, isExcludedProduct } from '@/lib/utils'

const BASE_URL = process.env.SOURCE_API_BASE || 'https://canboso.com'
const API_KEY = process.env.SOURCE_API_KEY || 'tgb_fe1aecd77893df0c7591b584d080c540596ad4369c6c7608'

/**
 * Tính giá bán lẻ Resell (Markup) - PHƯƠNG ÁN 1: Khung Cân Bằng Thực Chiến
 * Kết hợp Tỷ lệ % + Lãi sàn tối thiểu (Min Profit) + Làm tròn tâm lý học (Charm Pricing đuôi 9.000đ):
 * 1. Dưới 1.000đ (Hotmail, micro mail): Kê +80%, tối thiểu lãi +400đ (VD: 550đ -> 990đ)
 * 2. 1.000đ - 30.000đ (Slot giá rẻ, clone): Kê +80%, tối thiểu lãi +12.000đ (VD: 5k -> 19k, 10k -> 29k, 15k -> 29k)
 * 3. 30.000đ - 150.000đ (Capcut, Canva, GPT, Office): Kê +35%, tối thiểu lãi +18.000đ (VD: 50k -> 69k, 65k -> 89k, 100k -> 139k)
 * 4. 150.000đ - 500.000đ (Adobe, GPT Plus, YouTube, Spotify): Kê +20%, tối thiểu lãi +40.000đ (VD: 220k -> 269k, 350k -> 429k)
 * 5. 500.000đ - 1.500.000đ (Gói 3-6 tháng): Kê +18%, tối thiểu lãi +100.000đ (VD: 750k -> 889k, 1.25tr -> 1.48tr)
 * 6. Trên 1.500.000đ (Admin Fam, gói năm): Kê +17%, tối thiểu lãi +250.000đ (VD: 3.6tr -> 4.25tr, 6.5tr -> 7.65tr)
 */
export function calculateResellPrice(costPrice) {
  const cost = Number(costPrice) || 0
  if (cost <= 0) return 0

  // 1. Dưới 1.000đ: Mail rác / Micro items (tránh bán hòa vốn)
  if (cost < 1000) {
    if (cost <= 100) return cost // Giữ nguyên item test 0đ - 100đ
    const raw = Math.max(cost * 1.80, cost + 400)
    return Math.ceil(raw / 10) * 10 // Làm tròn chục: ví dụ 550đ -> 990đ
  }

  let raw = cost
  if (cost < 30000) {
    // 2. 1k - 30k: Bảo hiểm công add thủ công / support, lãi tối thiểu 12.000đ
    raw = Math.max(cost * 1.80, cost + 12000)
  } else if (cost <= 150000) {
    // 3. 30k - 150k: Phân khúc bán chạy nhất, kê 35%, tối thiểu lãi 18.000đ
    raw = Math.max(cost * 1.35, cost + 18000)
  } else if (cost <= 500000) {
    // 4. 150k - 500k: Kê 20%, tối thiểu lãi 40.000đ
    raw = Math.max(cost * 1.20, cost + 40000)
  } else if (cost <= 1500000) {
    // 5. 500k - 1.5tr: Kê 18%, tối thiểu lãi 100.000đ
    raw = Math.max(cost * 1.18, cost + 100000)
  } else {
    // 6. Trên 1.5tr: Kê 17%, tối thiểu lãi 250.000đ (đệm an toàn rủi ro bảo hành dài hạn)
    raw = Math.max(cost * 1.17, cost + 250000)
  }

  // A. Dưới 1.000.000đ: Làm tròn lên mốc đuôi 9.000đ (19k, 29k, 39k, 69k, 89k, 139k, 269k, 429k, 889k)
  if (raw < 1000000) {
    const step = 10000
    return Math.ceil((raw - 9000) / step) * step + 9000
  }

  // B. Từ 1.000.000đ đến 3.000.000đ: Làm tròn chẵn 10.000đ (VD: 1.480.000đ, 1.770.000đ, 2.380.000đ)
  if (raw < 3000000) {
    const step = 10000
    return Math.ceil(raw / step) * step
  }

  // C. Trên 3.000.000đ: Làm tròn chẵn 50.000đ (VD: 4.250.000đ, 7.650.000đ)
  const step = 50000
  return Math.ceil(raw / step) * step
}

/**
 * Normalize raw product from CanBoSo API to standard shop schema
 */
function normalizeProduct(p) {
  const costPrice = typeof p.price === 'object' && p.price !== null ? p.price.amount : (Number(p.price) || 0)
  const available = p.availability ? p.availability.available : (p.available !== undefined ? p.available : null)
  const sold = p.availability ? p.availability.sold : (p.sold || 0)

  // Fix relative image path → absolute URL
  let image = p.image || null
  if (image && !image.startsWith('http://') && !image.startsWith('https://')) {
    image = `${BASE_URL}/${image.replace(/^\/+/, '')}`
  }

  const sellPrice = calculateResellPrice(costPrice)

  return {
    id: p.productId || p.id,
    productId: p.productId || p.id,
    name: p.name,
    description: p.description || '',
    image,
    emoji: p.emoji || null,
    productType: p.productType || 'account',
    costPrice,
    price: sellPrice,
    sellPrice,
    priceText: formatCurrency(sellPrice),
    currency: typeof p.price === 'object' && p.price !== null ? p.price.currency : 'VND',
    available,
    sold,
    productFamily: p.emoji || p.productFamily || null,
    requiresCustomerEmail: Boolean(p.purchaseRequirements?.customerEmail || p.productType === 'slot' || p.productType === 'upgrade_account'),
    purchaseRequirements: p.purchaseRequirements || null,
    promotions: p.promotions || [],
  }
}


/**
 * Format delivered items from purchase API
 */
function formatDelivery(orderData) {
  if (!orderData) return 'Đơn hàng đã được ghi nhận.'

  // Case 1: Account credentials delivered
  if (orderData.delivery && Array.isArray(orderData.delivery.accounts) && orderData.delivery.accounts.length > 0) {
    return orderData.delivery.accounts.map((acc, idx) => {
      const parts = []
      if (acc.user) parts.push(`Tài khoản: ${acc.user}`)
      if (acc.password) parts.push(`Mật khẩu: ${acc.password}`)
      if (acc.verifyEmail) parts.push(`Mail khôi phục: ${acc.verifyEmail}`)
      if (acc.twoFa) parts.push(`Mã 2FA: ${acc.twoFa}`)
      if (acc.cookie) parts.push(`Cookie/Session: ${acc.cookie}`)
      return `[Mục ${idx + 1}]\n${parts.join('\n')}`
    }).join('\n\n--------------------\n\n')
  }

  // Case 2: Slot / Upgrade invite flow
  if (orderData.order) {
    const { productName, customerEmail, fulfillmentStatus, orderCode } = orderData.order
    let msg = `Sản phẩm: ${productName || ''}\nMã đơn: ${orderCode || ''}`
    if (customerEmail) msg += `\nEmail đăng ký: ${customerEmail}`
    if (fulfillmentStatus) msg += `\nTrạng thái xử lý: ${fulfillmentStatus}`
    msg += '\n\n👉 Vui lòng kiểm tra hòm thư / liên kết mời gia đình để hoàn tất kích hoạt.'
    return msg
  }

  return JSON.stringify(orderData.delivery || orderData, null, 2)
}

export async function getCatalog() {
  const url = `${BASE_URL}/api/v2/telegram-buyer/products?key=${encodeURIComponent(API_KEY)}`
  const res = await fetch(url, {
    headers: {
      'Accept': 'application/json',
    },
    next: { revalidate: 60 }, // Cache 1 minute
  })

  if (!res.ok) {
    const errorBody = await res.text().catch(() => '')
    console.error('Catalog fetch error:', res.status, errorBody)
    throw new Error(`Catalog fetch failed: ${res.status}`)
  }

  const data = await res.json()
  const rawProducts = data.products || []
  const activeProducts = rawProducts.filter((p) => !isExcludedProduct(p))
  const normalized = activeProducts.map(normalizeProduct)

  return {
    success: true,
    products: normalized,
  }
}

export async function getBalance() {
  const url = `${BASE_URL}/api/v2/telegram-buyer/balance?key=${encodeURIComponent(API_KEY)}`
  const res = await fetch(url, {
    headers: {
      'Accept': 'application/json',
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error(`Balance fetch failed: ${res.status}`)
  }

  return res.json()
}

export async function createOrder({ productId, quantity = 1, customerEmail, slotMonths }) {
  const url = `${BASE_URL}/api/v2/telegram-buyer/purchase`
  const idempotencyKey = `purchase-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`

  const payload = {
    key: API_KEY,
    product_id: productId,
    quantity: Number(quantity) || 1,
  }

  if (customerEmail) {
    payload.customer_email = customerEmail
  }

  if (slotMonths) {
    payload.slot_months = Number(slotMonths)
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify(payload),
  })

  const result = await res.json().catch(() => ({}))

  if (!res.ok || result.success === false) {
    throw new Error(result.message || `Đặt hàng thất bại (Mã lỗi: ${res.status})`)
  }

  const deliveredText = formatDelivery(result)
  const orderCode = result.order?.orderCode || idempotencyKey

  return {
    success: true,
    orderCode,
    deliveredText,
    rawOrder: result.order,
    payment: result.payment,
  }
}
