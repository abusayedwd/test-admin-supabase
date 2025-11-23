export type QuranRequestStatus = 'requested' | 'processing' | 'sent' | 'delivered' | 'cancelled';

export interface QuranRequest {
  id: string;
  full_name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  preferred_language: string | null;
  reason: string | null;
  latitude: string | null;
  longitude: string | null;
  status: QuranRequestStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface QuranRequestFilters {
  search: string;
  status: QuranRequestStatus | 'all';
  country: string;
  state: string;
  preferred_language: string;
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
}

export interface QuranRequestStats {
  total: number;
  requested: number;
  processing: number;
  sent: number;
  delivered: number;
  cancelled: number;
  thisWeek: number;
  thisMonth: number;
  averageProcessingDays: number;
}

export interface UpdateQuranRequestData {
  status?: QuranRequestStatus;
  admin_notes?: string;
  preferred_language?: string;
}

export interface CreateQuranRequestData {
  full_name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  preferred_language?: string;
  reason?: string;
  latitude?: string;
  longitude?: string;
}

export type BulkQuranRequestAction = 
  | 'mark_processing'
  | 'mark_sent' 
  | 'mark_delivered'
  | 'mark_cancelled'
  | 'delete';

export interface QuranRequestExportData {
  requests: QuranRequest[];
  filters: QuranRequestFilters;
  exportDate: string;
  totalCount: number;
}

// Activity feed types
export interface QuranRequestActivity {
  id: string;
  type: 'status_change' | 'note_added' | 'request_created';
  request_id: string;
  user_name: string;
  description: string;
  timestamp: string;
  old_status?: QuranRequestStatus;
  new_status?: QuranRequestStatus;
}

// Mock data type for development
export interface MockQuranRequestsData {
  requests: QuranRequest[];
  stats: QuranRequestStats;
  activities: QuranRequestActivity[];
} 