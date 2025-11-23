import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const adminClient = await createAdminClient()

    // Get users count and stats
    const { data: users } = await adminClient
      .from('user_profiles')
      .select('subscription_status, created_at')

    // Get reports count
    const { count: reportsCount } = await adminClient
      .from('reports')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')

    // Get quran requests count
    const { count: quranRequestsCount } = await adminClient
      .from('free_quran_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'requested')

    // Get mosques count
    const { count: mosquesCount } = await adminClient
      .from('mosques_metadata')
      .select('*', { count: 'exact', head: true })

    const totalUsers = users?.length || 0
    const subscriptionUsers = users?.filter(u => 
      ['barakah_access', 'quran_lite', 'deenhub_pro'].includes(u.subscription_status)
    ).length || 0

    return NextResponse.json({
      totalUsers,
      subscriptionUsers,
      pendingReports: reportsCount || 0,
      quranRequests: quranRequestsCount || 0,
      totalMosques: mosquesCount || 0,
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}
