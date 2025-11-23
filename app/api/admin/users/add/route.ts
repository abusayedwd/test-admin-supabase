import { createAdminClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const adminClient = await createAdminClient()
    const { email, full_name, subscription_status } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if user profile already exists by email
    const { data: existingProfileByEmail, error: emailSearchError } = await adminClient
      .from('user_profiles')
      .select('user_id, email')
      .eq('email', email)
      .single()

    if (existingProfileByEmail && !emailSearchError) {
      return NextResponse.json(
        { error: `A user with email "${email}" already exists in the system` },
        { status: 400 }
      )
    }

    // Create user in auth.users
    const { data: authUser, error: authError } = await adminClient.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: {
        full_name: full_name || '',
      }
    })

    if (authError) {
      console.error('Error creating auth user:', authError)
      // Check if the error is because the user already exists
      if (authError.message && (authError.message.includes('User already registered') || authError.message.includes('Email rate limit exceeded'))) {
        return NextResponse.json(
          { error: `A user account with email "${email}" already exists in the authentication system.` },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { error: `Failed to create user account: ${authError.message || 'Unknown error'}` },
        { status: 500 }
      )
    }

    // Double-check if user profile already exists by user_id to avoid constraint violation
    const { data: existingProfileByUserId, error: userIdSearchError } = await adminClient
      .from('user_profiles')
      .select('user_id')
      .eq('user_id', authUser.user.id)
      .single()

    if (existingProfileByUserId && !userIdSearchError) {
      return NextResponse.json(
        { error: `A profile for user ID "${authUser.user.id}" already exists in the system` },
        { status: 400 }
      )
    }

    // Create user profile
    const { error: profileError } = await adminClient
      .from('user_profiles')
      .insert({
        user_id: authUser.user.id,
        email,
        full_name: full_name || null,
        subscription_status: subscription_status || 'free',
        has_subscription: subscription_status && subscription_status !== 'free',
        ai_usage_data: {}
      })

    if (profileError) {
      console.error('Error creating user profile:', profileError)
      // Check if the error is due to a duplicate key constraint
      if (profileError.code === '23505') { // PostgreSQL unique violation code
        return NextResponse.json(
          { error: `A user profile with this user ID or email already exists: "${email}"` },
          { status: 400 }
        )
      }
      // Try to cleanup the auth user if profile creation fails
      await adminClient.auth.admin.deleteUser(authUser.user.id).catch(err => {
        console.error('Error cleaning up auth user:', err)
      })
      return NextResponse.json(
        { error: `Failed to create user profile: ${profileError.message || 'Unknown error'}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: authUser.user.id,
        email,
        full_name,
        subscription_status: subscription_status || 'free'
      }
    })
  } catch (error: any) {
    console.error('Error in add user API:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

