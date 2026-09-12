'use client'

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
}) {
  return (
    <div className={`overflow-x-auto scrollbar-none py-1 -my-1 ${className}`}>
      <div className="inline-flex items-center gap-2.5 min-w-full sm:min-w-0">
        {SHOP_CATEGORIES.map((cat) => {
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
                  className={`text-[11px] px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-canvas-mist text-muted-gray'
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
                className={`shop-category-chip ${isActive ? 'active' : ''}`}
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
              className={`shop-category-chip cursor-pointer ${isActive ? 'active' : ''}`}
            >
              {content}
            </button>
          )
        })}
      </div>
    </div>
  )
}
