/**
 * Format number as Vietnamese currency
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Check if a product should be excluded from display and purchasing
 * (e.g. internal admin items, provider API connection notice items)
 */
export function isExcludedProduct(p) {
  if (!p) return true
  const name = (p.name || '').toUpperCase()
  const desc = (p.description || '').toUpperCase()

  return (
    name.includes('IB ADMIN') ||
    name.includes('LẤY API KẾT NỐI') ||
    name.includes('KẾT NỐI VỚI BOT') ||
    name.includes('BOT/WEB') ||
    desc.includes('IB ADMIN ĐỂ LẤY API')
  )
}

/**
 * Format date to Vietnamese locale
 */
export function formatDate(dateStr) {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr))
}

/**
 * Generate a unique reference code for deposits
 */
export function generateRefCode(userId) {
  const ts = Date.now().toString(36).toUpperCase()
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `NT${ts}${rand}`
}

/**
 * Generate VietQR URL
 */
export function generateVietQRUrl({ amount, referenceCode, accountName }) {
  const bankId = process.env.NEXT_PUBLIC_BANK_ID || 'MB'
  const accountNo = process.env.NEXT_PUBLIC_BANK_ACCOUNT || '0123456789'
  const name = accountName || process.env.NEXT_PUBLIC_BANK_NAME || 'SHOP'
  const info = encodeURIComponent(referenceCode || '')
  const encodedName = encodeURIComponent(name)

  return `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png?amount=${amount}&addInfo=${info}&accountName=${encodedName}`
}

/**
 * Get order status label and color
 */
export function getStatusInfo(status) {
  const map = {
    pending: { label: 'Chờ xử lý', color: 'var(--color-warning)' },
    processing: { label: 'Đang xử lý', color: 'var(--color-info)' },
    delivered: { label: 'Đã giao', color: 'var(--color-success)' },
    failed: { label: 'Thất bại', color: 'var(--color-error)' },
    refunded: { label: 'Hoàn tiền', color: 'var(--color-muted)' },
    confirmed: { label: 'Đã xác nhận', color: 'var(--color-success)' },
    rejected: { label: 'Từ chối', color: 'var(--color-error)' },
  }
  return map[status] || { label: status, color: 'var(--color-muted)' }
}

/**
 * Get category metadata for a product
 */
export function getProductCategory(product) {
  const family = (product.productFamily || product.emoji || '').toLowerCase()
  const name = (product.name || '').toLowerCase()

  if (family === 'adobe' || name.includes('adobe')) {
    return { id: 'adobe', name: 'Adobe Creative Cloud', icon: '🎨', iconImg: '/icons/creative-cloud.png', badge: 'Adobe', color: '#ff0000', gradient: 'linear-gradient(135deg, #ff0000 0%, #cc0000 100%)' }
  }
  if (family === 'chatgpt' || name.includes('chatgpt') || name.includes('gpt') || name.includes('openai')) {
    return { id: 'chatgpt', name: 'ChatGPT & OpenAI', icon: '🤖', iconImg: '/icons/chatgpt.png', badge: 'ChatGPT', color: '#10a37f', gradient: 'linear-gradient(135deg, #10a37f 0%, #059669 100%)' }
  }
  if (family === 'claude' || name.includes('claude') || name.includes('anthropic')) {
    return { id: 'claude', name: 'Claude AI', icon: '🧠', iconImg: '/icons/claude-ai-icon.png', badge: 'Claude', color: '#d97706', gradient: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)' }
  }
  if (family === 'grok' || name.includes('grok')) {
    return { id: 'grok', name: 'Grok AI (xAI)', icon: '⚡', iconImg: '/icons/grok-icon.png', badge: 'Grok', color: '#3b82f6', gradient: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' }
  }
  if (family === 'veo3' || family === 'google' || family === 'google_one' || family === 'antigravity' || name.includes('veo') || name.includes('gemini') || name.includes('antigravity')) {
    return { id: 'veo3', name: 'Google Veo / Gemini', icon: '✨', iconImg: '/icons/google.png', badge: 'Google AI', color: '#8b5cf6', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' }
  }
  if (family === 'elevenlabs' || name.includes('elevenlabs') || name.includes('minimax') || name.includes('vibi')) {
    return { id: 'elevenlabs', name: 'ElevenLabs Voice AI', icon: '🎙️', iconImg: '/icons/elevenlabs-ai-icon.png', badge: 'ElevenLabs', color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }
  }
  if (family === 'kling' || name.includes('kling')) {
    return { id: 'kling', name: 'Kling AI Video', icon: '📹', iconImg: '/icons/kling-ai-icon.png', badge: 'Kling AI', color: '#8b5cf6', gradient: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)' }
  }
  if (family === 'capcut' || name.includes('capcut')) {
    return { id: 'capcut', name: 'CapCut Pro & Video', icon: '🎬', iconImg: '/icons/capcut-icon.png', badge: 'CapCut', color: '#ec4899', gradient: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)' }
  }
  if (family === 'apple' || name.includes('icloud') || name.includes('apple')) {
    return { id: 'apple', name: 'Apple iCloud', icon: '🍎', iconImg: '/icons/apple-logo.png', badge: 'Apple', color: '#64748b', gradient: 'linear-gradient(135deg, #475569 0%, #334155 100%)' }
  }
  if (family === 'spotify' || name.includes('spotify')) {
    return { id: 'spotify', name: 'Spotify Music', icon: '🎵', iconImg: '/icons/spotify.png', badge: 'Spotify', color: '#1db954', gradient: 'linear-gradient(135deg, #1db954 0%, #15883e 100%)' }
  }
  if (family === 'youtube' || name.includes('youtube') || name.includes('ytb') || name.includes('vidiq')) {
    return { id: 'youtube', name: 'YouTube Premium', icon: '▶️', iconImg: '/icons/youtube.png', badge: 'YouTube', color: '#ff0000', gradient: 'linear-gradient(135deg, #ff0000 0%, #cc0000 100%)' }
  }
  if (family === 'netflix' || name.includes('netflix')) {
    return { id: 'netflix', name: 'Netflix 4K HDR', icon: '🍿', iconImg: '/icons/netflix_macos_bigsur_icon_189917.png', badge: 'Netflix', color: '#e50914', gradient: 'linear-gradient(135deg, #e50914 0%, #b81d24 100%)' }
  }
  if (family === 'notion' || name.includes('notion')) {
    return { id: 'notion', name: 'Notion AI & Workspace', icon: '📝', iconImg: '/icons/notion-icon.png', badge: 'Notion', color: '#000000', gradient: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)' }
  }
  if (family === 'meitu' || name.includes('meitu') || name.includes('xingtu')) {
    return { id: 'meitu', name: 'Meitu VIP & Xingtu', icon: '💄', iconImg: '/icons/meitu-icon.jpeg', badge: 'Meitu', color: '#f43f5e', gradient: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)' }
  }
  if (family === 'qwen' || name.includes('qwen')) {
    return { id: 'qwen', name: 'Qwen AI (Alibaba)', icon: '🌐', iconImg: '/icons/qwen-ai-icon.png', badge: 'Qwen AI', color: '#6366f1', gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' }
  }
  if (family === 'akool' || name.includes('akool') || name.includes('seedance')) {
    return { id: 'akool', name: 'Akool & Seedance AI', icon: '🎭', iconImg: '/icons/seedance-icon.png', badge: 'Seedance', color: '#0ea5e9', gradient: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)' }
  }
  if (family === 'heygen' || name.includes('heygen')) {
    return { id: 'heygen', name: 'HeyGen Video AI', icon: '🎥', iconImg: '/icons/heygen-icon.ico', badge: 'HeyGen', color: '#8b5cf6', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' }
  }
  if (family === 'locket' || name.includes('locket')) {
    return { id: 'locket', name: 'Locket Gold', icon: '💛', iconImg: '/icons/locket_icon.jpg', badge: 'Locket', color: '#eab308', gradient: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)' }
  }
  if (family === 'quizlet' || name.includes('quizlet')) {
    return { id: 'quizlet', name: 'Quizlet Plus', icon: '📚', iconImg: '/icons/icons8-quizlet-50.png', badge: 'Quizlet', color: '#4255ff', gradient: 'linear-gradient(135deg, #4255ff 0%, #2938b8 100%)' }
  }
  if (family === 'reddit' || name.includes('reddit')) {
    return { id: 'reddit', name: 'Reddit Accounts', icon: '🤖', iconImg: '/icons/reddit-icon.png', badge: 'Reddit', color: '#ff4500', gradient: 'linear-gradient(135deg, #ff4500 0%, #cc3700 100%)' }
  }
  if (family === 'gmail' || name.includes('gmail')) {
    return { id: 'gmail', name: 'Tài khoản Gmail', icon: '✉️', iconImg: '/icons/gmail-icon.png', badge: 'Gmail', color: '#ea4335', gradient: 'linear-gradient(135deg, #ea4335 0%, #c5221f 100%)' }
  }
  if (name.includes('outlook') || name.includes('hotmail')) {
    return { id: 'outlook', name: 'Outlook & Hotmail', icon: '📧', iconImg: '/icons/microsoft-outlook-icon.png', badge: 'Outlook', color: '#0078d4', gradient: 'linear-gradient(135deg, #0078d4 0%, #005a9e 100%)' }
  }
  if (family.includes('vpn') || family === 'nordvpn' || family === 'surfshark' || family === 'hma_vpn' || family === 'express' || name.includes('vpn') || name.includes('hma')) {
    return { id: 'vpn', name: 'VPN & Bảo mật', icon: '🔐', iconImg: '/icons/vpn.png', badge: 'VPN', color: '#06b6d4', gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)' }
  }
  if (family === 'canva' || name.includes('canva')) {
    return { id: 'canva', name: 'Canva Pro & Design', icon: '🎨', iconImg: '/icons/palette.png', badge: 'Canva', color: '#06b6d4', gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)' }
  }
  if (family === 'microsoft_office_365' || name.includes('office') || name.includes('microsoft') || name.includes('365') || name.includes('windows')) {
    return { id: 'office', name: 'Microsoft 365 / Office', icon: '📄', iconImg: '/icons/microsoft.png', badge: 'Microsoft', color: '#ef4444', gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }
  }
  return { id: 'other', name: 'Tiện ích & Ứng dụng', icon: '💎', iconImg: '/icons/application.png', badge: 'Khác', color: '#a855f7', gradient: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)' }
}


/**
 * Format duration type to Vietnamese label
 */
export function formatDuration(duration) {
  const map = {
    day_7: '7 ngày',
    month_1: '1 tháng',
    month_3: '3 tháng',
    month_6: '6 tháng',
    month_12: '12 tháng (1 năm)',
    year_2: '2 năm',
    lifetime: 'Vĩnh viễn',
  }
  return map[duration] || duration || 'Chu kỳ tiêu chuẩn'
}

/**
 * Format warranty policy to Vietnamese label
 */
export function formatWarranty(policy) {
  const map = {
    bhf: 'Bảo hành Full (BHF)',
    kbh: 'Không bảo hành (KBH)',
    bh1m: 'Bảo hành 1 Tháng',
    bh3d: 'Bảo hành 3 Ngày',
    bh7d: 'Bảo hành 7 Ngày',
    bh35d: 'Bảo hành 35 Ngày',
  }
  return map[policy] || policy || 'Theo chính sách gói'
}

/**
 * Format account type to Vietnamese label
 */
export function formatAccountType(type) {
  const map = {
    personal: 'Tài khoản cấp - Dùng riêng',
    add_family: 'Nâng chính chủ - Add Fam',
    upgrade: 'Nâng cấp tài khoản',
  }
  return map[type] || type || 'Cấp sẵn / Nâng cấp'
}

/**
 * Truncate text
 */
export function truncate(str, len = 50) {
  if (!str) return ''
  return str.length > len ? str.substring(0, len) + '...' : str
}

/**
 * Determine the group key and group metadata for a product
 */
export function getProductGroupInfo(product) {
  const name = (product.name || '').toUpperCase()
  const family = (product.productFamily || product.emoji || '').toLowerCase()

  // 0. Adobe Creative Cloud
  if (family === 'adobe' || name.includes('ADOBE')) {
    return {
      groupId: 'adobe_cc',
      groupName: 'ADOBE CREATIVE CLOUD (FULL APPS & EXPRESS)',
      groupBadge: 'ADOBE CC',
      priority: 0,
    }
  }

  // 1. Google Veo 3 / Gemini / Antigravity
  if (name.includes('VEO3') || name.includes('VEO 3') || name.includes('ANTIGRAVITY')) {
    return {
      groupId: 'veo3_ultra',
      groupName: 'SLOT GOOGLE VEO 3 ULTRA (FLOW / ANTIGRAVITY)',
      groupBadge: 'VEO 3 ULTRA',
      priority: 1,
    }
  }
  if (name.includes('GEMINI') || family === 'google_one') {
    return {
      groupId: 'gemini_google_one',
      groupName: 'GOOGLE GEMINI PRO & GOOGLE ONE 5TB',
      groupBadge: 'GEMINI AI',
      priority: 2,
    }
  }

  // 2. YouTube Premium
  if (family === 'youtube' || name.includes('YOUTUBE') || name.includes('YTB')) {
    return {
      groupId: 'youtube_premium',
      groupName: 'SLOT YOUTUBE PREMIUM CHÍNH CHỦ',
      groupBadge: 'YOUTUBE',
      priority: 3,
    }
  }

  // 2.5. Spotify Premium
  if (family === 'spotify' || name.includes('SPOTIFY')) {
    return {
      groupId: 'spotify_premium',
      groupName: 'SPOTIFY PREMIUM FAMILY CHÍNH CHỦ',
      groupBadge: 'SPOTIFY',
      priority: 3.5,
    }
  }

  // 3. CapCut Pro
  if (family === 'capcut' || name.includes('CAPCUT')) {
    return {
      groupId: 'capcut_pro',
      groupName: 'TÀI KHOẢN CAPCUT PRO',
      groupBadge: 'CAPCUT PRO',
      priority: 4,
    }
  }

  // 4. ElevenLabs
  if (family === 'elevenlabs' || name.includes('ELEVENLABS')) {
    return {
      groupId: 'elevenlabs_voice',
      groupName: 'ELEVENLABS & MINIMAX AI VOICE',
      groupBadge: 'ELEVENLABS',
      priority: 5,
    }
  }

  // 5. Claude API
  if (family === 'claude' || name.includes('CLAUDE')) {
    return {
      groupId: 'claude_api',
      groupName: 'API CLAUDE AI (OPUS / SONNET / HAIKU)',
      groupBadge: 'CLAUDE API',
      priority: 6,
    }
  }

  // 6. ChatGPT & OpenAI
  if (family === 'chatgpt' || name.includes('CHATGPT') || name.includes('CHAT GPT') || name.includes('GPT')) {
    return {
      groupId: 'chatgpt_openai',
      groupName: 'TÀI KHOẢN CHATGPT PLUS & OPENAI',
      groupBadge: 'CHATGPT',
      priority: 7,
    }
  }

  // 7. Grok AI
  if (family === 'grok' || name.includes('GROK')) {
    return {
      groupId: 'grok_ai',
      groupName: 'GROK AI (SUPER / HEAVY / CDK)',
      groupBadge: 'GROK AI',
      priority: 8,
    }
  }

  // 8. Canva Pro
  if (family === 'canva' || name.includes('CANVA')) {
    return {
      groupId: 'canva_pro',
      groupName: 'CANVA PRO & EDU (SLOT FAM / ADMIN)',
      groupBadge: 'CANVA PRO',
      priority: 9,
    }
  }

  // 9. Microsoft Office 365 & Windows
  if (name.includes('WINDOWS') || name.includes('WIN 10') || name.includes('WIN 11')) {
    return {
      groupId: 'windows_retail',
      groupName: 'KEY WINDOWS 10 / 11 PRO RETAIL',
      groupBadge: 'WINDOWS',
      priority: 10,
    }
  }
  if (family === 'microsoft_office_365' || name.includes('OFFICE') || name.includes('MICROSOFT') || name.includes('MS365') || name.includes('365')) {
    return {
      groupId: 'ms365_office',
      groupName: 'MICROSOFT OFFICE 365 + 1TB ONEDRIVE',
      groupBadge: 'OFFICE 365',
      priority: 11,
    }
  }

  // 10. Apple iCloud
  if (family === 'apple' || name.includes('ICLOUD') || name.includes('APPLE')) {
    return {
      groupId: 'apple_icloud',
      groupName: 'SLOT APPLE ICLOUD 2TB',
      groupBadge: 'APPLE ICLOUD',
      priority: 12,
    }
  }

  // 11. Kling AI
  if (family === 'kling' || name.includes('KLING')) {
    return {
      groupId: 'kling_ai',
      groupName: 'KLING AI VIDEO GENERATION',
      groupBadge: 'KLING AI',
      priority: 13,
    }
  }

  // 12. Meitu & Xingtu
  if (family === 'meitu' || name.includes('MEITU') || name.includes('XINGTU')) {
    return {
      groupId: 'meitu_xingtu',
      groupName: 'MEITU VIP+ & XINGTU SVIP',
      groupBadge: 'MEITU / XINGTU',
      priority: 14,
    }
  }

  // 13. Gmail
  if (family === 'gmail' || name.includes('GMAIL')) {
    return {
      groupId: 'gmail_accounts',
      groupName: 'TÀI KHOẢN GMAIL CỔ & TRIAL RANDOM',
      groupBadge: 'GMAIL',
      priority: 15,
    }
  }

  // 14. VPNs
  if (family === 'nordvpn' || family === 'surfshark' || family === 'hma_vpn' || family.includes('vpn') || name.includes('VPN') || name.includes('HMA')) {
    return {
      groupId: 'vpn_services',
      groupName: 'TÀI KHOẢN & KEY VPN (NORD / SURFSHARK / HMA)',
      groupBadge: 'VPN PRO',
      priority: 16,
    }
  }

  // 15. Notion
  if (family === 'notion' || name.includes('NOTION')) {
    return {
      groupId: 'notion_ai',
      groupName: 'SLOT NOTION BUSINESS AI',
      groupBadge: 'NOTION AI',
      priority: 17,
    }
  }

  // 16. Netflix
  if (family === 'netflix' || name.includes('NETFLIX')) {
    return {
      groupId: 'netflix_4k',
      groupName: 'ADMIN NETFLIX PREMIUM 4K HDR',
      groupBadge: 'NETFLIX',
      priority: 18,
    }
  }

  // 17. Akool
  if (family === 'akool' || name.includes('AKOOL')) {
    return {
      groupId: 'akool_ai',
      groupName: 'AKOOL AI VIDEO & FACESWAP SEEDANCE',
      groupBadge: 'AKOOL AI',
      priority: 19,
    }
  }

  // 18. Qwen
  if (family === 'qwen' || name.includes('QWEN')) {
    return {
      groupId: 'qwen_api',
      groupName: 'API QWEN MAX (FULL MODEL TOKEN)',
      groupBadge: 'QWEN API',
      priority: 20,
    }
  }

  // 19. Reddit
  if (family === 'reddit' || name.includes('REDDIT')) {
    return {
      groupId: 'reddit_clone',
      groupName: 'TÀI KHOẢN REDDIT CLONE',
      groupBadge: 'REDDIT',
      priority: 21,
    }
  }

  // 20. Locket Gold
  if (family === 'locket' || name.includes('LOCKET')) {
    return {
      groupId: 'locket_gold',
      groupName: 'LOCKET GOLD CHÍNH CHỦ',
      groupBadge: 'LOCKET GOLD',
      priority: 22,
    }
  }

  // 21. HeyGen Video AI
  if (family === 'heygen' || name.includes('HEYGEN')) {
    return {
      groupId: 'heygen_ai',
      groupName: 'TÀI KHOẢN HEYGEN VIDEO AI',
      groupBadge: 'HEYGEN AI',
      priority: 23,
    }
  }

  // Fallback: Use product ID as group ID
  return {
    groupId: product.id || 'other',
    groupName: product.name,
    groupBadge: 'SẢN PHẨM',
    priority: 99,
  }
}

/**
 * Extract clean, concise variant label for selection chips
 */
export function getVariantLabel(product) {
  const name = product.name || ''
  
  // Format specific common patterns into clean short labels
  let label = name
    .replace(/SLOT\s+/i, '')
    .replace(/ADMIN\s+/i, 'Admin ')
    .replace(/KEY\s+/i, 'Key ')
    .replace(/CDK\s+/i, 'CDK ')
    .replace(/BẢO HÀNH FULL|BẢO HÀNH FULLTIME|BẢO HÀNH LOGIN|BHF|FULLTIME|FULL/gi, '')
    .replace(/BẢO HÀNH\s+\d+\s*(NGÀY|THÁNG|H|GIỜ|D)/gi, '')
    .trim()

  return label || name
}

/**
 * Group flat products list into unified product groups
 */
export function groupProducts(products = []) {
  const map = new Map()

  for (const product of products) {
    if (isExcludedProduct(product)) continue

    const { groupId, groupName, groupBadge, priority } = getProductGroupInfo(product)
    
    if (!map.has(groupId)) {
      map.set(groupId, {
        groupId,
        name: groupName,
        badge: groupBadge,
        priority,
        category: getProductCategory(product),
        productFamily: product.productFamily,
        emoji: product.emoji,
        image: product.image,
        description: product.description,
        variants: [],
      })
    }

    const group = map.get(groupId)
    group.variants.push(product)
  }

  // Calculate aggregated stats and default product for each group
  const groups = Array.from(map.values()).map((group) => {
    // Sort variants by price ascending
    group.variants.sort((a, b) => (a.sellPrice || a.price || 0) - (b.sellPrice || b.price || 0))

    const prices = group.variants.map((v) => v.sellPrice || v.price || 0)
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)

    // Calculate total available
    let totalAvailable = 0
    let hasUnlimited = false
    let isAvailable = false
    let totalSold = 0

    for (const v of group.variants) {
      if (v.available === null || v.available === undefined) {
        hasUnlimited = true
        isAvailable = true
      } else if (v.available > 0) {
        totalAvailable += v.available
        isAvailable = true
      }
      totalSold += v.sold || 0
    }

    // Best default variant: first available one, or first variant
    const defaultVariant = group.variants.find((v) => v.available === null || v.available > 0) || group.variants[0]

    return {
      ...group,
      id: defaultVariant.id, // Primary ID for links
      defaultProductId: defaultVariant.id,
      minPrice,
      maxPrice,
      priceText: minPrice === maxPrice 
        ? formatCurrency(minPrice)
        : `Từ ${formatCurrency(minPrice)}`,
      totalAvailable: hasUnlimited ? null : totalAvailable,
      isAvailable,
      totalSold,
      variantCount: group.variants.length,
      image: group.variants.find((v) => v.image)?.image || group.image,
      emoji: group.variants.find((v) => v.emoji)?.emoji || group.emoji,
    }
  })

  // Sort groups by priority
  groups.sort((a, b) => (a.priority || 99) - (b.priority || 99))

  return groups
}


