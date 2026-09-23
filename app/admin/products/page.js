'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import ProductIcon from '@/components/ProductIcon'
import { formatCurrency } from '@/lib/utils'

export default function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all') // 'all' | 'custom' | 'auto' | 'hidden'
  const [editingPrices, setEditingPrices] = useState({})
  const [savingId, setSavingId] = useState(null)
  const [toastMsg, setToastMsg] = useState(null)

  const showToast = (text, type = 'success') => {
    setToastMsg({ text, type })
    setTimeout(() => setToastMsg(null), 3000)
  }

  const loadProducts = async () => {
    setLoading(true)
    setErrorMsg('')
    try {
      const res = await fetch('/api/admin/products')
      const data = await res.json()

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Không thể tải danh sách sản phẩm từ canboso')
        return
      }

      setProducts(data.products || [])
      // Initialize editing price inputs
      const initialPrices = {}
      ;(data.products || []).forEach((p) => {
        initialPrices[p.id] = p.sellPrice
      })
      setEditingPrices(initialPrices)
    } catch (err) {
      console.error('Error fetching admin products:', err)
      setErrorMsg('Lỗi kết nối máy chủ!')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const handlePriceChange = (id, value) => {
    const numeric = value.replace(/\D/g, '')
    setEditingPrices((prev) => ({
      ...prev,
      [id]: numeric ? Number(numeric) : '',
    }))
  }

  const handleSavePrice = async (product) => {
    const priceVal = editingPrices[product.id]
    if (!priceVal || Number(priceVal) <= 0) {
      showToast('Vui lòng nhập giá bán hợp lệ (> 0đ)', 'error')
      return
    }

    setSavingId(product.id)
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          name: product.name,
          costPrice: product.costPrice,
          sellPrice: Number(priceVal),
          isVisible: product.isVisible,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        showToast(`Đã lưu giá ${formatCurrency(priceVal)} cho "${product.name}"`)
        // Update local product state
        setProducts((prev) =>
          prev.map((p) =>
            p.id === product.id
              ? { ...p, sellPrice: Number(priceVal), customPrice: Number(priceVal), isCustomized: true }
              : p
          )
        )
      } else {
        showToast(data.error || 'Lỗi khi cập nhật giá', 'error')
      }
    } catch (err) {
      showToast('Lỗi kết nối máy chủ!', 'error')
    } finally {
      setSavingId(null)
    }
  }

  const handleResetToAuto = async (product) => {
    if (!confirm(`Khôi phục giá sản phẩm "${product.name}" về theo công thức tự động (${formatCurrency(product.autoPrice)})?`)) {
      return
    }

    setSavingId(product.id)
    try {
      const res = await fetch(`/api/admin/products?id=${encodeURIComponent(product.id)}`, {
        method: 'DELETE',
      })

      const data = await res.json()
      if (res.ok && data.success) {
        showToast(`Đã khôi phục về giá công thức: ${formatCurrency(product.autoPrice)}`)
        setProducts((prev) =>
          prev.map((p) =>
            p.id === product.id
              ? { ...p, sellPrice: p.autoPrice, customPrice: null, isCustomized: false }
              : p
          )
        )
        setEditingPrices((prev) => ({
          ...prev,
          [product.id]: product.autoPrice,
        }))
      } else {
        showToast(data.error || 'Lỗi khi khôi phục', 'error')
      }
    } catch (err) {
      showToast('Lỗi kết nối máy chủ!', 'error')
    } finally {
      setSavingId(null)
    }
  }

  const handleToggleVisibility = async (product) => {
    const newVisibility = !product.isVisible
    setSavingId(product.id)
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          name: product.name,
          costPrice: product.costPrice,
          sellPrice: product.customPrice || null,
          isVisible: newVisibility,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        showToast(newVisibility ? `Đã hiển thị "${product.name}" trên cửa hàng` : `Đã ẩn "${product.name}" khỏi cửa hàng`)
        setProducts((prev) =>
          prev.map((p) =>
            p.id === product.id ? { ...p, isVisible: newVisibility } : p
          )
        )
      } else {
        showToast(data.error || 'Lỗi khi đổi trạng thái hiển thị', 'error')
      }
    } catch (err) {
      showToast('Lỗi kết nối máy chủ!', 'error')
    } finally {
      setSavingId(null)
    }
  }

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (filter === 'custom' && !p.isCustomized) return false
      if (filter === 'auto' && p.isCustomized) return false
      if (filter === 'hidden' && p.isVisible) return false

      if (!searchTerm) return true
      const term = searchTerm.toLowerCase()
      return (
        p.name.toLowerCase().includes(term) ||
        p.id.toLowerCase().includes(term) ||
        (p.category || '').toLowerCase().includes(term)
      )
    })
  }, [products, filter, searchTerm])

  const stats = useMemo(() => {
    const total = products.length
    const customized = products.filter((p) => p.isCustomized).length
    const auto = total - customized
    const hidden = products.filter((p) => !p.isVisible).length
    return { total, customized, auto, hidden }
  }, [products])

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-16">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 animate-pop-in">
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl border text-xs font-semibold flex items-center gap-2 ${
              toastMsg.type === 'error'
                ? 'bg-red-50 text-red-700 border-red-200'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}
          >
            <span>{toastMsg.type === 'error' ? '⚠️' : '✓'}</span>
            <span>{toastMsg.text}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-shop-display text-ink-black flex items-center gap-2">
            <span>🏷️</span> Quản Lý & Tinh Chỉnh Bảng Giá
          </h1>
          <p className="text-xs text-muted-gray mt-1">
            Đồng bộ sản phẩm canboso. Tùy chỉnh giá bán lẻ cố định hoặc dùng công thức tự động theo ý bạn.
          </p>
        </div>

        <button
          onClick={loadProducts}
          disabled={loading}
          className="px-4 py-2.5 rounded-pill bg-pure-white hover:bg-canvas-mist border border-faint-border text-xs font-medium text-ink-black transition-colors shadow-sm self-start sm:self-auto flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <span>🔄</span> {loading ? 'Đang đồng bộ...' : 'Đồng bộ từ canboso'}
        </button>
      </div>

      {/* 4 Stat Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          onClick={() => setFilter('all')}
          className={`p-4 rounded-cards bg-pure-white border cursor-pointer transition-all shadow-sm ${
            filter === 'all' ? 'border-shop-violet ring-1 ring-shop-violet' : 'border-faint-border hover:border-black/20'
          }`}
          style={{ borderRadius: '24px' }}
        >
          <div className="text-[11px] text-muted-gray font-semibold uppercase tracking-wider">Tổng sản phẩm</div>
          <div className="text-2xl font-bold text-ink-black mt-1">{stats.total}</div>
          <div className="text-[10px] text-muted-gray mt-1">Nguồn canboso API</div>
        </div>

        <div
          onClick={() => setFilter('custom')}
          className={`p-4 rounded-cards bg-pure-white border cursor-pointer transition-all shadow-sm ${
            filter === 'custom' ? 'border-shop-violet ring-1 ring-shop-violet' : 'border-faint-border hover:border-black/20'
          }`}
          style={{ borderRadius: '24px' }}
        >
          <div className="text-[11px] text-shop-violet font-semibold uppercase tracking-wider">Giá tùy chỉnh riêng</div>
          <div className="text-2xl font-bold text-shop-violet mt-1">{stats.customized}</div>
          <div className="text-[10px] text-muted-gray mt-1">Đã đặt giá cố định</div>
        </div>

        <div
          onClick={() => setFilter('auto')}
          className={`p-4 rounded-cards bg-pure-white border cursor-pointer transition-all shadow-sm ${
            filter === 'auto' ? 'border-shop-violet ring-1 ring-shop-violet' : 'border-faint-border hover:border-black/20'
          }`}
          style={{ borderRadius: '24px' }}
        >
          <div className="text-[11px] text-muted-gray font-semibold uppercase tracking-wider">Giá công thức tự động</div>
          <div className="text-2xl font-bold text-ink-black mt-1">{stats.auto}</div>
          <div className="text-[10px] text-muted-gray mt-1">Theo Markup chuẩn</div>
        </div>

        <div
          onClick={() => setFilter('hidden')}
          className={`p-4 rounded-cards bg-pure-white border cursor-pointer transition-all shadow-sm ${
            filter === 'hidden' ? 'border-red-400 ring-1 ring-red-400' : 'border-faint-border hover:border-black/20'
          }`}
          style={{ borderRadius: '24px' }}
        >
          <div className="text-[11px] text-red-600 font-semibold uppercase tracking-wider">Đang ẩn khỏi shop</div>
          <div className="text-2xl font-bold text-red-600 mt-1">{stats.hidden}</div>
          <div className="text-[10px] text-muted-gray mt-1">Khách không nhìn thấy</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="w-full sm:w-96">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên sản phẩm, SKU (VD: ChatGPT, MS365, Canva...)"
            className="w-full px-4 py-2.5 bg-pure-white border border-faint-border rounded-pill text-xs focus:outline-none focus:border-shop-violet shadow-sm text-ink-black placeholder:text-muted-gray"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-pure-white rounded-pill border border-faint-border shadow-sm self-stretch sm:self-auto">
          {[
            { id: 'all', label: `Tất cả (${stats.total})` },
            { id: 'custom', label: `Đã chỉnh giá (${stats.customized})` },
            { id: 'auto', label: `Công thức (${stats.auto})` },
            { id: 'hidden', label: `Đang ẩn (${stats.hidden})` },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3.5 py-1.5 rounded-pill text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                filter === f.id
                  ? 'bg-shop-violet text-white shadow-sm'
                  : 'text-muted-gray hover:text-ink-black'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Product Table Container */}
      <div
        className="bg-pure-white rounded-cards shadow-sm-2 border border-faint-border overflow-hidden"
        style={{ borderRadius: '28px' }}
      >
        {loading ? (
          <div className="p-16 text-center text-xs text-muted-gray flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-faint-border border-t-shop-violet rounded-full animate-spin"></div>
            <span>Đang tải danh sách sản phẩm và bảng giá...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-16 text-center text-muted-gray space-y-2">
            <div className="text-3xl">🔍</div>
            <div className="text-sm font-semibold text-ink-black">Không tìm thấy sản phẩm nào</div>
            <div className="text-xs">Thử tìm kiếm với từ khóa khác hoặc chuyển bộ lọc</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-ink-black border-collapse">
              <thead>
                <tr className="border-b border-faint-border bg-canvas-mist/40 text-[11px] font-semibold text-muted-gray uppercase tracking-wider">
                  <th className="py-3.5 px-5">Sản phẩm</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Giá vốn canboso</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Giá công thức</th>
                  <th className="py-3.5 px-4 min-w-[200px]">Giá bán thực tế (Tùy chỉnh)</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Lợi nhuận</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Hiển thị</th>
                  <th className="py-3.5 px-5 text-right whitespace-nowrap">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-faint-border">
                {filteredProducts.map((p) => {
                  const currentInput = editingPrices[p.id] !== undefined ? editingPrices[p.id] : p.sellPrice
                  const isModified = Number(currentInput) !== Number(p.sellPrice)
                  const profit = Number(currentInput || p.sellPrice) - Number(p.costPrice)
                  const profitMargin = p.costPrice > 0 ? Math.round((profit / p.costPrice) * 100) : 0
                  const isSavingThis = savingId === p.id

                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-canvas-mist/30 transition-colors ${
                        !p.isVisible ? 'bg-red-50/20 opacity-75' : ''
                      }`}
                    >
                      {/* Product Info */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-canvas-mist flex items-center justify-center p-1 border border-faint-border shrink-0 shadow-xs">
                            <ProductIcon image={p.image} emoji={p.emoji} name={p.name} size={28} />
                          </div>
                          <div className="min-w-0 max-w-xs">
                            <div className="font-semibold text-ink-black truncate" title={p.name}>
                              {p.name}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted-gray">
                              <span className="font-mono">{p.id.slice(0, 10)}...</span>
                              <span>•</span>
                              <span>{p.available !== null ? `Kho: ${p.available}` : 'Sẵn hàng'}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Cost Price */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-mono font-medium text-muted-gray">
                          {formatCurrency(p.costPrice)}
                        </div>
                        <span className="text-[10px] text-muted-gray">Giá nhập</span>
                      </td>

                      {/* Auto Formula Price */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-mono text-muted-gray font-medium">
                          {formatCurrency(p.autoPrice)}
                        </div>
                        <span className="text-[10px] text-muted-gray">Markup auto</span>
                      </td>

                      {/* Editable Sell Price */}
                      <td className="py-4 px-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <div className="relative">
                              <input
                                type="text"
                                value={currentInput ? new Intl.NumberFormat('vi-VN').format(currentInput) : ''}
                                onChange={(e) => handlePriceChange(p.id, e.target.value)}
                                placeholder="Nhập giá bán"
                                className={`w-32 px-3 py-1.5 bg-pure-white border rounded-xl text-xs font-mono font-bold focus:outline-none transition-all ${
                                  p.isCustomized
                                    ? 'border-shop-violet text-shop-violet bg-shop-violet/5 focus:border-shop-violet'
                                    : 'border-faint-border text-ink-black focus:border-black/30'
                                }`}
                              />
                              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-muted-gray pointer-events-none">
                                đ
                              </span>
                            </div>

                            {/* Quick Save button if modified */}
                            {isModified && (
                              <button
                                type="button"
                                disabled={isSavingThis}
                                onClick={() => handleSavePrice(p)}
                                className="px-3 py-1.5 rounded-pill bg-shop-violet hover:bg-[#4323d4] text-white text-[11px] font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1"
                              >
                                {isSavingThis ? '...' : '💾 Lưu'}
                              </button>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5">
                            {p.isCustomized ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-shop-violet/10 text-shop-violet border border-shop-violet/20">
                                <span>★</span> Giá tùy chỉnh riêng
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-canvas-mist text-muted-gray border border-faint-border">
                                Theo công thức
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Profit calculation */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className={`font-mono font-bold ${profit >= 0 ? 'text-[#10a37f]' : 'text-red-600'}`}>
                          {profit >= 0 ? `+${formatCurrency(profit)}` : formatCurrency(profit)}
                        </div>
                        <span className="text-[10px] font-medium text-muted-gray">
                          {profitMargin >= 0 ? `Lãi ~${profitMargin}%` : `Lỗ ~${profitMargin}%`}
                        </span>
                      </td>

                      {/* Visibility Toggle */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleToggleVisibility(p)}
                          disabled={isSavingThis}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer ${
                            p.isVisible
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              p.isVisible ? 'bg-emerald-500' : 'bg-red-500'
                            }`}
                          ></span>
                          <span>{p.isVisible ? 'Hiển thị' : 'Đang ẩn'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Save button (when not yet modified but want to persist current) */}
                          {!isModified && (
                            <button
                              type="button"
                              disabled={isSavingThis}
                              onClick={() => handleSavePrice(p)}
                              className="px-2.5 py-1 rounded-pill border border-faint-border hover:bg-canvas-mist text-ink-black text-[11px] font-medium transition-colors cursor-pointer"
                              title="Lưu lại giá này"
                            >
                              {isSavingThis ? '...' : 'Sửa giá'}
                            </button>
                          )}

                          {/* Revert button if customized */}
                          {p.isCustomized && (
                            <button
                              type="button"
                              disabled={isSavingThis}
                              onClick={() => handleResetToAuto(p)}
                              className="px-2.5 py-1 rounded-pill border border-faint-border hover:bg-red-50 text-red-600 text-[11px] font-medium transition-colors cursor-pointer"
                              title="Khôi phục về giá tính theo công thức tự động"
                            >
                              ↺ Khôi phục
                            </button>
                          )}

                          {/* View live on shop link */}
                          <Link
                            href={`/shop/${p.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 rounded-pill bg-canvas-mist hover:bg-faint-border text-muted-gray hover:text-ink-black text-[11px] font-medium transition-colors"
                            title="Xem sản phẩm ngoài cửa hàng"
                          >
                            Xem ↗
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
