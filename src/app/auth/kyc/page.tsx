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
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-2">
          Complete Your KYC Verification
        </h1>
        <p className="text-gray-400">
          Welcome, Dr. {user.firstName} {user.lastName}! Let's get you verified as a healthcare provider.
        </p>
      </div>

      <div className="space-y-6">
        {/* User Info Display */}
        <div className="bg-blue-900/10 border border-blue-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-200 mb-2">Your Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-300">Name:</span>
              <span className="ml-2 text-gray-100">Dr. {user.firstName} {user.lastName}</span>
            </div>
            <div>
              <span className="font-medium text-gray-300">Email:</span>
              <span className="ml-2 text-gray-100">{user.email}</span>
            </div>
            <div>
              <span className="font-medium text-gray-300">Country:</span>
              <span className="ml-2 text-gray-100">{user.country}</span>
            </div>
            <div>
              <span className="font-medium text-gray-300">User ID:</span>
              <span className="ml-2 text-gray-100">{user.id}</span>
            </div>
          </div>
        </div>

        {/* KYC Steps */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-100">KYC Verification Steps</h3>
          <div className="space-y-4">
            <div className="flex items-center p-4 border border-gray-700 rounded-lg bg-blue-900/20">
              <div className="w-8 h-8 bg-blue-800 text-blue-200 rounded-full flex items-center justify-center font-semibold mr-4">
                1
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-100">Medical License Verification</h4>
                <p className="text-sm text-gray-400">Upload your medical license and credentials</p>
              </div>
              <button className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors">
                Start
              </button>
            </div>

            <div className="flex items-center p-4 border border-gray-700 rounded-lg opacity-50">
              <div className="w-8 h-8 bg-gray-800 text-gray-400 rounded-full flex items-center justify-center font-semibold mr-4">
                2
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-100">Identity Verification</h4>
                <p className="text-sm text-gray-400">Verify your identity with government-issued ID</p>
              </div>
              <span className="px-4 py-2 bg-gray-800 text-gray-400 rounded-lg">
                Pending
              </span>
            </div>

            <div className="flex items-center p-4 border border-gray-700 rounded-lg opacity-50">
              <div className="w-8 h-8 bg-gray-800 text-gray-400 rounded-full flex items-center justify-center font-semibold mr-4">
                3
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-100">Background Check</h4>
                <p className="text-sm text-gray-400">Complete background verification process</p>
              </div>
              <span className="px-4 py-2 bg-gray-800 text-gray-400 rounded-lg">
                Pending
              </span>
            </div>

            <div className="flex items-center p-4 border border-gray-700 rounded-lg opacity-50">
              <div className="w-8 h-8 bg-gray-800 text-gray-400 rounded-full flex items-center justify-center font-semibold mr-4">
                4
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-100">Account Activation</h4>
                <p className="text-sm text-gray-400">Review and activate your account</p>
              </div>
              <span className="px-4 py-2 bg-gray-800 text-gray-400 rounded-lg">
                Pending
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-6 border-t border-gray-700">
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-900 transition-colors"
          >
            Back to Home
          </button>
          <button
            onClick={() => router.push('/doctor')}
            className="px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
          >
            Skip for Now (Demo)
          </button>
        </div>
      </div>
    </div>
  );
} 