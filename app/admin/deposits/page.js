'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function AdminDepositsPage() {
  const [deposits, setDeposits] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')
  const [processing, setProcessing] = useState(null)
  const [feedbackMsg, setFeedbackMsg] = useState({ id: null, type: '', text: '' })
  const supabase = createClient()

  const loadDeposits = async () => {
    setLoading(true)
    let query = supabase
      .from('wallet_transactions')
      .select('*, profiles!wallet_transactions_user_id_fkey(display_name, email)')
      .eq('type', 'deposit')
      .order('created_at', { ascending: false })

    if (filter !== 'all') {
      query = query.eq('status', filter)
    }

    const { data } = await query
    setDeposits(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadDeposits()
  }, [filter])

  const handleConfirm = async (deposit) => {
    if (!confirm(`Xác nhận nạp ${formatCurrency(deposit.amount)} cho ${deposit.profiles?.email || deposit.user_id}?`)) return
    setProcessing(deposit.id)
    setFeedbackMsg({ id: null, type: '', text: '' })

    try {
      // Atomic: get wallet, update balance, update tx status — all in RPC
      const { error } = await supabase.rpc('confirm_deposit', {
        p_transaction_id: deposit.id,
        p_user_id: deposit.user_id,
        p_amount: deposit.amount,
      })

      if (error) {
        // Fallback: manual 2-step if RPC not yet deployed
        const { data: { user } } = await supabase.auth.getUser()
        const { data: wallet } = await supabase
          .from('wallets')
          .select('balance')
          .eq('user_id', deposit.user_id)
          .single()

        const newBalance = (wallet?.balance || 0) + deposit.amount

        await supabase
          .from('wallets')
          .update({ balance: newBalance, updated_at: new Date().toISOString() })
          .eq('user_id', deposit.user_id)

        await supabase
          .from('wallet_transactions')
          .update({
            status: 'confirmed',
            balance_after: newBalance,
            confirmed_by: user.id,
          })
          .eq('id', deposit.id)
      }

      setFeedbackMsg({ id: deposit.id, type: 'success', text: `✓ Đã xác nhận nạp ${formatCurrency(deposit.amount)}` })
      loadDeposits()
    } catch (err) {
      setFeedbackMsg({ id: deposit.id, type: 'error', text: 'Lỗi hệ thống khi xử lý!' })
    } finally {
      setProcessing(null)
    }
  }

  const handleReject = async (deposit) => {
    if (!confirm(`Từ chối yêu cầu nạp ${formatCurrency(deposit.amount)}?`)) return
    setProcessing(deposit.id)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      await supabase
        .from('wallet_transactions')
        .update({ status: 'rejected', confirmed_by: user.id })
        .eq('id', deposit.id)

      setFeedbackMsg({ id: deposit.id, type: 'error', text: '✗ Đã từ chối yêu cầu nạp tiền.' })
      loadDeposits()
    } catch (err) {
      setFeedbackMsg({ id: deposit.id, type: 'error', text: 'Lỗi hệ thống!' })
    } finally {
      setProcessing(null)
    }
  }

  const filterTabs = [
    { id: 'pending', label: '⏳ Chờ duyệt' },
    { id: 'confirmed', label: '✓ Đã duyệt' },
    { id: 'rejected', label: '✗ Từ chối' },
    { id: 'all', label: 'Tất cả' },
  ]

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-shop-display text-ink-black flex items-center gap-2">
            <span>💰</span> Quản Lý Nạp Tiền
          </h1>
          <p className="text-xs text-muted-gray mt-1">
            Đối soát chuyển khoản VietQR và cộng số dư ví cho khách hàng
          </p>
        </div>

        {/* Filter Pill Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-pure-white rounded-pill border border-faint-border shadow-sm overflow-x-auto">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-pill text-xs font-medium tracking-shop-body whitespace-nowrap transition-colors ${
                filter === tab.id
                  ? 'bg-shop-violet text-white shadow-sm'
                  : 'text-muted-gray hover:text-ink-black'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Deposits Table */}
      <div
        className="bg-pure-white rounded-cards shadow-sm-2 border border-faint-border overflow-hidden"
        style={{ borderRadius: '28px' }}
      >
        {loading ? (
          <div className="p-12 text-center text-xs text-muted-gray flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-faint-border border-t-shop-violet rounded-full animate-spin" />
            <span>Đang tải danh sách nạp tiền...</span>
          </div>
        ) : deposits.length === 0 ? (
          <div className="p-16 text-center text-muted-gray space-y-2">
            <div className="text-3xl">💰</div>
            <div className="text-sm font-semibold text-ink-black">Không có yêu cầu nạp tiền</div>
            <div className="text-xs">Chưa có giao dịch nào phù hợp với bộ lọc hiện tại</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-ink-black border-collapse">
              <thead>
                <tr className="border-b border-faint-border bg-canvas-mist/40 text-[11px] font-semibold text-muted-gray uppercase tracking-wider">
                  <th className="py-3.5 px-5">Người dùng</th>
                  <th className="py-3.5 px-4">Số tiền</th>
                  <th className="py-3.5 px-4">Mã chuyển khoản</th>
                  <th className="py-3.5 px-4">Trạng thái</th>
                  <th className="py-3.5 px-4">Thời gian</th>
                  <th className="py-3.5 px-5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-faint-border">
                {deposits.map((dep) => (
                  <tr key={dep.id} className="hover:bg-canvas-mist/30 transition-colors">
                    {/* User Info */}
                    <td className="py-4 px-5">
                      <div className="font-medium text-ink-black truncate max-w-[180px]">
                        {dep.profiles?.display_name || 'Khách hàng'}
                      </div>
                      <div className="text-[11px] text-muted-gray truncate max-w-[180px]">
                        {dep.profiles?.email || dep.user_id}
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-4 px-4">
                      <span className="font-mono font-bold text-[#10a37f]">
                        +{formatCurrency(dep.amount)}
                      </span>
                    </td>

                    {/* Reference Code */}
                    <td className="py-4 px-4 font-mono text-xs text-ink-black">
                      {dep.reference_code || '—'}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {dep.status === 'confirmed' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          ✓ Đã xác nhận
                        </span>
                      ) : dep.status === 'rejected' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200">
                          ✗ Từ chối
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          Chờ duyệt
                        </span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 text-muted-gray text-[11px] whitespace-nowrap">
                      {formatDate(dep.created_at)}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      {dep.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          {/* Inline feedback */}
                          {feedbackMsg.id === dep.id && (
                            <span className={`text-[11px] font-medium ${feedbackMsg.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
                              {feedbackMsg.text}
                            </span>
                          )}
                          <button
                            onClick={() => handleConfirm(dep)}
                            disabled={processing === dep.id}
                            className="px-3.5 py-1.5 rounded-pill bg-shop-violet hover:bg-[#4323d4] text-white text-[11px] font-semibold transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {processing === dep.id ? '...' : '✓ Xác nhận'}
                          </button>
                          <button
                            onClick={() => handleReject(dep)}
                            disabled={processing === dep.id}
                            className="px-3 py-1.5 rounded-pill border border-faint-border hover:bg-red-50 text-red-600 text-[11px] font-medium transition-colors disabled:opacity-50"
                          >
                            ✗ Từ chối
                          </button>
                        </div>
                      ) : (
                        <span className="text-muted-gray text-[11px]">Đã xử lý</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reload button */}
      <div className="flex justify-end">
        <button
          onClick={loadDeposits}
          className="px-4 py-2 rounded-pill bg-pure-white hover:bg-canvas-mist border border-faint-border text-xs font-medium text-ink-black transition-colors shadow-sm flex items-center gap-1.5"
        >
          <span>🔄</span> Làm mới
        </button>
      </div>
    </div>
  )
}
