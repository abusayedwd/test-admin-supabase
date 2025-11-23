import { createAdminClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Use admin client to check admin status
    const adminClient = await createAdminClient()
    
    const { data: adminData, error } = await adminClient
      .from('admin_users')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single()

    if (error || !adminData) {
      return NextResponse.json(
        { isAdmin: false, adminUser: null },
        { status: 200 }
      )
    }

    return NextResponse.json(
      { 
        isAdmin: true, 
        adminUser: adminData 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Admin verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
