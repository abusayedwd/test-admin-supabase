'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Plus, Download, RefreshCw } from 'lucide-react';
// Removed unused createClient import
import { QuranRequest, QuranRequestFilters, QuranRequestStats } from '@/lib/types/quran-requests';
import QuranRequestsStatsCards from './QuranRequestsStatsCards';
import QuranRequestFiltersPanel from './QuranRequestFiltersPanel';
import QuranRequestsTable from './QuranRequestsTable';
import AddQuranRequestDialog from './AddQuranRequestDialog';

export default function QuranRequestsManagement() {
  const [requests, setRequests] = useState<QuranRequest[]>([]);
  const [stats, setStats] = useState<QuranRequestStats>({
    total: 0,
    requested: 0,
    processing: 0,
    sent: 0,
    delivered: 0,
    cancelled: 0,
    thisWeek: 0,
    thisMonth: 0,
    averageProcessingDays: 0
  });
  const [filters, setFilters] = useState<QuranRequestFilters>({
    search: '',
    status: 'all',
    country: '',
    state: '',
    preferred_language: '',
    dateRange: { from: null, to: null }
  });
  const [loading, setLoading] = useState(true);
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Removed unused supabase client

  const fetchRequests = async () => {
    try {
      setLoading(true);

      // Build query parameters
      const params = new URLSearchParams();
      if (filters.status !== 'all') {
        params.set('status', filters.status);
      }
      if (filters.search) {
        params.set('search', filters.search);
      }

      // Use the admin API instead of direct database queries
      const response = await fetch(`/api/admin/quran-requests?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch quran requests');
      }

      const data = await response.json();
      setRequests(data.requests || []);
      setStats({
        total: data.stats?.total_requests || 0,
        requested: data.stats?.requested_requests || 0,
        processing: data.stats?.processing_requests || 0,
        sent: data.stats?.sent_requests || 0,
        delivered: data.stats?.delivered_requests || 0,
        cancelled: 0,
        thisWeek: 0,
        thisMonth: 0,
        averageProcessingDays: 0
      });
    } catch (error) {
      console.error('Error fetching requests:', error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  // Remove calculateStats since we get stats from API

  const handleUpdateRequest = async (id: string, updates: { status?: string; admin_notes?: string }) => {
    try {
      const response = await fetch(`/api/admin/quran-requests?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update request');
      }

      await fetchRequests();
    } catch (error) {
      console.error('Error updating request:', error);
      alert('Failed to update request. Please try again.');
    }
  }

  const handleDeleteRequest = async (id: string) => {
    if (!confirm('Are you sure you want to delete this request?')) return;

    try {
      const response = await fetch(`/api/admin/quran-requests?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete request');
      }

      await fetchRequests();
    } catch (error) {
      console.error('Error deleting request:', error);
      alert('Failed to delete request. Please try again.');
    }
  }

  const handleBulkAction = async (action: string) => {
    if (selectedRequests.length === 0) return;

    try {
      const response = await fetch('/api/admin/quran-requests/bulk', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestIds: selectedRequests,
          action,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to perform bulk action');
      }

      setSelectedRequests([]);
      await fetchRequests();
    } catch (error) {
      console.error('Error performing bulk action:', error);
      alert('Failed to perform bulk action. Please try again.');
    }
  }

  const handleExport = () => {
    const csvContent = [
      ['ID', 'Full Name', 'Email', 'Address', 'City', 'State', 'Zip Code', 'Country', 'Language', 'Reason', 'Status', 'Created At'].join(','),
      ...requests.map(request => [
        request.id,
        `"${request.full_name}"`,
        request.email,
        `"${request.address}"`,
        request.city,
        request.state,
        request.zip_code,
        request.country,
        request.preferred_language || '',
        `"${request.reason || ''}"`,
        request.status,
        new Date(request.created_at).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quran-requests-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    fetchRequests();
  }, [filters]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <QuranRequestsStatsCards stats={stats} />

      {/* Actions Bar */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button onClick={() => setShowAddDialog(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Request
            </Button>

            {selectedRequests.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {selectedRequests.length} selected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('mark_processing')}
                >
                  Mark Processing
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('mark_sent')}
                >
                  Mark Sent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('mark_delivered')}
                >
                  Mark Delivered
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={fetchRequests}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button
              variant="outline"
              onClick={handleExport}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>
      </Card>

      {/* Filters */}
      <QuranRequestFiltersPanel
        filters={filters}
        onFiltersChange={setFilters}
        requests={requests}
      />

      {/* Requests Table */}
      <QuranRequestsTable
        requests={requests}
        selectedRequests={selectedRequests}
        onSelectionChange={setSelectedRequests}
        onUpdateRequest={handleUpdateRequest}
        onDeleteRequest={handleDeleteRequest}
      />

      {/* Add Request Dialog */}
      {showAddDialog && (
        <AddQuranRequestDialog
          isOpen={showAddDialog}
          onClose={() => setShowAddDialog(false)}
          onSuccess={() => {
            setShowAddDialog(false);
            fetchRequests();
          }}
        />
      )}
    </div>
  );
}