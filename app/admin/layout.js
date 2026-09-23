'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminLayout({ children }) {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [passkey, setPasskey] = useState('')
  const [claiming, setClaiming] = useState(false)
  const [claimError, setClaimError] = useState('')
  const [claimSuccess, setClaimSuccess] = useState('')
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const checkAdminStatus = async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      if (!currentUser) {
        router.push('/auth/login?redirect=/admin')
        return
      }
      setUser(currentUser)

      // Call verification API (which auto-promotes if email in ADMIN_EMAILS)
      const res = await fetch('/api/admin/verify')
      const data = await res.json()

      if (data.isAdmin) {
        setIsAdmin(true)
      } else {
        setIsAdmin(false)
      }
    } catch (err) {
      console.error('Admin layout check error:', err)
      setIsAdmin(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAdminStatus()
  }, [])

  const handleClaimAdmin = async (e) => {
    e.preventDefault()
    if (!passkey.trim()) return

    setClaiming(true)
    setClaimError('')
    setClaimSuccess('')

    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passkey }),
      })
      const data = await res.json()

      if (res.ok && data.success) {
        setClaimSuccess(data.message || 'Cấp quyền Admin thành công!')
        setTimeout(() => {
          setIsAdmin(true)
        }, 1000)
      } else {
        setClaimError(data.error || 'Mã Passkey không đúng!')
      }
    } catch (err) {
      setClaimError('Lỗi kết nối máy chủ!')
    } finally {
      setClaiming(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas-mist flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-2 border-faint-border border-t-shop-violet rounded-full animate-spin"></div>
          <p className="text-xs text-muted-gray tracking-shop-body">Đang xác thực quyền Quản trị...</p>
        </div>
      </div>
    )
  }

  // Not an admin yet -> show Refero Passkey verification screen
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-canvas-mist text-ink-black flex flex-col items-center justify-center p-4 font-sans">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <Link href="/" className="inline-flex items-center gap-1.5 group select-none">
              <span className="text-2xl font-medium tracking-shop-display text-ink-black">
                socialTech
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-shop-violet -ml-0.5"></span>
            </Link>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-shop-violet/10 text-shop-violet text-xs font-semibold rounded-full mt-2">
              <span>👑</span> Khu Vực Quản Trị Viên (Admin)
            </div>
          </div>

          <div
            className="bg-pure-white rounded-cards shadow-sm-2 border border-faint-border p-8"
            style={{ borderRadius: '28px' }}
          >
            <h2 className="text-lg font-semibold tracking-shop-display text-ink-black text-center mb-2">
              Kích Hoạt Quyền Quản Trị
            </h2>
            <p className="text-xs text-muted-gray text-center mb-6 leading-relaxed">
              Tài khoản <span className="font-semibold text-ink-black">{user?.email}</span> hiện chưa có quyền Admin trong hệ thống.
            </p>

            {claimError && (
              <div className="mb-5 p-3.5 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                {claimError}
              </div>
            )}

            {claimSuccess && (
              <div className="mb-5 p-3.5 bg-emerald-50 text-emerald-700 text-xs rounded-xl border border-emerald-200 font-medium">
                ✓ {claimSuccess}
              </div>
            )}

            <form onSubmit={handleClaimAdmin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-gray mb-1.5">
                  Mã Admin Passkey
                </label>
                <input
                  type="password"
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  placeholder="Nhập mã passkey quản trị (VD: socialtech2026)"
                  className="w-full px-4 py-3 bg-canvas-mist border border-faint-border rounded-xl text-sm focus:outline-none focus:border-shop-violet transition-colors text-ink-black"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={claiming}
                className="w-full py-3 bg-shop-violet hover:bg-[#4323d4] text-white text-sm font-medium rounded-pill shadow-lg-2 hover:shadow-lg transition-all duration-200 disabled:opacity-50"
              >
                {claiming ? 'Đang kích hoạt...' : 'Kích hoạt quyền Admin ngay'}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-faint-border flex items-center justify-between text-xs text-muted-gray">
              <Link href="/dashboard" className="hover:text-ink-black transition-colors">
                ← Về Dashboard cá nhân
              </Link>
              <Link href="/" className="hover:text-ink-black transition-colors">
                Trang chủ
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const navItems = [
    { href: '/admin', label: '📊 Tổng quan', exact: true },
    { href: '/admin/orders', label: '📦 Quản lý đơn hàng', exact: false },
    { href: '/admin/products', label: '🏷️ Quản lý giá', exact: false },
    { href: '/admin/deposits', label: '💰 Lịch sử nạp tiền', exact: false },
    { href: '/admin/users', label: '👥 Quản lý thành viên', exact: false },
  ]

  return (
    <div className="min-h-screen bg-canvas-mist text-ink-black flex flex-col font-sans">
      {/* Admin Refero Header */}
      <header className="sticky top-0 z-40 bg-pure-white/95 backdrop-blur-md border-b border-faint-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-2 group select-none">
              <span className="text-xl font-medium tracking-shop-display text-ink-black">
                socialTech
              </span>
              <span className="w-2 h-2 rounded-full bg-shop-violet -ml-1"></span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-shop-violet text-white rounded-full ml-1">
                Admin
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-2 rounded-pill text-xs font-medium tracking-shop-body transition-colors ${
                      isActive
                        ? 'bg-ink-black text-white'
                        : 'text-muted-gray hover:text-ink-black hover:bg-canvas-mist'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <div className="text-xs font-medium text-ink-black truncate max-w-[160px]">
                {user?.email}
              </div>
              <div className="text-[10px] text-shop-violet font-semibold">Quản trị viên</div>
            </div>
            <Link
              href="/dashboard"
              className="px-3.5 py-1.5 border border-faint-border hover:border-ink-black/30 rounded-pill text-xs font-medium text-ink-black transition-colors"
            >
              ← Về Dashboard
            </Link>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center gap-1 px-4 py-2 border-t border-faint-border overflow-x-auto">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 whitespace-nowrap rounded-pill text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-ink-black text-white'
                    : 'text-muted-gray hover:text-ink-black hover:bg-canvas-mist'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
