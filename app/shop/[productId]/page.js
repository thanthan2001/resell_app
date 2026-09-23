'use client'

import { useState, useEffect, use, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductIcon from '@/components/ProductIcon'
import DirectCheckoutModal from '@/components/DirectCheckoutModal'
import { createClient } from '@/lib/supabase/client'
import {
  formatCurrency,
  getProductCategory,
  formatDuration,
  formatWarranty,
  formatAccountType,
  groupProducts,
  getVariantLabel,
} from '@/lib/utils'

export default function ProductDetailPage({ params }) {
  const { productId } = use(params)
  const [product, setProduct] = useState(null)
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [customerEmails, setCustomerEmails] = useState([''])
  const [buying, setBuying] = useState(false)
  const [createdOrder, setCreatedOrder] = useState(null)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [user, setUser] = useState(null)
  const [wallet, setWallet] = useState(null)
  const [copied, setCopied] = useState(false)
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)
  const [showStickyBar, setShowStickyBar] = useState(false)
  const buyBarRef = useRef(null)
  const router = useRouter()
  const supabase = createClient()

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    if (user) {
      setCustomerEmails((prev) => {
        const next = [...prev]
        if (!next[0]) next[0] = user.email || ''
        return next
      })
      const { data } = await supabase
        .from('wallets')
        .select('balance')
        .eq('user_id', user.id)
        .single()
      setWallet(data)
    }
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/catalog')
      const data = await res.json()
      const products = data.products || data || []
      setAllProducts(products)
      const found = products.find((p) => p.id === productId)
      setProduct(found || null)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    checkAuth()
  }, [productId])

  // Track visibility of main buy box to show mobile sticky bottom bar
  useEffect(() => {
    if (!buyBarRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyBar(!entry.isIntersecting)
      },
      { threshold: 0.1 }
    )
    observer.observe(buyBarRef.current)
    return () => observer.disconnect()
  }, [product, loading])

  const handleQuantityChange = (newQty) => {
    const qty = Math.max(1, newQty)
    setQuantity(qty)
    setCustomerEmails((prev) => {
      const next = [...prev]
      if (qty > next.length) {
        while (next.length < qty) {
          next.push('')
        }
      } else {
        return next.slice(0, qty)
      }
      return next
    })
  }

  const handleEmailChange = (index, value) => {
    setCustomerEmails((prev) => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  const handleSelectVariant = (variant) => {
    setProduct(variant)
    setQuantity(1)
    setCustomerEmails((prev) => [prev[0] || (user?.email || '')])
    setError('')
    setResult(null)
    setCreatedOrder(null)
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `/shop/${variant.id}`)
    }
  }

  const handleBuy = async () => {
    if (!user) {
      router.push(`/auth/login?redirect=/shop/${product.id}`)
      return
    }

    const isSlotType = product.productType === 'slot' || product.requiresCustomerEmail
    if (isSlotType) {
      for (let i = 0; i < quantity; i++) {
        const em = (customerEmails[i] || '').trim()
        if (!em) {
          setError(
            quantity > 1
              ? `Vui lòng nhập đầy đủ email cho Slot ${i + 1}`
              : 'Vui lòng nhập email của bạn để hoàn tất đăng ký hoặc nâng cấp'
          )
          return
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
          setError(
            quantity > 1
              ? `Email cho Slot ${i + 1} ("${em}") không đúng định dạng.`
              : `Email "${em}" không đúng định dạng.`
          )
          return
        }
      }
    }

    setError('')
    setCreatedOrder(null)
    setShowCheckoutModal(true)
  }


  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas-mist text-ink-black flex flex-col font-sans">
        <Header />
        <main className="flex-1 pt-24 pb-16 shop-container">
          <div className="h-96 rounded-cards bg-pure-white shadow-sm-2 animate-pulse"></div>
        </main>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-canvas-mist text-ink-black flex flex-col font-sans">
        <Header />
        <main className="flex-1 pt-24 pb-16 shop-container max-w-xl mx-auto text-center">
          <div className="p-12 rounded-cards bg-pure-white shadow-sm-2 border border-faint-border">
            <div className="text-4xl mb-3 opacity-60">🔍</div>
            <h2 className="text-xl font-bold text-ink-black mb-2">Sản phẩm không tồn tại</h2>
            <p className="text-xs text-muted-gray mb-6">
              Gói dịch vụ này có thể đã hết hạn hoặc tạm dừng cung cấp.
            </p>
            <Link
              href="/shop"
              className="shop-pill-btn shop-btn-accent text-xs"
            >
              ← Quay lại cửa hàng
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const category = getProductCategory(product)
  const isAvailable = product.available === null || product.available > 0
  const availableCount = product.available
  const unitPrice = product.sellPrice || product.price || 0
  const originalPrice = Math.round(unitPrice * 1.4 / 1000) * 1000
  const totalPrice = unitPrice * quantity

  const allGroups = groupProducts(allProducts)
  const currentGroup = allGroups.find((g) => g.variants.some((v) => v.id === product.id))
  const groupVariants = currentGroup ? currentGroup.variants : [product]

  return (
    <div className="min-h-screen bg-canvas-mist text-ink-black flex flex-col font-sans">
      <Header />

      <main className="flex-1 pt-24 pb-20">
        <div className="shop-container">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs text-muted-gray mb-8 tracking-shop-body">
            <Link href="/" className="hover:text-ink-black transition-colors">
              Trang chủ
            </Link>
            <span aria-hidden="true" className="opacity-40">/</span>
            <Link href="/shop" className="hover:text-ink-black transition-colors">
              Cửa hàng
            </Link>
            <span aria-hidden="true" className="opacity-40">/</span>
            <span className="text-ink-black font-medium truncate max-w-xs">
              {currentGroup ? currentGroup.name : category.name}
            </span>
          </nav>

          {/* Main 2-Column Product Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column (5 cols): Visual Showcase & Assurance */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24" data-aos="fade-right" suppressHydrationWarning>
              {/* Image Box: 28px Card with 20px Inner Image */}
              <div className="bg-pure-white rounded-cards shadow-sm-2 p-4 border border-faint-border">
                <div
                  className="relative w-full aspect-square bg-[#f5f6f7] flex items-center justify-center p-8 overflow-hidden"
                  style={{ borderRadius: '20px' }}
                >
                  <ProductIcon
                    image={product.image || currentGroup?.image}
                    emoji={product.emoji || currentGroup?.emoji}
                    name={product.name || currentGroup?.name}
                    size={110}
                    className="w-28 h-28 sm:w-32 sm:h-32 object-contain filter drop-shadow-md"
                  />

                  {/* Stock Tag Top Right */}
                  <div className="absolute top-3.5 right-3.5">
                    {isAvailable ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-pure-white/95 backdrop-blur-sm text-ink-black border border-faint-border shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10a37f] shop-pulse"></span>
                        <span>{availableCount ? `Còn ${availableCount}` : 'Sẵn hàng'}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-pure-white/95 text-muted-gray border border-faint-border">
                        Tạm hết
                      </span>
                    )}
                  </div>

                  {/* Category Pill Top Left */}
                  <div className="absolute top-3.5 left-3.5">
                    <span className="inline-block px-3 py-1 rounded-full text-[11px] font-medium bg-pure-white/95 backdrop-blur-sm text-ink-black border border-faint-border shadow-sm">
                      {currentGroup?.badge || category.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Service Assurance Strip */}
              <div className="bg-pure-white rounded-cards p-5 shadow-sm-2 border border-faint-border">
                <div className="grid grid-cols-3 gap-2 text-center divide-x divide-faint-border">
                  <div className="px-2">
                    <div className="text-base mb-1">⚡</div>
                    <div className="text-[10px] text-muted-gray uppercase">Giao hàng</div>
                    <div className="text-xs font-semibold text-ink-black mt-0.5">Tức thì 5s</div>
                  </div>
                  <div className="px-2">
                    <div className="text-base mb-1">🛡️</div>
                    <div className="text-[10px] text-muted-gray uppercase">Bảo hành</div>
                    <div className="text-xs font-semibold text-[#10a37f] mt-0.5">1-đổi-1 trọn gói</div>
                  </div>
                  <a
                    href="https://zalo.me/0788836968"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 hover:opacity-80 transition-opacity block cursor-pointer"
                    title="Liên hệ Zalo 0788836968 hoặc Facebook hỗ trợ 24/7"
                  >
                    <div className="text-base mb-1">💬</div>
                    <div className="text-[10px] text-muted-gray uppercase">Hỗ trợ</div>
                    <div className="text-xs font-semibold text-warm-accent mt-0.5">Zalo / FB 24/7</div>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column (7 cols): Details, Variant Selection & Order Flow */}
            <div className="lg:col-span-7 space-y-6" data-aos="fade-left" suppressHydrationWarning>
              {/* Product Header */}
              <div>
                <span className="inline-block text-xs font-medium text-warm-accent mb-2">
                  {currentGroup ? currentGroup.name : category.name}
                </span>
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-shop-display text-ink-black leading-snug">
                  {product.name}
                </h1>
                <div className="text-xs text-muted-gray mt-2 tracking-shop-caption">
                  Mã SKU: <span className="font-mono text-ink-black">{product.id.toUpperCase()}</span>
                </div>
              </div>

              {/* Price Panel */}
              <div className="bg-pure-white rounded-cards p-6 shadow-sm-2 border border-faint-border flex items-baseline gap-4">
                <div>
                  <div className="text-[10px] uppercase font-semibold text-muted-gray tracking-wider">
                    Giá thanh toán
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-ink-black tracking-tight mt-0.5">
                    {formatCurrency(unitPrice)}
                  </div>
                </div>
                {originalPrice > unitPrice && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-gray line-through">
                      {formatCurrency(originalPrice)}
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-canvas-mist text-ink-black border border-faint-border">
                      TIẾT KIỆM 30%
                    </span>
                  </div>
                )}
              </div>

              {/* Variant Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-black mb-2.5">
                  Chọn phiên bản / Gói cước ({groupVariants.length} lựa chọn)
                </label>

                {/* Calm Showroom Notice for Out of Stock items */}
                <div className="mb-4 p-4 rounded-cards bg-canvas-mist/80 border border-faint-border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0 leading-none mt-0.5">💬</span>
                    <div>
                      <h3 className="text-xs sm:text-sm font-semibold text-ink-black tracking-tight">
                        Cần mua gói cước đang tạm hết hàng?
                      </h3>
                      <p className="text-xs text-muted-gray mt-0.5">
                        Quý khách có thể nhắn tin trực tiếp để Admin hỗ trợ cấp slot riêng nhanh chóng.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 pt-1 sm:pt-0">
                    <a
                      href="https://zalo.me/0788836968"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-initial px-3.5 py-1.5 rounded-full bg-pure-white hover:bg-slate-50 text-ink-black border border-faint-border text-xs font-medium transition-all flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <span>💬 Zalo</span>
                    </a>
                    <a
                      href="https://www.facebook.com/thanthan1011"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-initial px-3.5 py-1.5 rounded-full bg-pure-white hover:bg-slate-50 text-ink-black border border-faint-border text-xs font-medium transition-all flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <span>🌐 Facebook</span>
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {groupVariants.map((variant) => {
                    const isSelected = variant.id === product.id
                    const varAvailable = variant.available === null || variant.available > 0
                    const varPrice = variant.sellPrice || variant.price || 0
                    const label = getVariantLabel(variant)

                    return (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => handleSelectVariant(variant)}
                        className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all cursor-pointer ${isSelected
                            ? 'bg-pure-white border-warm-accent shadow-sm ring-1 ring-warm-accent'
                            : 'bg-pure-white border-faint-border hover:border-black/20 shadow-sm'
                          } ${!varAvailable ? 'opacity-80 bg-canvas-mist/40' : ''}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${isSelected ? 'border-warm-accent bg-warm-accent' : 'border-cool-stone'
                                }`}
                            >
                              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                            </span>
                            <span className="text-xs font-semibold text-ink-black">{label}</span>
                          </div>
                          {isSelected && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-warm-accent text-white">
                              Đang chọn
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-xs pt-2 border-t border-faint-border">
                          <span className="font-bold text-ink-black">{formatCurrency(varPrice)}</span>
                          <span className={`text-[11px] font-semibold ${!varAvailable ? 'text-muted-gray' : 'text-muted-gray'}`}>
                            {varAvailable ? (variant.available ? `Còn ${variant.available}` : 'Sẵn hàng') : '● Tạm hết (Nhắn Admin)'}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Specs Chips */}
              <div className="flex flex-wrap gap-2 text-xs">
                {product.durationType && (
                  <div className="px-3.5 py-1.5 rounded-full bg-pure-white border border-faint-border shadow-sm text-muted-gray">
                    Thời hạn: <strong className="text-ink-black font-semibold">{formatDuration(product.durationType)}</strong>
                  </div>
                )}
                {product.warrantyPolicy && (
                  <div className="px-3.5 py-1.5 rounded-full bg-pure-white border border-faint-border shadow-sm text-muted-gray">
                    Bảo hành: <strong className="text-[#10a37f] font-semibold">{formatWarranty(product.warrantyPolicy)}</strong>
                  </div>
                )}
                {product.accountType && (
                  <div className="px-3.5 py-1.5 rounded-full bg-pure-white border border-faint-border shadow-sm text-muted-gray">
                    Hình thức: <strong className="text-ink-black font-semibold">{formatAccountType(product.accountType)}</strong>
                  </div>
                )}
              </div>

              {/* Customer Email Inputs (When Required or productType is slot) */}
              {(product.requiresCustomerEmail || product.productType === 'slot') && (
                <div className="p-4 sm:p-5 rounded-cards bg-pure-white border border-faint-border shadow-sm space-y-3">
                  {quantity > 1 ? (
                    <>
                      <div className="flex items-center justify-between border-b border-faint-border pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="text-base">📧</span>
                          <div>
                            <label className="block text-xs font-semibold text-ink-black">
                              Nhập danh sách email nhận slot ({quantity} slot):
                            </label>
                            <span className="text-[11px] text-muted-gray">Mỗi slot kích hoạt cho một tài khoản riêng</span>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-warm-accent bg-accent-wash px-3 py-1 rounded-full shrink-0">
                          {quantity} slot
                        </span>
                      </div>

                      <div className="space-y-2.5 pt-1">
                        {Array.from({ length: quantity }).map((_, idx) => {
                          const emailVal = customerEmails[idx] || ''
                          const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal.trim())
                          return (
                            <div key={idx} className="space-y-1">
                              <div className="flex items-center justify-between text-[11px]">
                                <label htmlFor={`cust-email-${idx}`} className="font-semibold text-ink-black">
                                  Email nhận Slot {idx + 1}:
                                </label>
                                {idx === 0 && user?.email && emailVal === user.email && (
                                  <span className="text-muted-gray italic text-[10px]">(Email tài khoản của bạn)</span>
                                )}
                              </div>
                              <div className="relative">
                                <input
                                  id={`cust-email-${idx}`}
                                  type="email"
                                  required
                                  value={emailVal}
                                  onChange={(e) => handleEmailChange(idx, e.target.value)}
                                  placeholder={`email-slot-${idx + 1}@gmail.com`}
                                  className={`w-full pl-4 pr-9 py-2.5 bg-canvas-mist border rounded-full text-sm text-ink-black placeholder-muted-gray focus:outline-none transition-colors ${emailVal && !isValid
                                      ? 'border-red-300 focus:border-red-400'
                                      : 'border-faint-border focus:border-black/20'
                                    }`}
                                />
                                {isValid && (
                                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#10a37f]">
                                    ✓
                                  </span>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      <p className="text-[11px] text-muted-gray pt-1">
                        Chúng tôi không bao giờ yêu cầu mật khẩu. Lời mời hoặc quyền truy cập sẽ gửi trực tiếp đến từng email trên.
                      </p>
                    </>
                  ) : (
                    <>
                      <label htmlFor="cust-email-0" className="block text-xs font-semibold text-ink-black">
                        📧 Nhập email của bạn (để kích hoạt hoặc nhận lời mời gia đình):
                      </label>
                      <input
                        id="cust-email-0"
                        type="email"
                        required
                        value={customerEmails[0] || ''}
                        onChange={(e) => handleEmailChange(0, e.target.value)}
                        placeholder="email-cua-ban@gmail.com"
                        className="w-full px-4 py-2.5 bg-canvas-mist border border-faint-border rounded-full text-sm text-ink-black placeholder-muted-gray focus:outline-none focus:border-black/20"
                      />
                      <p className="text-[11px] text-muted-gray">
                        Chúng tôi không bao giờ yêu cầu mật khẩu của bạn. Chỉ cần email để hoàn tất nâng cấp.
                      </p>
                    </>
                  )}
                </div>
              )}

              {/* Order Checkout Bar */}
              <div ref={buyBarRef} className="p-6 rounded-cards bg-pure-white border border-faint-border shadow-sm-2 space-y-5">
                <div className="flex items-center justify-between gap-4">
                  {/* Quantity Counter Pill */}
                  <div className="flex items-center bg-canvas-mist border border-faint-border rounded-full p-1">
                    <button
                      type="button"
                      aria-label="Giảm số lượng"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1 || !isAvailable}
                      className="w-8 h-8 rounded-full bg-pure-white hover:bg-slate-100 disabled:opacity-30 text-ink-black text-sm font-bold flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                    >
                      −
                    </button>
                    <span className="px-4 text-sm font-semibold text-ink-black">{quantity}</span>
                    <button
                      type="button"
                      aria-label="Tăng số lượng"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={!isAvailable}
                      className="w-8 h-8 rounded-full bg-pure-white hover:bg-slate-100 disabled:opacity-30 text-ink-black text-sm font-bold flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  {/* Total Price */}
                  <div className="text-right">
                    <span className="text-[11px] text-muted-gray block">Tổng thanh toán:</span>
                    <span className="text-2xl sm:text-3xl font-bold text-ink-black tracking-tight">
                      {formatCurrency(totalPrice)}
                    </span>
                  </div>
                </div>

                {/* Payment Method Badge */}
                <div className="flex items-center justify-between px-4 py-2.5 rounded-full bg-accent-wash border border-warm-accent/20 text-xs">
                  <span className="text-muted-gray flex items-center gap-1.5">
                    <span>💳</span> Phương thức thanh toán:
                  </span>
                  <span className="text-warm-accent font-semibold flex items-center gap-1">
                    <span>Quét mã VietQR 24/7</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-warm-accent"></span>
                  </span>
                </div>

                {/* Error Alert */}
                {error && (
                  <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
                    ⚠️ {error}
                  </div>
                )}

                {/* Buy Button or Result Display */}
                {!result ? (
                  !isAvailable ? (
                    <div className="space-y-2">
                      <a
                        href="https://zalo.me/0788836968"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shop-pill-btn bg-slate-900 hover:bg-black text-white w-full py-3.5 text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                      >
                        <span>💬 Tạm hết hàng — Nhắn Zalo Admin hỗ trợ ↗</span>
                      </a>
                      <p className="text-center text-xs text-muted-gray">
                        * Gói cước đang tạm hết hàng. Quý khách vui lòng nhắn tin Zalo: 0788836968 để Admin kích hoạt riêng!
                      </p>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={buying}
                      onClick={handleBuy}
                      className="shop-pill-btn shop-btn-accent w-full py-3.5 text-sm font-semibold shadow-lg-2 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {buying ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                          <span>Đang khởi tạo đơn hàng...</span>
                        </>
                      ) : !user ? (
                        '🔐 Đăng nhập để Mua ngay'
                      ) : (
                        '⚡ Thanh toán VietQR ngay'
                      )}
                    </button>
                  )
                ) : (
                  <div className="p-5 rounded-cards bg-emerald-50 border border-emerald-200 text-xs space-y-3">
                    <div className="flex items-center gap-2 text-[#0b7a55] font-bold text-sm">
                      <span>✓</span> Mua hàng thành công!
                    </div>
                    <div className="text-ink-black">
                      Mã đơn: <strong className="font-mono">{result.orderCode || result.clientOrderCode}</strong>
                    </div>

                    {result.deliveredText && (
                      <div className="space-y-2">
                        <div className="text-[11px] font-semibold text-[#0b7a55]">Thông tin nhận hàng:</div>
                        <pre className="p-3.5 rounded-2xl bg-pure-white border border-emerald-200 text-ink-black font-mono text-xs whitespace-pre-wrap break-all max-h-48 overflow-y-auto">
                          {result.deliveredText}
                        </pre>
                        <button
                          type="button"
                          onClick={() => handleCopy(result.deliveredText)}
                          className="shop-pill-btn shop-btn-white w-full py-2 text-xs font-semibold"
                        >
                          {copied ? '✓ Đã sao chép' : '📋 Sao chép thông tin'}
                        </button>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2 border-t border-emerald-200">
                      <Link
                        href="/dashboard/orders"
                        className="shop-pill-btn shop-btn-white flex-1 py-2 text-xs"
                      >
                        Lịch sử đơn hàng
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setResult(null)
                          setQuantity(1)
                        }}
                        className="shop-pill-btn shop-btn-accent flex-1 py-2 text-xs"
                      >
                        Mua tiếp
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Detailed Description */}
              {product.description && (
                <div className="bg-pure-white border border-faint-border rounded-cards p-6 shadow-sm-2 text-xs text-muted-gray space-y-3">
                  <h3 className="text-sm font-semibold text-ink-black border-b border-faint-border pb-3">
                    📝 Mô tả chi tiết & Hướng dẫn kích hoạt
                  </h3>
                  <div className="leading-relaxed whitespace-pre-line text-ink-black/80 space-y-2">
                    {product.description}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ================= MOBILE STICKY BUY BAR ================= */}
      <aside
        aria-label="Thanh mua hàng nhanh trên điện thoại"
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-pure-white/95 backdrop-blur-md border-t border-faint-border shadow-[0_-4px_24px_rgba(0,0,0,0.08)] px-4 py-2.5 transition-transform duration-300 ease-in-out font-sans ${
          showStickyBar && !result ? 'translate-y-0' : 'translate-y-full pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#f5f6f7] flex items-center justify-center p-1.5 border border-faint-border shrink-0">
              <ProductIcon
                image={product.image || currentGroup?.image}
                emoji={product.emoji || currentGroup?.emoji}
                name={product.name}
                size={28}
                className="object-contain"
              />
            </div>
            <div className="truncate">
              <div className="text-xs font-semibold text-ink-black truncate tracking-shop-body">
                {product.name}
              </div>
              <div className="text-xs font-bold text-warm-accent">
                {formatCurrency(totalPrice)}
                {quantity > 1 && (
                  <span className="text-[10px] text-muted-gray font-normal ml-1">
                    (x{quantity})
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="shrink-0">
            {!isAvailable ? (
              <a
                href="https://zalo.me/0788836968"
                target="_blank"
                rel="noopener noreferrer"
                className="shop-pill-btn bg-slate-900 text-white text-xs font-semibold py-2 px-3.5 shadow-sm inline-flex items-center gap-1 cursor-pointer"
              >
                💬 Nhắn Zalo
              </a>
            ) : (
              <button
                type="button"
                disabled={buying}
                onClick={handleBuy}
                className="shop-pill-btn shop-btn-accent text-xs font-semibold py-2 px-4 shadow-lg-2 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                {buying ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                    <span>Đang tạo...</span>
                  </>
                ) : !user ? (
                  '🔐 Đăng nhập'
                ) : (
                  '⚡ Mua ngay'
                )}
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Direct VietQR Checkout Modal */}
      <DirectCheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        order={createdOrder}
        product={product}
        quantity={quantity}
        unitPrice={unitPrice}
        user={user}
        customerEmails={customerEmails.slice(0, quantity)}
      />

      <Footer />
    </div>
  )
}
