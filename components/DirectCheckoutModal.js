'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ProductIcon from '@/components/ProductIcon'
import { formatCurrency, generateVietQRUrl } from '@/lib/utils'

export default function DirectCheckoutModal({
  isOpen,
  onClose,
  product,
  quantity = 1,
  unitPrice = 0,
  user,
  customerEmails = [],
}) {
  const [copiedField, setCopiedField] = useState(null)
  const [customerEmail, setCustomerEmail] = useState('')
  const [orderCode, setOrderCode] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [createdOrder, setCreatedOrder] = useState(null)

  const bankId = process.env.NEXT_PUBLIC_BANK_ID || 'VCB'
  const bankAccount = process.env.NEXT_PUBLIC_BANK_ACCOUNT || '1030067982'
  const bankName = process.env.NEXT_PUBLIC_BANK_NAME || 'TRAN VAN BE THAN'

  const totalPrice = Number(unitPrice || 0) * Number(quantity || 1)

  useEffect(() => {
    if (isOpen) {
      // Generate unique order code on modal open
      const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase()
      const code = `ST-${randomStr}`
      setOrderCode(code)
      setCustomerEmail(user?.email || '')
      setSuccess(false)
      setError('')
      setSubmitting(false)
      setCreatedOrder(null)
    }
  }, [isOpen, user])

  if (!isOpen || !product) return null

  const qrUrl = `https://img.vietqr.io/image/${bankId}-${bankAccount}-compact2.png?amount=${totalPrice}&addInfo=${encodeURIComponent(
    orderCode
  )}&accountName=${encodeURIComponent(bankName)}`

  const handleCopy = (text, field) => {
    if (!text) return
    navigator.clipboard.writeText(String(text))
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handleConfirmTransfer = async () => {
    setSubmitting(true)
    setError('')

    const emailToSend = Array.isArray(customerEmails) && customerEmails.length > 0
      ? customerEmails.filter(Boolean).join(', ')
      : (customerEmail || user?.email || '')

    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'transfer',
          productId: product.id,
          productName: product.name,
          quantity,
          unitPrice,
          customerEmail: emailToSend,
          orderCode,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.error || 'Đã xảy ra lỗi khi ghi nhận đơn hàng. Vui lòng thử lại!')
      } else {
        setCreatedOrder(data)
        setSuccess(true)
      }
    } catch (err) {
      console.error('Checkout error:', err)
      setError('Lỗi kết nối máy chủ! Vui lòng kiểm tra lại mạng.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-black/40 backdrop-blur-sm animate-fade-in font-sans">
      <div
        className="relative w-full max-w-lg bg-pure-white rounded-cards shadow-2xl border border-faint-border overflow-hidden transition-all animate-pop-in"
        style={{ borderRadius: '28px' }}
      >
        {/* Header */}
        <div className="p-6 border-b border-faint-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-shop-violet/10 text-shop-violet flex items-center justify-center font-bold text-sm">
              💳
            </div>
            <div>
              <h3 className="font-semibold text-ink-black tracking-shop-display text-base">
                {success ? 'Xác Nhận Đơn Hàng' : 'Thanh Toán Chuyển Khoản'}
              </h3>
              <p className="text-xs text-muted-gray">Quét VietQR & Nhập chính xác nội dung</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-canvas-mist hover:bg-faint-border text-muted-gray hover:text-ink-black flex items-center justify-center transition-colors text-sm"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[82vh] overflow-y-auto">
          {success ? (
            /* Success View */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl mx-auto shadow-sm">
                ✓
              </div>
              <h4 className="text-lg font-semibold text-ink-black tracking-shop-display">
                Đã Ghi Nhận Thanh Toán!
              </h4>
              <p className="text-xs text-muted-gray max-w-sm mx-auto leading-relaxed">
                Đơn hàng <span className="font-mono font-bold text-ink-black">{orderCode}</span> đã được chuyển đến bộ phận quản trị. Admin sẽ kiểm tra biến động số dư và bàn giao thông tin tài khoản cho bạn sớm nhất có thể.
              </p>

              <div className="p-4 bg-canvas-mist rounded-2xl border border-faint-border text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-gray">Sản phẩm:</span>
                  <span className="font-medium text-ink-black">{product.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-gray">Số lượng:</span>
                  <span className="font-medium text-ink-black">x{quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-gray">Tổng tiền:</span>
                  <span className="font-bold text-shop-violet">{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-gray">Trạng thái:</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-medium text-[11px]">
                    ⏳ Chờ duyệt thanh toán
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Link
                  href="/dashboard/orders"
                  className="flex-1 py-3 px-4 rounded-pill bg-shop-violet hover:bg-[#4323d4] text-white text-xs font-semibold text-center transition-all shadow-lg-2"
                >
                  Xem Đơn Hàng Của Tôi
                </Link>
                <button
                  onClick={onClose}
                  className="py-3 px-4 rounded-pill border border-faint-border hover:bg-canvas-mist text-ink-black text-xs font-medium transition-colors"
                >
                  Tiếp tục xem sản phẩm
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Details & QR */
            <div className="space-y-5">
              {/* Product Info Bar */}
              <div className="p-3 bg-canvas-mist rounded-2xl flex items-center justify-between border border-faint-border gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-pure-white flex items-center justify-center p-1.5 border border-faint-border shrink-0 shadow-sm">
                    <ProductIcon
                      image={product.image}
                      emoji={product.emoji}
                      name={product.name}
                      size={32}
                    />
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-semibold text-ink-black truncate">{product.name}</div>
                    <div className="text-[11px] text-muted-gray">Số lượng: {quantity}</div>
                  </div>
                </div>
                <div className="text-right whitespace-nowrap shrink-0">
                  <div className="text-sm font-bold text-shop-violet">{formatCurrency(totalPrice)}</div>
                </div>
              </div>

              {/* Slot Emails Summary (if applicable) */}
              {Array.isArray(customerEmails) && customerEmails.length > 0 && customerEmails.some(Boolean) && (
                <div className="p-3 bg-canvas-mist/80 rounded-2xl border border-faint-border text-xs space-y-1.5">
                  <div className="text-[11px] text-muted-gray font-medium flex items-center justify-between">
                    <span>📧 Email nhận kích hoạt ({customerEmails.length} slot):</span>
                  </div>
                  <div className="flex flex-col gap-1 max-h-28 overflow-y-auto">
                    {customerEmails.map((em, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-[11px] bg-pure-white px-3 py-1.5 rounded-lg border border-faint-border text-ink-black"
                      >
                        <span className="text-shop-violet font-semibold text-[10px] uppercase shrink-0">
                          Slot {idx + 1}:
                        </span>
                        <span className="truncate font-mono">{em || '(Chưa nhập)'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* QR Code Presentation */}
              <div className="flex flex-col items-center justify-center p-4 bg-canvas-mist/60 border border-faint-border rounded-2xl">
                <div className="bg-pure-white p-2.5 rounded-xl shadow-sm border border-faint-border mb-3">
                  <img
                    src={qrUrl}
                    alt={`VietQR ${orderCode}`}
                    className="w-48 h-48 object-contain"
                    loading="eager"
                  />
                </div>
                <p className="text-[11px] text-muted-gray text-center flex items-center gap-1.5">
                  <span>📱</span> Mở app ngân hàng bất kỳ để quét mã QR tự động điền
                </p>
              </div>

              {/* Bank Details With 1-Click Copy */}
              <div className="space-y-2 text-xs">
                {/* Account Number */}
                <div className="flex items-center justify-between p-3 bg-canvas-mist rounded-xl border border-faint-border">
                  <div>
                    <div className="text-[10px] text-muted-gray uppercase tracking-wider">Số tài khoản ({bankId})</div>
                    <div className="font-mono font-bold text-sm text-ink-black">{bankAccount}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(bankAccount, 'account')}
                    className="px-3 py-1.5 bg-pure-white hover:bg-faint-border border border-faint-border rounded-pill text-[11px] font-medium text-ink-black transition-colors"
                  >
                    {copiedField === 'account' ? '✓ Đã copy' : 'Sao chép'}
                  </button>
                </div>

                {/* Account Name */}
                <div className="flex items-center justify-between p-3 bg-canvas-mist rounded-xl border border-faint-border">
                  <div>
                    <div className="text-[10px] text-muted-gray uppercase tracking-wider">Chủ tài khoản</div>
                    <div className="font-semibold text-ink-black">{bankName}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(bankName, 'name')}
                    className="px-3 py-1.5 bg-pure-white hover:bg-faint-border border border-faint-border rounded-pill text-[11px] font-medium text-ink-black transition-colors"
                  >
                    {copiedField === 'name' ? '✓ Đã copy' : 'Sao chép'}
                  </button>
                </div>

                {/* Amount */}
                <div className="flex items-center justify-between p-3 bg-canvas-mist rounded-xl border border-faint-border">
                  <div>
                    <div className="text-[10px] text-muted-gray uppercase tracking-wider">Số tiền thanh toán</div>
                    <div className="font-bold text-shop-violet text-sm">{formatCurrency(totalPrice)}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(totalPrice, 'amount')}
                    className="px-3 py-1.5 bg-pure-white hover:bg-faint-border border border-faint-border rounded-pill text-[11px] font-medium text-ink-black transition-colors"
                  >
                    {copiedField === 'amount' ? '✓ Đã copy' : 'Sao chép'}
                  </button>
                </div>

                {/* Transfer Content / Order Code */}
                <div className="flex items-center justify-between p-3 bg-shop-violet/5 border-2 border-shop-violet/30 rounded-xl">
                  <div>
                    <div className="text-[10px] text-shop-violet font-semibold uppercase tracking-wider">
                      Nội dung chuyển khoản (Bắt buộc)
                    </div>
                    <div className="font-mono font-extrabold text-base text-shop-violet">{orderCode}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(orderCode, 'code')}
                    className="px-3 py-1.5 bg-shop-violet hover:bg-[#4323d4] text-white rounded-pill text-[11px] font-medium transition-colors shadow-sm"
                  >
                    {copiedField === 'code' ? '✓ Đã copy' : 'Sao chép'}
                  </button>
                </div>
              </div>

              {/* Warning box */}
              <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-[11px] text-amber-800 leading-relaxed">
                ⚠️ <b>Lưu ý quan trọng:</b> Hãy chuyển đúng <b>{formatCurrency(totalPrice)}</b> và ghi chính xác nội dung <b>{orderCode}</b> để Admin duyệt đơn nhanh nhất!
              </div>

              {/* Customer Email confirmation */}
              <div>
                <label className="block text-[11px] font-medium text-muted-gray mb-1">
                  Email nhận tài khoản / thông tin đơn hàng
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="Nhập email của bạn"
                  className="w-full px-3.5 py-2.5 bg-canvas-mist border border-faint-border rounded-xl text-xs focus:outline-none focus:border-shop-violet text-ink-black"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
                  {error}
                </div>
              )}

              {/* Main CTA: Xác nhận đã thanh toán */}
              <button
                type="button"
                disabled={submitting}
                onClick={handleConfirmTransfer}
                className="w-full py-3.5 px-4 bg-shop-violet hover:bg-[#4323d4] text-white text-xs font-semibold rounded-pill shadow-lg-2 hover:shadow-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                    <span>Đang gửi thông tin đơn hàng...</span>
                  </>
                ) : (
                  <>
                    <span>✓</span>
                    <span>Tôi đã chuyển khoản (Xác nhận thanh toán)</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
