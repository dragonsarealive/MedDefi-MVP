"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  patientName?: string;
  doctorName?: string;
  appointmentDate: string;
  serviceDescription: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  paymentMethod: 'card' | 'crypto' | 'insurance';
  createdAt: string;
}

interface InvoiceTableProps {
  invoices: Invoice[];
  userType: 'doctor' | 'patient';
  onDownload?: (invoice: Invoice) => void;
  onSearch?: (query: string) => void;
  onFilterStatus?: (status: string) => void;
  onFilterDate?: (startDate: string, endDate: string) => void;
}

export function InvoiceTable({
  invoices,
  userType,
  onDownload,
  onSearch,
  onFilterStatus,
  onFilterDate
}: InvoiceTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const itemsPerPage = 10;
  const totalPages = Math.ceil(invoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInvoices = invoices.slice(startIndex, endIndex);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    onFilterStatus?.(status);
  };

  const handleDateFilter = () => {
    onFilterDate?.(startDate, endDate);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      paid: 'bg-blue-100 text-blue-800',
      pending: 'bg-blue-50 text-blue-700',
      overdue: 'bg-blue-200 text-blue-900'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPaymentMethodBadge = (method: string) => {
    const variants = {
      card: 'bg-blue-100 text-blue-800',
      crypto: 'bg-blue-50 text-blue-700',
      insurance: 'bg-blue-200 text-blue-900'
    };
    
    return (
      <Badge className={variants[method as keyof typeof variants]}>
        {method.charAt(0).toUpperCase() + method.slice(1)}
      </Badge>
    );
  };

  return (
    <Card className="p-6">
      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-4 h-4" />
            <input
              type="text"
              placeholder={`Search by ${userType === 'doctor' ? 'patient name' : 'doctor name'} or invoice number...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>
          <Button type="submit" variant="primary">
            Search
          </Button>
        </form>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-blue-700">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="px-3 py-1 border border-blue-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="">All</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-blue-700">Date Range:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-1 border border-blue-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
            <span className="text-sm text-blue-500">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-1 border border-blue-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
            <Button onClick={handleDateFilter} variant="outline" size="sm">
              Apply
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-blue-200">
              <th className="text-left py-3 px-4 font-semibold text-blue-700">Invoice #</th>
              {userType === 'doctor' ? (
                <th className="text-left py-3 px-4 font-semibold text-blue-700">Patient</th>
              ) : (
                <th className="text-left py-3 px-4 font-semibold text-blue-700">Doctor</th>
              )}
              <th className="text-left py-3 px-4 font-semibold text-blue-700">Date</th>
              <th className="text-left py-3 px-4 font-semibold text-blue-700">Service</th>
              <th className="text-left py-3 px-4 font-semibold text-blue-700">Amount</th>
              <th className="text-left py-3 px-4 font-semibold text-blue-700">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-blue-700">Payment</th>
              <th className="text-left py-3 px-4 font-semibold text-blue-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentInvoices.map((invoice) => (
              <tr key={invoice.id} className="border-b border-blue-100 hover:bg-blue-50">
                <td className="py-3 px-4 font-medium text-blue-900">
                  {invoice.invoiceNumber}
                </td>
                <td className="py-3 px-4 text-blue-700">
                  {userType === 'doctor' ? invoice.patientName : invoice.doctorName}
                </td>
                <td className="py-3 px-4 text-blue-700">
                  {new Date(invoice.appointmentDate).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 text-blue-700">
                  {invoice.serviceDescription}
                </td>
                <td className="py-3 px-4 font-semibold text-blue-900">
                  ${invoice.amount.toFixed(2)}
                </td>
                <td className="py-3 px-4">
                  {getStatusBadge(invoice.status)}
                </td>
                <td className="py-3 px-4">
                  {getPaymentMethodBadge(invoice.paymentMethod)}
                </td>
                <td className="py-3 px-4">
                  <Button
                    onClick={() => onDownload?.(invoice)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 border-blue-200 text-blue-700 hover:bg-blue-50"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-blue-700">
            Showing {startIndex + 1} to {Math.min(endIndex, invoices.length)} of {invoices.length} invoices
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
              className="border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <span className="px-3 py-1 text-sm text-blue-700">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
              className="border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
} 