import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HeroConstellation from '@/components/HeroConstellation'
import ProductCard from '@/components/ProductCard'
import HomeCatalogSection from '@/components/HomeCatalogSection'
import { getCatalog } from '@/lib/source-api'
import { groupProducts } from '@/lib/utils'

export const revalidate = 60

export const metadata = {
  title: 'socialTech — Kho Bản Quyền AI & Phần Mềm Số Chính Hãng',
  description: 'Cửa hàng bản quyền số uy tín số 1: ChatGPT Plus, Claude 3.5 Sonnet, Google Veo 3, Canva Pro, Microsoft 365. Kích hoạt tự động tức thì trong 5s, thanh toán VietQR 24/7.',
  openGraph: {
    title: 'socialTech — Kho Bản Quyền AI & Phần Mềm Số Chính Hãng',
    description: 'Cửa hàng tài khoản và phần mềm bản quyền tự động. Kích hoạt tức thì trong 5 giây qua VietQR 24/7.',
    url: 'https://socialtech.vn',
    siteName: 'socialTech',
    type: 'website',
  },
}

export default async function HomePage() {
  let products = []
  try {
    const data = await getCatalog()
    products = data.products || []
  } catch (err) {
    console.error('Server error fetching catalog in HomePage:', err)
  }

  // Unified product families
  const allGroups = groupProducts(products)

  // Split into curated category rails
  const aiGroups = allGroups
    .filter((g) => ['chatgpt', 'claude', 'grok', 'ai_api'].includes(g.category?.id))
    .slice(0, 8)

  const mediaGroups = allGroups
    .filter((g) => ['veo3', 'elevenlabs', 'kling', 'capcut', 'adobe'].includes(g.category?.id))
    .slice(0, 8)

  const designOfficeGroups = allGroups
    .filter((g) => ['canva', 'office', 'apple', 'meitu', 'vpn', 'other'].includes(g.category?.id))
    .slice(0, 8)

  return (
    <div className="min-h-screen bg-canvas-mist text-ink-black flex flex-col font-sans">
      <Header />

      <main className="flex-1 pt-14">
        {/* ================= HERO SHOWROOM ================= */}
        <HeroConstellation featuredGroups={allGroups} />

        {/* ================= SOCIAL PROOF & TRUST METRICS BAR ================= */}
        <section className="py-10 bg-pure-white border-y border-faint-border shadow-2xs">
          <div className="shop-container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-canvas-mist flex items-center justify-center text-warm-accent flex-shrink-0">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-semibold text-ink-black tracking-shop-body">
                    Cấp tự động 5s
                  </div>
                  <div className="text-xs text-muted-gray">Nhận tài khoản tức thì</div>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-canvas-mist flex items-center justify-center text-warm-accent flex-shrink-0">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-semibold text-ink-black tracking-shop-body">
                    Bảo hành 1-đổi-1
                  </div>
                  <div className="text-xs text-muted-gray">Cam kết trọn chu kỳ dùng</div>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-canvas-mist flex items-center justify-center text-warm-accent flex-shrink-0">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                    <line x1="2" y1="10" x2="22" y2="10"></line>
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-semibold text-ink-black tracking-shop-body">
                    VietQR 24/7
                  </div>
                  <div className="text-xs text-muted-gray">Mọi ngân hàng, miễn phí</div>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-canvas-mist flex items-center justify-center text-warm-accent flex-shrink-0">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-semibold text-ink-black tracking-shop-body">
                    10,000+ Khách hàng
                  </div>
                  <div className="text-xs text-muted-gray">Đánh giá 4.9/5 sao</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= CURATED CATALOG WITH INTERACTIVE TABS ================= */}
        <section className="py-12 sm:py-16">
          <HomeCatalogSection
            allGroups={allGroups}
            aiGroups={aiGroups}
            mediaGroups={mediaGroups}
            designOfficeGroups={designOfficeGroups}
          />
        </section>

        {/* ================= HOW IT WORKS: 3 BƯỚC MUA HÀNG SIÊU TỐC ================= */}
        <section className="py-16 sm:py-20 bg-pure-white border-y border-faint-border">
          <div className="shop-container">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-block text-xs font-semibold text-warm-accent uppercase tracking-wider mb-2">
                Trải nghiệm mua sắm tự động
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-shop-display text-ink-black">
                Nhận Bản Quyền Chỉ Với 3 Bước
              </h2>
              <p className="text-xs sm:text-sm text-muted-gray mt-2">
                Quy trình tự động hóa 100%, không cần chờ đợi xác nhận thủ công
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {/* Step 1 */}
              <div className="bg-canvas-mist/60 rounded-cards p-6 border border-faint-border relative">
                <div className="w-10 h-10 rounded-full bg-pure-white text-ink-black font-bold text-sm flex items-center justify-center border border-faint-border shadow-xs mb-4">
                  01
                </div>
                <h3 className="text-base font-semibold text-ink-black tracking-shop-body mb-2">
                  Chọn gói & Nhập email
                </h3>
                <p className="text-xs text-muted-gray leading-relaxed">
                  Lựa chọn phần mềm và thời hạn cần dùng. Bạn chỉ cần nhập email nhận thông tin — chúng tôi không bao giờ yêu cầu mật khẩu.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-canvas-mist/60 rounded-cards p-6 border border-faint-border relative">
                <div className="w-10 h-10 rounded-full bg-pure-white text-ink-black font-bold text-sm flex items-center justify-center border border-faint-border shadow-xs mb-4">
                  02
                </div>
                <h3 className="text-base font-semibold text-ink-black tracking-shop-body mb-2">
                  Quét mã VietQR 24/7
                </h3>
                <p className="text-xs text-muted-gray leading-relaxed">
                  Mở ứng dụng ngân hàng bất kỳ để quét mã QR. Số tiền và nội dung chuyển khoản được tự động điền chính xác tuyệt đối.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-canvas-mist/60 rounded-cards p-6 border border-faint-border relative">
                <div className="w-10 h-10 rounded-full bg-warm-accent text-white font-bold text-sm flex items-center justify-center shadow-xs mb-4">
                  03
                </div>
                <h3 className="text-base font-semibold text-ink-black tracking-shop-body mb-2">
                  Cấp tài khoản tức thì trong 5s
                </h3>
                <p className="text-xs text-muted-gray leading-relaxed">
                  Thông tin đăng nhập, key bản quyền hoặc lời mời nâng cấp sẽ lập tức xuất hiện trên màn hình và gửi thẳng đến hòm thư của bạn.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= FAQ SECTION ================= */}
        <section className="py-16 sm:py-20">
          <div className="shop-container max-w-3xl">
            <div className="text-center mb-10">
              <span className="inline-block text-xs font-semibold text-warm-accent uppercase tracking-wider mb-2">
                Hỗ trợ & Minh bạch
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-shop-display text-ink-black mb-2">
                Câu Hỏi Thường Gặp
              </h2>
              <p className="text-xs sm:text-sm text-muted-gray">
                Giải đáp mọi thắc mắc về chính sách giao nhận và bảo hành
              </p>
            </div>

            <div className="space-y-3.5">
              <div className="bg-pure-white rounded-cards p-5 sm:p-6 shadow-sm-2 border border-faint-border">
                <h3 className="text-sm font-semibold text-ink-black tracking-shop-body mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-warm-accent"></span>
                  Sau khi quét VietQR, bao lâu thì tôi nhận được tài khoản?
                </h3>
                <p className="text-xs text-muted-gray leading-relaxed pl-3.5">
                  Hệ thống xử lý tự động hoàn toàn: ngay khi giao dịch chuyển khoản thành công, thông tin tài khoản (email/mật khẩu hoặc liên kết kích hoạt) sẽ hiển thị trực tiếp trên màn hình và lưu vào mục Đơn Hàng trong tài khoản của bạn sau 5 giây.
                </p>
              </div>

              <div className="bg-pure-white rounded-cards p-5 sm:p-6 shadow-sm-2 border border-faint-border">
                <h3 className="text-sm font-semibold text-ink-black tracking-shop-body mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-warm-accent"></span>
                  Chính sách bảo hành 1-đổi-1 hoạt động như thế nào?
                </h3>
                <p className="text-xs text-muted-gray leading-relaxed pl-3.5">
                  Tất cả tài khoản tại socialTech đều được cam kết bảo hành trong suốt thời gian sử dụng. Nếu gặp sự cố đăng nhập hay lỗi bản quyền, bạn chỉ cần gửi mã đơn hàng cho Admin qua Zalo (0788836968) để được khắc phục hoặc đổi tài khoản mới ngay lập tức.
                </p>
              </div>

              <div className="bg-pure-white rounded-cards p-5 sm:p-6 shadow-sm-2 border border-faint-border">
                <h3 className="text-sm font-semibold text-ink-black tracking-shop-body mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-warm-accent"></span>
                  Tôi có cần cung cấp mật khẩu tài khoản cá nhân khi mua không?
                </h3>
                <p className="text-xs text-muted-gray leading-relaxed pl-3.5">
                  Tuyệt đối không. Chúng tôi không bao giờ hỏi mật khẩu của quý khách. Với các gói nâng cấp chính chủ (như Canva, YouTube, Spotify), bạn chỉ cần cung cấp địa chỉ email để nhận lời mời tham gia nhóm bản quyền.
                </p>
              </div>

              <div className="bg-pure-white rounded-cards p-5 sm:p-6 shadow-sm-2 border border-faint-border">
                <h3 className="text-sm font-semibold text-ink-black tracking-shop-body mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-warm-accent"></span>
                  Tôi cần tư vấn gói doanh nghiệp hoặc mua số lượng lớn?
                </h3>
                <p className="text-xs text-muted-gray leading-relaxed pl-3.5">
                  Quý khách vui lòng liên hệ trực tiếp Admin qua Zalo: 0788.836.968 hoặc Facebook để nhận báo giá chiết khấu đại lý tốt nhất.
                </p>
              </div>
            </div>

            {/* Direct Admin Consultation Card */}
            <div className="mt-10 p-6 rounded-cards bg-pure-white border border-faint-border shadow-sm-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-ink-black">Bạn vẫn còn câu hỏi cần giải đáp?</h3>
                <p className="text-xs text-muted-gray mt-0.5">Admin trực tuyến 24/7 sẵn sàng hỗ trợ trực tiếp.</p>
              </div>
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <a
                  href="https://zalo.me/0788836968"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shop-pill-btn shop-btn-accent text-xs py-2.5 px-4 flex-1 sm:flex-initial text-center"
                >
                  💬 Chat Zalo Admin
                </a>
                <a
                  href="https://www.facebook.com/thanthan1011"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shop-pill-btn shop-btn-white text-xs py-2.5 px-4 flex-1 sm:flex-initial text-center"
                >
                  🌐 Facebook
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
