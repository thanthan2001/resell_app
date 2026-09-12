'use client'

import Link from 'next/link'
import ProductIcon from '@/components/ProductIcon'
import { formatCurrency } from '@/lib/utils'

export default function ProductCard({ group, index = 0 }) {
  const isAvailable = group.isAvailable
  const availableCount = group.totalAvailable
  const priceDisplay = group.priceText || (group.minPrice ? formatCurrency(group.minPrice) : 'Liên hệ')
  const defaultHref = `/shop/${group.defaultProductId}`
  const delay = Math.min((index % 4) * 75, 300)

  return (
    <Link
      href={defaultHref}
      data-aos="fade-up"
      data-aos-delay={delay}
      className="group block bg-pure-white rounded-2xl sm:rounded-cards shadow-sm-2 hover:shadow-lg transition-all duration-300 p-2 sm:p-3 flex flex-col justify-between product-card-hover active:scale-[0.98]"
    >
      {/* 1:1 Image Frame with inner radius */}
      <div
        className="relative w-full aspect-square bg-[#f5f6f7] flex items-center justify-center p-3 sm:p-6 overflow-hidden transition-all duration-300 group-hover:bg-[#f0f2f4] rounded-xl sm:rounded-[20px]"
      >
        <ProductIcon
          image={group.image}
          emoji={group.emoji}
          name={group.name}
          size={84}
          className="w-14 h-14 sm:w-20 sm:h-20 lg:w-24 lg:h-24 object-contain filter drop-shadow-sm transition-transform duration-300 group-hover:scale-110"
        />

        {/* Top-Right In-Stock Status Pill */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
          {isAvailable ? (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-[11px] font-medium bg-pure-white/90 backdrop-blur-sm text-ink-black shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-faint-border">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10a37f] shop-pulse"></span>
              <span>{availableCount ? `Còn ${availableCount}` : 'Sẵn hàng'}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-[11px] font-semibold bg-pure-white/90 backdrop-blur-sm text-red-600 border border-red-200">
              Hết hàng
            </span>
          )}
        </div>

        {/* Top-Left Category Badge */}
        {group.badge && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
            <span className="inline-block px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-semibold tracking-wider uppercase bg-pure-white/90 backdrop-blur-sm text-ink-black border border-faint-border shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              {group.badge}
            </span>
          </div>
        )}
      </div>

      {/* Supporting Product Details */}
      <div className="pt-2 sm:pt-3.5 pb-1 px-1 sm:px-2 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xs sm:text-base font-semibold text-ink-black tracking-shop-body group-hover:text-shop-violet transition-colors line-clamp-2 min-h-[2rem] sm:min-h-0 leading-snug sm:leading-normal">
            {group.name}
          </h3>

          {/* Social Proof / Metadata */}
          <div className="flex items-center gap-1.5 mt-1 sm:mt-1.5 text-[10px] sm:text-[11px] text-muted-gray tracking-shop-caption flex-wrap">
            {group.variantCount > 1 ? (
              <span>{group.variantCount} gói</span>
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
        <div className="mt-2.5 sm:mt-3.5 pt-2 sm:pt-3 border-t border-faint-border flex items-center justify-between gap-1 sm:gap-2">
          <div className="min-w-0">
            <span className="block text-[9px] sm:text-[10px] text-muted-gray uppercase tracking-shop-micro">
              Giá từ
            </span>
            <span className="text-xs sm:text-base lg:text-lg font-bold text-ink-black tracking-tight truncate block">
              {priceDisplay}
            </span>
          </div>

          <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-canvas-mist group-hover:bg-shop-violet text-ink-black group-hover:text-white flex items-center justify-center transition-all duration-150 shadow-sm flex-shrink-0">
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </span>
        </div>
      </div>
    </Link>
  )
}
