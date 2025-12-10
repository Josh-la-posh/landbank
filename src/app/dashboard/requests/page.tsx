'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Megaphone, Search, Filter, MessageSquare, Clock, CheckCircle2, XCircle, MapPin, Calendar, Mail, Phone, ExternalLink } from 'lucide-react';

// Types for property requests
type RequestStatus = 'pending' | 'responded' | 'closed';

interface PropertyRequest {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyLocation: string;
  propertyPrice: string;
  requestType: 'inquiry' | 'viewing' | 'offer';
  status: RequestStatus;
  message: string;
  createdAt: string;
  respondedAt?: string;
  response?: string;
  merchantName: string;
  merchantContact?: string;
}

// Mock data - Replace with API call later
const mockRequests: PropertyRequest[] = [
  {
    id: 'req-001',
    propertyId: 'ad-12345',
    propertyTitle: 'Orchid Road, Lekki',
    propertyLocation: 'Lekki Phase 2, Lagos',
    propertyPrice: '₦85,000,000',
    requestType: 'viewing',
    status: 'responded',
    message: 'I would like to schedule a viewing for this property. I am available this weekend.',
    createdAt: '2025-12-08T10:30:00Z',
    respondedAt: '2025-12-08T14:20:00Z',
    response: 'Thank you for your interest. We have availability on Saturday at 2 PM. Please confirm if this works for you.',
    merchantName: 'Prime Lands Ltd',
    merchantContact: 'contact@primelands.com',
  },
  {
    id: 'req-002',
    propertyId: 'ad-67890',
    propertyTitle: 'Katampe Extension',
    propertyLocation: 'Katampe, Abuja',
    propertyPrice: '₦42,000,000',
    requestType: 'inquiry',
    status: 'pending',
    message: 'What is the payment plan for this property? Do you offer installment options?',
    createdAt: '2025-12-09T16:45:00Z',
    merchantName: 'Capital Properties',
  },
  {
    id: 'req-003',
    propertyId: 'ad-11223',
    propertyTitle: 'Trans Amadi Industrial',
    propertyLocation: 'Port Harcourt, Rivers',
    propertyPrice: '₦61,500,000',
    requestType: 'offer',
    status: 'pending',
    message: 'I would like to make an offer of ₦58,000,000 for this property. Please let me know if this is acceptable.',
    createdAt: '2025-12-10T09:15:00Z',
    merchantName: 'Coastal Realty',
    merchantContact: 'info@coastalrealty.ng',
  },
  {
    id: 'req-004',
    propertyId: 'ad-44556',
    propertyTitle: 'Victoria Island Commercial Plot',
    propertyLocation: 'Victoria Island, Lagos',
    propertyPrice: '₦125,000,000',
    requestType: 'inquiry',
    status: 'closed',
    message: 'Is this property still available? What documents are included?',
    createdAt: '2025-12-05T11:00:00Z',
    respondedAt: '2025-12-05T15:30:00Z',
    response: 'Yes, the property is still available. All necessary documents including C of O are ready. Please schedule a call to discuss further.',
    merchantName: 'Island Properties',
    merchantContact: '+234 802 123 4567',
  },
];

export default function RequestsPage() {
  const [requests] = useState<PropertyRequest[]>(mockRequests);
  const [selectedStatus, setSelectedStatus] = useState<RequestStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter requests
  const filteredRequests = requests.filter((request) => {
    const matchesStatus = selectedStatus === 'all' || request.status === selectedStatus;
    const matchesSearch =
      searchQuery === '' ||
      request.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.propertyLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.merchantName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Count by status
  const statusCounts = {
    all: requests.length,
    pending: requests.filter((r) => r.status === 'pending').length,
    responded: requests.filter((r) => r.status === 'responded').length,
    closed: requests.filter((r) => r.status === 'closed').length,
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-NG', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
    });
  };

  const getStatusIcon = (status: RequestStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'responded':
        return <MessageSquare className="h-4 w-4" />;
      case 'closed':
        return <CheckCircle2 className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: RequestStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
      case 'responded':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'closed':
        return 'bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800';
    }
  };

  const getRequestTypeLabel = (type: PropertyRequest['requestType']) => {
    switch (type) {
      case 'inquiry':
        return 'General Inquiry';
      case 'viewing':
        return 'Viewing Request';
      case 'offer':
        return 'Offer Submission';
    }
  };

  return (
    <div className="min-h-screen bg-surface-secondary py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-brand/10 rounded-lg">
              <Megaphone className="h-8 w-8 text-brand" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary">My Property Requests</h1>
              <p className="text-secondary mt-1">Track all your property inquiries and communications</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-surface rounded-lg border border-border p-4">
            <p className="text-sm text-secondary mb-1">Total Requests</p>
            <p className="text-2xl font-bold text-primary">{statusCounts.all}</p>
          </div>
          <div className="bg-surface rounded-lg border border-border p-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              <p className="text-sm text-secondary">Pending</p>
            </div>
            <p className="text-2xl font-bold text-primary">{statusCounts.pending}</p>
          </div>
          <div className="bg-surface rounded-lg border border-border p-4">
            <div className="flex items-center gap-2 mb-1">
              <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <p className="text-sm text-secondary">Responded</p>
            </div>
            <p className="text-2xl font-bold text-primary">{statusCounts.responded}</p>
          </div>
          <div className="bg-surface rounded-lg border border-border p-4">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              <p className="text-sm text-secondary">Closed</p>
            </div>
            <p className="text-2xl font-bold text-primary">{statusCounts.closed}</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-surface rounded-lg border border-border p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary" />
              <input
                type="text"
                placeholder="Search by property, location, or merchant..."
                className="input pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-secondary" />
              <select
                className="input min-w-[160px]"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as RequestStatus | 'all')}
              >
                <option value="all">All Status ({statusCounts.all})</option>
                <option value="pending">Pending ({statusCounts.pending})</option>
                <option value="responded">Responded ({statusCounts.responded})</option>
                <option value="closed">Closed ({statusCounts.closed})</option>
              </select>
            </div>
          </div>
        </div>

        {/* Requests List */}
        {filteredRequests.length === 0 ? (
          <div className="bg-surface rounded-lg border border-dashed border-border p-12 text-center">
            <XCircle className="h-12 w-12 text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-primary mb-2">No requests found</h3>
            <p className="text-secondary mb-6">
              {searchQuery || selectedStatus !== 'all'
                ? 'Try adjusting your filters or search query'
                : 'You haven&apos;t made any property requests yet'}
            </p>
            {!searchQuery && selectedStatus === 'all' && (
              <Link href="/lands" className="btn btn-primary">
                Browse Properties
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <div
                key={request.id}
                className="bg-surface rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  {/* Request Header */}
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-2">
                        <Link
                          href={`/lands/${request.propertyId}`}
                          className="text-lg font-semibold text-primary hover:text-brand transition-colors"
                        >
                          {request.propertyTitle}
                        </Link>
                        <ExternalLink className="h-4 w-4 text-secondary flex-shrink-0 mt-1" />
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-secondary">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {request.propertyLocation}
                        </span>
                        <span>•</span>
                        <span className="font-medium text-brand">{request.propertyPrice}</span>
                        <span>•</span>
                        <span>{request.merchantName}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Request Type Badge */}
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-surface-secondary text-primary border border-border">
                        {getRequestTypeLabel(request.requestType)}
                      </span>
                      {/* Status Badge */}
                      <span
                        className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                          request.status
                        )}`}
                      >
                        {getStatusIcon(request.status)}
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Request Message */}
                  <div className="bg-surface-secondary rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="h-4 w-4 text-secondary" />
                      <span className="text-sm font-medium text-secondary">Your Message</span>
                      <span className="text-xs text-muted">•</span>
                      <span className="text-xs text-muted flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(request.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-primary">{request.message}</p>
                  </div>

                  {/* Response */}
                  {request.response && (
                    <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                          Merchant Response
                        </span>
                        {request.respondedAt && (
                          <>
                            <span className="text-xs text-blue-600 dark:text-blue-400">•</span>
                            <span className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(request.respondedAt)}
                            </span>
                          </>
                        )}
                      </div>
                      <p className="text-sm text-blue-900 dark:text-blue-100">{request.response}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      href={`/lands/${request.propertyId}`}
                      className="btn btn-ghost text-sm"
                    >
                      View Property
                    </Link>
                    {request.merchantContact && (
                      <a
                        href={
                          request.merchantContact.includes('@')
                            ? `mailto:${request.merchantContact}`
                            : `tel:${request.merchantContact}`
                        }
                        className="flex items-center gap-2 text-sm text-brand hover:underline"
                      >
                        {request.merchantContact.includes('@') ? (
                          <Mail className="h-4 w-4" />
                        ) : (
                          <Phone className="h-4 w-4" />
                        )}
                        Contact Merchant
                      </a>
                    )}
                    {request.status === 'pending' && (
                      <button className="text-sm text-secondary hover:text-primary transition-colors">
                        Follow Up
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 bg-surface rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-primary mb-3">Need Help?</h3>
          <p className="text-sm text-secondary mb-4">
            If you have questions about your requests or need assistance, our support team is here to
            help.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="mailto:support@landbank.com" className="btn btn-ghost text-sm">
              <Mail className="h-4 w-4 mr-2" />
              Email Support
            </a>
            <Link href="/about" className="text-sm text-brand hover:underline flex items-center gap-1">
              Learn More
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
