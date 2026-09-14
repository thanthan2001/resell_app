import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { isEmailAdmin } from '@/lib/auth/admin'

/**
 * GET /api/admin/users — List all users with verification status
 * Query params: ?filter=unverified|verified|all (default: all)
 */
export async function GET(request) {
  try {
    // 1. Verify caller is admin
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const isAdmin = profile?.role === 'admin' || isEmailAdmin(user.email)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // 2. Use service role to list auth users (includes email_confirmed_at)
    const serviceClient = createServiceClient()
    const { data: { users: authUsers }, error: listError } = await serviceClient.auth.admin.listUsers({
      perPage: 1000,
    })

    if (listError) {
      console.error('Failed to list auth users:', listError)
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }

    // 3. Get all profiles for display names
    const { data: profiles } = await serviceClient
      .from('profiles')
      .select('id, display_name, email, role, created_at')

    const profileMap = new Map()
    for (const p of (profiles || [])) {
      profileMap.set(p.id, p)
    }

    // 4. Merge auth users with profiles
    const mergedUsers = (authUsers || []).map((authUser) => {
      const prof = profileMap.get(authUser.id) || {}
      return {
        id: authUser.id,
        email: authUser.email,
        display_name: prof.display_name || authUser.email?.split('@')[0] || '—',
        role: prof.role || 'user',
        email_confirmed: !!authUser.email_confirmed_at,
        email_confirmed_at: authUser.email_confirmed_at,
        created_at: authUser.created_at,
        last_sign_in_at: authUser.last_sign_in_at,
      }
    })

    // 5. Filter by verification status
    const { searchParams } = new URL(request.url)
    const filter = searchParams.get('filter') || 'all'

    let filtered = mergedUsers
    if (filter === 'unverified') {
      filtered = mergedUsers.filter((u) => !u.email_confirmed)
    } else if (filter === 'verified') {
      filtered = mergedUsers.filter((u) => u.email_confirmed)
    }

    // Sort: unverified first, then by created_at descending
    filtered.sort((a, b) => {
      if (a.email_confirmed !== b.email_confirmed) return a.email_confirmed ? 1 : -1
      return new Date(b.created_at) - new Date(a.created_at)
    })

    // Count stats
    const totalUsers = mergedUsers.length
    const unverifiedCount = mergedUsers.filter((u) => !u.email_confirmed).length
    const verifiedCount = mergedUsers.filter((u) => u.email_confirmed).length

    return NextResponse.json({
      users: filtered,
      stats: { totalUsers, unverifiedCount, verifiedCount },
    })
  } catch (err) {
    console.error('Admin users GET error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

/**
 * PATCH /api/admin/users — Approve (confirm email) or handle a user
 * Body: { userId: string }
 */
export async function PATCH(request) {
  try {
    // 1. Verify caller is admin
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const isAdmin = profile?.role === 'admin' || isEmailAdmin(user.email)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // 2. Parse request body
    const { userId } = await request.json()
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    // 3. Use service role to confirm user's email
    const serviceClient = createServiceClient()
    const { data: updatedUser, error: updateError } = await serviceClient.auth.admin.updateUserById(
      userId,
      { email_confirm: true }
    )

    if (updateError) {
      console.error('Failed to confirm user email:', updateError)
      return NextResponse.json({ error: 'Failed to approve user' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Đã duyệt tài khoản thành công! Email đã được xác nhận.',
      user: {
        id: updatedUser.user.id,
        email: updatedUser.user.email,
        email_confirmed_at: updatedUser.user.email_confirmed_at,
      },
    })
  } catch (err) {
    console.error('Admin users PATCH error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
