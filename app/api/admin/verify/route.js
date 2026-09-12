import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isEmailAdmin, verifyAdminPasskey } from '@/lib/auth/admin'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ isAdmin: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Check database profile role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const hasRoleAdmin = profile?.role === 'admin'
    const isEmailConfiguredAdmin = isEmailAdmin(user.email)

    if (isEmailConfiguredAdmin && !hasRoleAdmin) {
      // Auto-promote user to admin in profiles table
      await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', user.id)
    }

    const isAdmin = hasRoleAdmin || isEmailConfiguredAdmin

    return NextResponse.json({
      isAdmin,
      email: user.email,
      role: isAdmin ? 'admin' : (profile?.role || 'user'),
    })
  } catch (err) {
    console.error('Admin verify error:', err)
    return NextResponse.json({ isAdmin: false, error: err.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Vui lòng đăng nhập trước' }, { status: 401 })
    }

    const body = await request.json()
    const { passkey } = body

    if (!verifyAdminPasskey(passkey)) {
      return NextResponse.json({ success: false, error: 'Mã Admin Passkey không chính xác!' }, { status: 400 })
    }

    // Promote to admin
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', user.id)

    if (updateError) {
      console.error('Failed to update profile role:', updateError)
      return NextResponse.json({ success: false, error: 'Không thể cập nhật quyền trong CSDL' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Chúc mừng! Bạn đã được cấp quyền Quản trị viên (Admin) thành công.',
      role: 'admin',
    })
  } catch (err) {
    console.error('Admin claim error:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
