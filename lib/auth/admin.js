/**
 * Admin authorization helpers
 */

export function isEmailAdmin(email) {
  if (!email) return false
  const adminEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)

  if (adminEmails.length === 0) {
    // If no admin emails configured, treat any authenticated user as admin in local dev
    if (process.env.NODE_ENV === 'development' && process.env.ALLOW_DEV_ADMIN === 'true') {
      return true
    }
    return false
  }

  return adminEmails.includes(email.toLowerCase())
}

export function verifyAdminPasskey(passkey) {
  const configuredPasskey = process.env.ADMIN_PASSKEY || 'socialtech2026'
  return passkey && passkey.trim() === configuredPasskey.trim()
}
