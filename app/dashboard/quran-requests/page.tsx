'use client'

import AuthWrapper from '@/components/AuthWrapper'
import DashboardLayout from '@/app/dashboard/components/DashboardLayout'
import QuranRequestsManagement from './components/QuranRequestsManagement';

export default function QuranRequestsPage() {
  return (
    <AuthWrapper requireAdmin>
      {({ user, adminUser }) => (
        <DashboardLayout user={user} adminUser={adminUser}>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Free Quran Requests</h1>
              <p className="text-gray-600 mt-2">
                Manage and track free Quran distribution requests
              </p>
            </div>

            <QuranRequestsManagement />
          </div>
        </DashboardLayout>
      )}
    </AuthWrapper>
  );
}
