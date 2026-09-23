'use client'

import React from 'react'

export default function FloatingContact() {
  return (
    <aside
      aria-label="Kênh liên hệ hỗ trợ"
      className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end gap-2 sm:gap-2.5 pointer-events-auto font-sans"
    >
      {/* Direct Zalo Button */}
      <a
        href="https://zalo.me/0788836968"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Liên hệ Zalo 0788.836.968"
        className="group flex items-center gap-2.5 bg-pure-white text-ink-black pl-2 pr-3.5 sm:pr-4 py-2 rounded-full shadow-sm-2 hover:shadow-lg border border-faint-border hover:border-black/15 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
      >
        <div className="w-8 h-8 rounded-full bg-[#0068FF] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.04 2 11.02c0 2.76 1.39 5.24 3.58 6.89-.16.92-.61 2.64-.64 2.76-.06.24.13.43.34.33.26-.13 2.94-1.8 3.55-2.22.77.16 1.57.25 2.39.25 5.52 0 10-4.04 10-9.02S17.52 2 12 2zm1.69 12.28h-3.8c-.3 0-.54-.24-.54-.54 0-.17.08-.32.21-.42l3.07-3.87H9.89c-.3 0-.54-.24-.54-.54s.24-.54.54-.54h3.79c.3 0 .54.24.54.54 0 .17-.08.33-.21.43l-3.07 3.86h2.75c.3 0 .54.24.54.54s-.24.54-.54.54z" />
          </svg>
        </div>
        <div className="flex flex-col text-left leading-tight">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold tracking-shop-body group-hover:text-warm-accent transition-colors">
              Zalo: 0788.836.968
            </span>
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
          </div>
          <span className="text-[10px] text-muted-gray">Hỗ trợ kích hoạt 24/7</span>
        </div>
      </a>

      {/* Direct Facebook Button */}
      <a
        href="https://www.facebook.com/thanthan1011"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Liên hệ Facebook Admin Thân Thân"
        className="group flex items-center gap-2.5 bg-pure-white text-ink-black pl-2 pr-3.5 sm:pr-4 py-2 rounded-full shadow-sm-2 hover:shadow-lg border border-faint-border hover:border-black/15 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
      >
        <div className="w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </div>
        <div className="flex flex-col text-left leading-tight">
          <span className="text-xs font-semibold tracking-shop-body group-hover:text-warm-accent transition-colors flex items-center gap-1">
            Facebook Admin <span className="text-[10px] text-muted-gray">↗</span>
          </span>
          <span className="text-[10px] text-muted-gray">Thân Thân</span>
        </div>
      </a>
    </aside>
  )
}

