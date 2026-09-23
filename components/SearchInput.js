'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ProductIcon from '@/components/ProductIcon'
import { formatCurrency } from '@/lib/utils'

export default function SearchInput({
  defaultValue = '',
  placeholder = 'Tìm kiếm tài khoản AI, bản quyền số...',
  className = '',
  onSearch,
  autoFocus = false,
}) {
  const [query, setQuery] = useState(defaultValue)
  const [catalog, setCatalog] = useState([])
  const [results, setResults] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const router = useRouter()
  const containerRef = useRef(null)
  const inputRef = useRef(null)

  // Fetch catalog once for instant client-side autocomplete
  useEffect(() => {
    let isMounted = true
    const loadCatalog = async () => {
      try {
        const res = await fetch('/api/catalog')
        if (!res.ok) return
        const data = await res.json()
        const items = data.products || data || []
        if (isMounted) setCatalog(items)
      } catch (err) {
        console.error('Autocomplete catalog fetch error:', err)
      }
    }
    loadCatalog()
    return () => {
      isMounted = false
    }
  }, [])

  // Filter products when query changes
  useEffect(() => {
    const trimmed = query.trim().toLowerCase()
    if (trimmed.length < 2) {
      setResults([])
      setIsOpen(false)
      setSelectedIndex(-1)
      return
    }

    setLoading(true)
    const matches = catalog
      .filter((p) => {
        const nameMatch = p.name?.toLowerCase().includes(trimmed)
        const descMatch = p.description?.toLowerCase().includes(trimmed)
        const familyMatch = p.productFamily?.toLowerCase().includes(trimmed)
        return nameMatch || descMatch || familyMatch
      })
      .slice(0, 5)

    setResults(matches)
    setIsOpen(matches.length > 0)
    setSelectedIndex(-1)
    setLoading(false)
  }, [query, catalog])

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = (e) => {
    e?.preventDefault()
    const trimmed = query.trim()
    setIsOpen(false)

    if (selectedIndex >= 0 && results[selectedIndex]) {
      router.push(`/shop/${results[selectedIndex].id}`)
      return
    }

    if (onSearch) {
      onSearch(trimmed)
    } else {
      router.push(`/shop?q=${encodeURIComponent(trimmed)}`)
    }
  }

  const handleKeyDown = (e) => {
    if (!isOpen || results.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1))
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <form
        onSubmit={handleSubmit}
        className={`relative flex items-center bg-pure-white rounded-full border border-black/10 focus-within:border-warm-accent/40 transition-all shadow-[0_2px_12px_rgba(0,0,0,0.04)] focus-within:shadow-[0_4px_24px_rgba(234,88,12,0.12)] pl-5 pr-1.5 py-1 ${className}`}
        role="search"
      >
        <span className="text-muted-gray mr-2 flex-shrink-0 select-none text-base" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </span>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            if (onSearch) onSearch(e.target.value)
          }}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true)
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full bg-transparent border-0 text-sm sm:text-base text-ink-black placeholder-muted-gray focus:outline-none tracking-shop-body pr-2"
          aria-label="Tìm kiếm sản phẩm"
          autoComplete="off"
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setResults([])
              setIsOpen(false)
              if (onSearch) onSearch('')
              inputRef.current?.focus()
            }}
            className="p-1 mr-1 text-muted-gray hover:text-ink-black rounded-full hover:bg-canvas-mist transition-colors cursor-pointer"
            aria-label="Xóa từ khóa tìm kiếm"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}

        {/* Signature Warm Accent Circular Submit Button */}
        <button
          type="submit"
          aria-label="Tìm kiếm"
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-warm-accent hover:opacity-90 active:scale-95 text-white flex items-center justify-center flex-shrink-0 shadow-[0_4px_24px_rgba(234,88,12,0.28)] transition-all duration-150 cursor-pointer"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </form>

      {/* ================= INSTANT AUTOCOMPLETE DROPDOWN ================= */}
      {isOpen && results.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 mt-2 bg-pure-white rounded-cards shadow-2xl border border-faint-border overflow-hidden z-50 animate-pop-in p-2 font-sans"
          style={{ borderRadius: '24px' }}
        >
          <div className="px-3 py-1.5 text-[11px] font-semibold text-muted-gray uppercase tracking-wider flex items-center justify-between border-b border-faint-border mb-1">
            <span>Sản phẩm gợi ý ({results.length})</span>
            <span className="text-[10px] text-muted-gray/60 font-normal">Dùng phím ↑ ↓ để chọn</span>
          </div>

          <div className="space-y-1">
            {results.map((item, idx) => {
              const isSelected = selectedIndex === idx
              const price = item.sellPrice || item.price || 0
              const isAvailable = item.available === null || item.available > 0

              return (
                <Link
                  key={item.id}
                  href={`/shop/${item.id}`}
                  onClick={() => setIsOpen(false)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-2.5 rounded-2xl transition-all ${
                    isSelected ? 'bg-canvas-mist border border-black/10' : 'hover:bg-canvas-mist/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <div className="w-10 h-10 rounded-xl bg-[#f5f6f7] flex items-center justify-center p-1.5 border border-faint-border shrink-0">
                      <ProductIcon
                        image={item.image}
                        emoji={item.emoji}
                        name={item.name}
                        size={28}
                        className="object-contain"
                      />
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-semibold text-ink-black truncate tracking-shop-body">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-muted-gray flex items-center gap-1.5 mt-0.5">
                        <span className={isAvailable ? 'text-emerald-600 font-medium' : 'text-red-500 font-medium'}>
                          {isAvailable ? '● Sẵn hàng' : '● Tạm hết'}
                        </span>
                        {item.sold > 0 && (
                          <>
                            <span>•</span>
                            <span>Đã bán {item.sold}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 pl-2">
                    <div className="text-xs sm:text-sm font-bold text-warm-accent">
                      {formatCurrency(price)}
                    </div>
                    <span className="text-[10px] text-muted-gray flex items-center justify-end gap-0.5 group-hover:text-ink-black">
                      Xem ngay ↗
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Footer View All */}
          <div className="pt-1.5 mt-1 border-t border-faint-border">
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full text-center py-2 px-3 text-xs font-medium text-warm-accent hover:text-ink-black hover:bg-canvas-mist/80 rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>Xem tất cả kết quả cho &ldquo;<strong>{query}</strong>&rdquo;</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
