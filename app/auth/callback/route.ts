import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    
    // Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Auth callback error:', error)
      return NextResponse.redirect(new URL('/login?error=auth_callback_error', request.url))
    }

    if (data.user) {
      // Check if user is admin
      try {
        const response = await fetch(new URL('/api/auth/verify-admin', request.url), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: data.user.id }),
        })

        const result = await response.json()
        
        if (result.isAdmin) {
          return NextResponse.redirect(new URL('/dashboard', request.url))
        } else {
          // Sign out the user if they're not an admin
          await supabase.auth.signOut()
          return NextResponse.redirect(new URL('/unauthorized', request.url))
        }
      } catch (err) {
        console.error('Error verifying admin status:', err)
        return NextResponse.redirect(new URL('/login?error=admin_verification_error', request.url))
      }
    }
  }

  // If no code or other issues, redirect to login
  return NextResponse.redirect(new URL('/login', request.url))
}
