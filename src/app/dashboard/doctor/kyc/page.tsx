'use client';

import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { useEffect } from 'react';

export default function DoctorKYCPage() {
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    // Redirect if user is not a doctor or not authenticated
    if (!user || user.role !== 'doctor') {
      router.push('/');
      return;
    }
  }, [user, router]);

  if (!user || user.role !== 'doctor') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Complete Your KYC Verification
            </h1>
            <p className="text-gray-600">
              Welcome, Dr. {user.firstName} {user.lastName}! Let's get you verified as a healthcare provider.
            </p>
          </div>

          <div className="space-y-6">
            {/* User Info Display */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Your Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Name:</span>
                  <span className="ml-2 text-gray-900">Dr. {user.firstName} {user.lastName}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Email:</span>
                  <span className="ml-2 text-gray-900">{user.email}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Country:</span>
                  <span className="ml-2 text-gray-900">{user.country}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">User ID:</span>
                  <span className="ml-2 text-gray-900">{user.id}</span>
                </div>
              </div>
            </div>

            {/* KYC Steps */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">KYC Verification Steps</h3>
              
              <div className="space-y-4">
                <div className="flex items-center p-4 border border-gray-200 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold mr-4">
                    1
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Medical License Verification</h4>
                    <p className="text-sm text-gray-600">Upload your medical license and credentials</p>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Start
                  </button>
                </div>

                <div className="flex items-center p-4 border border-gray-200 rounded-lg opacity-50">
                  <div className="w-8 h-8 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center font-semibold mr-4">
                    2
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Identity Verification</h4>
                    <p className="text-sm text-gray-600">Verify your identity with government-issued ID</p>
                  </div>
                  <span className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg">
                    Pending
                  </span>
                </div>

                <div className="flex items-center p-4 border border-gray-200 rounded-lg opacity-50">
                  <div className="w-8 h-8 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center font-semibold mr-4">
                    3
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Background Check</h4>
                    <p className="text-sm text-gray-600">Complete background verification process</p>
                  </div>
                  <span className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg">
                    Pending
                  </span>
                </div>

                <div className="flex items-center p-4 border border-gray-200 rounded-lg opacity-50">
                  <div className="w-8 h-8 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center font-semibold mr-4">
                    4
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Account Activation</h4>
                    <p className="text-sm text-gray-600">Review and activate your account</p>
                  </div>
                  <span className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg">
                    Pending
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-6 border-t border-gray-200">
              <button
                onClick={() => router.push('/')}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back to Home
              </button>
              <button
                onClick={() => router.push('/dashboard/doctor')}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Skip for Now (Demo)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 