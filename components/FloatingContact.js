'use client'

import React from 'react'

export default function FloatingContact() {
  return (
    <aside
      aria-label="Liên hệ hỗ trợ nhanh"
      className="fixed bottom-6 right-5 sm:right-6 z-40 flex flex-col items-end gap-3 pointer-events-auto select-none"
    >
      {/* Facebook Contact Button */}
      <a
        href="https://www.facebook.com/thanthan1011"
        target="_blank"
        rel="noopener noreferrer"
        title="Liên hệ qua Facebook: thanthan1011"
        className="group relative flex items-center justify-center bg-pure-white hover:bg-[#1877F2] text-ink-black hover:text-white p-2 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.12)] border border-faint-border hover:border-transparent transition-all duration-300 transform hover:scale-105 active:scale-95"
      >
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:px-3 text-xs font-medium transition-all duration-300 ease-out text-inherit">
          Facebook: thanthan1011
        </span>
        <div className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center text-white shadow-sm flex-shrink-0">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </div>
      </a>

      {/* Zalo Contact Button */}
      <a
        href="https://zalo.me/0788836968"
        target="_blank"
        rel="noopener noreferrer"
        title="Chat Zalo: 0788836968"
        className="group relative flex items-center justify-center bg-pure-white hover:bg-[#0068FF] text-ink-black hover:text-white p-2 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.12)] border border-faint-border hover:border-transparent transition-all duration-300 transform hover:scale-105 active:scale-95"
      >
        {/* Pulsing ring indicator */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0068FF] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#0068FF] border-2 border-pure-white"></span>
        </span>

        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:px-3 text-xs font-medium transition-all duration-300 ease-out text-inherit">
          Zalo: 0788836968
        </span>
        <div className="w-10 h-10 rounded-full bg-[#0068FF] flex items-center justify-center text-white shadow-sm flex-shrink-0 font-bold text-xs tracking-tighter">
          <span className="text-[13px] font-extrabold tracking-tight font-sans">Zalo</span>
        </div>
      </a>
    </aside>
  )
}
