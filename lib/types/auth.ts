export interface AdminUser {
  id: string
  user_id: string
  role: 'admin' | 'super_admin'
  permissions: AdminPermissions
  created_at: string
  updated_at: string
  created_by: string | null
  is_active: boolean
  user?: {
    id: string
    email: string
    raw_user_meta_data: Record<string, any>
  }
}

export interface AdminPermissions {
  users: PermissionSet
  reports: PermissionSet
  quran_requests: PermissionSet
  mosques: PermissionSet
  admin_management?: PermissionSet
}

export interface PermissionSet {
  read: boolean
  write: boolean
  delete: boolean
}

export interface AuthUser {
  id: string
  email: string
  raw_user_meta_data: {
    full_name?: string
    avatar_url?: string
    picture?: string
    name?: string
  }
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthState {
  user: AuthUser | null
  adminUser: AdminUser | null
  isLoading: boolean
  isAdmin: boolean
} 