'use client'

import { useRequireAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const { user, adminUser, loading } = useRequireAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.push('/login')
      return
    }

    if (!adminUser) {
      router.push('/unauthorized')
      return
    }

    // If user is admin, redirect to dashboard
    router.push('/dashboard')
  }, [user, adminUser, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return null // Will redirect
}
