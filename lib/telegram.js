/**
 * Telegram notification helper for socialTech Shop
 */

import { formatCurrency } from './utils.js'

export async function sendTelegramNotification(message) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    console.log('[Telegram Notification Mock / Not Configured]:', message)
    return { success: false, reason: 'unconfigured' }
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    })

    const data = await res.json()
    if (!res.ok || !data.ok) {
      console.error('[Telegram] Send error:', data)
      return { success: false, error: data }
    }

    return { success: true, data }
  } catch (err) {
    console.error('[Telegram] Network error:', err)
    return { success: false, error: err.message }
  }
}

/**
 * Format new order notification for Telegram
 */
export function formatNewOrderMessage({
  orderCode,
  productName,
  quantity,
  unitPrice,
  totalPrice,
  customerEmail,
  customerName,
  bankAccount,
  bankId,
}) {
  const timeStr = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })

  return `🔥 <b>ĐƠN HÀNG MỚI CHỜ DUYỆT</b> 🔥
━━━━━━━━━━━━━━━━━━━━
🏷️ <b>Mã đơn / Nội dung CK:</b> <code>${orderCode}</code>
📦 <b>Sản phẩm:</b> ${productName}
🔢 <b>Số lượng:</b> ${quantity}
💰 <b>Tổng tiền:</b> <b>${formatCurrency(totalPrice)}</b>
👤 <b>Khách hàng:</b> ${customerName ? `${customerName} (${customerEmail})` : customerEmail}
🏦 <b>Chuyển về:</b> ${bankId || 'VCB'} - ${bankAccount || '1030067982'}
⏰ <b>Thời gian:</b> ${timeStr}
━━━━━━━━━━━━━━━━━━━━
👉 <i>Admin vui lòng vào Dashboard để kiểm tra giao dịch và bàn giao tài khoản cho khách!</i>`
}
