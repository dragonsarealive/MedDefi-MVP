'use client';

import React, { useState } from 'react';
import UnifiedRegistrationForm from '@/components/UnifiedRegistrationForm';
import TestingTerminal from '@/components/TestingTerminal';
import MedicDashboard from '@/components/MedicDashboard';
import PatientDashboard from '@/components/PatientDashboard';
import { Terminal, ArrowLeft, Sparkles } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 pt-24">
        <div className="w-full max-w-2xl">
          {/* Main Card */}
          <div className="backdrop-blur-xl bg-white/70 border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-b border-white/20 px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {currentState === 'registration' ? 'Create Your Account' : 'Dashboard'}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {currentState === 'registration' 
                      ? 'Join the future of medical tourism with blockchain technology'
                      : 'Manage your medical services and transactions'
                    }
                  </p>
                </div>
                
                {/* Back Button for Dashboard */}
                {currentState === 'dashboard' && (
                  <button
                    onClick={handleBackToRegistration}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-white/80 text-gray-700 rounded-xl hover:bg-white transition-all duration-200 border border-white/40 shadow-sm"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Registration
                  </button>
                )}
              </div>
            </div>

            {/* Card Content */}
            <div className="p-8 pt-12">
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
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <button
              onClick={() => setIsTerminalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-white/50 rounded-xl transition-all duration-200 border border-gray-200/50 hover:border-blue-300/50"
            >
              <Terminal className="w-4 h-4" />
              View Debug Terminal
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Real-time blockchain transaction logging and debugging
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Testing Terminal */}
      <TestingTerminal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
      />
    </div>
  );
} 