'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function Header() {
  const [user, setUser] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setDropdownOpen(false)
    router.push('/')
    router.refresh()
  }

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-200 bg-pure-white/95 backdrop-blur-md border-b ${scrolled
        ? 'border-faint-border shadow-[0_2px_12px_rgba(0,0,0,0.04)]'
        : 'border-faint-border/80'
        }`}
    >
      <div className="shop-container h-16 flex items-center justify-between gap-4">
        {/* Logo with Refero Violet Dot */}
        <Link href="/" className="flex items-center gap-1.5 group select-none">
          <span className="text-xl font-medium tracking-shop-display text-ink-black">
            socialTech
          </span>
          <span className="w-2 h-2 rounded-full bg-shop-violet -ml-0.5"></span>
        </Link>

        {/* Center Pill Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-canvas-mist/80 p-1 rounded-full border border-faint-border text-sm">
          <Link
            href="/"
            className={`px-4 py-1.5 rounded-full transition-all tracking-shop-body ${pathname === '/'
              ? 'bg-pure-white text-ink-black shadow-sm font-medium'
              : 'text-muted-gray hover:text-ink-black'
              }`}
          >
            Khám phá
          </Link>
          <Link
            href="/shop"
            className={`px-4 py-1.5 rounded-full transition-all tracking-shop-body ${pathname.startsWith('/shop')
              ? 'bg-pure-white text-ink-black shadow-sm font-medium'
              : 'text-muted-gray hover:text-ink-black'
              }`}
          >
            Cửa hàng
          </Link>
          {user && (
            <Link
              href="/dashboard/orders"
              className={`px-4 py-1.5 rounded-full transition-all tracking-shop-body ${pathname.startsWith('/dashboard/orders')
                ? 'bg-pure-white text-ink-black shadow-sm font-medium'
                : 'text-muted-gray hover:text-ink-black'
                }`}
            >
              Đơn hàng
            </Link>
          )}
          <a
            href="https://t.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-full text-muted-gray hover:text-ink-black transition-colors inline-flex items-center gap-1 tracking-shop-body text-xs"
          >
            Hỗ trợ ↗
          </a>
        </nav>

        {/* Right Controls: User Pill or Login */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              {/* User Avatar & Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-9 h-9 rounded-full bg-canvas-mist border border-faint-border flex items-center justify-center text-xs font-semibold text-ink-black hover:border-black/20 transition-colors overflow-hidden cursor-pointer"
                  aria-label="Tài khoản cá nhân"
                >
                  {user.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{(user.email || 'U')[0].toUpperCase()}</span>
                  )}
                </button>

                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-pure-white border border-faint-border rounded-cards shadow-lg py-2 z-50 text-xs animate-pop-in"
                    style={{ borderRadius: '20px' }}
                  >


                    <Link
                      href="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-ink-black hover:bg-canvas-mist transition-colors"
                    >
                      Bảng điều khiển
                    </Link>
                    {/* <Link
                      href="/dashboard/wallet"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-ink-black hover:bg-canvas-mist transition-colors"
                    >
                      Nạp tiền VietQR
                    </Link> */}
                    <Link
                      href="/dashboard/orders"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-ink-black hover:bg-canvas-mist transition-colors"
                    >
                      Lịch sử đơn hàng
                    </Link>

                    <div className="border-t border-faint-border my-1"></div>

                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="shop-pill-btn shop-btn-black text-xs py-2 px-5"
            >
              Đăng nhập
            </Link>
          )}

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-9 h-9 rounded-full bg-canvas-mist flex items-center justify-center text-ink-black border border-faint-border cursor-pointer"
            aria-label="Mở menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {menuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </>
              ) : (
                <>
                  <line x1="4" y1="8" x2="20" y2="8"></line>
                  <line x1="4" y1="16" x2="20" y2="16"></line>
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="md:hidden border-t border-faint-border bg-pure-white p-4 space-y-2 text-sm animate-fade-in-up">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="block px-4 py-2.5 rounded-full hover:bg-canvas-mist text-ink-black font-medium"
          >
            Khám phá
          </Link>
          <Link
            href="/shop"
            onClick={() => setMenuOpen(false)}
            className="block px-4 py-2.5 rounded-full hover:bg-canvas-mist text-ink-black font-medium"
          >
            Cửa hàng sản phẩm
          </Link>
          {user ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2.5 rounded-full hover:bg-canvas-mist text-ink-black font-medium"
              >
                Bảng điều khiển
              </Link>

              <Link
                href="/dashboard/orders"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2.5 rounded-full hover:bg-canvas-mist text-ink-black font-medium"
              >
                Lịch sử đơn hàng
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2.5 rounded-full text-red-600 hover:bg-red-50 font-medium"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              onClick={() => setMenuOpen(false)}
              className="shop-pill-btn shop-btn-violet w-full py-2.5 mt-2"
            >
              Đăng nhập / Đăng ký
            </Link>
          )}
        </div>
      )}
    </header>
  )
}
