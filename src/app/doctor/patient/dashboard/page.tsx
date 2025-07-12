'use client';

import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { useEffect } from 'react';

export default function PatientDashboardPage() {
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    // Redirect if user is not a patient or not authenticated
    if (!user || user.role !== 'patient') {
      router.push('/');
      return;
    }
  }, [user, router]);

  if (!user || user.role !== 'patient') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.firstName}!
          </h1>
          <p className="text-gray-600">
            Your health journey starts here. Find doctors, book appointments, and manage your care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                <div className="font-medium text-blue-900">Find a Doctor</div>
                <div className="text-sm text-blue-700">Search and book appointments</div>
              </button>
              <button className="w-full text-left p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
                <div className="font-medium text-green-900">My Appointments</div>
                <div className="text-sm text-green-700">View upcoming and past visits</div>
              </button>
              <button className="w-full text-left p-3 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors">
                <div className="font-medium text-purple-900">Health Records</div>
                <div className="text-sm text-purple-700">Access your medical history</div>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">Account Created</div>
                  <div className="text-xs text-gray-500">Just now</div>
                </div>
              </div>
              <div className="text-center py-4 text-gray-500 text-sm">
                No recent activity yet
              </div>
            </div>
          </div>

          {/* Health Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Summary</h3>
            <div className="space-y-4">
              <div className="text-center py-8 text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="text-sm">No health records yet</div>
                <div className="text-xs text-gray-400">Start by booking your first appointment</div>
              </div>
            </div>
          </div>
        </div>

        {/* User Info Card */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-500">Full Name</span>
              <div className="text-gray-900">{user.firstName} {user.lastName}</div>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Email</span>
              <div className="text-gray-900">{user.email}</div>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Country</span>
              <div className="text-gray-900">{user.country}</div>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Member Since</span>
              <div className="text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 