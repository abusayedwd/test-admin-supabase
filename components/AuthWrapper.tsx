'use client'

import { useRequireAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface AuthWrapperProps {
  children: (props: {
    user: any
    adminUser: any
  }) => React.ReactNode
  requireAdmin?: boolean
}

export default function AuthWrapper({ children, requireAdmin = false }: AuthWrapperProps) {
  const { user, adminUser, loading, isAuthenticated, isAdmin } = useRequireAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (requireAdmin && !isAdmin) {
      router.push('/unauthorized')
      return
    }
  }, [loading, isAuthenticated, isAdmin, requireAdmin, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated || (requireAdmin && !isAdmin)) {
    return null // Will redirect
  }

  return <>{children({ user, adminUser })}</>
}
