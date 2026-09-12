'use client'

import Link from 'next/link'
import ProductIcon from '@/components/ProductIcon'
import SearchInput from '@/components/SearchInput'
import CategoryPills from '@/components/CategoryPills'

export default function HeroConstellation({ featuredGroups = [] }) {
  // Take top 3-4 products for the constellation
  const constellationItems = featuredGroups.slice(0, 4)

  return (
    <section className="relative pt-12 pb-16 overflow-hidden">
      {/* Background Soft Marble Gradient Wash */}
      <div className="absolute inset-0 pointer-events-none -z-10 flex justify-center">
        <div className="w-[800px] h-[500px] bg-gradient-to-b from-pure-white via-canvas-mist to-transparent rounded-full blur-3xl opacity-60"></div>
      </div>

      <div className="shop-container">
        {/* Floating Constellation Cards (Desktop & Tablet) */}
        {constellationItems.length > 0 && (
          <div className="relative max-w-4xl mx-auto h-48 sm:h-56 mb-6 hidden md:block select-none">
            {constellationItems.map((item, idx) => {
              // Defined constellation coordinates for floating effect
              const positions = [
                'left-[6%] top-[14%] -rotate-3 hover:rotate-0',
                'left-[28%] top-[2%] rotate-2 hover:rotate-0',
                'right-[28%] top-[8%] -rotate-2 hover:rotate-0',
                'right-[6%] top-[18%] rotate-3 hover:rotate-0',
              ]

              return (
                <Link
                  key={item.groupId || idx}
                  href={`/shop/${item.defaultProductId}`}
                  data-aos="zoom-in"
                  data-aos-delay={idx * 100}
                  className={`absolute ${positions[idx % positions.length]} z-10 w-44 bg-pure-white rounded-cards p-2.5 shadow-sm-2 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2.5 hover:scale-105 cursor-pointer constellation-float-${(idx % 4) + 1}`}
                  style={{ borderRadius: '24px' }}
                >
                  <div
                    className="w-full h-24 bg-[#f8f9fa] rounded-inner-img flex items-center justify-center p-2 mb-2"
                    style={{ borderRadius: '18px' }}
                  >
                    <ProductIcon
                      image={item.image}
                      emoji={item.emoji}
                      name={item.name}
                      size={44}
                      className="object-contain filter drop-shadow-sm"
                    />
                  </div>
                  <div className="px-1 text-center">
                    <div className="text-xs font-semibold text-ink-black truncate tracking-shop-body">
                      {item.name}
                    </div>
                    <div className="text-[11px] font-bold text-shop-violet mt-0.5">
                      {item.priceText || 'Giá tốt'}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {/* Centerpiece: Wordmark with Violet Dot */}
        <div className="text-center max-w-2xl mx-auto mt-4 mb-6" data-aos="fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pure-white border border-faint-border shadow-sm text-xs text-muted-gray mb-4">
            <span className="w-2 h-2 rounded-full bg-shop-violet"></span>
            <span>Kho tài khoản & bản quyền AI số 1</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-normal tracking-shop-display text-ink-black leading-none mb-3">
            socialTech<span className="text-shop-violet">.</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-gray tracking-shop-body max-w-lg mx-auto">
            Khám phá tài khoản ChatGPT, Claude, Google Veo 3 và Canva Pro bản quyền. Kích hoạt tức thì 24/7 qua VietQR.
          </p>
        </div>

        {/* Signature Refero Pill Search Bar */}
        <div className="max-w-xl mx-auto mb-8" data-aos="fade-up" data-aos-delay="100">
          <SearchInput
            placeholder="Bạn đang tìm kiếm tài khoản hay công cụ nào hôm nay?"
            className="w-full"
          />
        </div>

        {/* Category Pill Strip Directly Below Search */}
        <div className="flex justify-center max-w-4xl mx-auto" data-aos="fade-up" data-aos-delay="150">
          <CategoryPills isNavigation={true} className="justify-center" />
        </div>
      </div>
    </section>
  )
}
