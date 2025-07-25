'use client';

import React, { useState, useEffect } from 'react';
import { walletDashService } from '@/services/walletdash-integration';
import { databaseService } from '@/services/database-integration';
import { logInfo, logSuccess, logError } from '@/components/TestingTerminal';
import { 
  Building2, 
  Plus, 
  Stethoscope, 
  DollarSign, 
  Eye,
  Loader2,
  CheckCircle,
  AlertCircle,
  Terminal,
  Wallet,
  Activity
} from 'lucide-react';
import { PracticeForm, ServiceForm } from '@/types/walletdash-api';

interface MedicDashboardProps {
  userData: any;
  onShowTerminal: () => void;
}

export default function MedicDashboard({ userData, onShowTerminal }: MedicDashboardProps) {
  const [practices, setPractices] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'practice' | 'services'>('overview');
  const [isCreatingPractice, setIsCreatingPractice] = useState(false);
  const [isCreatingService, setIsCreatingService] = useState(false);
  const [practiceForm, setPracticeForm] = useState<PracticeForm>({
    name: '',
    specialty: '',
    location: ''
  });
  const [serviceForm, setServiceForm] = useState<ServiceForm>({
    name: '',
    description: '',
    price_usd: 0,
    duration_minutes: 30
  });

  // Load user's practices and services on mount
  useEffect(() => {
    loadUserData();
  }, [userData]);

  const loadUserData = async () => {
    try {
      logInfo('📊 Loading medic dashboard data', { profileId: userData.profile.id });
      
      // Load doctor's practices and services via API route
      const response = await fetch(`/api/doctor/practices?doctorId=${userData.profile.id}`);
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      setPractices(result.data.practices);
      setServices(result.data.services);

      logSuccess('📊 Dashboard data loaded', {
        practicesCount: result.data.practices.length,
        servicesCount: result.data.services.length
      });

    } catch (error) {
      logError('❌ Failed to load dashboard data', { error: error instanceof Error ? error.message : error });
    }
  };

  const handleCreatePractice = async () => {
    if (!practiceForm.name || !practiceForm.specialty || !practiceForm.location) {
      logError('❌ Validation failed', { error: 'All practice fields are required' });
      return;
    }

    setIsCreatingPractice(true);
    
    try {
      logInfo('🏥 Creating medical practice', practiceForm);

      // Get user's backend user_id from wallet
      const backendUserId = userData.wallet.user_id;

      // Create practice via WalletDash API
      const practiceResponse = await walletDashService.createPractice({
        user_id: backendUserId,
        name: practiceForm.name,
        specialty: practiceForm.specialty,
        location: practiceForm.location
      }, userData.profile.id);

      if (!practiceResponse.success) {
        throw new Error(`Practice creation failed: ${practiceResponse.message}`);
      }

      // Store practice in database
      const storedPractice = await databaseService.storeMedicalPractice(
        userData.profile.id,
        userData.wallet.id,
        practiceResponse.data
      );

      // Update local state
      setPractices(prev => [...prev, storedPractice]);

      // Reset form
      setPracticeForm({ name: '', specialty: '', location: '' });

      logSuccess('✅ Practice created successfully', {
        practiceId: storedPractice.id,
        backendPracticeId: storedPractice.backend_practice_id,
        contractAddress: storedPractice.contract_address
      });

    } catch (error) {
      logError('❌ Practice creation failed', { error: error instanceof Error ? error.message : error });
    } finally {
      setIsCreatingPractice(false);
    }
  };

  const handleCreateService = async () => {
    if (practices.length === 0) {
      logError('❌ No practice available', { error: 'Create a practice first before adding services' });
      return;
    }

    if (!serviceForm.name || !serviceForm.description || serviceForm.price_usd <= 0) {
      logError('❌ Validation failed', { error: 'All service fields are required and price must be > 0' });
      return;
    }

    setIsCreatingService(true);
    
    try {
      logInfo('⚕️ Creating medical service', serviceForm);

      // Use the first practice (in real app, user would select)
      const practice = practices[0];

      // Create service via WalletDash API
      const serviceResponse = await walletDashService.createService({
        practice_id: practice.backend_practice_id,
        name: serviceForm.name,
        description: serviceForm.description,
        price_usd: serviceForm.price_usd
      }, userData.profile.id);

      if (!serviceResponse.success) {
        throw new Error(`Service creation failed: ${serviceResponse.message}`);
      }

      // Store service in database
      const storedService = await databaseService.storeMedicalService(
        userData.profile.id,
        practice.id,
        serviceResponse.data
      );

      // Update local state
      setServices(prev => [...prev, storedService]);

      // Reset form
      setServiceForm({ name: '', description: '', price_usd: 0, duration_minutes: 30 });

      logSuccess('✅ Service created successfully', {
        serviceId: storedService.id,
        backendServiceId: storedService.backend_service_id,
        contractAddress: storedService.service_contract_address
      });

    } catch (error) {
      logError('❌ Service creation failed', { error: error instanceof Error ? error.message : error });
    } finally {
      setIsCreatingService(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* User Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Stethoscope className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Dr. {userData.profile.first_name} {userData.profile.last_name}
              </h2>
              <p className="text-gray-600">Medical Professional Dashboard</p>
              <div className="flex items-center gap-4 mt-2 text-sm">
                <div className="flex items-center gap-1">
                  <Wallet className="w-4 h-4 text-green-500" />
                  <span className="text-green-600">{userData.blockchainData.funding_amount_strk} STRK</span>
                </div>
                <div className="text-gray-500">
                  {userData.blockchainData.wallet_address.slice(0, 8)}...{userData.blockchainData.wallet_address.slice(-6)}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={onShowTerminal}
              className="p-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
              title="Show Debug Terminal"
            >
              <Terminal className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'practice', label: 'Practice Management', icon: Building2 },
              { id: 'services', label: 'Services', icon: Stethoscope }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Practice Overview</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-8 h-8 text-blue-600" />
                    <div>
                      <div className="text-2xl font-bold text-blue-900">{practices.length}</div>
                      <div className="text-sm text-blue-600">Active Practices</div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Stethoscope className="w-8 h-8 text-green-600" />
                    <div>
                      <div className="text-2xl font-bold text-green-900">{services.length}</div>
                      <div className="text-sm text-green-600">Available Services</div>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-8 h-8 text-purple-600" />
                    <div>
                      <div className="text-2xl font-bold text-purple-900">
                        ${services.reduce((sum, service) => sum + service.price_usd, 0)}
                      </div>
                      <div className="text-sm text-purple-600">Total Service Value</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Blockchain Status */}
              <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-3">Blockchain Integration Status</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-gray-800 font-medium">Medical wallet created and funded</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-gray-800 font-medium">Ready for practice creation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {practices.length > 0 ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-gray-800 font-medium">Practice contracts deployed</span>
                      </>
                    ) : (
                      <>
                        <div className="w-4 h-4 rounded-full border border-gray-300" />
                        <span className="text-gray-500">No practices created yet</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Practice Management Tab */}
          {activeTab === 'practice' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Practice Management</h3>
                <p className="text-sm text-gray-500">
                  Create and manage your medical practices on the blockchain
                </p>
              </div>

              {/* Create Practice Form */}
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-4">Create New Practice</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Practice Name"
                    value={practiceForm.name}
                    onChange={(e) => setPracticeForm(prev => ({ ...prev, name: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    value={practiceForm.specialty}
                    onChange={(e) => setPracticeForm(prev => ({ ...prev, specialty: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Specialty</option>
                    <option value="General Medicine">General Medicine</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Dentistry">Dentistry</option>
                    <option value="Orthopedics">Orthopedics</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Location"
                    value={practiceForm.location}
                    onChange={(e) => setPracticeForm(prev => ({ ...prev, location: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={handleCreatePractice}
                  disabled={isCreatingPractice}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isCreatingPractice ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating Practice...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Create Practice
                    </div>
                  )}
                </button>
              </div>

              {/* Practices List */}
              <div className="space-y-4">
                <h4 className="font-medium">Your Practices</h4>
                {practices.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Building2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No practices created yet. Create your first practice above.</p>
                  </div>
                ) : (
                  practices.map((practice) => (
                    <div key={practice.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium">{practice.name}</h5>
                          <p className="text-sm text-gray-600">{practice.specialty} • {practice.location}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Contract: {practice.contract_address}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Active
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Services Tab */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Service Management</h3>
                <p className="text-sm text-gray-500">
                  Add and manage medical services for your practices
                </p>
              </div>

              {/* Create Service Form */}
              {practices.length > 0 && (
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-4">Add New Service</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Service Name"
                      value={serviceForm.name}
                      onChange={(e) => setServiceForm(prev => ({ ...prev, name: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Price (USD)"
                      value={serviceForm.price_usd || ''}
                      onChange={(e) => setServiceForm(prev => ({ ...prev, price_usd: parseFloat(e.target.value) || 0 }))}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <textarea
                    placeholder="Service Description"
                    value={serviceForm.description}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full mt-4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                  <button
                    onClick={handleCreateService}
                    disabled={isCreatingService}
                    className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isCreatingService ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating Service...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add Service
                      </div>
                    )}
                  </button>
                </div>
              )}

              {/* Services List */}
              <div className="space-y-4">
                <h4 className="font-medium">Your Services</h4>
                {services.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Stethoscope className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>
                      {practices.length === 0 
                        ? 'Create a practice first before adding services.'
                        : 'No services created yet. Add your first service above.'
                      }
                    </p>
                  </div>
                ) : (
                  services.map((service) => (
                    <div key={service.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium">{service.name}</h5>
                          <p className="text-sm text-gray-600">{service.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Practice: {service.practice_name} • Contract: {service.service_contract_address}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">${service.price_usd}</div>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Available
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 