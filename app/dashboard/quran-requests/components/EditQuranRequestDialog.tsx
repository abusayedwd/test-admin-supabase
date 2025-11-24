'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { X, User, Mail, MapPin, Globe, Languages, MessageSquare, Loader2, FileText } from 'lucide-react';
import { QuranRequest } from '@/lib/types/quran-requests';

interface EditQuranRequestDialogProps {
  isOpen: boolean;
  request: QuranRequest;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditQuranRequestDialog({
  isOpen,
  request,
  onClose,
  onSuccess
}: EditQuranRequestDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    country: '',
    preferred_language: '',
    reason: '',
    status: 'requested',
    admin_notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (request) {
      setFormData({
        full_name: request.full_name || '',
        email: request.email || '',
        address: request.address || '',
        city: request.city || '',
        state: request.state || '',
        zip_code: request.zip_code || '',
        country: request.country || '',
        preferred_language: request.preferred_language || '',
        reason: request.reason || '',
        status: request.status || 'requested',
        admin_notes: request.admin_notes || ''
      });
    }
  }, [request]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`/api/admin/quran-requests?id=${request.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update request');
      }

      onSuccess();
    } catch (error) {
      console.error('Error updating request:', error);
      alert('Failed to update request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Edit Quran Request</h2>
              <p className="text-green-100 text-sm mt-1">Update request details for {request.full_name}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-green-600" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => handleChange('full_name', e.target.value)}
                    placeholder="Enter full name"
                    className={`w-full pl-10 pr-4 py-2.5 border ${
                      errors.full_name ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                  />
                </div>
                {errors.full_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="email@example.com"
                    className={`w-full pl-10 pr-4 py-2.5 border ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            </div>
          </div>

          {/* Address Information Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" />
              Address Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="Enter street address"
                  className={`w-full px-4 py-2.5 border ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    placeholder="City"
                    className={`w-full px-4 py-2.5 border ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State/Province
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    placeholder="State"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    value={formData.zip_code}
                    onChange={(e) => handleChange('zip_code', e.target.value)}
                    placeholder="Zip"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => handleChange('country', e.target.value)}
                    placeholder="Enter country"
                    className={`w-full pl-10 pr-4 py-2.5 border ${
                      errors.country ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                  />
                </div>
                {errors.country && (
                  <p className="mt-1 text-sm text-red-600">{errors.country}</p>
                )}
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Languages className="h-5 w-5 text-green-600" />
              Additional Information
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Language
                  </label>
                  <select
                    value={formData.preferred_language}
                    onChange={(e) => handleChange('preferred_language', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select language</option>
                    <option value="English">English</option>
                    <option value="Arabic">Arabic</option>
                    <option value="Urdu">Urdu</option>
                    <option value="French">French</option>
                    <option value="Spanish">Spanish</option>
                    <option value="Turkish">Turkish</option>
                    <option value="Indonesian">Indonesian</option>
                    <option value="Bengali">Bengali</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  >
                    <option value="requested">Requested</option>
                    <option value="processing">Processing</option>
                    <option value="sent">Sent</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Request
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <textarea
                    value={formData.reason}
                    onChange={(e) => handleChange('reason', e.target.value)}
                    placeholder="Please provide a reason for requesting the Quran..."
                    rows={3}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Notes
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <textarea
                    value={formData.admin_notes}
                    onChange={(e) => handleChange('admin_notes', e.target.value)}
                    placeholder="Add internal notes about this request..."
                    rows={3}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="px-6 bg-green-600 hover:bg-green-700"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Request'
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}