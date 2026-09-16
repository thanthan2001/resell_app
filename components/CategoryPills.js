'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

export const SHOP_CATEGORIES = [
  { id: 'all', name: 'Tất cả', iconImg: '/icons/application.png', icon: '✨', slug: 'all' },
  { id: 'chatgpt', name: 'ChatGPT & OpenAI', iconImg: '/icons/chatgpt.png', icon: '🤖', slug: 'chatgpt' },
  { id: 'claude', name: 'Claude AI', iconImg: '/icons/claude-ai-icon.png', icon: '🧠', slug: 'claude' },
  { id: 'veo3', name: 'Google Veo & Gemini', iconImg: '/icons/google.png', icon: '✨', slug: 'veo3' },
  { id: 'grok', name: 'Grok AI', iconImg: '/icons/grok-icon.png', icon: '⚡', slug: 'grok' },
  { id: 'kling', name: 'Kling AI Video', iconImg: '/icons/kling-ai-icon.png', icon: '📹', slug: 'kling' },
  { id: 'adobe', name: 'Adobe Creative', iconImg: '/icons/creative-cloud.png', icon: '🎨', slug: 'adobe' },
  { id: 'canva', name: 'Canva Pro', iconImg: '/icons/palette.png', icon: '🎨', slug: 'canva' },
  { id: 'capcut', name: 'CapCut Pro', iconImg: '/icons/capcut-icon.png', icon: '🎬', slug: 'capcut' },
  { id: 'elevenlabs', name: 'ElevenLabs Voice', iconImg: '/icons/elevenlabs-ai-icon.png', icon: '🎙️', slug: 'elevenlabs' },
  { id: 'office', name: 'Microsoft 365', iconImg: '/icons/microsoft.png', icon: '📄', slug: 'office' },
  { id: 'youtube', name: 'YouTube Premium', iconImg: '/icons/youtube.png', icon: '▶️', slug: 'youtube' },
  { id: 'netflix', name: 'Netflix 4K', iconImg: '/icons/netflix_macos_bigsur_icon_189917.png', icon: '🍿', slug: 'netflix' },
  { id: 'spotify', name: 'Spotify Music', iconImg: '/icons/spotify.png', icon: '🎵', slug: 'spotify' },
  { id: 'apple', name: 'Apple iCloud', iconImg: '/icons/apple-logo.png', icon: '🍎', slug: 'apple' },
  { id: 'notion', name: 'Notion AI', iconImg: '/icons/notion-icon.png', icon: '📝', slug: 'notion' },
  { id: 'locket', name: 'Locket Gold', iconImg: '/icons/locket_icon.jpg', icon: '💛', slug: 'locket' },
  { id: 'heygen', name: 'HeyGen Video', iconImg: '/icons/heygen-icon.ico', icon: '🎥', slug: 'heygen' },
  { id: 'meitu', name: 'Meitu & Xingtu', iconImg: '/icons/meitu-icon.jpeg', icon: '💄', slug: 'meitu' },
  { id: 'vpn', name: 'VPN & Bảo mật', iconImg: '/icons/vpn.png', icon: '🔐', slug: 'vpn' },
  { id: 'other', name: 'Tiện ích khác', iconImg: '/icons/application.png', icon: '💎', slug: 'other' },
]

export default function CategoryPills({
  selectedId = 'all',
  onSelect,
  counts = {},
  isNavigation = false,
  className = '',
  initialLimit = 9,
  collapsible = true,
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Visible categories calculation
  const visibleCategories = useMemo(() => {
    if (!collapsible || isExpanded) {
      return SHOP_CATEGORIES
    }

    const initialSlice = SHOP_CATEGORIES.slice(0, initialLimit)
    // If selectedId is outside the initial slice, ensure it's displayed so active state is always visible
    if (selectedId && selectedId !== 'all' && !initialSlice.some((c) => c.id === selectedId)) {
      const selectedCat = SHOP_CATEGORIES.find((c) => c.id === selectedId)
      if (selectedCat) {
        return [...initialSlice, selectedCat]
      }
    }
    return initialSlice
  }, [collapsible, isExpanded, initialLimit, selectedId])

  const hiddenCount = Math.max(0, SHOP_CATEGORIES.length - visibleCategories.length)
  const isCentered = className.includes('justify-center')

  return (
    <div className={`w-full ${className}`}>
      <div className={`flex flex-wrap items-center gap-2 sm:gap-2.5 transition-all duration-300 ease-in-out ${isCentered ? 'justify-center' : ''}`}>
        {visibleCategories.map((cat) => {
          const isActive = selectedId === cat.id
          const count = counts[cat.id]

          const content = (
            <>
              <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden" aria-hidden="true">
                {cat.iconImg ? (
                  <img
                    src={cat.iconImg}
                    alt=""
                    className="w-4 h-4 object-contain"
                  />
                ) : (
                  <span className="text-xs">{cat.icon}</span>
                )}
              </span>
              <span className="font-normal tracking-shop-body whitespace-nowrap">
                {cat.name}
              </span>
              {count !== undefined && (
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full transition-colors ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-canvas-mist text-muted-gray group-hover:bg-faint-border group-hover:text-ink-black'
                  }`}
                >
                  {count}
                </span>
              )}
            </>
          )

          if (isNavigation) {
            return (
              <Link
                key={cat.id}
                href={cat.id === 'all' ? '/shop' : `/shop?category=${cat.id}`}
                className={`shop-category-chip group ${isActive ? 'active' : ''}`}
              >
                {content}
              </Link>
            )
          }

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelect && onSelect(cat.id)}
              className={`shop-category-chip group cursor-pointer ${isActive ? 'active' : ''}`}
            >
              {content}
            </button>
          )
        })}

        {/* Action Toggle / Explore Button */}
        {collapsible && (
          <>
            {isNavigation ? (
              // For navigation mode (e.g. Home page Hero): Direct link to /shop catalog
              <Link
                href="/shop"
                className="shop-category-chip group hover:border-shop-violet/40 hover:text-shop-violet cursor-pointer transition-all duration-200"
                title="Khám phá toàn bộ danh mục sản phẩm"
              >
                <span className="w-5 h-5 rounded-full bg-shop-violet/10 text-shop-violet flex items-center justify-center text-xs font-bold transition-transform group-hover:scale-110">
                  +
                </span>
                <span className="font-medium tracking-shop-body text-shop-violet whitespace-nowrap">
                  Xem tất cả ({SHOP_CATEGORIES.length - 1}+ dịch vụ)
                </span>
                <svg
                  className="w-3.5 h-3.5 text-shop-violet transition-transform group-hover:translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ) : !isExpanded && hiddenCount > 0 ? (
              // Collapsed state: Show More button
              <button
                type="button"
                onClick={() => setIsExpanded(true)}
                className="shop-category-chip group hover:border-shop-violet/30 hover:text-shop-violet cursor-pointer transition-all duration-200"
                aria-expanded={false}
                aria-label={`Xem thêm ${hiddenCount} danh mục`}
              >
                <span className="w-5 h-5 rounded-full bg-shop-violet/10 text-shop-violet flex items-center justify-center text-xs font-bold transition-transform group-hover:scale-110">
                  +
                </span>
                <span className="font-medium tracking-shop-body whitespace-nowrap text-ink-black group-hover:text-shop-violet">
                  Xem thêm ({hiddenCount})
                </span>
                <svg
                  className="w-3.5 h-3.5 text-muted-gray group-hover:text-shop-violet transition-transform group-hover:translate-y-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            ) : isExpanded ? (
              // Expanded state: Collapse button
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="shop-category-chip group hover:border-black/20 text-muted-gray hover:text-ink-black cursor-pointer transition-all duration-200"
                aria-expanded={true}
                aria-label="Thu gọn danh mục"
              >
                <span className="font-medium tracking-shop-body whitespace-nowrap">
                  Thu gọn
                </span>
                <svg
                  className="w-3.5 h-3.5 text-muted-gray group-hover:text-ink-black transition-transform group-hover:-translate-y-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
            ) : null}
          </>
        )}
      </div>
    </div>
  )
}

