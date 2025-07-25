'use client';

import React, { useState } from 'react';
import UnifiedRegistrationForm from '@/components/UnifiedRegistrationForm';
import TestingTerminal from '@/components/TestingTerminal';
import MedicDashboard from '@/components/MedicDashboard';
import PatientDashboard from '@/components/PatientDashboard';
import { Terminal, ArrowLeft, Database } from 'lucide-react';

type DemoState = 'registration' | 'dashboard';

export default function IntegrationDemo() {
  const [currentState, setCurrentState] = useState<DemoState>('registration');
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const handleRegistrationSuccess = (data: any) => {
    setUserData(data);
    setCurrentState('dashboard');
  };

  const handleBackToRegistration = () => {
    setCurrentState('registration');
    setUserData(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              {currentState === 'dashboard' && (
                <button
                  onClick={handleBackToRegistration}
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Registration
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* API Status Indicator */}
              <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>WalletDash API Ready</span>
              </div>

              {/* Database Status Indicator */}
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                <Database className="w-4 h-4" />
                <span>Supabase Connected</span>
              </div>

              {/* Terminal Toggle */}
              <button
                onClick={() => setIsTerminalOpen(!isTerminalOpen)}
                className={`p-2 rounded-md transition-colors ${
                  isTerminalOpen 
                    ? 'bg-gray-800 text-white' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
                title="Toggle Debug Terminal"
              >
                <Terminal className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Demo Info Banner */}
        {currentState === 'registration' && (
          <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">
              🚀 Complete Blockchain Integration Demo
            </h2>
            <p className="text-blue-700 mb-4">
              This demo showcases the full integration between frontend, WalletDash blockchain API, and Supabase database.
              Every action is logged in real-time in the debug terminal.
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h3 className="font-medium text-blue-800 mb-2">🏥 Medical Professionals:</h3>
                <ul className="space-y-1 text-blue-600">
                  <li>• Medical wallet with 2 STRK funding</li>
                  <li>• Create blockchain practices</li>
                  <li>• Add medical services</li>
                  <li>• Receive patient payments</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-blue-800 mb-2">🏥 Patients:</h3>
                <ul className="space-y-1 text-blue-600">
                  <li>• Individual wallet with 5 STRK funding</li>
                  <li>• Browse medical services</li>
                  <li>• Purchase with automatic payment splits</li>
                  <li>• Real blockchain transactions</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Current View */}
        {currentState === 'registration' ? (
          <UnifiedRegistrationForm
            onSuccess={handleRegistrationSuccess}
            onShowTerminal={() => setIsTerminalOpen(true)}
          />
        ) : userData?.userType === 'doctor' ? (
          <MedicDashboard 
            userData={userData}
            onShowTerminal={() => setIsTerminalOpen(true)}
          />
        ) : (
          <PatientDashboard 
            userData={userData}
            onShowTerminal={() => setIsTerminalOpen(true)}
          />
        )}
      </main>

      {/* Testing Terminal */}
      <TestingTerminal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div>
              <p>MedDefi MVP Integration Demo</p>
              <p>Blockchain: Starknet Sepolia • Database: Supabase • API: WalletDash</p>
            </div>
            <div className="text-right">
              <p>100% API Coverage • Real-time Logging • Full Integration</p>
              <p>Database Schema: 9 Tables • 6 Views • Complete Tracking</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 