'use client'

import { Metadata } from 'next'
import AuthWrapper from '@/components/AuthWrapper'
import DashboardLayout from '../components/DashboardLayout'
import ReportsManagement from './components/ReportsManagement'

export default function ReportsPage() {
  return (
    <AuthWrapper requireAdmin>
      {({ user, adminUser }) => (
        <DashboardLayout user={user} adminUser={adminUser}>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Reports Management</h1>
              <p className="text-gray-600">
                Review and moderate user-reported content across AI chatbot, explanations, and hadith
              </p>
            </div>
            
            <ReportsManagement />
          </div>
        </DashboardLayout>
      )}
    </AuthWrapper>
  )
}
