import { createClient } from './supabase/client'

// Client-side auth functions
export function createAuthClient() {
  return createClient()
}

export async function signInWithEmail(email: string, password: string) {
  const supabase = createAuthClient()
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  if (error) throw error
  
  // Check if user is admin using server-side API
  if (data.user) {
    const response = await fetch('/api/auth/verify-admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: data.user.id }),
    })

    const result = await response.json()
    
    if (!result.isAdmin) {
      await supabase.auth.signOut()
      throw new Error('Access denied. Admin privileges required.')
    }
  }
  
  return data
}

export async function signInWithGoogle() {
  const supabase = createAuthClient()
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  })
  
  if (error) throw error
  return data
}

export async function checkAdminStatus(userId: string): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/verify-admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    })

    const result = await response.json()
    return result.isAdmin
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}

export async function signOutClient() {
  const supabase = createAuthClient()
  await supabase.auth.signOut()
} 