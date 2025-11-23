'use client'

import { Metadata } from 'next'
import AuthWrapper from '@/components/AuthWrapper'
import DashboardLayout from '../components/DashboardLayout'
import MosquesManagement from './components/MosquesManagement'

// Note: metadata export doesn't work with 'use client'
// export const metadata: Metadata = {
//   title: 'Mosque Management - DeenHub Admin',
//   description: 'Manage mosque metadata and location database',
// }

export default function MosquesPage() {
  return (
    <AuthWrapper requireAdmin>
      {({ user, adminUser }) => (
        <DashboardLayout user={user} adminUser={adminUser}>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mosque Management</h1>
              <p className="text-gray-600">
                Manage mosque metadata and location database for the app
              </p>
            </div>
            
            <MosquesManagement />
          </div>
        </DashboardLayout>
      )}
    </AuthWrapper>
  )
}
