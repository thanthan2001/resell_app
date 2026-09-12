'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function AdminDepositsPage() {
  const [deposits, setDeposits] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')
  const [processing, setProcessing] = useState(null)
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

    const { data: { user } } = await supabase.auth.getUser()

    // Get current wallet balance
    const { data: wallet } = await supabase
      .from('wallets')
      .select('balance')
      .eq('user_id', deposit.user_id)
      .single()

    const newBalance = (wallet?.balance || 0) + deposit.amount

    // Update wallet
    await supabase
      .from('wallets')
      .update({ balance: newBalance, updated_at: new Date().toISOString() })
      .eq('user_id', deposit.user_id)

    // Update transaction
    await supabase
      .from('wallet_transactions')
      .update({
        status: 'confirmed',
        balance_after: newBalance,
        confirmed_by: user.id,
      })
      .eq('id', deposit.id)

    setProcessing(null)
    loadDeposits()
  }

  const handleReject = async (deposit) => {
    if (!confirm(`Từ chối yêu cầu nạp ${formatCurrency(deposit.amount)}?`)) return
    setProcessing(deposit.id)

    const { data: { user } } = await supabase.auth.getUser()

    await supabase
      .from('wallet_transactions')
      .update({
        status: 'rejected',
        confirmed_by: user.id,
      })
      .eq('id', deposit.id)

    setProcessing(null)
    loadDeposits()
  }

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>💰 Quản lý nạp tiền</h1>
        <div style={{ display: 'flex', gap: 4 }}>
          {['pending', 'confirmed', 'rejected', 'all'].map((f) => (
            <button
              key={f}
              className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setFilter(f)}
            >
              {f === 'pending' ? '⏳ Chờ duyệt'
                : f === 'confirmed' ? '✓ Đã duyệt'
                : f === 'rejected' ? '✗ Từ chối'
                : 'Tất cả'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="skeleton" style={{ height: 300, borderRadius: 16 }}></div>
      ) : deposits.length === 0 ? (
        <div className="empty-state card" style={{ padding: 48 }}>
          <div className="empty-icon">💰</div>
          <h3>Không có yêu cầu nạp tiền</h3>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Người dùng</th>
                <th>Số tiền</th>
                <th>Mã CK</th>
                <th>Trạng thái</th>
                <th>Thời gian</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {deposits.map((dep) => (
                <tr key={dep.id}>
                  <td>
                    <div style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>
                      {dep.profiles?.display_name || '—'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      {dep.profiles?.email || dep.user_id}
                    </div>
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--color-success)', fontFamily: 'var(--font-mono)' }}>
                    +{formatCurrency(dep.amount)}
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.825rem' }}>
                    {dep.reference_code || '—'}
                  </td>
                  <td>
                    <span className={`badge ${
                      dep.status === 'confirmed' ? 'badge-success'
                      : dep.status === 'rejected' ? 'badge-error'
                      : 'badge-warning'
                    }`}>
                      {dep.status === 'confirmed' ? '✓ Xác nhận'
                        : dep.status === 'rejected' ? '✗ Từ chối'
                        : '⏳ Chờ duyệt'}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.825rem', whiteSpace: 'nowrap' }}>{formatDate(dep.created_at)}</td>
                  <td>
                    {dep.status === 'pending' && (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleConfirm(dep)}
                          disabled={processing === dep.id}
                        >
                          {processing === dep.id ? '...' : '✓'}
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleReject(dep)}
                          disabled={processing === dep.id}
                        >
                          ✗
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
