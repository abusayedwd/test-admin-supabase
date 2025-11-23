import { useState } from 'react'
import { Button } from '@/app/components/ui/button'
import { MoreHorizontal, Edit, Trash2, Crown, Ban, UserCheck, AlertTriangle, CheckCircle } from 'lucide-react'
import EditUserDialog from './EditUserDialog';
import type { UserProfile } from '@/lib/types/users'

interface UserActionsProps {
  user: UserProfile
  onUserUpdate: (user: UserProfile) => void
  onDelete?: () => void
}

export default function UserActions({ user, onUserUpdate, onDelete }: UserActionsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)

  const handleSubscriptionChange = async (newStatus: 'free' | 'barakah_access' | 'quran_lite' | 'deenhub_pro' | 'expired') => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.user_id,
          subscription_status: newStatus,
        }),
      })

      const result = await response.json()

      if (result.success) {
        onUserUpdate(result.user)
        setIsOpen(false)
      } else {
        console.error('Failed to update user subscription:', result.error)
        alert('Failed to update subscription. Please try again.')
      }
    } catch (error) {
      console.error('Error updating subscription:', error)
      alert('Failed to update subscription. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSuspendUser = async () => {
    setLoading(true)
    try {
      // In Supabase, we can update user's status by changing their role or by managing a flag in our user_profiles table
      // Here we'll update their subscription status to 'expired' and set has_subscription to false
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.user_id,
          subscription_status: 'expired',
          has_subscription: false,
          subscription_expiry: null,
        }),
      })

      const result = await response.json()

      if (result.success) {
        onUserUpdate(result.user)
        setIsOpen(false)
      } else {
        console.error('Failed to suspend user:', result.error)
        alert('Failed to suspend user. Please try again.')
      }
    } catch (error) {
      console.error('Error suspending user:', error)
      alert('Failed to suspend user. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async () => {
    if (confirm(`Are you sure you want to delete ${user.full_name || user.email}? This action cannot be undone.`)) {
      setLoading(true)
      try {
        const response = await fetch(`/api/admin/users/${user.user_id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          // In the UsersManagement component, we'll need to update the UI to remove the deleted user
          // Since we can't remove the user from the parent component directly, we'll just close the menu
          setIsOpen(false)
          alert('User deleted successfully')
          onDelete?.()
        } else {
          const error = await response.json()
          console.error('Failed to delete user:', error.error)
          alert(`Failed to delete user: ${error.error}`)
        }
      } catch (error) {
        console.error('Error deleting user:', error)
        alert('Failed to delete user. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleEditUser = () => {
    setShowEditDialog(true)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
      >
        {loading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-transparent"></div>
        ) : (
          <MoreHorizontal className="h-4 w-4" />
        )}
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full z-20 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
            <div className="py-1">
              <button
                onClick={handleEditUser}
                disabled={loading}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit User
              </button>

              {/* Subscription Actions based on current status */}
              {user.subscription_status === 'free' || user.subscription_status === 'expired' ? (
                <>
                  <button
                    onClick={() => handleSubscriptionChange('quran_lite')}
                    disabled={loading}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    <Crown className="mr-2 h-4 w-4 text-blue-500" />
                    Upgrade to Quran Lite
                  </button>
                  <button
                    onClick={() => handleSubscriptionChange('deenhub_pro')}
                    disabled={loading}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    <Crown className="mr-2 h-4 w-4 text-purple-500" />
                    Upgrade to DeenHub Pro
                  </button>
                </>
              ) : (
                <>
                  {user.subscription_status !== 'deenhub_pro' && (
                    <button
                      onClick={() => handleSubscriptionChange('deenhub_pro')}
                      disabled={loading}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                      <Crown className="mr-2 h-4 w-4 text-purple-500" />
                      Upgrade to DeenHub Pro
                    </button>
                  )}
                  {user.subscription_status !== 'quran_lite' && (
                    <button
                      onClick={() => handleSubscriptionChange('quran_lite')}
                      disabled={loading}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                      <Crown className="mr-2 h-4 w-4 text-blue-500" />
                      {user.subscription_status === 'deenhub_pro' ? 'Downgrade to Quran Lite' : 'Upgrade to Quran Lite'}
                    </button>
                  )}
                  <button
                    onClick={() => handleSubscriptionChange('free')}
                    disabled={loading}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    <Crown className="mr-2 h-4 w-4" />
                    Downgrade to Free
                  </button>
                </>
              )}

              <div className="border-t border-gray-100 my-1"></div>

              <button
                onClick={handleSuspendUser}
                disabled={loading}
                className="flex items-center w-full px-4 py-2 text-sm text-amber-600 hover:bg-amber-50 transition-colors disabled:opacity-50"
              >
                <Ban className="mr-2 h-4 w-4" />
                Suspend User
              </button>

              <div className="border-t border-gray-100 my-1"></div>

              <button
                onClick={handleDeleteUser}
                disabled={loading}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete User
              </button>
            </div>
          </div>
        </>
      )}

      {showEditDialog && (
        <EditUserDialog
          isOpen={showEditDialog}
          onClose={() => setShowEditDialog(false)}
          user={user}
          onSuccess={(updatedUser) => {
            onUserUpdate(updatedUser)
            setShowEditDialog(false)
          }}
        />
      )}
    </div>
  )
}