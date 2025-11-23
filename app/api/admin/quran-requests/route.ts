import { createAdminClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const adminClient = await createAdminClient()
    const { searchParams } = new URL(request.url)

    const status = searchParams.get('status') || 'all'
    const search = searchParams.get('search') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    let query = adminClient
      .from('free_quran_requests')
      .select('*', { count: 'exact' })

    // Apply status filter
    if (status !== 'all') {
      query = query.eq('status', status)
    }

    // Apply search filter
    if (search) {
      query = query.or(
        `full_name.ilike.%${search}%,email.ilike.%${search}%,city.ilike.%${search}%,state.ilike.%${search}%`
      )
    }

    // Apply sorting
    query = query.order('created_at', { ascending: false })

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data: requests, error, count } = await query

    if (error) {
      console.error('Error fetching quran requests:', error)
      return NextResponse.json(
        { error: 'Failed to fetch quran requests' },
        { status: 500 }
      )
    }

    // Get stats
    const { data: statsData } = await adminClient
      .from('free_quran_requests')
      .select('status')

    const stats = {
      total_requests: statsData?.length || 0,
      requested_requests: statsData?.filter(r => r.status === 'requested').length || 0,
      processing_requests: statsData?.filter(r => r.status === 'processing').length || 0,
      sent_requests: statsData?.filter(r => r.status === 'sent').length || 0,
      delivered_requests: statsData?.filter(r => r.status === 'delivered').length || 0,
    }

    return NextResponse.json({
      requests: requests || [],
      stats,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('Error in quran requests API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminClient = await createAdminClient()
    const body = await request.json()

    // Validate required fields
    if (!body.full_name || !body.email || !body.address || !body.city || !body.state || !body.country) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data: newRequest, error } = await adminClient
      .from('free_quran_requests')
      .insert([{
        full_name: body.full_name,
        email: body.email,
        address: body.address,
        city: body.city,
        state: body.state,
        country: body.country,
        zip_code: body.zip_code || null,
        preferred_language: body.preferred_language || 'Arabic',
        reason: body.reason || null,
        status: body.status || 'requested',
        admin_notes: body.admin_notes || null
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating quran request:', error)
      return NextResponse.json(
        { error: 'Failed to create quran request' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      request: newRequest
    })
  } catch (error) {
    console.error('Error in POST quran requests API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const adminClient = await createAdminClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Request ID is required' },
        { status: 400 }
      )
    }

    const body = await request.json()

    // Prepare update data
    const updateData: any = {}
    if (body.status !== undefined) updateData.status = body.status
    if (body.admin_notes !== undefined) updateData.admin_notes = body.admin_notes
    if (body.full_name !== undefined) updateData.full_name = body.full_name
    if (body.email !== undefined) updateData.email = body.email
    if (body.address !== undefined) updateData.address = body.address
    if (body.city !== undefined) updateData.city = body.city
    if (body.state !== undefined) updateData.state = body.state
    if (body.country !== undefined) updateData.country = body.country
    if (body.zip_code !== undefined) updateData.zip_code = body.zip_code
    if (body.preferred_language !== undefined) updateData.preferred_language = body.preferred_language
    if (body.reason !== undefined) updateData.reason = body.reason

    const { data: updatedRequest, error } = await adminClient
      .from('free_quran_requests')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating quran request:', error)
      return NextResponse.json(
        { error: 'Failed to update quran request' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      request: updatedRequest
    })
  } catch (error) {
    console.error('Error in PUT quran requests API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const adminClient = await createAdminClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Request ID is required' },
        { status: 400 }
      )
    }

    const { error } = await adminClient
      .from('free_quran_requests')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting quran request:', error)
      return NextResponse.json(
        { error: 'Failed to delete quran request' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Quran request deleted successfully'
    })
  } catch (error) {
    console.error('Error in DELETE quran requests API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
