'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')
  const [searchTerm, setSearchTerm] = useState('')
  const [activeModalOrder, setActiveModalOrder] = useState(null)
  const [deliveredInput, setDeliveredInput] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [feedbackMsg, setFeedbackMsg] = useState('')
  const [copiedCode, setCopiedCode] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const PAGE_SIZE = 20
  const supabase = createClient()

  const loadOrders = async (page = currentPage) => {
    setLoading(true)
    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    let query = supabase
      .from('orders')
      .select('*, profiles!orders_user_id_fkey(display_name, email)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)

    if (filter !== 'all') {
      query = query.eq('status', filter)
    }

    const { data, error, count } = await query
    if (error) {
      console.error('Error fetching orders:', error)
    }
    setOrders(data || [])
    setTotalCount(count || 0)
    setLoading(false)
  }

  useEffect(() => {
    setCurrentPage(1)
    loadOrders(1)
  }, [filter])

  const handleCopy = (text) => {
    if (!text) return
    navigator.clipboard.writeText(text)
    setCopiedCode(text)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const openFulfillModal = (order) => {
    setActiveModalOrder(order)
    setDeliveredInput(order.delivered_text || '')
    setFeedbackMsg('')
  }

  const handleConfirmFulfill = async (e) => {
    e.preventDefault()
    if (!activeModalOrder) return

    setSubmitting(true)
    setFeedbackMsg('')

    try {
      const res = await fetch('/api/order', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: activeModalOrder.id,
          status: 'delivered',
          deliveredText: deliveredInput.trim(),
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setActiveModalOrder(null)
        loadOrders()
      } else {
        setFeedbackMsg(data.error || 'Lỗi khi cập nhật đơn hàng')
      }
    } catch (err) {
      setFeedbackMsg('Lỗi kết nối máy chủ!')
    } finally {
      setSubmitting(false)
    }
  }

  const handleRejectOrder = async (orderId) => {
    if (!confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) return

    try {
      const res = await fetch('/api/order', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          status: 'failed',
        }),
      })

      if (res.ok) {
        loadOrders()
      } else {
        alert('Không thể cập nhật trạng thái đơn hàng!')
      }
    } catch (err) {
      alert('Lỗi kết nối máy chủ!')
    }
  }

  const filteredOrders = orders.filter((o) => {
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    const code = (o.client_order_code || o.source_order_code || '').toLowerCase()
    const email = (o.profiles?.email || '').toLowerCase()
    const name = (o.product_name || '').toLowerCase()
    return code.includes(term) || email.includes(term) || name.includes(term)
  })

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  const goToPage = (page) => {
    setCurrentPage(page)
    loadOrders(page)
  }

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-shop-display text-ink-black flex items-center gap-2">
            <span>📦</span> Quản Lý & Duyệt Đơn Hàng
          </h1>
          <p className="text-xs text-muted-gray mt-1">
            Kiểm tra thông báo Telegram, đối soát chuyển khoản ngân hàng và cấp tài khoản thủ công cho khách
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-pure-white rounded-pill border border-faint-border shadow-sm">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'pending', label: '⏳ Chờ duyệt' },
            { id: 'delivered', label: '✓ Đã giao' },
            { id: 'failed', label: '✗ Đã hủy' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3.5 py-1.5 rounded-pill text-xs font-medium tracking-shop-body transition-colors whitespace-nowrap ${filter === f.id
                ? 'bg-shop-violet text-white shadow-sm'
                : 'text-muted-gray hover:text-ink-black'
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search and Refresh Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="w-full sm:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo mã đơn (ST-...), email khách, sản phẩm..."
            className="w-full px-4 py-2.5 bg-pure-white border border-faint-border rounded-pill text-xs focus:outline-none focus:border-shop-violet shadow-sm text-ink-black placeholder:text-muted-gray"
          />
        </div>
        <button
          onClick={loadOrders}
          className="px-4 py-2 rounded-pill bg-pure-white hover:bg-canvas-mist border border-faint-border text-xs font-medium text-ink-black transition-colors shadow-sm self-end sm:self-auto flex items-center gap-1.5"
        >
          <span>🔄</span> Làm mới danh sách
        </button>
      </div>

      {/* Orders Table Container */}
      <div
        className="bg-pure-white rounded-cards shadow-sm-2 border border-faint-border overflow-hidden"
        style={{ borderRadius: '28px' }}
      >
        {loading ? (
          <div className="p-12 text-center text-xs text-muted-gray flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-faint-border border-t-shop-violet rounded-full animate-spin"></div>
            <span>Đang tải danh sách đơn hàng...</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-16 text-center text-muted-gray space-y-2">
            <div className="text-3xl">📦</div>
            <div className="text-sm font-semibold text-ink-black">Không tìm thấy đơn hàng nào</div>
            <div className="text-xs">Chưa có đơn hàng nào phù hợp với bộ lọc hiện tại</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-ink-black border-collapse">
              <thead>
                <tr className="border-b border-faint-border bg-canvas-mist/40 text-[11px] font-semibold text-muted-gray uppercase tracking-wider">
                  <th className="py-3.5 px-5">Mã Đơn / Nội dung CK</th>
                  <th className="py-3.5 px-4">Khách hàng</th>
                  <th className="py-3.5 px-4">Sản phẩm</th>
                  <th className="py-3.5 px-4">Số tiền</th>
                  <th className="py-3.5 px-4">Trạng thái</th>
                  <th className="py-3.5 px-4">Thời gian</th>
                  <th className="py-3.5 px-5 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-faint-border">
                {filteredOrders.map((order) => {
                  const code = order.client_order_code || order.source_order_code || order.id.slice(0, 8)
                  const isPending = order.status === 'pending'
                  const isDelivered = order.status === 'delivered'

                  return (
                    <tr key={order.id} className="hover:bg-canvas-mist/30 transition-colors">
                      {/* Order Code */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-shop-violet text-xs">
                            {code}
                          </span>
                          <button
                            onClick={() => handleCopy(code)}
                            title="Sao chép mã đơn"
                            className="text-[11px] text-muted-gray hover:text-ink-black transition-colors"
                          >
                            {copiedCode === code ? '✓' : '📋'}
                          </button>
                        </div>
                      </td>

                      {/* Customer Info */}
                      <td className="py-4 px-4">
                        <div className="font-medium text-ink-black truncate max-w-[180px]">
                          {order.profiles?.display_name || 'Khách hàng'}
                        </div>
                        <div className="text-[11px] text-muted-gray truncate max-w-[180px]">
                          {order.profiles?.email || '—'}
                        </div>
                      </td>

                      {/* Product & Qty */}
                      <td className="py-4 px-4">
                        <div className="font-semibold text-ink-black max-w-[200px] truncate">
                          {order.product_name}
                        </div>
                        <div className="text-[11px] text-muted-gray">SL: x{order.quantity}</div>
                      </td>

                      {/* Total Price */}
                      <td className="py-4 px-4 font-bold font-mono text-ink-black whitespace-nowrap">
                        {formatCurrency(order.total_price)}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {isPending ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                            Chờ duyệt
                          </span>
                        ) : isDelivered ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            ✓ Đã bàn giao
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200">
                            ✗ Đã hủy
                          </span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 text-muted-gray text-[11px] whitespace-nowrap">
                        {formatDate(order.created_at)}
                      </td>

                      {/* Action buttons */}
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        {isPending ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openFulfillModal(order)}
                              className="px-3.5 py-1.5 rounded-pill bg-shop-violet hover:bg-[#4323d4] text-white text-[11px] font-semibold transition-all shadow-sm"
                            >
                              ✓ Duyệt & Cấp tài khoản
                            </button>
                            <button
                              onClick={() => handleRejectOrder(order.id)}
                              className="px-2.5 py-1.5 rounded-pill border border-faint-border hover:bg-red-50 text-red-600 text-[11px] font-medium transition-colors"
                            >
                              Hủy
                            </button>
                          </div>
                        ) : isDelivered ? (
                          <button
                            onClick={() => openFulfillModal(order)}
                            className="px-3 py-1 rounded-pill border border-faint-border hover:bg-canvas-mist text-ink-black text-[11px] font-medium transition-colors"
                          >
                            Xem / Sửa thông tin cấp
                          </button>
                        ) : (
                          <span className="text-muted-gray text-[11px]">Đã kết thúc</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-muted-gray">
            Trang {currentPage}/{totalPages} — {totalCount} đơn hàng tổng
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="w-9 h-9 rounded-full bg-pure-white border border-faint-border shadow-sm text-xs font-medium text-ink-black hover:bg-canvas-mist transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
              aria-label="Trang trước"
            >
              ‹
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && p - arr[idx - 1] > 1) acc.push('…')
                acc.push(p)
                return acc
              }, [])
              .map((item, idx) =>
                item === '…' ? (
                  <span key={`ellipsis-${idx}`} className="text-xs text-muted-gray px-1">…</span>
                ) : (
                  <button
                    key={item}
                    onClick={() => goToPage(item)}
                    className={`w-9 h-9 rounded-full text-xs font-semibold transition-all ${
                      item === currentPage
                        ? 'bg-shop-violet text-white shadow-sm'
                        : 'bg-pure-white border border-faint-border text-ink-black hover:bg-canvas-mist'
                    }`}
                  >
                    {item}
                  </button>
                )
              )}

            <button
              onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="w-9 h-9 rounded-full bg-pure-white border border-faint-border shadow-sm text-xs font-medium text-ink-black hover:bg-canvas-mist transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
              aria-label="Trang tiếp"
            >
              ›
            </button>
          </div>
        </div>
      )}

      {/* Modal Duyệt & Cấp Tài Khoản Thủ Công */}
      {activeModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-black/40 backdrop-blur-sm animate-fade-in font-sans">
          <div
            className="w-full max-w-lg bg-pure-white rounded-cards shadow-2xl border border-faint-border overflow-hidden"
            style={{ borderRadius: '28px' }}
          >
            <div className="p-6 border-b border-faint-border flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-ink-black tracking-shop-display text-base">
                  Bàn Giao Tài Khoản / Key Cho Khách
                </h3>
                <p className="text-xs text-muted-gray">
                  Mã đơn: <span className="font-mono font-bold text-shop-violet">{activeModalOrder.client_order_code || activeModalOrder.id.slice(0, 8)}</span>
                </p>
              </div>
              <button
                onClick={() => setActiveModalOrder(null)}
                className="w-8 h-8 rounded-full bg-canvas-mist text-muted-gray hover:text-ink-black flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmFulfill} className="p-6 space-y-4">
              {/* Summary box */}
              <div className="p-3.5 bg-canvas-mist rounded-2xl border border-faint-border text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-gray">Sản phẩm:</span>
                  <span className="font-medium text-ink-black">{activeModalOrder.product_name} x{activeModalOrder.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-gray">Khách hàng:</span>
                  <span className="font-medium text-ink-black">{activeModalOrder.profiles?.email || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-gray">Số tiền thanh toán:</span>
                  <span className="font-bold text-shop-violet">{formatCurrency(activeModalOrder.total_price)}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-black mb-1.5">
                  Nội dung tài khoản / Key / Hướng dẫn kích hoạt
                </label>
                <textarea
                  rows={5}
                  value={deliveredInput}
                  onChange={(e) => setDeliveredInput(e.target.value)}
                  placeholder="Nhập thông tin tài khoản, mật khẩu hoặc key bản quyền cấp cho khách...&#10;VD:&#10;Tài khoản: user@gmail.com&#10;Mật khẩu: Pass123@&#10;Hạn dùng: 30 ngày"
                  className="w-full px-4 py-3 bg-canvas-mist border border-faint-border rounded-2xl text-xs font-mono focus:outline-none focus:border-shop-violet text-ink-black leading-relaxed"
                  required
                />
                <p className="text-[11px] text-muted-gray mt-1">
                  💡 Khách hàng sẽ nhìn thấy thông tin này trực tiếp tại trang Đơn hàng của họ.
                </p>
              </div>

              {feedbackMsg && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                  {feedbackMsg}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 bg-shop-violet hover:bg-[#4323d4] text-white text-xs font-semibold rounded-pill shadow-lg-2 transition-all disabled:opacity-50"
                >
                  {submitting ? 'Đang cập nhật...' : '✓ Xác nhận duyệt & Hoàn tất bàn giao'}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModalOrder(null)}
                  className="py-3 px-5 border border-faint-border hover:bg-canvas-mist rounded-pill text-xs font-medium text-ink-black transition-colors"
                >
                  Đóng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
