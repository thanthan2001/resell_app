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
      className="group block bg-pure-white rounded-cards shadow-sm-2 hover:shadow-lg transition-all duration-300 p-3 flex flex-col justify-between product-card-hover active:scale-[0.98]"
      style={{
        borderRadius: '28px',
      }}
    >
      {/* 1:1 Image Frame with 20px inner radius */}
      <div
        className="relative w-full aspect-square bg-[#f5f6f7] flex items-center justify-center p-6 overflow-hidden transition-all duration-300 group-hover:bg-[#f0f2f4]"
        style={{
          borderRadius: '20px',
        }}
      >
        <ProductIcon
          image={group.image}
          emoji={group.emoji}
          name={group.name}
          size={84}
          className="w-20 h-20 sm:w-24 sm:h-24 object-contain filter drop-shadow-sm transition-transform duration-300 group-hover:scale-110"
        />

        {/* Top-Right In-Stock Status Pill */}
        <div className="absolute top-3 right-3">
          {isAvailable ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-pure-white/90 backdrop-blur-sm text-ink-black shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-faint-border">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10a37f] shop-pulse"></span>
              <span>{availableCount ? `Còn ${availableCount}` : 'Sẵn hàng'}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-pure-white/90 backdrop-blur-sm text-muted-gray border border-faint-border">
              Hết hàng
            </span>
          )}
        </div>

        {/* Top-Left Category Badge */}
        {group.badge && (
          <div className="absolute top-3 left-3">
            <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-pure-white/90 backdrop-blur-sm text-ink-black border border-faint-border shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              {group.badge}
            </span>
          </div>
        )}
      </div>

      {/* Supporting Product Details */}
      <div className="pt-3.5 pb-2 px-2 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-ink-black tracking-shop-body group-hover:text-shop-violet transition-colors line-clamp-1">
            {group.name}
          </h3>

          {/* Social Proof / Metadata */}
          <div className="flex items-center gap-2 mt-1.5 text-[11px] text-muted-gray tracking-shop-caption">
            {group.variantCount > 1 ? (
              <span>{group.variantCount} gói lựa chọn</span>
            ) : (
              <span>Giao tự động 24/7</span>
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
        <div className="mt-3.5 pt-3 border-t border-faint-border flex items-center justify-between gap-2">
          <div>
            <span className="block text-[10px] text-muted-gray uppercase tracking-shop-micro">
              Giá từ
            </span>
            <span className="text-base sm:text-lg font-bold text-ink-black tracking-tight">
              {priceDisplay}
            </span>
          </div>

          <span className="w-8 h-8 rounded-full bg-canvas-mist group-hover:bg-shop-violet text-ink-black group-hover:text-white flex items-center justify-center transition-all duration-150 shadow-sm flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </span>
        </div>
      </div>
    </Link>
  )
}
