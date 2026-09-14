'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, formatDate } from '@/lib/utils'


export default function AdminOverviewPage() {
  const [stats, setStats] = useState({
    pendingOrders: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingUsers: 0,
  })
  const [recentPending, setRecentPending] = useState([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const loadDashboardData = async () => {
    try {
      // Pending orders count
      const { count: pendingOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')

      // Total users count
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      // Total orders count
      const { count: totalOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })

      // Total revenue (delivered orders)
      const { data: deliveredOrders } = await supabase
        .from('orders')
        .select('total_price')
        .eq('status', 'delivered')

      const totalRevenue = (deliveredOrders || []).reduce((sum, o) => sum + (o.total_price || 0), 0)

      // Get top 5 recent pending orders
      const { data: pendingList } = await supabase
        .from('orders')
        .select('*, profiles!orders_user_id_fkey(display_name, email)')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(5)

      // Fetch pending users count
      let pendingUsersCount = 0
      try {
        const usersRes = await fetch('/api/admin/users?filter=unverified')
        const usersData = await usersRes.json()
        if (usersRes.ok) {
          pendingUsersCount = usersData.stats?.unverifiedCount || 0
        }
      } catch (e) {
        console.error('Failed to fetch pending users:', e)
      }

      setStats({
        pendingOrders: pendingOrders || 0,
        totalUsers: totalUsers || 0,
        totalOrders: totalOrders || 0,
        totalRevenue,
        pendingUsers: pendingUsersCount,
      })
      setRecentPending(pendingList || [])
    } catch (err) {
      console.error('Error loading admin stats:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* Top Welcome Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-shop-display text-ink-black flex items-center gap-2">
            <span>👑</span> Bảng Quản Trị Hệ Thống
          </h1>
          <p className="text-xs text-muted-gray mt-1">
            Tổng quan hiệu suất bán hàng, trạng thái xử lý đơn và thông báo Telegram
          </p>
        </div>

        <Link
          href="/admin/orders"
          className="px-4 py-2 bg-shop-violet hover:bg-[#4323d4] text-white text-xs font-semibold rounded-pill shadow-lg-2 transition-all self-start sm:self-auto flex items-center gap-1.5"
        >
          <span>📦</span> Xem tất cả đơn hàng
        </Link>
      </div>

      {/* 5 Metric Cards (Refero 28px Radius) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Pending Orders */}
        <div
          className={`p-6 bg-pure-white rounded-cards shadow-sm-2 border transition-all ${
            stats.pendingOrders > 0
              ? 'border-amber-300 ring-2 ring-amber-200/50'
              : 'border-faint-border'
          }`}
          style={{ borderRadius: '28px' }}
        >
          <div className="flex items-center justify-between text-xs text-muted-gray mb-3">
            <span>Đơn chờ duyệt</span>
            <span className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-sm">
              ⏳
            </span>
          </div>
          <div className="text-3xl font-bold tracking-shop-display text-amber-600">
            {loading ? '—' : stats.pendingOrders}
          </div>
          <p className="text-[11px] text-muted-gray mt-2">
            {stats.pendingOrders > 0 ? 'Có đơn hàng đang chờ bạn kiểm tra' : 'Không có đơn chờ duyệt'}
          </p>
        </div>

        {/* Pending Users */}
        <div
          className={`p-6 bg-pure-white rounded-cards shadow-sm-2 border transition-all ${
            stats.pendingUsers > 0
              ? 'border-shop-violet ring-2 ring-shop-violet/20'
              : 'border-faint-border'
          }`}
          style={{ borderRadius: '28px' }}
        >
          <div className="flex items-center justify-between text-xs text-muted-gray mb-3">
            <span>Chờ duyệt TK</span>
            <span className="w-8 h-8 rounded-full bg-shop-violet/10 text-shop-violet flex items-center justify-center text-sm">
              👥
            </span>
          </div>
          <div className="text-3xl font-bold tracking-shop-display text-shop-violet">
            {loading ? '—' : stats.pendingUsers}
          </div>
          <p className="text-[11px] text-muted-gray mt-2">
            {stats.pendingUsers > 0 ? (
              <Link href="/admin/users" className="text-shop-violet hover:underline font-semibold">
                Duyệt ngay →
              </Link>
            ) : 'Không có TK chờ duyệt'}
          </p>
        </div>

        {/* Total Users */}
        <div
          className="p-6 bg-pure-white rounded-cards shadow-sm-2 border border-faint-border"
          style={{ borderRadius: '28px' }}
        >
          <div className="flex items-center justify-between text-xs text-muted-gray mb-3">
            <span>Khách hàng</span>
            <span className="w-8 h-8 rounded-full bg-canvas-mist text-ink-black flex items-center justify-center text-sm">
              👥
            </span>
          </div>
          <div className="text-3xl font-bold tracking-shop-display text-ink-black">
            {loading ? '—' : stats.totalUsers}
          </div>
          <p className="text-[11px] text-muted-gray mt-2">Tài khoản thành viên đã đăng ký</p>
        </div>

        {/* Total Orders */}
        <div
          className="p-6 bg-pure-white rounded-cards shadow-sm-2 border border-faint-border"
          style={{ borderRadius: '28px' }}
        >
          <div className="flex items-center justify-between text-xs text-muted-gray mb-3">
            <span>Tổng số đơn</span>
            <span className="w-8 h-8 rounded-full bg-canvas-mist text-ink-black flex items-center justify-center text-sm">
              📦
            </span>
          </div>
          <div className="text-3xl font-bold tracking-shop-display text-ink-black">
            {loading ? '—' : stats.totalOrders}
          </div>
          <p className="text-[11px] text-muted-gray mt-2">Tất cả giao dịch trên hệ thống</p>
        </div>

        {/* Revenue */}
        <div
          className="p-6 bg-pure-white rounded-cards shadow-sm-2 border border-faint-border"
          style={{ borderRadius: '28px' }}
        >
          <div className="flex items-center justify-between text-xs text-muted-gray mb-3">
            <span>Doanh thu đã thu</span>
            <span className="w-8 h-8 rounded-full bg-shop-violet/10 text-shop-violet flex items-center justify-center text-sm">
              💰
            </span>
          </div>
          <div className="text-2xl font-bold tracking-shop-display text-shop-violet">
            {loading ? '—' : formatCurrency(stats.totalRevenue)}
          </div>
          <p className="text-[11px] text-muted-gray mt-2">Tính trên các đơn đã bàn giao</p>
        </div>
      </div>

      {/* Pending Orders Quick Action Table */}
      <div
        className="p-6 bg-pure-white rounded-cards shadow-sm-2 border border-faint-border"
        style={{ borderRadius: '28px' }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold tracking-shop-display text-ink-black flex items-center gap-2">
              <span>⚡</span> Đơn Hàng Cần Duyệt Gấp
            </h2>
            <p className="text-xs text-muted-gray">Các đơn chuyển khoản VietQR mới nhất đang đợi cấp tài khoản</p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-semibold text-shop-violet hover:underline"
          >
            Xem tất cả ({stats.pendingOrders}) →
          </Link>
        </div>

        {recentPending.length === 0 ? (
          <div className="py-12 text-center text-muted-gray space-y-1 text-xs">
            <div className="text-2xl">🎉</div>
            <div className="font-semibold text-ink-black">Tuyệt vời! Không còn đơn hàng nào tồn đọng.</div>
            <div>Hệ thống sẽ thông báo qua Telegram ngay khi có đơn mới.</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-faint-border text-muted-gray text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-3">Mã đơn</th>
                  <th className="py-3 px-3">Khách hàng</th>
                  <th className="py-3 px-3">Sản phẩm</th>
                  <th className="py-3 px-3">Số tiền</th>
                  <th className="py-3 px-3">Thời gian</th>
                  <th className="py-3 px-3 text-right">Xử lý</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-faint-border">
                {recentPending.map((order) => (
                  <tr key={order.id} className="hover:bg-canvas-mist/30 transition-colors">
                    <td className="py-3.5 px-3 font-mono font-bold text-shop-violet">
                      {order.client_order_code || order.id.slice(0, 8)}
                    </td>
                    <td className="py-3.5 px-3 text-ink-black font-medium">
                      {order.profiles?.email || '—'}
                    </td>
                    <td className="py-3.5 px-3 text-ink-black font-semibold">
                      {order.product_name} x{order.quantity}
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-ink-black">
                      {formatCurrency(order.total_price)}
                    </td>
                    <td className="py-3.5 px-3 text-muted-gray text-[11px]">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <Link
                        href="/admin/orders"
                        className="px-3 py-1 bg-shop-violet text-white rounded-pill text-[11px] font-semibold hover:bg-[#4323d4] transition-colors inline-block"
                      >
                        Vào duyệt đơn
                      </Link>
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
