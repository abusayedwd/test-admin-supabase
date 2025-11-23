'use client'

import { useState } from 'react'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Badge } from '@/app/components/ui/badge'
import { Plus, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { CreateMosqueData } from '@/lib/types/mosques'
import { MOSQUE_FACILITIES } from '@/lib/types/mosques'

interface AddMosqueDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function AddMosqueDialog({ isOpen, onClose, onSuccess }: AddMosqueDialogProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState<CreateMosqueData>({
    mosque_id: '',
    name: '',
    address: '',
    latitude: undefined,
    longitude: undefined,
    timezone: 'UTC',
    phone: '',
    website: '',
    additional_info: '',
    facilities: []
  })

  const supabase = createClient()

  const handleInputChange = (field: keyof CreateMosqueData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }



  const handleFacilityToggle = (facilityType: string) => {
    const existingFacilities = formData.facilities || []
    const existingIndex = existingFacilities.findIndex(f => f.facility_type === facilityType)
    
    let newFacilities
    if (existingIndex >= 0) {
      // Remove the facility
      newFacilities = existingFacilities.filter(f => f.facility_type !== facilityType)
    } else {
      // Add the facility
      newFacilities = [...existingFacilities, {
        facility_type: facilityType,
        availability: 'available',
        description: '',
        additional_info: ''
      }]
    }
    
    handleInputChange('facilities', newFacilities)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Validate required fields
      if (!formData.name) {
        throw new Error('Mosque name is required')
      }

      // Generate a unique mosque_id if not provided
      const mosque_id = formData.mosque_id || `mosque_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // First, insert the mosque metadata
      const { error: insertError } = await supabase
        .from('mosques_metadata')
        .insert([{
          mosque_id,
          name: formData.name,
          address: formData.address,
          latitude: formData.latitude,
          longitude: formData.longitude,
          timezone: formData.timezone || 'UTC',
          phone: formData.phone,
          website: formData.website,
          additional_info: formData.additional_info,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])

      if (insertError) {
        throw insertError
      }

      // Then, insert the facilities if any
      if (formData.facilities && formData.facilities.length > 0) {
        const facilitiesData = formData.facilities.map(facility => ({
          mosque_id,
          facility_type: facility.facility_type,
          availability: facility.availability,
          description: facility.description,
          additional_info: facility.additional_info,
          created_at: new Date().toISOString(),
          last_updated: new Date().toISOString()
        }))

        const { error: facilitiesError } = await supabase
          .from('mosque_facilities')
          .insert(facilitiesData)

        if (facilitiesError) {
          throw facilitiesError
        }
      }

      onSuccess()
    } catch (err: any) {
      setError(err.message || 'Failed to add mosque')
    } finally {
      setLoading(false)
    }
  }

  const handleGeocodeAddress = async () => {
    if (!formData.address) {
      setError('Please enter an address first')
      return
    }
    
    try {
      // Note: In a real implementation, you would use a geocoding service like Google Maps API
      // For now, this is a placeholder
      console.log('Geocoding address:', formData.address)
      // You can integrate with your preferred geocoding service here
      setError('Geocoding service not implemented yet. Please enter coordinates manually.')
    } catch (error) {
      console.error('Geocoding failed:', error)
      setError('Geocoding failed')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Add New Mosque</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mosque ID
                </label>
                <Input
                  type="text"
                  value={formData.mosque_id}
                  onChange={(e) => handleInputChange('mosque_id', e.target.value)}
                  placeholder="Auto-generated if empty"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Mosque name"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <Input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Street address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Latitude
                </label>
                <Input
                  type="number"
                  step="any"
                  value={formData.latitude || ''}
                  onChange={(e) => handleInputChange('latitude', e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="e.g., 40.7128"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Longitude
                </label>
                <Input
                  type="number"
                  step="any"
                  value={formData.longitude || ''}
                  onChange={(e) => handleInputChange('longitude', e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="e.g., -74.0060"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Timezone
                </label>
                <Input
                  type="text"
                  value={formData.timezone}
                  onChange={(e) => handleInputChange('timezone', e.target.value)}
                  placeholder="e.g., America/New_York"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <Input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>



          {/* Facilities */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Facilities Available</h3>
            <div className="flex flex-wrap gap-2">
              {MOSQUE_FACILITIES.map((facility) => (
                <Badge
                  key={facility}
                  variant={formData.facilities?.some(f => f.facility_type === facility) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => handleFacilityToggle(facility)}
                >
                  {facility.replace(/_/g, ' ')}
                </Badge>
              ))}
            </div>
          </div>

          {/* Additional Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Details</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Information
              </label>
              <textarea
                value={formData.additional_info}
                onChange={(e) => handleInputChange('additional_info', e.target.value)}
                placeholder="Additional information about the mosque..."
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Mosque'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 