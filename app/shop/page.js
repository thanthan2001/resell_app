'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import SearchInput from '@/components/SearchInput'
import CategoryPills, { SHOP_CATEGORIES } from '@/components/CategoryPills'
import { groupProducts } from '@/lib/utils'

function ShopContent() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [onlyInStock, setOnlyInStock] = useState(false)
  const [sortBy, setSortBy] = useState('priority')
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const PAGE_SIZE = 12

  const searchParams = useSearchParams()
  const router = useRouter()

  // Sync with URL query parameters on mount or change
  useEffect(() => {
    const qParam = searchParams.get('q') || ''
    const catParam = searchParams.get('category') || 'all'
    if (qParam) setSearch(qParam)
    if (catParam) setSelectedCategory(catParam)
  }, [searchParams])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/catalog')
      const data = await res.json()
      setProducts(data.products || data || [])
    } catch (err) {
      setError('Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // Group products into unified families
  const productGroups = useMemo(() => groupProducts(products), [products])

  // Category counts map
  const categoryCounts = useMemo(() => {
    const counts = { all: productGroups.length }
    productGroups.forEach((g) => {
      const catId = g.category?.id || 'other'
      counts[catId] = (counts[catId] || 0) + 1
    })
    return counts
  }, [productGroups])

  // Filter and Sort
  const filteredGroups = useMemo(() => {
    let result = productGroups.filter((group) => {
      const searchLower = search.toLowerCase()
      const matchesSearch =
        group.name.toLowerCase().includes(searchLower) ||
        (group.description || '').toLowerCase().includes(searchLower) ||
        group.variants.some((v) => (v.name || '').toLowerCase().includes(searchLower))

      if (!matchesSearch) return false
      if (selectedCategory !== 'all' && group.category?.id !== selectedCategory) return false
      if (onlyInStock && !group.isAvailable) return false

      return true
    })

    result.sort((a, b) => {
      if (sortBy === 'price_asc') return (a.minPrice || 0) - (b.minPrice || 0)
      if (sortBy === 'price_desc') return (b.minPrice || 0) - (a.minPrice || 0)
      if (sortBy === 'sold') return (b.totalSold || 0) - (a.totalSold || 0)
      return (a.priority || 99) - (b.priority || 99)
    })

    return result
  }, [productGroups, search, selectedCategory, onlyInStock, sortBy])

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [search, selectedCategory, onlyInStock, sortBy])

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId)
    const params = new URLSearchParams(window.location.search)
    if (catId === 'all') {
      params.delete('category')
    } else {
      params.set('category', catId)
    }
    router.replace(`/shop?${params.toString()}`, { scroll: false })
  }

  const handleSearchChange = (val) => {
    setSearch(val)
    const params = new URLSearchParams(window.location.search)
    if (!val) {
      params.delete('q')
    } else {
      params.set('q', val)
    }
    router.replace(`/shop?${params.toString()}`, { scroll: false })
  }

  return (
    <main className="flex-1 pt-24 pb-20">
      <div className="shop-container">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-muted-gray mb-6 tracking-shop-body">
          <Link href="/" className="hover:text-ink-black transition-colors">
            Trang chủ
          </Link>
          <span aria-hidden="true" className="opacity-40">/</span>
          <span className="text-ink-black font-medium">Cửa hàng sản phẩm số</span>
        </nav>

        {/* Discovery Hero: Search & Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-faint-border mb-8 animate-fade-in-up">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-pure-white border border-faint-border shadow-sm text-ink-black mb-3">
              <span className="w-2 h-2 rounded-full bg-shop-violet"></span>
              <span>Kho bản quyền tự động</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-semibold tracking-shop-display text-ink-black">
              Danh Mục Sản Phẩm
            </h1>
            <p className="text-muted-gray text-xs sm:text-sm mt-1.5 max-w-xl tracking-shop-body">
              Tài khoản ChatGPT Plus, Claude Pro, Canva, Veo3 và Office 365 chính hãng. Kích hoạt tức thì sau khi thanh toán.
            </p>
          </div>

          {/* Search Box with Violet Submit */}
          <div className="w-full md:w-96">
            <SearchInput
              defaultValue={search}
              onSearch={handleSearchChange}
              placeholder="Tìm kiếm tài khoản, công cụ..."
            />
          </div>
        </div>

        {/* Category Pills Strip */}
        <div className="mb-8 animate-fade-in-up">
          <CategoryPills
            selectedId={selectedCategory}
            onSelect={handleCategorySelect}
            counts={categoryCounts}
          />
        </div>

        {/* Controls & Filter Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-pure-white border border-faint-border rounded-cards shadow-sm mb-8 text-xs text-muted-gray animate-fade-in-up">
          <div className="flex items-center gap-2 flex-wrap">
            <span>
              Hiển thị <strong className="text-ink-black font-semibold">{Math.min(currentPage * PAGE_SIZE, filteredGroups.length)}</strong> / <strong className="text-ink-black font-semibold">{filteredGroups.length}</strong> sản phẩm
            </span>
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-shop-violet/10 text-shop-violet text-[11px] font-medium animate-fade-in">
                <span>Đang lọc: {SHOP_CATEGORIES.find((c) => c.id === selectedCategory)?.name || selectedCategory}</span>
                <button
                  type="button"
                  onClick={() => handleCategorySelect('all')}
                  className="hover:opacity-70 font-bold cursor-pointer ml-0.5"
                  title="Xóa bộ lọc danh mục"
                  aria-label="Xóa bộ lọc danh mục"
                >
                  ✕
                </button>
              </span>
            )}
          </div>

          <div className="flex items-center gap-6">
            {/* In-Stock Toggle */}
            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="w-4 h-4 rounded border-faint-border text-shop-violet focus:ring-0 cursor-pointer accent-shop-violet"
              />
              <span className="text-ink-black">Chỉ hiện còn hàng</span>
            </label>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span>Sắp xếp:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-canvas-mist border border-faint-border rounded-full px-3 py-1.5 text-xs text-ink-black font-medium focus:outline-none focus:border-black/20 cursor-pointer"
              >
                <option value="priority">Độ phổ biến</option>
                <option value="price_asc">Giá: Thấp đến Cao</option>
                <option value="price_desc">Giá: Cao đến Thấp</option>
                <option value="sold">Bán chạy nhất</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid (Responsive 2-to-4 Columns) */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-pure-white rounded-2xl sm:rounded-cards p-2.5 sm:p-3 shadow-sm-2 animate-pulse h-64 sm:h-80">
                <div className="w-full aspect-square bg-canvas-mist rounded-xl sm:rounded-inner-img mb-3"></div>
                <div className="h-3.5 bg-canvas-mist rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-canvas-mist rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-pure-white border border-faint-border rounded-cards p-12 text-center text-muted-gray shadow-sm">
            <div className="text-3xl mb-3">⚠️</div>
            <p className="text-sm text-ink-black font-medium">{error}</p>
            <button
              onClick={fetchProducts}
              className="shop-pill-btn shop-btn-violet mt-4 text-xs"
            >
              Tải lại trang
            </button>
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="bg-pure-white border border-faint-border rounded-cards p-16 text-center shadow-sm">
            <div className="text-4xl mb-3 opacity-60">📦</div>
            <h3 className="text-base font-semibold text-ink-black mb-1">Không tìm thấy sản phẩm phù hợp</h3>
            <p className="text-xs text-muted-gray max-w-sm mx-auto">
              Thử tìm kiếm với từ khóa khác hoặc bỏ chọn các điều kiện lọc đang áp dụng.
            </p>
            <button
              onClick={() => {
                setSearch('')
                setSelectedCategory('all')
                setOnlyInStock(false)
                router.replace('/shop')
              }}
              className="shop-pill-btn shop-btn-white mt-5 text-xs font-medium"
            >
              Xóa tất cả bộ lọc
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {filteredGroups.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE).map((group, idx) => (
                <ProductCard key={group.groupId} group={group} index={idx} />
              ))}
            </div>

            {/* Pagination Controls */}
            {filteredGroups.length > PAGE_SIZE && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  disabled={currentPage === 1}
                  className="w-9 h-9 rounded-full bg-pure-white border border-faint-border shadow-sm text-xs font-medium text-ink-black hover:bg-canvas-mist transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
                  aria-label="Trang trước"
                >
                  ‹
                </button>

                {Array.from({ length: Math.ceil(filteredGroups.length / PAGE_SIZE) }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                    className={`w-9 h-9 rounded-full text-xs font-semibold transition-all ${
                      page === currentPage
                        ? 'bg-shop-violet text-white shadow-sm'
                        : 'bg-pure-white border border-faint-border text-ink-black hover:bg-canvas-mist'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => { setCurrentPage(p => Math.min(Math.ceil(filteredGroups.length / PAGE_SIZE), p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  disabled={currentPage === Math.ceil(filteredGroups.length / PAGE_SIZE)}
                  className="w-9 h-9 rounded-full bg-pure-white border border-faint-border shadow-sm text-xs font-medium text-ink-black hover:bg-canvas-mist transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
                  aria-label="Trang tiếp"
                >
                  ›
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-canvas-mist text-ink-black flex flex-col font-sans">
      <Header />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Đang tải cửa hàng...</div>}>
        <ShopContent />
      </Suspense>
      <Footer />
    </div>
  )
}
