'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [copiedId, setCopiedId] = useState('')
  const supabase = createClient()

  const loadOrders = async () => {
    try {
      setLoading(true)
      setErrorMsg(null)

      const { data: sessionData } = await supabase.auth.getSession()
      const token = sessionData?.session?.access_token

      const res = await fetch('/api/order', {
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      })

      if (res.ok) {
        const data = await res.json()
        if (data.success && Array.isArray(data.orders)) {
          setOrders(data.orders)
          setLoading(false)
          return
        }
      }

      // Graceful fallback to client Supabase query if needed
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading orders:', error)
        setErrorMsg(error.message)
      } else {
        setOrders(data || [])
      }
    } catch (err) {
      console.error('Catch loadOrders:', err)
      setErrorMsg(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(''), 2000)
  }

  if (loading) {
    return (
      <div className="space-y-4 font-sans">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 bg-pure-white rounded-cards shadow-sm-2 border border-faint-border animate-pulse" style={{ borderRadius: '28px' }}></div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between pb-2 border-b border-faint-border">
        <div>
          <h2 className="text-lg font-semibold tracking-shop-display text-ink-black">
            Lịch sử đơn hàng
          </h2>
          <p className="text-xs text-muted-gray">
            Tổng cộng {orders.length} đơn hàng đã thực hiện
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadOrders}
            className="shop-pill-btn shop-btn-white text-xs py-1.5 px-3 flex items-center gap-1 cursor-pointer"
            title="Làm mới danh sách đơn hàng"
          >
            <span>🔄</span> Làm mới
          </button>
          <Link
            href="/shop"
            className="shop-pill-btn shop-btn-violet text-xs py-1.5 px-4"
          >
            + Mua đơn mới
          </Link>
        </div>
      </div>

      {errorMsg && (
        <div className="p-5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-3 shadow-sm">
          <div className="font-semibold flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-sm">
              <span>⚠️</span> Cần cập nhật chính sách Supabase RLS (Lỗi 42P17)
            </span>
            <button
              type="button"
              onClick={() => {
                const sql = `CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql SECURITY DEFINER SET search_path = public STABLE AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin');
$$;

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can update all profiles" ON public.profiles FOR UPDATE USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Service can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Service can update orders" ON public.orders;

CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all orders" ON public.orders FOR SELECT USING (public.is_admin());
CREATE POLICY "Service can insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Service can update orders" ON public.orders FOR UPDATE USING (true);`
                navigator.clipboard.writeText(sql)
                alert('Đã sao chép đoạn mã SQL! Hãy mở Supabase -> SQL Editor và dán rồi bấm RUN.')
              }}
              className="shop-pill-btn shop-btn-violet text-xs py-1 px-3 cursor-pointer shrink-0"
            >
              📋 Sao chép mã SQL khắc phục
            </button>
          </div>
          <p className="leading-relaxed text-amber-800">
            Chính sách bảo mật cũ trên Supabase đang đệ quy vô hạn khi kiểm tra quyền. Hãy vào <strong>Supabase Dashboard → SQL Editor → New query</strong>, dán đoạn mã SQL trên và bấm <strong>Run</strong> để khắc phục triệt để.
          </p>
        </div>
      )}

      {orders.length === 0 && !errorMsg ? (
        <div
          className="bg-pure-white rounded-cards p-12 text-center shadow-sm-2 border border-faint-border"
          style={{ borderRadius: '28px' }}
        >
          <div className="text-4xl mb-3 opacity-50">📦</div>
          <h3 className="text-base font-semibold text-ink-black mb-1">Chưa có đơn hàng nào</h3>
          <p className="text-xs text-muted-gray mb-5">
            Bạn chưa thực hiện đơn đặt hàng nào. Ghé thăm cửa hàng để khám phá các gói tài khoản AI!
          </p>
          <Link
            href="/shop"
            className="shop-pill-btn shop-btn-violet text-xs py-2.5 px-6"
          >
            Ghé thăm cửa hàng ngay →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-pure-white rounded-cards p-6 shadow-sm-2 border border-faint-border space-y-4"
              style={{ borderRadius: '28px' }}
            >
              {/* Order Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-faint-border">
                <div>
                  <h3 className="text-base font-semibold text-ink-black tracking-shop-body">
                    {order.product_name}
                  </h3>
                  <div className="text-xs text-muted-gray mt-0.5">
                    Mã đơn: <span className="font-mono text-ink-black font-semibold">{order.client_order_code || order.source_order_code || '—'}</span>
                  </div>
                </div>

                <div>
                  <span className={`badge ${
                    order.status === 'delivered' ? 'badge-success'
                    : order.status === 'failed' ? 'badge-error'
                    : order.status === 'refunded' ? 'badge-warning'
                    : 'badge-warning'
                  }`}>
                    {order.status === 'delivered' ? '✓ Đã hoàn tất & cấp hàng'
                      : order.status === 'failed' ? '✕ Đơn đã hủy'
                      : order.status === 'refunded' ? '↩ Đã hoàn tiền'
                      : '⏳ Chờ duyệt thanh toán'}
                  </span>
                </div>
              </div>

              {/* Order Specs Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs py-1">
                <div>
                  <span className="text-[11px] text-muted-gray block">Số lượng:</span>
                  <span className="font-semibold text-ink-black text-sm">{order.quantity}</span>
                </div>
                <div>
                  <span className="text-[11px] text-muted-gray block">Đơn giá:</span>
                  <span className="font-semibold text-ink-black text-sm">{formatCurrency(order.unit_price)}</span>
                </div>
                <div>
                  <span className="text-[11px] text-muted-gray block">Tổng thanh toán:</span>
                  <span className="font-bold text-shop-violet text-sm">{formatCurrency(order.total_price)}</span>
                </div>
                <div>
                  <span className="text-[11px] text-muted-gray block">Thời gian đặt:</span>
                  <span className="text-muted-gray text-xs">{formatDate(order.created_at)}</span>
                </div>
              </div>

              {/* Pending Helper Box */}
              {order.status === 'pending' && (
                <div className="p-3 bg-amber-50 border border-amber-200/70 rounded-2xl text-[11px] text-amber-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                    <span>
                      Đơn hàng đang chờ Admin kiểm tra giao dịch và cấp tài khoản. Nội dung CK: <strong className="font-mono font-bold text-shop-violet">{order.client_order_code || '—'}</strong>
                    </span>
                  </div>
                </div>
              )}

              {/* Delivered Credentials Box */}
              {order.delivered_text && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                    className="shop-pill-btn shop-btn-white text-xs py-1.5 px-4 cursor-pointer"
                  >
                    {selectedOrder === order.id ? '🔒 Thu gọn thông tin nhận hàng' : '🔑 Xem thông tin nhận hàng'}
                  </button>

                  {selectedOrder === order.id && (
                    <div className="mt-3 p-4 rounded-2xl bg-canvas-mist border border-faint-border space-y-2.5">
                      <div className="text-[11px] font-semibold text-ink-black">Thông tin tài khoản / Key bản quyền:</div>
                      <pre className="p-3.5 rounded-xl bg-pure-white border border-faint-border text-xs font-mono text-ink-black whitespace-pre-wrap break-all max-h-48 overflow-y-auto">
                        {order.delivered_text}
                      </pre>
                      <button
                        type="button"
                        onClick={() => handleCopy(order.delivered_text, order.id)}
                        className="shop-pill-btn shop-btn-white text-xs py-1 px-4 cursor-pointer"
                      >
                        {copiedId === order.id ? '✓ Đã sao chép' : '📋 Sao chép thông tin'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
