'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-faint-border bg-pure-white text-muted-gray text-xs mt-24">
      <div className="shop-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <Link href="/" className="inline-flex items-center gap-1.5 select-none">
              <span className="text-lg font-semibold tracking-shop-display text-ink-black">
                socialTech
              </span>
              <span className="w-2 h-2 rounded-full bg-warm-accent -ml-0.5"></span>
            </Link>
            <p className="text-muted-gray leading-relaxed text-xs max-w-xs">
              Hệ thống cung cấp bản quyền số và tài khoản công nghệ AI chính hãng. Kích hoạt tự động, thanh toán VietQR 24/7.
            </p>
          </div>

          {/* Column 1: Danh mục */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-black mb-4">
              Sản phẩm nổi bật
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/shop" className="hover:text-ink-black transition-colors">
                  Tất cả sản phẩm
                </Link>
              </li>
              <li>
                <Link href="/shop?category=chatgpt" className="hover:text-ink-black transition-colors">
                  ChatGPT & OpenAI
                </Link>
              </li>
              <li>
                <Link href="/shop?category=claude" className="hover:text-ink-black transition-colors">
                  Claude Pro (Anthropic)
                </Link>
              </li>
              <li>
                <Link href="/shop?category=veo3" className="hover:text-ink-black transition-colors">
                  Google Veo 3 / Gemini
                </Link>
              </li>
              <li>
                <Link href="/shop?category=canva" className="hover:text-ink-black transition-colors">
                  Canva Pro Design
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Khách hàng */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-black mb-4">
              Tài khoản & Ví
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/dashboard" className="hover:text-ink-black transition-colors">
                  Bảng điều khiển
                </Link>
              </li>
              <li>
                <Link href="/dashboard/wallet" className="hover:text-ink-black transition-colors">
                  Ví nạp tiền VietQR
                </Link>
              </li>
              <li>
                <Link href="/dashboard/orders" className="hover:text-ink-black transition-colors">
                  Lịch sử đơn hàng
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="hover:text-ink-black transition-colors">
                  Đăng nhập / Đăng ký
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Hỗ trợ */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-black mb-4">
              Hỗ trợ kỹ thuật
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="https://zalo.me/0788836968"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#0068FF] transition-colors inline-flex items-center gap-1.5 font-medium"
                >
                  <span className="w-2 h-2 rounded-full bg-[#0068FF]"></span>
                  <span>Zalo: 0788836968</span>
                  <span className="text-[10px]">↗</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/thanthan1011"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#1877F2] transition-colors inline-flex items-center gap-1.5 font-medium"
                >
                  <span className="w-2 h-2 rounded-full bg-[#1877F2]"></span>
                  <span>Facebook cá nhân</span>
                  <span className="text-[10px]">↗</span>
                </a>
              </li>
              <li>
                <span className="text-muted-gray">Thời gian hỗ trợ: 24/7</span>
              </li>
              <li>
                <span className="text-muted-gray">Bảo hành 1-đổi-1 suốt chu kỳ</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Hairline & Copyright */}
        <div className="pt-8 border-t border-faint-border flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-muted-gray">
          <p>© {new Date().getFullYear()} socialTech. Mọi quyền được bảo lưu.</p>
          <div className="flex items-center gap-4">
            <span>Thanh toán bảo mật VietQR</span>
            <span>•</span>
            <span>API kích hoạt 5s</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
