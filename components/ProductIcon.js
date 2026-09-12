'use client'

import { useState } from 'react'

/**
 * Local brand icons mapping from /public/icons/
 */
const BRAND_LOCAL_ICONS = {
  chatgpt: '/icons/chatgpt.png',
  openai: '/icons/chatgpt.png',
  claude: '/icons/claude-ai-icon.png',
  anthropic: '/icons/claude-ai-icon.png',
  grok: '/icons/grok-icon.png',
  xai: '/icons/grok-icon.png',
  google: '/icons/google.png',
  gemini: '/icons/google.png',
  google_one: '/icons/google.png',
  antigravity: '/icons/google.png',
  veo: '/icons/google.png',
  veo3: '/icons/google.png',
  adobe: '/icons/creative-cloud.png',
  canva: '/icons/palette.png',
  capcut: '/icons/capcut-icon.png',
  elevenlabs: '/icons/elevenlabs-ai-icon.png',
  kling: '/icons/kling-ai-icon.png',
  meitu: '/icons/meitu-icon.jpeg',
  xingtu: '/icons/meitu-icon.jpeg',
  notion: '/icons/notion-icon.png',
  netflix: '/icons/netflix_macos_bigsur_icon_189917.png',
  qwen: '/icons/qwen-ai-icon.png',
  akool: '/icons/seedance-icon.png',
  seedance: '/icons/seedance-icon.png',
  reddit: '/icons/reddit-icon.png',
  gmail: '/icons/gmail-icon.png',
  outlook: '/icons/microsoft-outlook-icon.png',
  hotmail: '/icons/microsoft-outlook-icon.png',
  heygen: '/icons/heygen-icon.ico',
  locket: '/icons/locket_icon.jpg',
  locket_gold: '/icons/locket_icon.jpg',
  quizlet: '/icons/icons8-quizlet-50.png',
  microsoft_office_365: '/icons/microsoft.png',
  microsoft: '/icons/microsoft.png',
  office: '/icons/microsoft.png',
  windows: '/icons/microsoft.png',
  youtube: '/icons/youtube.png',
  spotify: '/icons/spotify.png',
  apple: '/icons/apple-logo.png',
  icloud: '/icons/apple-logo.png',
  vpn: '/icons/vpn.png',
  nordvpn: '/icons/vpn.png',
  surfshark: '/icons/vpn.png',
  hma_vpn: '/icons/vpn.png',
  express: '/icons/vpn.png',
  application: '/icons/application.png',
}

/**
 * Smart resolver for local brand icons based on emoji and name keywords
 */
export function resolveLocalIcon(emoji, name = '') {
  const e = (emoji || '').toLowerCase().trim()
  if (e && BRAND_LOCAL_ICONS[e]) {
    return BRAND_LOCAL_ICONS[e]
  }

  const n = (name || '').toLowerCase()
  if (n.includes('adobe')) return '/icons/creative-cloud.png'
  if (n.includes('chatgpt') || n.includes('gpt') || n.includes('openai')) return '/icons/chatgpt.png'
  if (n.includes('claude') || n.includes('anthropic')) return '/icons/claude-ai-icon.png'
  if (n.includes('grok')) return '/icons/grok-icon.png'
  if (n.includes('veo') || n.includes('gemini') || n.includes('google') || n.includes('antigravity')) return '/icons/google.png'
  if (n.includes('canva')) return '/icons/palette.png'
  if (n.includes('capcut')) return '/icons/capcut-icon.png'
  if (n.includes('elevenlabs') || n.includes('minimax') || n.includes('vibi')) return '/icons/elevenlabs-ai-icon.png'
  if (n.includes('kling')) return '/icons/kling-ai-icon.png'
  if (n.includes('meitu') || n.includes('xingtu')) return '/icons/meitu-icon.jpeg'
  if (n.includes('notion')) return '/icons/notion-icon.png'
  if (n.includes('netflix')) return '/icons/netflix_macos_bigsur_icon_189917.png'
  if (n.includes('qwen')) return '/icons/qwen-ai-icon.png'
  if (n.includes('akool') || n.includes('seedance')) return '/icons/seedance-icon.png'
  if (n.includes('reddit')) return '/icons/reddit-icon.png'
  if (n.includes('heygen')) return '/icons/heygen-icon.ico'
  if (n.includes('locket')) return '/icons/locket_icon.jpg'
  if (n.includes('quizlet')) return '/icons/icons8-quizlet-50.png'
  if (n.includes('outlook') || n.includes('hotmail')) return '/icons/microsoft-outlook-icon.png'
  if (n.includes('gmail')) return '/icons/gmail-icon.png'
  if (n.includes('office') || n.includes('microsoft') || n.includes('windows') || n.includes('365')) return '/icons/microsoft.png'
  if (n.includes('youtube') || n.includes('ytb') || n.includes('vidiq')) return '/icons/youtube.png'
  if (n.includes('spotify')) return '/icons/spotify.png'
  if (n.includes('apple') || n.includes('icloud')) return '/icons/apple-logo.png'
  if (n.includes('vpn') || n.includes('surfshark') || n.includes('nord') || n.includes('hma') || n.includes('express')) return '/icons/vpn.png'

  return '/icons/application.png'
}

/**
 * Smart product icon component using high-resolution local brand assets
 */
export default function ProductIcon({
  image,
  emoji,
  name = '',
  size = 56,
  className = '',
  style = {},
}) {
  const [localErr, setLocalErr] = useState(false)
  const [customErr, setCustomErr] = useState(false)

  const localIcon = resolveLocalIcon(emoji, name)

  // Priority 1: High-res curated brand icon from /public/icons/
  if (localIcon && !localErr) {
    return (
      <img
        src={localIcon}
        alt=""
        width={size}
        height={size}
        className={`product-icon ${className}`}
        style={{
          width: size,
          height: size,
          objectFit: 'contain',
          ...style,
        }}
        onError={() => setLocalErr(true)}
      />
    )
  }

  // Priority 2: Custom seller image (if not a generic CanBoSo placeholder)
  if (image && !customErr && !image.includes('product-default-images')) {
    return (
      <img
        src={image}
        alt=""
        width={size}
        height={size}
        className={`product-icon ${className}`}
        style={{
          width: size,
          height: size,
          objectFit: 'contain',
          borderRadius: 8,
          ...style,
        }}
        onError={() => setCustomErr(true)}
      />
    )
  }

  // Priority 3: Default application icon
  return (
    <img
      src="/icons/application.png"
      alt=""
      width={size}
      height={size}
      className={`product-icon ${className}`}
      style={{
        width: size,
        height: size,
        objectFit: 'contain',
        ...style,
      }}
    />
  )
}
