'use client'

import { createBrowserClient } from '@supabase/ssr'

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseUrl =
  rawUrl.startsWith('http')
    ? rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '')
    : 'https://placeholder.supabase.co'

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

