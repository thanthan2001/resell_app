'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HeroConstellation from '@/components/HeroConstellation'
import ProductCard from '@/components/ProductCard'
import { groupProducts } from '@/lib/utils'

export default function HomePage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCatalog() {
      try {
        const res = await fetch('/api/catalog')
        const data = await res.json()
        setProducts(data.products || data || [])
      } catch (err) {
        console.error('Failed to load catalog:', err)
      } finally {
        setLoading(false)
      }
    }
    loadCatalog()
  }, [])

  // Unified product families
  const allGroups = useMemo(() => groupProducts(products), [products])

  // Split into curated category rails
  const aiGroups = useMemo(() => {
    return allGroups.filter((g) =>
      ['chatgpt', 'claude', 'grok', 'ai_api'].includes(g.category?.id)
    ).slice(0, 4)
  }, [allGroups])

  const mediaGroups = useMemo(() => {
    return allGroups.filter((g) =>
      ['veo3', 'elevenlabs', 'kling', 'capcut'].includes(g.category?.id)
    ).slice(0, 4)
  }, [allGroups])

  const designOfficeGroups = useMemo(() => {
    return allGroups.filter((g) =>
      ['canva', 'office', 'apple', 'meitu', 'vpn', 'other'].includes(g.category?.id)
    ).slice(0, 4)
  }, [allGroups])

  return (
    <div className="min-h-screen bg-canvas-mist text-ink-black flex flex-col font-sans">
      <Header />

      <main className="flex-1 pt-16">
        {/* ================= REFERO HERO CONSTELLATION ================= */}
        <HeroConstellation featuredGroups={allGroups.slice(0, 4)} />

        {/* ================= SECTION 1: AI & CHATBOT THÔNG MINH ================= */}
        <section className="py-12 sm:py-16">
          <div className="shop-container">
            {/* Category Section Header with Chevron */}
            <div className="flex items-center justify-between mb-8" data-aos="fade-up" suppressHydrationWarning>
              <Link
                href="/shop?category=chatgpt"
                className="shop-section-header group"
              >
                <span>AI & Chatbot Thông Minh</span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-ink-black"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </Link>

              <Link
                href="/shop?category=chatgpt"
                className="text-xs text-muted-gray hover:text-ink-black font-medium tracking-shop-body"
              >
                Xem tất cả gói →
              </Link>
            </div>

            {/* 2-Column Mobile / 4-Column Desktop Responsive Grid */}
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
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {(aiGroups.length > 0 ? aiGroups.slice(0, 8) : allGroups.slice(0, 8)).map((group, idx) => (
                  <ProductCard key={group.groupId} group={group} index={idx} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ================= SECTION 2: VIDEO & VOICE AI GENERATION ================= */}
        <section className="py-12 sm:py-16">
          <div className="shop-container">
            <div className="flex items-center justify-between mb-8" data-aos="fade-up" suppressHydrationWarning>
              <Link
                href="/shop?category=veo3"
                className="shop-section-header group"
              >
                <span>Video & Voice AI Siêu Cấp</span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-ink-black"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </Link>

              <Link
                href="/shop?category=veo3"
                className="text-xs text-muted-gray hover:text-ink-black font-medium tracking-shop-body"
              >
                Xem tất cả gói →
              </Link>
            </div>

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
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {(mediaGroups.length > 0 ? mediaGroups.slice(0, 8) : allGroups.slice(4, 12)).map((group, idx) => (
                  <ProductCard key={group.groupId} group={group} index={idx} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ================= SECTION 3: THIẾT KẾ, VĂN PHÒNG & BẢO MẬT ================= */}
        <section className="py-12 sm:py-16">
          <div className="shop-container">
            <div className="flex items-center justify-between mb-8" data-aos="fade-up" suppressHydrationWarning>
              <Link
                href="/shop?category=canva"
                className="shop-section-header group"
              >
                <span>Thiết Kế & Văn Phòng Tiện Ích</span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-ink-black"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </Link>

              <Link
                href="/shop?category=canva"
                className="text-xs text-muted-gray hover:text-ink-black font-medium tracking-shop-body"
              >
                Xem tất cả gói →
              </Link>
            </div>

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
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {(designOfficeGroups.length > 0 ? designOfficeGroups.slice(0, 8) : allGroups.slice(8, 16)).map((group, idx) => (
                  <ProductCard key={group.groupId} group={group} index={idx} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ================= 4 PILLARS OF ASSURANCE ================= */}
        <section className="py-16 bg-pure-white border-y border-faint-border">
          <div className="shop-container">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
              <div className="flex flex-col items-start space-y-2" data-aos="fade-up" data-aos-delay="0" suppressHydrationWarning>
                <div className="w-10 h-10 rounded-full bg-canvas-mist flex items-center justify-center text-lg mb-1">
                  ⚡
                </div>
                <h4 className="text-base font-semibold text-ink-black tracking-shop-body">
                  Kích Hoạt Tự Động 5s
                </h4>
                <p className="text-xs text-muted-gray leading-relaxed">
                  Hệ thống kết nối trực tiếp nhà phát hành, cấp tài khoản hoặc key bản quyền ngay tức thì.
                </p>
              </div>

              <div className="flex flex-col items-start space-y-2" data-aos="fade-up" data-aos-delay="100" suppressHydrationWarning>
                <div className="w-10 h-10 rounded-full bg-canvas-mist flex items-center justify-center text-lg mb-1">
                  🛡️
                </div>
                <h4 className="text-base font-semibold text-ink-black tracking-shop-body">
                  Bảo Hành Minh Bạch
                </h4>
                <p className="text-xs text-muted-gray leading-relaxed">
                  Cam kết bảo hành 1-đổi-1 hoặc hoàn tiền đúng thỏa thuận theo toàn bộ chu kỳ gói sử dụng.
                </p>
              </div>

              <div className="flex flex-col items-start space-y-2" data-aos="fade-up" data-aos-delay="200" suppressHydrationWarning>
                <div className="w-10 h-10 rounded-full bg-canvas-mist flex items-center justify-center text-lg mb-1">
                  💳
                </div>
                <h4 className="text-base font-semibold text-ink-black tracking-shop-body">
                  Nạp Ví VietQR 24/7
                </h4>
                <p className="text-xs text-muted-gray leading-relaxed">
                  Quét mã qua app ngân hàng bất kỳ, số dư vào ví tức thì không cần chờ duyệt thủ công.
                </p>
              </div>

              <div className="flex flex-col items-start space-y-2" data-aos="fade-up" data-aos-delay="300" suppressHydrationWarning>
                <div className="w-10 h-10 rounded-full bg-canvas-mist flex items-center justify-center text-lg mb-1">
                  💬
                </div>
                <h4 className="text-base font-semibold text-ink-black tracking-shop-body">
                  Hỗ Trợ Tận Tâm
                </h4>
                <p className="text-xs text-muted-gray leading-relaxed">
                  Hỗ trợ qua Zalo (0788836968) và Facebook 24/7, tiếp nhận và xử lý sự cố tức thì, hướng dẫn cài đặt chi tiết.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FAQ SECTION ================= */}
        <section className="py-16 sm:py-20">
          <div className="shop-container max-w-3xl">
            <div className="text-center mb-10" data-aos="fade-up" suppressHydrationWarning>
              <h2 className="text-2xl font-semibold tracking-shop-display text-ink-black mb-2">
                Câu Hỏi Thường Gặp
              </h2>
              <p className="text-xs text-muted-gray">
                Mọi thắc mắc về quy trình mua sắm và chính sách bảo hành
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-pure-white rounded-cards p-6 shadow-sm-2 border border-faint-border" data-aos="fade-up" data-aos-delay="50" suppressHydrationWarning>
                <h4 className="text-sm font-semibold text-ink-black tracking-shop-body mb-2">
                  Sau khi thanh toán tôi nhận sản phẩm như thế nào?
                </h4>
                <p className="text-xs text-muted-gray leading-relaxed">
                  Ngay sau khi bạn nhấn Mua bằng số dư ví, thông tin tài khoản (email/mật khẩu, token hoặc liên kết kích hoạt) sẽ hiển thị ngay trên màn hình và tự động lưu vào mục Đơn hàng trong tài khoản của bạn.
                </p>
              </div>

              <div className="bg-pure-white rounded-cards p-6 shadow-sm-2 border border-faint-border" data-aos="fade-up" data-aos-delay="100" suppressHydrationWarning>
                <h4 className="text-sm font-semibold text-ink-black tracking-shop-body mb-2">
                  Đối với các gói nâng cấp chính chủ, tôi cần cung cấp gì?
                </h4>
                <p className="text-xs text-muted-gray leading-relaxed">
                  Bạn chỉ cần nhập email của tài khoản bạn muốn nâng cấp khi đặt hàng. Chúng tôi không bao giờ yêu cầu mật khẩu. Hệ thống sẽ gửi lời mời hoặc nâng cấp trực tiếp qua email đã đăng ký.
                </p>
              </div>

              <div className="bg-pure-white rounded-cards p-6 shadow-sm-2 border border-faint-border" data-aos="fade-up" data-aos-delay="150" suppressHydrationWarning>
                <h4 className="text-sm font-semibold text-ink-black tracking-shop-body mb-2">
                  Nếu trong quá trình sử dụng gặp lỗi thì sao?
                </h4>
                <p className="text-xs text-muted-gray leading-relaxed">
                  Mọi sản phẩm đều có chính sách bảo hành rõ ràng. Bạn chỉ cần nhắn mã đơn hàng cho đội ngũ hỗ trợ qua Zalo (0788836968) hoặc Facebook, chúng tôi sẽ kiểm tra và khắc phục hoặc đổi mới cho bạn trong thời gian sớm nhất.
                </p>
              </div>
            </div>

            {/* Bottom Final CTA */}
            <div className="mt-12 text-center" data-aos="zoom-in" data-aos-delay="200" suppressHydrationWarning>
              <Link
                href="/shop"
                className="shop-pill-btn shop-btn-violet py-3.5 px-8 text-sm"
              >
                Khám phá tất cả sản phẩm →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
