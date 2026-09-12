'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, formatDate, generateRefCode, generateVietQRUrl } from '@/lib/utils'

export default function WalletPage() {
  const [wallet, setWallet] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showDeposit, setShowDeposit] = useState(false)
  const [depositAmount, setDepositAmount] = useState('100000')
  const [depositStep, setDepositStep] = useState('input') // 'input' | 'qr'
  const [currentDeposit, setCurrentDeposit] = useState(null)
  const [copied, setCopied] = useState('')
  const supabase = createClient()

  const loadWallet = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: walletData } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', user.id)
      .single()
    setWallet(walletData)

    const { data: txs } = await supabase
      .from('wallet_transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setTransactions(txs || [])

    setLoading(false)
  }

  useEffect(() => {
    loadWallet()

    const channelName = `wallet-updates-${Math.random().toString(36).substring(2, 9)}`
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'wallets' },
        () => {
          loadWallet()
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'wallet_transactions' },
        () => {
          loadWallet()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const handleCreateDeposit = async (customAmt) => {
    const amount = parseInt(customAmt || depositAmount)
    if (!amount || amount < 10000) {
      alert('Số tiền nạp tối thiểu là 10.000 ₫')
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const refCode = generateRefCode(user.id)

    const { data, error } = await supabase.from('wallet_transactions').insert({
      user_id: user.id,
      type: 'deposit',
      amount: amount,
      balance_after: (wallet?.balance || 0),
      description: `Nạp tiền ${formatCurrency(amount)}`,
      reference_code: refCode,
      status: 'pending',
    }).select().single()

    if (error) {
      alert('Lỗi tạo yêu cầu nạp tiền: ' + error.message)
      return
    }

    setCurrentDeposit({ ...data, amount, refCode })
    setDepositStep('qr')
    loadWallet()
  }

  const quickAmounts = [50000, 100000, 200000, 500000, 1000000, 2000000]

  const qrUrl = currentDeposit ? generateVietQRUrl({
    amount: currentDeposit.amount,
    referenceCode: currentDeposit.refCode || currentDeposit.reference_code,
  }) : ''

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(''), 2000)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-44 bg-pure-white rounded-cards shadow-sm-2 border border-faint-border animate-pulse"></div>
        <div className="h-96 bg-pure-white rounded-cards shadow-sm-2 border border-faint-border animate-pulse"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Balance Hero Card */}
      <div
        className="bg-pure-white rounded-cards shadow-sm-2 border border-faint-border p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        style={{ borderRadius: '28px' }}
      >
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-gray uppercase font-semibold tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-[#10a37f] shop-pulse"></span>
            <span>Số dư ví của bạn</span>
          </div>
          <div className="text-4xl sm:text-5xl font-bold text-ink-black tracking-tight">
            {formatCurrency(wallet?.balance || 0)}
          </div>
          <p className="text-xs text-muted-gray mt-2">
            Số dư dùng để mua tài khoản và gia hạn bản quyền trực tiếp trong 5 giây.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowDeposit(true)
            setDepositStep('input')
            setDepositAmount('100000')
          }}
          className="shop-pill-btn shop-btn-violet py-3 px-6 text-sm font-semibold cursor-pointer"
        >
          ➕ Nạp tiền VietQR 24/7
        </button>
      </div>

      {/* Transaction History Table */}
      <div
        className="bg-pure-white rounded-cards shadow-sm-2 border border-faint-border p-6"
        style={{ borderRadius: '28px' }}
      >
        <div className="flex items-center justify-between pb-4 border-b border-faint-border mb-4">
          <div>
            <h3 className="text-base font-semibold text-ink-black tracking-shop-body">
              📜 Lịch sử giao dịch ví
            </h3>
            <p className="text-xs text-muted-gray">Toàn bộ các lần nạp và trừ tiền mua sản phẩm</p>
          </div>
          <span className="text-xs text-muted-gray">{transactions.length} giao dịch</span>
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-12 text-xs text-muted-gray">
            Chưa có giao dịch nào trên tài khoản của bạn.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-faint-border text-muted-gray">
                  <th className="pb-3 font-semibold">Loại GD</th>
                  <th className="pb-3 font-semibold">Mã tham chiếu</th>
                  <th className="pb-3 font-semibold">Mô tả</th>
                  <th className="pb-3 font-semibold">Số tiền</th>
                  <th className="pb-3 font-semibold">Trạng thái</th>
                  <th className="pb-3 font-semibold text-right">Thời gian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-faint-border">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-canvas-mist/40 transition-colors">
                    <td className="py-3">
                      <span className={`badge ${tx.type === 'deposit' ? 'badge-success' : 'badge-info'}`}>
                        {tx.type === 'deposit' ? '➕ Nạp tiền' : '➖ Thanh toán'}
                      </span>
                    </td>
                    <td className="py-3 font-mono font-medium text-ink-black">
                      {tx.reference_code || '—'}
                    </td>
                    <td className="py-3 font-medium text-ink-black">{tx.description}</td>
                    <td className={`py-3 font-bold ${tx.type === 'deposit' ? 'text-[#10a37f]' : 'text-ink-black'}`}>
                      {tx.type === 'deposit' ? `+${formatCurrency(tx.amount)}` : `-${formatCurrency(tx.amount)}`}
                    </td>
                    <td className="py-3">
                      <span className={`badge ${
                        tx.status === 'confirmed' ? 'badge-success'
                        : tx.status === 'failed' ? 'badge-error'
                        : 'badge-warning'
                      }`}>
                        {tx.status === 'confirmed' ? '✓ Thành công'
                          : tx.status === 'failed' ? '✕ Thất bại'
                          : '⏳ Chờ thanh toán'}
                      </span>
                    </td>
                    <td className="py-3 text-right text-muted-gray">{formatDate(tx.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Deposit Modal (Refero Light Canvas Styling) */}
      {showDeposit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div
            className="w-full max-w-lg bg-pure-white rounded-cards shadow-lg border border-faint-border p-6 sm:p-8 overflow-hidden"
            style={{ borderRadius: '28px' }}
          >
            <div className="flex items-center justify-between pb-4 border-b border-faint-border mb-6">
              <div>
                <h3 className="text-lg font-semibold text-ink-black tracking-shop-body">
                  {depositStep === 'input' ? 'Nạp tiền vào ví' : 'Quét mã VietQR thanh toán'}
                </h3>
                <p className="text-xs text-muted-gray">Hệ thống xử lý tự động 24/7</p>
              </div>
              <button
                type="button"
                onClick={() => setShowDeposit(false)}
                className="w-8 h-8 rounded-full bg-canvas-mist hover:bg-slate-200 text-ink-black flex items-center justify-center text-xs transition-colors cursor-pointer"
                aria-label="Đóng"
              >
                ✕
              </button>
            </div>

            {depositStep === 'input' ? (
              <div className="space-y-6">
                {/* Quick Selection Amounts */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-black mb-3">
                    Chọn nhanh số tiền nạp:
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {quickAmounts.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setDepositAmount(String(amt))}
                        className={`py-2 px-3 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                          depositAmount === String(amt)
                            ? 'bg-ink-black text-white border-ink-black shadow-sm'
                            : 'bg-canvas-mist text-ink-black border-faint-border hover:border-black/20'
                        }`}
                      >
                        {formatCurrency(amt)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Amount Input */}
                <div>
                  <label htmlFor="custom-amount" className="block text-xs font-semibold uppercase tracking-wider text-ink-black mb-2">
                    Hoặc nhập số tiền tùy chọn (VND):
                  </label>
                  <input
                    id="custom-amount"
                    type="number"
                    min="10000"
                    step="10000"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="Ví dụ: 150000"
                    className="w-full px-4 py-3 bg-canvas-mist border border-faint-border rounded-full text-sm font-semibold text-ink-black focus:outline-none focus:border-black/20"
                  />
                  <span className="text-[11px] text-muted-gray block mt-1.5">
                    Số tiền tối thiểu: 10.000 ₫
                  </span>
                </div>

                {/* Create Deposit Action */}
                <button
                  type="button"
                  onClick={() => handleCreateDeposit()}
                  className="shop-pill-btn shop-btn-violet w-full py-3.5 text-sm font-semibold cursor-pointer"
                >
                  Tạo mã VietQR chuyển khoản →
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* QR Display */}
                <div className="bg-[#fafafa] border border-faint-border rounded-inner-img p-4 text-center">
                  <div className="w-56 h-56 mx-auto bg-white rounded-xl shadow-sm p-2 flex items-center justify-center border border-faint-border mb-3">
                    {qrUrl && (
                      <img
                        src={qrUrl}
                        alt="Mã VietQR"
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>

                  <div className="text-xs text-muted-gray">
                    Số tiền cần chuyển:{' '}
                    <strong className="text-base font-bold text-ink-black">
                      {formatCurrency(currentDeposit?.amount || 0)}
                    </strong>
                  </div>
                </div>

                {/* Bank Transfer Details with Copy */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-canvas-mist border border-faint-border">
                    <div>
                      <span className="text-muted-gray block text-[10px]">Nội dung chuyển khoản (bắt buộc):</span>
                      <span className="font-mono font-bold text-ink-black text-sm">
                        {currentDeposit?.refCode || currentDeposit?.reference_code}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(currentDeposit?.refCode || currentDeposit?.reference_code, 'ref')}
                      className="px-3 py-1 rounded-full bg-pure-white border border-faint-border text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      {copied === 'ref' ? '✓ Đã chép' : 'Sao chép'}
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-muted-gray text-center leading-relaxed">
                  ⚡ Tiền sẽ tự động cộng vào ví của bạn sau khi ngân hàng xử lý thành công (1-3 giây).
                </p>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setDepositStep('input')}
                    className="shop-pill-btn shop-btn-white flex-1 py-2.5 text-xs font-medium cursor-pointer"
                  >
                    ← Chọn số tiền khác
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeposit(false)}
                    className="shop-pill-btn shop-btn-violet flex-1 py-2.5 text-xs font-semibold cursor-pointer"
                  >
                    Hoàn tất
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
