import { createClient } from './supabase/server'
import { createClient as createBrowserClient } from './supabase/client'
import { redirect } from 'next/navigation'
import type { AdminUser, AuthUser } from './types/auth'

// Server-side auth functions
export async function getUser(): Promise<AuthUser | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null
  
  return {
    id: user.id,
    email: user.email!,
    raw_user_meta_data: user.user_metadata || {}
  }
}

export async function getAdminUser(userId?: string): Promise<AdminUser | null> {
  const supabase = await createClient()
  const currentUser = userId || (await getUser())?.id
  
  if (!currentUser) return null
  
  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .eq('user_id', currentUser)
    .eq('is_active', true)
    .single()
  
  if (error || !data) return null
  
  // Get user data separately
  const { data: userData } = await supabase.auth.admin.getUserById(currentUser)
  
  return {
    ...data,
    user: userData.user ? {
      id: userData.user.id,
      email: userData.user.email!,
      raw_user_meta_data: userData.user.user_metadata || {}
    } : undefined
  } as AdminUser
}

export async function requireAdmin() {
  const user = await getUser()
  if (!user) {
    redirect('/login')
  }
  
  const adminUser = await getAdminUser(user.id)
  if (!adminUser) {
    redirect('/unauthorized')
  }
  
  return { user, adminUser }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

// Client-side auth functions
export function createAuthClient() {
  return createBrowserClient()
}

export async function signInWithEmail(email: string, password: string) {
  const supabase = createAuthClient()
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  if (error) throw error
  
  // Check if user is admin
  if (data.user) {
    const { data: adminData } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', data.user.id)
      .eq('is_active', true)
      .single()
    
    if (!adminData) {
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
  const supabase = createAuthClient()
  
  const { data } = await supabase
    .from('admin_users')
    .select('id')
    .eq('user_id', userId)
    .eq('is_active', true)
    .single()
  
  return !!data
} 