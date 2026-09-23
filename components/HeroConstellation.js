'use client'

import Link from 'next/link'
import ProductIcon from '@/components/ProductIcon'
import SearchInput from '@/components/SearchInput'
import CategoryPills from '@/components/CategoryPills'
import { formatCurrency } from '@/lib/utils'

export default function HeroConstellation({ featuredGroups = [] }) {
  // Take top 4 flagship services
  const flagshipItems = featuredGroups.slice(0, 4)

  const trendingTags = [
    { label: 'ChatGPT Plus', href: '/shop?category=chatgpt' },
    { label: 'Claude 3.5 Sonnet', href: '/shop?category=claude' },
    { label: 'Canva Pro', href: '/shop?category=canva' },
    { label: 'Google Veo & Gemini', href: '/shop?category=veo3' },
    { label: 'CapCut Pro', href: '/shop?category=capcut' },
    { label: 'Microsoft 365', href: '/shop?category=office' },
  ]

  return (
    <section className="relative pt-8 sm:pt-14 pb-12 sm:pb-16 overflow-hidden font-sans">
      {/* Subtle Warm Marble Light Glow Background */}
      <div className="absolute inset-0 pointer-events-none -z-10 flex justify-center">
        <div className="w-[900px] h-[500px] bg-gradient-to-b from-pure-white via-canvas-mist to-transparent rounded-full blur-3xl opacity-70"></div>
      </div>

      <div className="shop-container">
        {/* ================= HERO TEXT & HEADLINE ================= */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          {/* Live System Status Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pure-white border border-faint-border shadow-sm text-xs mb-5 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-warm-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-warm-accent"></span>
            </span>
            <span className="font-semibold text-ink-black tracking-shop-body">Hệ thống cấp bản quyền số tự động 24/7</span>
            <span className="text-muted-gray/40 hidden sm:inline">•</span>
            <span className="text-muted-gray hidden sm:inline">10,000+ đơn hàng hoàn tất</span>
          </div>

          {/* Master Editorial Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-[3.5rem] font-normal tracking-shop-display text-ink-black leading-[1.12] mb-4">
            Bản quyền AI & công cụ số <br className="hidden sm:inline" />
            <span className="font-semibold text-warm-accent">cho người làm việc <br /> chuyên nghiệp.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-muted-gray tracking-shop-body max-w-xl mx-auto leading-relaxed">
            Nâng cấp trực tiếp ChatGPT Plus, Claude 3.5 Sonnet, Canva Pro, Google Gemini... Kích hoạt tự động tức thì trong 5 giây qua mã VietQR 24/7.
          </p>
        </div>

        {/* ================= SIGNATURE SEARCH BAR ================= */}
        <div className="max-w-xl mx-auto mb-4" data-aos="fade-up" data-aos-delay="50" suppressHydrationWarning>
          <SearchInput
            placeholder="Tìm kiếm công cụ: ChatGPT, Claude, Canva, Veo 3..."
            className="w-full"
          />
        </div>

        {/* Trending Suggestions Strip */}
        <div className="flex items-center justify-center gap-1.5 flex-wrap text-xs max-w-2xl mx-auto mb-10 text-muted-gray px-2">
          <span className="font-semibold text-ink-black flex items-center gap-1 text-[11px] uppercase tracking-wider">
            <span>🔥</span> Thịnh hành:
          </span>
          {trendingTags.map((tag) => (
            <Link
              key={tag.label}
              href={tag.href}
              className="px-2.5 py-1 rounded-full bg-pure-white hover:bg-slate-100 text-ink-black border border-faint-border text-[11px] font-medium transition-all shadow-2xs hover:border-black/20"
            >
              {tag.label}
            </Link>
          ))}
        </div>

        {/* ================= CURATED FLAGSHIP SPOTLIGHT (4 TOP SERVICES) ================= */}
        {flagshipItems.length > 0 && (
          <div className="mb-12" data-aos="fade-up" data-aos-delay="100" suppressHydrationWarning>
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-warm-accent"></span>
                <span className="text-xs font-semibold uppercase tracking-wider text-ink-black">
                  Dịch vụ tiêu biểu nổi bật
                </span>
              </div>
              <Link
                href="/shop"
                className="text-xs font-medium text-muted-gray hover:text-ink-black transition-colors"
              >
                Xem toàn bộ kho hàng →
              </Link>
            </div>

            {/* Responsive 4-Column Showcase (Mobile swipeable rail) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
              {flagshipItems.map((item, idx) => {
                const defaultProductId = item.defaultProductId || item.id || (item.variants && item.variants[0]?.id)
                const href = defaultProductId ? `/shop/${defaultProductId}` : '/shop'
                const price = item.priceText || (item.minPrice ? formatCurrency(item.minPrice) : 'Giá tốt')

                return (
                  <Link
                    key={item.groupId || idx}
                    href={href}
                    className="group bg-pure-white rounded-cards p-3 sm:p-4 shadow-sm-2 hover:shadow-lg transition-all duration-300 border border-faint-border hover:border-black/20 flex flex-col justify-between cursor-pointer active:scale-[0.98]"
                  >
                    <div>
                      {/* Top Visual Box with 20px inner frame */}
                      <div className="relative w-full aspect-square bg-[#f5f6f7] rounded-inner-img flex items-center justify-center p-4 mb-3 transition-colors group-hover:bg-[#eff1f3] overflow-hidden">
                        <ProductIcon
                          image={item.image}
                          emoji={item.emoji}
                          name={item.name}
                          size={64}
                          className="w-16 h-16 sm:w-20 sm:h-20 object-contain filter drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
                        />

                        {/* Top Badges */}
                        <div className="absolute top-2.5 left-2.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-pure-white/95 backdrop-blur-sm text-ink-black border border-faint-border shadow-xs">
                            {item.badge || 'Bản quyền'}
                          </span>
                        </div>

                        <div className="absolute top-2.5 right-2.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-pure-white/95 backdrop-blur-sm text-ink-black border border-faint-border shadow-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#10a37f]"></span>
                            <span>Sẵn hàng</span>
                          </span>
                        </div>
                      </div>

                      {/* Title & Metadata */}
                      <h3 className="text-xs sm:text-sm font-semibold text-ink-black tracking-shop-body group-hover:text-warm-accent transition-colors line-clamp-1">
                        {item.name}
                      </h3>
                      <div className="text-[11px] text-muted-gray mt-0.5 flex items-center gap-1.5">
                        <span>⭐ 4.9</span>
                        <span>•</span>
                        <span>{item.variantCount > 1 ? `${item.variantCount} phiên bản` : 'Cấp tức thì 5s'}</span>
                      </div>
                    </div>

                    {/* Price and Action Row */}
                    <div className="mt-3 pt-3 border-t border-faint-border flex items-center justify-between gap-2">
                      <div>
                        <span className="block text-[10px] text-muted-gray uppercase tracking-wider">
                          Giá từ
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-ink-black tracking-tight">
                          {price}
                        </span>
                      </div>
                      <span className="w-7 h-7 rounded-full bg-canvas-mist group-hover:bg-warm-accent text-ink-black group-hover:text-white flex items-center justify-center transition-all shadow-xs">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* ================= CATEGORY PILL STRIP ================= */}
        <div className="flex justify-center max-w-4xl mx-auto" data-aos="fade-up" data-aos-delay="150" suppressHydrationWarning>
          <CategoryPills isNavigation={true} className="justify-center" />
        </div>
      </div>
    </section>
  )
}
