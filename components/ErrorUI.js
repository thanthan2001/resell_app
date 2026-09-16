'use client'

import { useEffect } from 'react'
import Link from 'next/link'

/**
 * Reusable Error UI used by all route-level error.js files.
 * Accepts: error, retry, backHref, backLabel, context (string label for the section)
 */
export default function ErrorUI({ error, retry, backHref = '/', backLabel = 'Về trang chủ', context = '' }) {
  useEffect(() => {
    // Log to console only — replace with Sentry/etc in production
    console.error(`[ErrorBoundary${context ? `:${context}` : ''}]`, error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div
        className="w-full max-w-md bg-pure-white border border-faint-border rounded-cards p-10 text-center animate-pop-in"
        style={{ borderRadius: 28 }}
      >
        {/* Visual indicator */}
        <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-2xl">
          ⚠️
        </div>

        <h2 className="text-lg font-semibold tracking-shop-display text-ink-black mb-2">
          Có lỗi xảy ra
        </h2>
        <p className="text-sm text-muted-gray leading-relaxed mb-6">
          {process.env.NODE_ENV === 'development' && error?.message
            ? error.message
            : 'Đã có lỗi không mong muốn. Vui lòng thử lại hoặc quay về trang trước.'}
        </p>

        {error?.digest && (
          <p className="text-[11px] text-cool-stone font-mono mb-6 bg-canvas-mist px-3 py-1.5 rounded-full inline-block">
            ID: {error.digest}
          </p>
        )}

        <div className="flex gap-3 justify-center flex-wrap">
          {retry && (
            <button
              onClick={retry}
              className="shop-pill-btn shop-btn-violet px-5 py-2.5 text-sm font-semibold"
            >
              🔄 Thử lại
            </button>
          )}
          <Link
            href={backHref}
            className="shop-pill-btn shop-btn-white px-5 py-2.5 text-sm font-medium"
          >
            {backLabel}
          </Link>
        </div>
      </div>
    </div>
  )
}
