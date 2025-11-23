import { createAdminClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(request: NextRequest) {
  try {
    const adminClient = await createAdminClient()
    const body = await request.json()

    const { requestIds, action } = body

    if (!requestIds || !Array.isArray(requestIds) || requestIds.length === 0) {
      return NextResponse.json(
        { error: 'Request IDs are required' },
        { status: 400 }
      )
    }

    if (!action) {
      return NextResponse.json(
        { error: 'Action is required' },
        { status: 400 }
      )
    }

    // Map action to status
    let statusToUpdate: string | null = null
    switch (action) {
      case 'mark_processing':
        statusToUpdate = 'processing'
        break
      case 'mark_sent':
        statusToUpdate = 'sent'
        break
      case 'mark_delivered':
        statusToUpdate = 'delivered'
        break
      case 'mark_cancelled':
        statusToUpdate = 'cancelled'
        break
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    const updateData: any = { status: statusToUpdate }
    if (action === 'mark_delivered') {
      updateData.delivered_at = new Date().toISOString()
    }

    const { data: updatedRequests, error } = await adminClient
      .from('free_quran_requests')
      .update(updateData)
      .in('id', requestIds)
      .select()

    if (error) {
      console.error('Error performing bulk update:', error)
      return NextResponse.json(
        { error: 'Failed to perform bulk update' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      updatedCount: updatedRequests?.length || 0,
      updatedRequests
    })
  } catch (error) {
    console.error('Error in bulk quran requests API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}