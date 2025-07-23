"use client";

import { useState, useEffect } from 'react';
import { InvoiceTable, Invoice } from '@/components/invoices/InvoiceTable';
import { mockPatientInvoices, filterInvoices } from '@/lib/mockData';
import { Card } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Download, FileText, DollarSign, Receipt } from 'lucide-react';

export default function PatientInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockPatientInvoices);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>(mockPatientInvoices);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });

  // Calculate summary statistics
  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter(inv => inv.status === 'paid').length;
  const pendingInvoices = invoices.filter(inv => inv.status === 'pending').length;
  const totalSpent = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);
  const pendingAmount = invoices
    .filter(inv => inv.status === 'pending')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = filterInvoices(invoices, query, statusFilter, dateRange.startDate, dateRange.endDate);
    setFilteredInvoices(filtered);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    const filtered = filterInvoices(invoices, searchQuery, status, dateRange.startDate, dateRange.endDate);
    setFilteredInvoices(filtered);
  };

  const handleDateFilter = (startDate: string, endDate: string) => {
    setDateRange({ startDate, endDate });
    const filtered = filterInvoices(invoices, searchQuery, statusFilter, startDate, endDate);
    setFilteredInvoices(filtered);
  };

  const handleDownload = (invoice: Invoice) => {
    // Simulate PDF download
    console.log('Downloading invoice:', invoice.invoiceNumber);
    // In a real implementation, this would generate and download a PDF
    alert(`Downloading invoice ${invoice.invoiceNumber}...`);
  };

  const handleDownloadAll = () => {
    // Simulate downloading all invoices
    console.log('Downloading all invoices...');
    alert('Downloading all invoices as ZIP...');
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Invoices</h1>
          <p className="text-gray-600 mt-1">View and download your medical invoices</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleDownloadAll} variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download All
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Invoices</p>
              <p className="text-2xl font-bold text-gray-900">{totalInvoices}</p>
            </div>
            <Receipt className="w-8 h-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Paid Invoices</p>
              <p className="text-2xl font-bold text-green-600">{paidInvoices}</p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingInvoices}</p>
            </div>
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-green-600">${totalSpent.toFixed(2)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Amount</p>
              <p className="text-2xl font-bold text-yellow-600">${pendingAmount.toFixed(2)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-yellow-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Cost</p>
              <p className="text-2xl font-bold text-blue-600">
                ${totalInvoices > 0 ? (totalSpent / totalInvoices).toFixed(2) : '0.00'}
              </p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Invoices Table */}
      <InvoiceTable
        invoices={filteredInvoices}
        userType="patient"
        onDownload={handleDownload}
        onSearch={handleSearch}
        onFilterStatus={handleStatusFilter}
        onFilterDate={handleDateFilter}
      />

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Request New Invoice
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download All Paid
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Receipt className="w-4 h-4" />
            View Payment History
          </Button>
        </div>
      </Card>

      {/* Information Section */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Invoice Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <p className="font-medium mb-2">Payment Methods:</p>
            <ul className="space-y-1">
              <li>• Credit/Debit Card</li>
              <li>• Cryptocurrency (ETH, BTC)</li>
              <li>• Insurance Coverage</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">Invoice Status:</p>
            <ul className="space-y-1">
              <li>• <span className="text-green-600">Paid</span> - Payment completed</li>
              <li>• <span className="text-yellow-600">Pending</span> - Awaiting payment</li>
              <li>• <span className="text-red-600">Overdue</span> - Payment past due</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
} 