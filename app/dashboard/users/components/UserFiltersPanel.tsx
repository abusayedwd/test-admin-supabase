import { Button } from '@/app/components/ui/button'
import { Filter } from 'lucide-react'
import type { UserFilters } from '@/lib/types/users'

interface UserFiltersPanelProps {
  filters: UserFilters
  onFiltersChange: (filters: UserFilters) => void
}

export default function UserFiltersPanel({ filters, onFiltersChange }: UserFiltersPanelProps) {
  const subscriptionOptions = [
    { value: 'all', label: 'All Users' },
    { value: 'free', label: 'Free' },
    { value: 'premium', label: 'Premium' },
    { value: 'expired', label: 'Expired' }
  ]

  const sortOptions = [
    { value: 'created_at', label: 'Join Date' },
    { value: 'last_sign_in', label: 'Last Active' },
    { value: 'full_name', label: 'Name' },
    { value: 'email', label: 'Email' }
  ]

  return (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm">
        <Filter className="mr-2 h-4 w-4" />
        Filters
      </Button>
      
      <select
        value={filters.subscription_status || 'all'}
        onChange={(e) => onFiltersChange({
          ...filters,
          subscription_status: e.target.value as any
        })}
        className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white"
      >
        {subscriptionOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <select
        value={filters.sort_by || 'created_at'}
        onChange={(e) => onFiltersChange({
          ...filters,
          sort_by: e.target.value as any
        })}
        className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white"
      >
        {sortOptions.map(option => (
          <option key={option.value} value={option.value}>
            Sort by {option.label}
          </option>
        ))}
      </select>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onFiltersChange({
          ...filters,
          sort_order: filters.sort_order === 'asc' ? 'desc' : 'asc'
        })}
      >
        {filters.sort_order === 'asc' ? '↑' : '↓'}
      </Button>
    </div>
  )
} 