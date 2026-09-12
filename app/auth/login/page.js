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

  const handleGoogleLogin = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}`,
      },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

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
          emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}`,
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

          {/* Google OAuth Pill Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3 px-4 rounded-full bg-pure-white hover:bg-slate-50 border border-faint-border shadow-sm flex items-center justify-center gap-3 text-xs font-medium text-ink-black transition-all cursor-pointer mb-5"
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            <span>Tiếp tục với Google</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-5">
            <div className="border-t border-faint-border w-full"></div>
            <span className="bg-pure-white px-3 text-[11px] text-muted-gray uppercase tracking-wider relative">
              hoặc
            </span>
          </div>

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
