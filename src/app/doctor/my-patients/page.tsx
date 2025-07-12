'use client';

import { useUser } from '@/contexts/UserContext';
import { Users, Search, Filter } from 'lucide-react';

const mockPatients = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    country: 'United States',
    lastVisit: '2025-01-15',
    status: 'Active',
    avatar: 'JS'
  },
  {
    id: '2',
    name: 'Maria Garcia',
    email: 'maria.garcia@email.com',
    country: 'Spain',
    lastVisit: '2025-01-10',
    status: 'Active',
    avatar: 'MG'
  },
  {
    id: '3',
    name: 'Ahmed Hassan',
    email: 'ahmed.hassan@email.com',
    country: 'Egypt',
    lastVisit: '2025-01-08',
    status: 'Inactive',
    avatar: 'AH'
  }
];

export default function MyPatientsPage() {
  const { user } = useUser();

  if (!user || user.role !== 'doctor') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600">Only doctors can access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Patients</h1>
          <p className="text-gray-600">Manage and view your patient list</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
          Add Patient
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search patients..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Filter className="w-5 h-5" />
          Filter
        </button>
      </div>

      {/* Patients List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Patient List</h2>
            <span className="text-sm text-gray-500">{mockPatients.length} patients</span>
          </div>
          
          <div className="space-y-4">
            {mockPatients.map((patient) => (
              <div key={patient.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700">
                    {patient.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                    <p className="text-sm text-gray-500">{patient.email}</p>
                    <p className="text-xs text-gray-400">{patient.country}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Last Visit</p>
                    <p className="text-sm font-medium text-gray-900">{patient.lastVisit}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    patient.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {patient.status}
                  </span>
                  <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 