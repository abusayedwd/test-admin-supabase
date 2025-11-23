import { createAdminClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// Define types
type UserProfile = {
  id: string
  email: string
  full_name: string | null
}

type Report = {
  id: string
  user_id: string | null
  report_type: string
  category: string
  title: string
  description: string | null
  content_id: string | null
  content_data: any
  context_data: any
  status: string
  admin_notes: string | null
  resolved_at: string | null
  resolved_by: string | null
  created_at: string | null
  updated_at: string | null
}

type TransformedReport = Report & {
  reporter: {
    id: string
    email: string
    full_name: string | null
  } | null
}

export async function GET(request: NextRequest) {
  try {
    const adminClient = await createAdminClient()
    const { searchParams } = new URL(request.url)
    
    const status = searchParams.get('status') || 'all'
    const reportType = searchParams.get('report_type') || 'all'
    const search = searchParams.get('search') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    // Build the main query
    let query = adminClient
      .from('reports')
      .select(`
        id,
        user_id,
        report_type,
        category,
        title,
        description,
        content_id,
        content_data,
        context_data,
        status,
        admin_notes,
        resolved_at,
        resolved_by,
        created_at,
        updated_at
      `)

    // Apply status filter
    if (status !== 'all') {
      query = query.eq('status', status)
    }

    // Apply report type filter
    if (reportType !== 'all') {
      query = query.eq('report_type', reportType)
    }

    // Apply search filter
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    // Apply sorting
    query = query.order('created_at', { ascending: false })

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data: reports, error, count } = await query

    if (error) {
      console.error('Error fetching reports:', error)
      return NextResponse.json(
        { error: 'Failed to fetch reports' },
        { status: 500 }
      )
    }

    // Get user details separately
    const userIds = reports?.map(r => r.user_id).filter((id): id is string => Boolean(id)) || []
    let userData: UserProfile[] = []

    if (userIds.length > 0) {
      const { data: profiles } = await adminClient
        .from('user_profiles')
        .select('id, email, full_name')
        .in('id', userIds)
      
      userData = (profiles as UserProfile[]) || []
    }

    // Transform reports to include reporter info
    const transformedReports: TransformedReport[] = reports?.map(report => {
      const userProfile = userData.find(u => u.id === report.user_id)
      return {
        ...report,
        reporter: userProfile ? {
          id: userProfile.id,
          email: userProfile.email,
          full_name: userProfile.full_name
        } : null
      }
    }) || []

    // Get comprehensive stats
    const { data: allReports } = await adminClient
      .from('reports')
      .select('status, report_type, category, created_at')

    const stats = {
      total_reports: allReports?.length || 0,
      pending_reports: allReports?.filter(r => r.status === 'pending').length || 0,
      reviewed_reports: allReports?.filter(r => r.status === 'reviewing').length || 0,
      resolved_reports: allReports?.filter(r => r.status === 'resolved').length || 0,
      dismissed_reports: allReports?.filter(r => r.status === 'dismissed').length || 0,
    }

    return NextResponse.json({
      reports: transformedReports,
      stats,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })

  } catch (error) {
    console.error('Error in reports API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}