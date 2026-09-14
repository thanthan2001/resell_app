'use client'

import { useState, useEffect } from 'react'
import { formatDate } from '@/lib/utils'

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState({ totalUsers: 0, unverifiedCount: 0, verifiedCount: 0 })
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('unverified')
  const [approving, setApproving] = useState(null) // userId being approved

  const loadUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/users?filter=${filter}`)
      const data = await res.json()
      if (res.ok) {
        setUsers(data.users || [])
        setStats(data.stats || { totalUsers: 0, unverifiedCount: 0, verifiedCount: 0 })
      } else {
        console.error('Failed to load users:', data.error)
      }
    } catch (err) {
      console.error('Error loading users:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [filter])

  const handleApprove = async (userId) => {
    if (!confirm('Xác nhận duyệt tài khoản này? Email sẽ được xác nhận tự động.')) return

    setApproving(userId)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        // Refresh the list
        await loadUsers()
      } else {
        alert(data.error || 'Có lỗi xảy ra khi duyệt tài khoản.')
      }
    } catch (err) {
      alert('Lỗi kết nối máy chủ!')
    } finally {
      setApproving(null)
    }
  }

  const tabs = [
    { id: 'unverified', label: '⏳ Chờ duyệt', count: stats.unverifiedCount },
    { id: 'verified', label: '✅ Đã xác nhận', count: stats.verifiedCount },
    { id: 'all', label: '👥 Tất cả', count: stats.totalUsers },
  ]

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-shop-display text-ink-black flex items-center gap-2">
          <span>👥</span> Quản Lý Thành Viên
        </h1>
        <p className="text-xs text-muted-gray mt-1">
          Duyệt tài khoản đăng ký email chưa xác nhận, quản lý trạng thái người dùng
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Pending */}
        <div
          className={`p-5 bg-pure-white rounded-cards shadow-sm-2 border transition-all ${
            stats.unverifiedCount > 0
              ? 'border-amber-300 ring-2 ring-amber-200/50'
              : 'border-faint-border'
          }`}
          style={{ borderRadius: '28px' }}
        >
          <div className="flex items-center justify-between text-xs text-muted-gray mb-2">
            <span>Chờ duyệt</span>
            <span className="w-7 h-7 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-sm">
              ⏳
            </span>
          </div>
          <div className="text-3xl font-bold tracking-shop-display text-amber-600">
            {loading ? '—' : stats.unverifiedCount}
          </div>
          <p className="text-[11px] text-muted-gray mt-1">Email chưa xác nhận</p>
        </div>

        {/* Verified */}
        <div
          className="p-5 bg-pure-white rounded-cards shadow-sm-2 border border-faint-border"
          style={{ borderRadius: '28px' }}
        >
          <div className="flex items-center justify-between text-xs text-muted-gray mb-2">
            <span>Đã xác nhận</span>
            <span className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm">
              ✅
            </span>
          </div>
          <div className="text-3xl font-bold tracking-shop-display text-emerald-600">
            {loading ? '—' : stats.verifiedCount}
          </div>
          <p className="text-[11px] text-muted-gray mt-1">Tài khoản hoạt động</p>
        </div>

        {/* Total */}
        <div
          className="p-5 bg-pure-white rounded-cards shadow-sm-2 border border-faint-border"
          style={{ borderRadius: '28px' }}
        >
          <div className="flex items-center justify-between text-xs text-muted-gray mb-2">
            <span>Tổng thành viên</span>
            <span className="w-7 h-7 rounded-full bg-canvas-mist text-ink-black flex items-center justify-center text-sm">
              👥
            </span>
          </div>
          <div className="text-3xl font-bold tracking-shop-display text-ink-black">
            {loading ? '—' : stats.totalUsers}
          </div>
          <p className="text-[11px] text-muted-gray mt-1">Tất cả tài khoản đăng ký</p>
        </div>
      </div>

      {/* Tabs + Table Card */}
      <div
        className="bg-pure-white rounded-cards shadow-sm-2 border border-faint-border overflow-hidden"
        style={{ borderRadius: '28px' }}
      >
        {/* Tab Filter */}
        <div className="flex items-center gap-2 p-4 border-b border-faint-border overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 rounded-pill text-xs font-medium tracking-shop-body transition-all whitespace-nowrap cursor-pointer ${
                filter === tab.id
                  ? 'bg-ink-black text-white'
                  : 'text-muted-gray hover:text-ink-black hover:bg-canvas-mist border border-faint-border'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  filter === tab.id ? 'bg-white/20 text-white' : 'bg-canvas-mist text-muted-gray'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="py-16 text-center">
            <div className="w-8 h-8 border-2 border-faint-border border-t-shop-violet rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-muted-gray">Đang tải danh sách...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center text-muted-gray space-y-1 text-xs">
            <div className="text-2xl">
              {filter === 'unverified' ? '🎉' : '📭'}
            </div>
            <div className="font-semibold text-ink-black">
              {filter === 'unverified'
                ? 'Không có tài khoản nào đang chờ duyệt!'
                : 'Không có dữ liệu'}
            </div>
            <div>
              {filter === 'unverified'
                ? 'Tất cả tài khoản đã được xác nhận email.'
                : 'Chọn bộ lọc khác để xem thêm.'}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-faint-border text-muted-gray text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Thành viên</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4">Ngày đăng ký</th>
                  <th className="py-3 px-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-faint-border">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-canvas-mist/30 transition-colors">
                    {/* User info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-canvas-mist border border-faint-border flex items-center justify-center text-xs font-semibold text-ink-black flex-shrink-0">
                          {(u.email || 'U')[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-ink-black text-xs">
                            {u.display_name}
                          </div>
                          {u.role === 'admin' && (
                            <span className="text-[10px] font-bold text-shop-violet">
                              Admin
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-3.5 px-4 text-ink-black font-mono text-[11px]">
                      {u.email}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      {u.email_confirmed ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-pill bg-emerald-50 text-emerald-700 text-[11px] font-semibold">
                          <span>✓</span> Đã xác nhận
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-pill bg-amber-50 text-amber-700 text-[11px] font-semibold">
                          <span>⏳</span> Chờ duyệt
                        </span>
                      )}
                    </td>

                    {/* Created At */}
                    <td className="py-3.5 px-4 text-muted-gray text-[11px]">
                      {formatDate(u.created_at)}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      {!u.email_confirmed ? (
                        <button
                          type="button"
                          onClick={() => handleApprove(u.id)}
                          disabled={approving === u.id}
                          className="px-3.5 py-1.5 bg-shop-violet text-white rounded-pill text-[11px] font-semibold hover:bg-[#4323d4] transition-colors shadow-lg-2 disabled:opacity-50 cursor-pointer"
                        >
                          {approving === u.id ? 'Đang duyệt...' : '✓ Duyệt tài khoản'}
                        </button>
                      ) : (
                        <span className="text-[11px] text-muted-gray">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
