'use client'

import { useState } from 'react'
import Link from 'next/link'
import ProductIcon from '@/components/ProductIcon'
import { formatCurrency } from '@/lib/utils'

export default function ProductCard({ group, index = 0 }) {
  const [isNavigating, setIsNavigating] = useState(false)
  const isAvailable = group.isAvailable
  const availableCount = group.totalAvailable
  const priceDisplay = group.priceText || (group.minPrice ? formatCurrency(group.minPrice) : 'Liên hệ')
  const defaultProductId = group.defaultProductId || group.id || (group.variants && group.variants[0]?.id)
  const defaultHref = defaultProductId ? `/shop/${defaultProductId}` : '/shop'

  const handleClick = () => {
    setIsNavigating(true)
  }

  return (
    <Link
      href={defaultHref}
      onClick={handleClick}
      className={`group block bg-pure-white rounded-cards shadow-sm-2 hover:shadow-lg transition-all duration-280 p-2.5 sm:p-3 flex flex-col justify-between product-card-hover active:scale-[0.98] cursor-pointer animate-fade-in relative overflow-hidden ${
        isNavigating ? 'ring-2 ring-warm-accent/30 bg-warm-accent/[0.015]' : ''
      }`}
    >
      {/* Top accent loading bar on click */}
      {isNavigating && (
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-warm-accent shadow-[0_0_8px_rgba(234,88,12,0.8)] animate-pulse z-20" />
      )}
      {/* 1:1 Image Frame with inner radius 20px */}
      <div
        className="relative w-full aspect-square bg-[#f5f6f7] flex items-center justify-center p-3 sm:p-5 overflow-hidden transition-all duration-300 group-hover:bg-[#eff1f3] rounded-inner-img"
      >
        <ProductIcon
          image={group.image}
          emoji={group.emoji}
          name={group.name}
          size={84}
          className="w-14 h-14 sm:w-20 sm:h-20 lg:w-22 lg:h-22 object-contain filter drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
        />

        {/* Top-Right In-Stock Status Pill */}
        <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5">
          {isAvailable ? (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-pure-white/95 backdrop-blur-sm text-ink-black shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-faint-border">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10a37f]"></span>
              <span>{availableCount ? `Còn ${availableCount}` : 'Sẵn hàng'}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-pure-white/95 backdrop-blur-sm text-red-600 border border-red-200">
              Hết hàng
            </span>
          )}
        </div>

        {/* Top-Left Category Badge */}
        {group.badge && (
          <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5">
            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wider uppercase bg-pure-white/95 backdrop-blur-sm text-muted-gray border border-faint-border shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
              {group.badge}
            </span>
          </div>
        )}
      </div>

      {/* Supporting Product Details */}
      <div className="pt-3 pb-1 px-1 sm:px-1.5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xs sm:text-base font-semibold text-ink-black tracking-shop-body group-hover:text-warm-accent transition-colors line-clamp-2 min-h-[2.2rem] sm:min-h-0 leading-snug sm:leading-normal">
            {group.name}
          </h3>

          {/* Social Proof / Metadata */}
          <div className="flex items-center gap-1.5 mt-1 sm:mt-1.5 text-[11px] text-muted-gray tracking-shop-caption flex-wrap">
            {group.variantCount > 1 ? (
              <span>{group.variantCount} gói lựa chọn</span>
            ) : (
              <span>Tự động 24/7</span>
            )}
            {group.totalSold > 0 && (
              <>
                <span aria-hidden="true">•</span>
                <span className="text-ink-black font-medium">Đã bán {group.totalSold}</span>
              </>
            )}
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="mt-2.5 sm:mt-3 pt-2.5 sm:pt-3 border-t border-faint-border flex items-center justify-between gap-2">
          <div className="min-w-0">
            <span className="block text-[10px] text-muted-gray uppercase tracking-shop-micro">
              Giá từ
            </span>
            <span className="text-sm sm:text-base font-bold text-ink-black tracking-tight truncate block">
              {priceDisplay}
            </span>
          </div>

          <span
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-150 shadow-sm flex-shrink-0 ${
              isNavigating
                ? 'bg-warm-accent text-white ring-2 ring-warm-accent/30'
                : 'bg-canvas-mist group-hover:bg-warm-accent text-ink-black group-hover:text-white'
            }`}
          >
            {isNavigating ? (
              <svg className="w-3.5 h-3.5 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            )}
          </span>
        </div>
      </div>
    </Link>
  )
}
