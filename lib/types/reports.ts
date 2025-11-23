export type ReportType = 'ai_chatbot' | 'ai_explanation' | 'hadith'

export type ReportCategory = 
  | 'incorrect_information' 
  | 'inappropriate_content' 
  | 'misleading_guidance' 
  | 'technical_error' 
  | 'inconsistency' 
  | 'offensive_content' 
  | 'other'

export type ReportStatus = 'pending' | 'reviewing' | 'resolved' | 'dismissed'

export interface Report {
  id: string
  user_id: string | null
  report_type: ReportType
  category: ReportCategory
  title: string
  description: string | null
  content_id: string | null
  content_data: {
    // AI Chatbot specific
    message_content?: string
    message_index?: number
    
    // AI Explanation specific
    surah_number?: number
    verse_number?: number
    explanation?: string
    
    // Hadith specific
    book_name?: string
    chapter_name?: string
    hadith_number?: string
    grade?: string
    hadith_text?: string
  } | null
  context_data: {
    session_id?: string
    surah_name?: string
    timestamp?: string
    user_agent?: string
    ip_address?: string
  } | null
  status: ReportStatus
  admin_notes: string | null
  resolved_at: string | null
  resolved_by: string | null
  created_at: string
  updated_at: string
  
  // Related data
  reporter?: {
    id: string
    email: string
    full_name: string | null
  }
  resolver?: {
    id: string
    email: string
    full_name: string | null
  }
}

export interface ReportFilters {
  search?: string
  report_type?: ReportType | 'all'
  category?: ReportCategory | 'all'
  status?: ReportStatus | 'all'
  date_range?: {
    from: string
    to: string
  }
  sort_by?: 'created_at' | 'updated_at' | 'report_type' | 'status'
  sort_order?: 'asc' | 'desc'
}

export interface ReportStats {
  total_reports: number
  pending_reports: number
  reviewing_reports: number
  resolved_reports: number
  dismissed_reports: number
  reports_this_week: number
  avg_resolution_time_hours: number
  by_type: {
    ai_chatbot: number
    ai_explanation: number
    hadith: number
  }
  by_category: Record<ReportCategory, number>
}

export interface UpdateReportData {
  status?: ReportStatus
  admin_notes?: string
  resolved_by?: string
}

export interface BulkReportAction {
  action: 'resolve' | 'dismiss' | 'assign_reviewer' | 'export'
  report_ids: string[]
  data?: {
    status?: ReportStatus
    admin_notes?: string
    resolved_by?: string
  }
} 