'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function DashboardPage() {
  const [recentOrders, setRecentOrders] = useState([])
  const [stats, setStats] = useState({ totalOrders: 0, deliveredOrders: 0, pendingOrders: 0, totalSpent: 0 })
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const supabase = createClient()

  const loadDashboard = async () => {
    try {
      setLoading(true)
      setLoadError(null)

      let orderList = null

      const { data: sessionData } = await supabase.auth.getSession()
      const token = sessionData?.session?.access_token

      try {
        const res = await fetch('/api/order', {
          headers: {
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          }
        })
        if (res.ok) {
          const data = await res.json()
          if (data.success && Array.isArray(data.orders)) {
            orderList = data.orders
          }
        }
      } catch (apiErr) {
        // Fallback below
      }

      if (orderList === null) {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setLoading(false)
          return
        }

        const { data: orders, error: ordersErr } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (ordersErr) {
          console.error('Fetch orders error:', ordersErr)
          setLoadError(ordersErr.message)
          orderList = []
        } else {
          orderList = orders || []
        }
      }

      const delivered = orderList.filter((o) => o.status === 'delivered')
      const pending = orderList.filter((o) => o.status === 'pending')
      const totalSpent = delivered.reduce((sum, o) => sum + (o.total_price || 0), 0)

      setRecentOrders(orderList.slice(0, 8))
      setStats({
        totalOrders: orderList.length,
        deliveredOrders: delivered.length,
        pendingOrders: pending.length,
        totalSpent,
      })
    } catch (err) {
      console.error('Dashboard load catch:', err)
      setLoadError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-pure-white rounded-cards p-6 shadow-sm-2 border border-faint-border animate-pulse h-36">
            <div className="h-4 bg-canvas-mist rounded w-1/3 mb-4"></div>
            <div className="h-8 bg-canvas-mist rounded w-2/3"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8 font-sans">
      {loadError && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 space-y-2">
          <div className="font-semibold flex items-center gap-1.5">
            <span>⚠️</span> Chú ý cấu hình Supabase RLS
          </div>
          <p className="leading-relaxed">
            Hệ thống phát hiện chính sách bảo mật cũ trên Supabase đang chặn tải danh sách đơn hàng. Vui lòng chạy đoạn mã SQL khắc phục trong Supabase SQL Editor.
          </p>
        </div>
      )}

      {/* 3 Metric Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Total Orders */}
        <div className="bg-pure-white rounded-cards p-6 shadow-sm-2 border border-faint-border flex flex-col justify-between" style={{ borderRadius: '28px' }}>
          <div>
            <div className="text-xs text-muted-gray uppercase font-semibold tracking-wider mb-1">
              📦 Tổng số đơn hàng
            </div>
            <div className="text-3xl font-bold text-ink-black tracking-tight mt-1">
              {stats.totalOrders} <span className="text-sm font-normal text-muted-gray">đơn</span>
            </div>
          </div>
          <div className="mt-5 pt-3 border-t border-faint-border flex items-center justify-between">
            <span className="text-[11px] text-muted-gray">Thanh toán VietQR trực tiếp</span>
            <Link
              href="/dashboard/orders"
              className="text-xs font-semibold text-warm-accent hover:underline"
            >
              Xem chi tiết →
            </Link>
          </div>
        </div>

        {/* Card 2: Pending Orders */}
        <div className="bg-pure-white rounded-cards p-6 shadow-sm-2 border border-faint-border flex flex-col justify-between" style={{ borderRadius: '28px' }}>
          <div>
            <div className="text-xs text-muted-gray uppercase font-semibold tracking-wider mb-1">
              ⏳ Đơn đang chờ duyệt
            </div>
            <div className="text-3xl font-bold text-amber-600 tracking-tight mt-1">
              {stats.pendingOrders} <span className="text-sm font-normal text-muted-gray">đơn</span>
            </div>
          </div>
          <div className="mt-5 pt-3 border-t border-faint-border flex items-center justify-between">
            <span className="text-[11px] text-muted-gray">Admin đang kiểm tra</span>
            <Link
              href="/dashboard/orders"
              className="text-xs font-semibold text-warm-accent hover:underline"
            >
              Theo dõi →
            </Link>
          </div>
        </div>

        {/* Card 3: Total Spent */}
        <div className="bg-pure-white rounded-cards p-6 shadow-sm-2 border border-faint-border flex flex-col justify-between" style={{ borderRadius: '28px' }}>
          <div>
            <div className="text-xs text-muted-gray uppercase font-semibold tracking-wider mb-1">
              💸 Tổng chi tiêu
            </div>
            <div className="text-3xl font-bold text-warm-accent tracking-tight mt-1">
              {formatCurrency(stats.totalSpent)}
            </div>
          </div>
          <div className="mt-5 pt-3 border-t border-faint-border flex items-center justify-between">
            <span className="text-[11px] text-muted-gray">Giá bản quyền tốt nhất</span>
            <Link
              href="/shop"
              className="text-xs font-semibold text-warm-accent hover:underline"
            >
              Mua sắm ngay →
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-pure-white rounded-cards p-6 shadow-sm-2 border border-faint-border" style={{ borderRadius: '28px' }}>
        <div className="flex items-center justify-between pb-4 border-b border-faint-border mb-4">
          <div>
            <h3 className="text-base font-semibold text-ink-black tracking-shop-body">
              📦 Đơn hàng gần đây
            </h3>
            <p className="text-xs text-muted-gray">Các giao dịch đặt hàng mới nhất của bạn</p>
          </div>
          <Link
            href="/dashboard/orders"
            className="text-xs font-semibold text-warm-accent hover:underline"
          >
            Xem tất cả →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-3xl mb-2 opacity-50">🛒</div>
            <p className="text-xs text-muted-gray mb-4">Bạn chưa thực hiện đơn hàng nào.</p>
            <Link
              href="/shop"
              className="shop-pill-btn shop-btn-accent text-xs"
            >
              Khám phá cửa hàng ngay →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-faint-border text-muted-gray">
                  <th className="pb-3 font-semibold">Mã đơn</th>
                  <th className="pb-3 font-semibold">Sản phẩm</th>
                  <th className="pb-3 font-semibold">SL</th>
                  <th className="pb-3 font-semibold">Tổng tiền</th>
                  <th className="pb-3 font-semibold">Trạng thái</th>
                  <th className="pb-3 font-semibold text-right">Thời gian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-faint-border">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-canvas-mist/40 transition-colors">
                    <td className="py-3 font-mono font-bold text-warm-accent">
                      {order.client_order_code || order.id.slice(0, 8)}
                    </td>
                    <td className="py-3 font-medium text-ink-black max-w-xs truncate">
                      {order.product_name}
                    </td>
                    <td className="py-3 text-muted-gray">{order.quantity}</td>
                    <td className="py-3 font-bold text-ink-black">{formatCurrency(order.total_price)}</td>
                    <td className="py-3">
                      <span className={`badge ${
                        order.status === 'delivered' ? 'badge-success'
                        : order.status === 'failed' ? 'badge-error'
                        : 'badge-warning'
                      }`}>
                        {order.status === 'delivered' ? '✓ Đã giao'
                          : order.status === 'failed' ? '✕ Đã hủy'
                          : '⏳ Chờ duyệt'}
                      </span>
                    </td>
                    <td className="py-3 text-right text-muted-gray">{formatDate(order.created_at)}</td>
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
