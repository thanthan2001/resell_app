'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SearchInput({
  defaultValue = '',
  placeholder = 'Tìm kiếm tài khoản AI, bản quyền số...',
  className = '',
  onSearch,
  autoFocus = false,
}) {
  const [query, setQuery] = useState(defaultValue)
  const router = useRouter()

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (onSearch) {
      onSearch(trimmed)
    } else {
      router.push(`/shop?q=${encodeURIComponent(trimmed)}`)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative flex items-center bg-pure-white rounded-inputs border border-black/10 focus-within:border-black/25 transition-all shadow-[0_2px_12px_rgba(0,0,0,0.04)] focus-within:shadow-[0_4px_24px_rgba(0,0,0,0.08)] pl-5 pr-1.5 py-1 ${className}`}
      role="search"
    >
      <span className="text-muted-gray mr-2 flex-shrink-0 select-none text-base" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </span>

      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          if (onSearch) onSearch(e.target.value)
        }}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full bg-transparent border-0 text-base text-ink-black placeholder-muted-gray focus:outline-none tracking-shop-body pr-2"
        aria-label="Tìm kiếm sản phẩm"
      />

      {query && (
        <button
          type="button"
          onClick={() => {
            setQuery('')
            if (onSearch) onSearch('')
          }}
          className="p-1 mr-1 text-muted-gray hover:text-ink-black rounded-full hover:bg-canvas-mist transition-colors"
          aria-label="Xóa từ khóa tìm kiếm"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      )}

      {/* Signature Violet Circular Submit Button */}
      <button
        type="submit"
        aria-label="Tìm kiếm"
        className="w-11 h-11 rounded-full bg-shop-violet hover:bg-[#4524db] active:scale-95 text-white flex items-center justify-center flex-shrink-0 shadow-[0_4px_24px_rgba(69,36,219,0.34)] transition-transform duration-150 cursor-pointer"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </form>
  )
}
