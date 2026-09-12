'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, generateRefCode, generateVietQRUrl } from '@/lib/utils'

export default function QuickDepositModal({
  isOpen,
  onClose,
  requiredAmount = 50000,
  onDepositSuccess,
}) {
  const [amount, setAmount] = useState(requiredAmount)
  const [step, setStep] = useState('qr') // 'input' | 'qr'
  const [refCode, setRefCode] = useState('')
  const [copied, setCopied] = useState('')
  const [isDepositing, setIsDepositing] = useState(false)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (isOpen) {
      setAmount(Math.max(10000, requiredAmount))
      setStep('qr')
      setSuccess(false)
      // Generate reference code
      const fetchUserAndInit = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const code = generateRefCode(user.id)
          setRefCode(code)

          // Auto-insert pending transaction into Supabase
          try {
            await supabase.from('wallet_transactions').insert({
              user_id: user.id,
              type: 'deposit',
              amount: Math.max(10000, requiredAmount),
              description: `Nạp tiền nhanh ${formatCurrency(Math.max(10000, requiredAmount))}`,
              reference_code: code,
              status: 'pending',
            })
          } catch (e) {
            console.error('Failed to log pending transaction', e)
          }
        }
      }
      fetchUserAndInit()
    }
  }, [isOpen, requiredAmount])

  // Realtime subscription for wallet updates
  useEffect(() => {
    if (!isOpen) return

    const channel = supabase
      .channel(`quick-deposit-${Math.random()}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'wallets' }, () => {
        setSuccess(true)
        if (onDepositSuccess) onDepositSuccess()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(''), 2000)
  }

  const qrUrl = generateVietQRUrl({
    amount,
    referenceCode: refCode,
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md bg-pure-white rounded-cards shadow-lg overflow-hidden border border-faint-border p-6"
        style={{ borderRadius: '28px' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-faint-border mb-4">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-canvas-mist flex items-center justify-center text-sm">
              💳
            </span>
            <div>
              <h3 className="text-base font-semibold text-ink-black tracking-shop-body">
                Nạp Ví VietQR 24/7
              </h3>
              <p className="text-xs text-muted-gray">
                Quét mã chuyển khoản tức thì không rời trang
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-canvas-mist hover:bg-slate-200 text-ink-black flex items-center justify-center text-sm transition-colors"
            aria-label="Đóng"
          >
            ✕
          </button>
        </div>

        {success ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 text-2xl flex items-center justify-center mx-auto mb-3">
              ✓
            </div>
            <h4 className="text-base font-bold text-ink-black mb-1">
              Nạp tiền thành công!
            </h4>
            <p className="text-xs text-muted-gray mb-6">
              Số dư ví của bạn đã được cập nhật. Bạn có thể tiếp tục mua ngay.
            </p>
            <button
              onClick={onClose}
              className="shop-pill-btn shop-btn-violet w-full py-3"
            >
              Tiếp tục mua hàng →
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* VietQR Code Display */}
            <div className="bg-[#fcfcfd] border border-faint-border rounded-inner-img p-4 text-center">
              <div className="w-56 h-56 mx-auto bg-white rounded-xl shadow-sm p-2 flex items-center justify-center border border-faint-border mb-3">
                <img
                  src={qrUrl}
                  alt="Mã VietQR"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="text-xs text-muted-gray">
                Số tiền cần nạp:{' '}
                <strong className="text-base font-bold text-ink-black">
                  {formatCurrency(amount)}
                </strong>
              </div>
            </div>

            {/* Transfer Details with One-Click Copy */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-canvas-mist border border-faint-border">
                <div>
                  <span className="text-muted-gray block text-[10px]">Nội dung chuyển khoản (bắt buộc):</span>
                  <span className="font-mono font-bold text-ink-black text-sm">{refCode}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(refCode, 'ref')}
                  className="px-3 py-1 rounded-full bg-pure-white hover:bg-slate-50 border border-faint-border text-[11px] font-medium transition-colors"
                >
                  {copied === 'ref' ? '✓ Đã chép' : 'Sao chép'}
                </button>
              </div>

              <p className="text-[11px] text-muted-gray leading-relaxed text-center pt-1">
                ⚡ Hệ thống kiểm tra giao dịch tự động. Sau khi chuyển tiền, ví sẽ được cộng ngay sau 1-3 giây.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="shop-pill-btn shop-btn-white w-full py-2.5 text-xs text-muted-gray hover:text-ink-black"
              >
                Đóng cửa sổ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
