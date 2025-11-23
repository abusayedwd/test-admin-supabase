'use client'

import { Metadata } from 'next'
import AuthWrapper from '@/components/AuthWrapper'
import DashboardLayout from '@/app/dashboard/components/DashboardLayout'
import DashboardOverview from '@/app/dashboard/components/DashboardOverview'

export default function DashboardPage() {
  return (
    <AuthWrapper requireAdmin>
      {({ user, adminUser }) => (
        <DashboardLayout user={user} adminUser={adminUser}>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">
                Welcome back, {user.raw_user_meta_data.full_name || user.raw_user_meta_data.name || user.email}
              </p>
            </div>
            
            <DashboardOverview />
          </div>
        </DashboardLayout>
      )}
    </AuthWrapper>
  )
}
