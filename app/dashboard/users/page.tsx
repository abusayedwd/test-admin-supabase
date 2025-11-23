'use client'

import { Metadata } from 'next'
import AuthWrapper from '@/components/AuthWrapper'
import DashboardLayout from '../components/DashboardLayout'
import UsersManagement from './components/UsersManagement'

export default function UsersPage() {
  return (
    <AuthWrapper requireAdmin>
      {({ user, adminUser }) => (
        <DashboardLayout user={user} adminUser={adminUser}>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
              <p className="text-gray-600">
                Manage user accounts, subscriptions, and view usage analytics
              </p>
            </div>
            
            <UsersManagement />
          </div>
        </DashboardLayout>
      )}
    </AuthWrapper>
  )
}
