'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'

export default function HomeCatalogSection({
  allGroups = [],
  aiGroups = [],
  mediaGroups = [],
  designOfficeGroups = [],
}) {
  const [activeTab, setActiveTab] = useState('all')

  const tabs = [
    { id: 'all', label: 'Tất cả sản phẩm', count: allGroups.length },
    { id: 'ai', label: '🤖 AI & Chatbot', count: aiGroups.length },
    { id: 'media', label: '🎬 Video & Âm thanh', count: mediaGroups.length },
    { id: 'design_office', label: '🎨 Thiết kế & Văn phòng', count: designOfficeGroups.length },
  ]

  // Filtered groups based on activeTab
  const currentGroups = useMemo(() => {
    switch (activeTab) {
      case 'ai':
        return aiGroups
      case 'media':
        return mediaGroups
      case 'design_office':
        return designOfficeGroups
      default:
        return allGroups
    }
  }, [activeTab, allGroups, aiGroups, mediaGroups, designOfficeGroups])

  return (
    <div className="space-y-12">
      {/* ================= INTERACTIVE TAB BAR ================= */}
      <div className="sticky top-16 z-30 py-3 bg-canvas-mist/95 backdrop-blur-md border-b border-faint-border/80">
        <div className="shop-container flex items-center justify-between gap-3 overflow-x-auto no-scrollbar py-1">
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-xs font-medium tracking-shop-body transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-ink-black text-pure-white shadow-sm'
                      : 'bg-pure-white text-muted-gray hover:text-ink-black border border-faint-border hover:border-black/15 shadow-2xs'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-canvas-mist text-muted-gray'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              )
            })}
          </div>

          <Link
            href="/shop"
            className="text-xs font-semibold text-warm-accent hover:underline shrink-0 hidden sm:inline-flex items-center gap-1"
          >
            <span>Mở cửa hàng đầy đủ</span>
            <span>→</span>
          </Link>
        </div>
      </div>

      {/* ================= CATALOG DISPLAY ================= */}
      <div className="shop-container">
        {activeTab === 'all' ? (
          /* "All" Tab: Multi-section Curated Showroom */
          <div className="space-y-16 sm:space-y-20">
            {/* Section 1: AI */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pure-white border border-faint-border shadow-2xs text-[11px] font-semibold text-ink-black uppercase tracking-wider mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-warm-accent"></span>
                    <span>Mô hình AI hàng đầu</span>
                  </div>
                  <h2 className="shop-section-header">
                    <Link
                      href="/shop?category=chatgpt"
                      className="inline-flex items-center gap-2 group text-ink-black"
                    >
                      <span className="text-xl sm:text-2xl font-semibold tracking-shop-display">
                        AI & Chatbot Thông Minh
                      </span>
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-ink-black transition-transform group-hover:translate-x-1"
                      >
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </Link>
                  </h2>
                  <p className="text-xs text-muted-gray mt-1 max-w-lg">
                    Nâng cấp tài khoản ChatGPT Plus GPT-4o, Claude 3.5 Sonnet, Grok AI phục vụ viết lách, phân tích dữ liệu và lập trình.
                  </p>
                </div>

                <Link
                  href="/shop?category=chatgpt"
                  className="shop-pill-btn shop-btn-white text-xs py-2 px-4 self-start sm:self-auto shrink-0"
                >
                  Xem tất cả {aiGroups.length} gói →
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {(aiGroups.length > 0 ? aiGroups : allGroups.slice(0, 8)).map((group, idx) => (
                  <ProductCard key={group.groupId} group={group} index={idx} />
                ))}
              </div>
            </div>

            {/* Section 2: Media */}
            <div className="pt-12 border-t border-faint-border/60">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pure-white border border-faint-border shadow-2xs text-[11px] font-semibold text-ink-black uppercase tracking-wider mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-warm-accent"></span>
                    <span>Media Generation</span>
                  </div>
                  <h2 className="shop-section-header">
                    <Link
                      href="/shop?category=veo3"
                      className="inline-flex items-center gap-2 group text-ink-black"
                    >
                      <span className="text-xl sm:text-2xl font-semibold tracking-shop-display">
                        Sáng Tạo Video & Âm Thanh AI
                      </span>
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-ink-black transition-transform group-hover:translate-x-1"
                      >
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </Link>
                  </h2>
                  <p className="text-xs text-muted-gray mt-1 max-w-lg">
                    Tạo video chân thực với Google Veo 3, Kling AI, CapCut Pro và nhân bản giọng nói cảm xúc cùng ElevenLabs.
                  </p>
                </div>

                <Link
                  href="/shop?category=veo3"
                  className="shop-pill-btn shop-btn-white text-xs py-2 px-4 self-start sm:self-auto shrink-0"
                >
                  Xem tất cả {mediaGroups.length} gói →
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {(mediaGroups.length > 0 ? mediaGroups : allGroups.slice(4, 12)).map((group, idx) => (
                  <ProductCard key={group.groupId} group={group} index={idx} />
                ))}
              </div>
            </div>

            {/* Section 3: Design & Office */}
            <div className="pt-12 border-t border-faint-border/60">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pure-white border border-faint-border shadow-2xs text-[11px] font-semibold text-ink-black uppercase tracking-wider mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-warm-accent"></span>
                    <span>Thiết kế & Công sở</span>
                  </div>
                  <h2 className="shop-section-header">
                    <Link
                      href="/shop?category=canva"
                      className="inline-flex items-center gap-2 group text-ink-black"
                    >
                      <span className="text-xl sm:text-2xl font-semibold tracking-shop-display">
                        Thiết Kế, Văn Phòng & Tiện Ích
                      </span>
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-ink-black transition-transform group-hover:translate-x-1"
                      >
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </Link>
                  </h2>
                  <p className="text-xs text-muted-gray mt-1 max-w-lg">
                    Canva Pro trọn đời, Microsoft 365 bản quyền, tài khoản Adobe Cloud và VPN bảo mật tốc độ cao.
                  </p>
                </div>

                <Link
                  href="/shop?category=canva"
                  className="shop-pill-btn shop-btn-white text-xs py-2 px-4 self-start sm:self-auto shrink-0"
                >
                  Xem tất cả {designOfficeGroups.length} gói →
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {(designOfficeGroups.length > 0 ? designOfficeGroups : allGroups.slice(8, 16)).map((group, idx) => (
                  <ProductCard key={group.groupId} group={group} index={idx} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Specific Filtered Tab */
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-faint-border">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold tracking-shop-display text-ink-black">
                  {tabs.find((t) => t.id === activeTab)?.label}
                </h2>
                <p className="text-xs text-muted-gray mt-0.5">
                  Đang hiển thị {currentGroups.length} sản phẩm sẵn sàng giao tự động
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className="shop-pill-btn shop-btn-white text-xs py-2 px-3.5"
              >
                ← Xem tất cả chuyên mục
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {currentGroups.map((group, idx) => (
                <ProductCard key={group.groupId} group={group} index={idx} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
