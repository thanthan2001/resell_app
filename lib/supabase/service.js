import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseUrl =
  rawUrl.startsWith('http')
    ? rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '')
    : 'https://placeholder.supabase.co'

const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

/**
 * Creates a Supabase client with service role key (full admin access).
 * Server-only — NEVER import this in client components.
 */
export function createServiceClient() {
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured in .env.local')
  }

  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
