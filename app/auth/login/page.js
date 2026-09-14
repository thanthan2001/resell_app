'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState('login') // 'login' or 'register'
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard'
  const supabase = createClient()

  const handleEmailAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError(error.message)
        setLoading(false)
      } else {
        window.location.href = redirect
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/auth/callback?redirect=${redirect}`,
        },
      })
      if (error) {
        setError(error.message)
        setLoading(false)
      } else {
        setError('')
        alert('Kiểm tra email để xác nhận tài khoản!')
        setLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-canvas-mist text-ink-black flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-1.5 group select-none">
            <span className="text-2xl font-medium tracking-shop-display text-ink-black">
              socialTech
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-shop-violet -ml-0.5"></span>
          </Link>
          <p className="text-xs text-muted-gray mt-2 tracking-shop-body">
            Hệ thống cung cấp bản quyền số tự động
          </p>
        </div>

        {/* Auth Card (Refero 28px Radius & Soft Dual Shadow) */}
        <div
          className="bg-pure-white rounded-cards shadow-sm-2 border border-faint-border p-8"
          style={{ borderRadius: '28px' }}
        >
          <h1 className="text-xl font-semibold tracking-shop-display text-ink-black text-center mb-1">
            {mode === 'login' ? 'Đăng nhập tài khoản' : 'Tạo tài khoản mới'}
          </h1>
          <p className="text-xs text-muted-gray text-center mb-6 tracking-shop-body">
            {mode === 'login'
              ? 'Chào mừng trở lại! Đăng nhập để quản lý ví và đơn hàng.'
              : 'Đăng ký nhanh để bắt đầu mua sắm bản quyền.'}
          </p>

          {/* Email / Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <label htmlFor="auth-email" className="block text-xs font-semibold text-ink-black mb-1">
                Email
              </label>
              <input
                id="auth-email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-canvas-mist border border-faint-border rounded-full text-xs text-ink-black placeholder-muted-gray focus:outline-none focus:border-black/20"
              />
            </div>

            <div>
              <label htmlFor="auth-password" className="block text-xs font-semibold text-ink-black mb-1">
                Mật khẩu
              </label>
              <input
                id="auth-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-2.5 bg-canvas-mist border border-faint-border rounded-full text-xs text-ink-black placeholder-muted-gray focus:outline-none focus:border-black/20"
              />
            </div>

            {error && (
              <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
                ⚠️ {error}
              </div>
            )}

            {/* Action Pill Button */}
            <button
              type="submit"
              disabled={loading}
              className="shop-pill-btn shop-btn-violet w-full py-3 text-xs font-semibold mt-2 cursor-pointer"
            >
              {loading ? 'Đang xử lý...' : mode === 'login' ? 'Đăng nhập' : 'Đăng ký tài khoản'}
            </button>
          </form>

          {/* Switch Mode */}
          <div className="text-center mt-6 pt-4 border-t border-faint-border text-xs text-muted-gray">
            {mode === 'login' ? (
              <p>
                Chưa có tài khoản?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('register'); setError('') }}
                  className="font-semibold text-shop-violet hover:underline cursor-pointer"
                >
                  Đăng ký ngay
                </button>
              </p>
            ) : (
              <p>
                Đã có tài khoản?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError('') }}
                  className="font-semibold text-shop-violet hover:underline cursor-pointer"
                >
                  Đăng nhập
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-canvas-mist flex items-center justify-center">Đang tải...</div>}>
      <LoginForm />
    </Suspense>
  )
}
