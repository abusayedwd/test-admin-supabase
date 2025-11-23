import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Shield, ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Access Denied - DeenHub Admin',
  description: 'You do not have permission to access this area',
}

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Access Denied
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            You don't have permission to access this area
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center text-red-600">
              Admin Access Required
            </CardTitle>
            <CardDescription className="text-center">
              This area is restricted to authorized administrators only.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                If you believe you should have access to this area, please contact the system administrator.
              </p>
              <p>
                Only users with administrative privileges can access the DeenHub admin dashboard.
              </p>
            </div>
            
            <div className="flex space-x-3">
              <Button asChild variant="outline" className="flex-1">
                <Link href="/login">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Login
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            DeenHub Admin Panel - Secure Access Only
          </p>
        </div>
      </div>
    </div>
  )
} 