'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { AuthUser, AdminUser } from '@/lib/types/auth'

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    let mounted = true

    async function getInitialAuth() {
      try {
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError || !user) {
          if (mounted) {
            setUser(null)
            setAdminUser(null)
            setLoading(false)
          }
          return
        }

        const authUser: AuthUser = {
          id: user.id,
          email: user.email!,
          raw_user_meta_data: user.user_metadata || {}
        }

        // Check if user is admin using server-side API
        try {
          const response = await fetch('/api/auth/verify-admin', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: user.id }),
          })

          const result = await response.json()

          if (mounted) {
            setUser(authUser)
            
            if (result.isAdmin && result.adminUser) {
              setAdminUser({
                ...result.adminUser,
                user: authUser
              } as AdminUser)
            }
            
            setLoading(false)
          }
        } catch (err) {
          if (mounted) {
            setUser(authUser)
            setLoading(false)
          }
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Auth error')
          setLoading(false)
        }
      }
    }

    getInitialAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return

      if (event === 'SIGNED_OUT' || !session?.user) {
        setUser(null)
        setAdminUser(null)
        setLoading(false)
        return
      }

      if (event === 'SIGNED_IN' && session?.user) {
        const authUser: AuthUser = {
          id: session.user.id,
          email: session.user.email!,
          raw_user_meta_data: session.user.user_metadata || {}
        }

        // Check admin status using server-side API
        try {
          const response = await fetch('/api/auth/verify-admin', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: session.user.id }),
          })

          const result = await response.json()

          setUser(authUser)
          if (result.isAdmin && result.adminUser) {
            setAdminUser({
              ...result.adminUser,
              user: authUser
            } as AdminUser)
          }
          setLoading(false)
        } catch (err) {
          setUser(authUser)
          setLoading(false)
        }
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  return { user, adminUser, loading, error }
}

export function useRequireAuth() {
  const { user, adminUser, loading, error } = useAuth()
  
  return {
    user,
    adminUser,
    loading,
    error,
    isAuthenticated: !!user,
    isAdmin: !!adminUser,
    requireAdmin: !!user && !!adminUser
  }
}
