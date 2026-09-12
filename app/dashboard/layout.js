'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function DashboardLayout({ children }) {
  const [user, setUser] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login?redirect=/dashboard')
        return
      }
      setUser(user)

      fetch('/api/admin/verify')
        .then((res) => res.json())
        .then((data) => {
          if (data.isAdmin) setIsAdmin(true)
        })
        .catch(() => {})
    }
    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const navItems = [
    { href: '/dashboard', label: 'Tổng quan', icon: '📊', exact: true },
    { href: '/dashboard/orders', label: 'Đơn hàng của tôi', icon: '📦' },
    { href: '/shop', label: 'Cửa hàng sản phẩm', icon: '🛍️' },
  ]

  if (isAdmin) {
    navItems.push(
      { href: '/admin', label: 'Admin Quản Trị', icon: '👑' }
    )
  }

  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Tài khoản'

  return (
    <div className="min-h-screen bg-canvas-mist text-ink-black flex flex-col font-sans">
      {/* Sidebar (Desktop Persistent, Mobile Drawer) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-[260px] bg-pure-white border-r border-faint-border flex flex-col justify-between transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
      >
        <div>
          {/* Logo & Brand */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-faint-border">
            <Link href="/" className="flex items-center gap-1.5 group select-none">
              <span className="text-xl font-medium tracking-shop-display text-ink-black">
                socialTech
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-shop-violet -ml-0.5"></span>
            </Link>

            {/* Mobile close button */}
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="md:hidden w-8 h-8 rounded-full bg-canvas-mist flex items-center justify-center text-muted-gray hover:text-ink-black"
            >
              ✕
            </button>
          </div>

          {/* Navigation Items (Pill Style) */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-full text-xs font-medium tracking-shop-body transition-all duration-150 ${isActive
                    ? 'bg-ink-black text-pure-white shadow-sm'
                    : 'text-muted-gray hover:text-ink-black hover:bg-canvas-mist'
                    }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* User Card & Sign Out at bottom */}
        <div className="p-4 border-t border-faint-border">
          {user && (
            <div className="flex items-center gap-3 p-2 rounded-2xl bg-canvas-mist/60 mb-2">
              <div className="w-9 h-9 rounded-full bg-pure-white border border-faint-border flex items-center justify-center text-xs font-semibold text-ink-black overflow-hidden flex-shrink-0">
                {user.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{(user.email || 'U')[0].toUpperCase()}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-ink-black truncate">
                  {displayName}
                </div>
                <div className="text-[11px] text-muted-gray truncate">
                  {user.email}
                </div>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleSignOut}
            className="w-full py-2 px-4 rounded-full bg-transparent hover:bg-red-50 text-red-600 text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>🚪</span>
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-xs md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 md:ml-[260px] flex flex-col min-h-screen">
        {/* Sticky Clean Topbar */}
        <header className="sticky top-0 z-20 h-16 bg-pure-white/95 backdrop-blur-md border-b border-faint-border px-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="md:hidden w-9 h-9 rounded-full bg-canvas-mist flex items-center justify-center text-ink-black border border-faint-border cursor-pointer"
              aria-label="Mở menu điều hướng"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="8" x2="20" y2="8"></line>
                <line x1="4" y1="16" x2="20" y2="16"></line>
              </svg>
            </button>

            <h1 className="text-base sm:text-lg font-semibold tracking-shop-display text-ink-black">
              {pathname === '/dashboard' ? 'Tổng quan tài khoản'
                : pathname === '/dashboard/orders' ? 'Lịch sử đơn hàng'
                  : 'Bảng điều khiển'}
            </h1>
          </div>

          {/* Quick Actions Right */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/shop"
              className="shop-pill-btn shop-btn-violet text-xs py-1.5 px-4"
            >
              🛍️ Mua sắm
            </Link>
          </div>
        </header>

        {/* Content Wrapper */}
        <main className="flex-1 p-4 sm:p-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
