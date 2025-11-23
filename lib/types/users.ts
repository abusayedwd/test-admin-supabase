export interface UserProfile {
  id: string
  user_id: string
  email: string
  full_name: string | null
  has_subscription: boolean
  subscription_status: 'free' | 'barakah_access' | 'quran_lite' | 'deenhub_pro' | 'expired'
  subscription_expiry: string | null
  created_at: string
  updated_at: string
  ai_usage_data: {
    monthly_tokens?: number
    daily_tokens?: number
    total_requests?: number
    last_reset_date?: string
    last_used?: string
    estimated_cost_this_month?: number
    entries?: Array<{
      date: string
      tokens: number
      cost: number
      requests: number
    }>
  }
  // Auth user data
  auth_user?: {
    id: string
    email: string
    email_confirmed_at: string | null
    last_sign_in_at: string | null
    raw_user_meta_data: Record<string, any>
    created_at: string
  }
}

export interface UserFilters {
  search?: string
  subscription_status?: 'all' | 'free' | 'barakah_access' | 'quran_lite' | 'deenhub_pro' | 'expired'
  has_subscription?: boolean
  date_range?: {
    from: string
    to: string
  }
  sort_by?: 'created_at' | 'last_sign_in' | 'full_name' | 'email'
  sort_order?: 'asc' | 'desc'
}

export interface UserStats {
  total_users: number
  barakah_access_users: number
  quran_lite_users: number
  deenhub_pro_users: number
  free_users: number
  new_users_this_month: number
  active_users_last_30_days: number
}

export interface UpdateUserData {
  full_name?: string
  subscription_status?: 'free' | 'barakah_access' | 'quran_lite' | 'deenhub_pro' | 'expired'
  subscription_expiry?: string | null
  has_subscription?: boolean
}

export interface BulkUserAction {
  action: 'delete' | 'update_subscription' | 'export'
  user_ids: string[]
  data?: {
    subscription_status?: 'free' | 'barakah_access' | 'quran_lite' | 'deenhub_pro' | 'expired'
    subscription_expiry?: string | null
  }
} 