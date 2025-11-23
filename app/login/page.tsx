'use client'

import { useRequireAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import LoginForm from './components/LoginForm'

export default function LoginPage() {
  const { user, adminUser, loading } = useRequireAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    if (user) {
      if (adminUser) {
        router.push('/dashboard')
      } else {
        router.push('/unauthorized')
      }
    }
  }, [user, adminUser, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // If user is already authenticated, will redirect via useEffect
  if (user) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-3">
          <div className="mx-auto h-14 w-14 rounded-xl flex items-center justify-center bg-emerald-600 text-white shadow">
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15l-3-3h6l-3 3z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8V6a4 4 0 00-8 0v2" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12h18" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">DeenHub Admin</h2>
          <p className="text-sm text-gray-600">Sign in to access the admin dashboard</p>
        </div>

        <LoginForm />

        <div className="text-center">
          <p className="text-xs text-muted-foreground">Admin access only. Unauthorized access is prohibited.</p>
        </div>
      </div>
    </div>
  )
}
