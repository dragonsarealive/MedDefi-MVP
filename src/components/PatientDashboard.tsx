'use client';

import React, { useState, useEffect } from 'react';
import { walletDashService } from '@/services/walletdash-integration';
import { databaseService } from '@/services/database-integration';
import { logInfo, logSuccess, logError } from '@/components/TestingTerminal';
import { 
  User, 
  ShoppingCart, 
  History, 
  CreditCard,
  Loader2,
  CheckCircle,
  Terminal,
  Wallet,
  Activity,
  Heart,
  MapPin,
  Clock
} from 'lucide-react';

interface PatientDashboardProps {
  userData: any;
  onShowTerminal: () => void;
}

export default function PatientDashboard({ userData, onShowTerminal }: PatientDashboardProps) {
  const [services, setServices] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'history'>('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);

  // Load available services and user's purchase history
  useEffect(() => {
    loadPatientData();
  }, [userData]);

  const loadPatientData = async () => {
    setIsLoading(true);
    
    try {
      logInfo('📊 Loading patient dashboard data', { profileId: userData.profile.id });
      
      // Load all available services
      const availableServices = await databaseService.getCompleteServiceListings();
      setServices(availableServices);

      // Load user's purchase history (would implement when purchases exist)
      // For now, just set empty array
      setPurchases([]);

      logSuccess('📊 Patient dashboard data loaded', {
        servicesCount: availableServices.length,
        purchasesCount: 0
      });

    } catch (error) {
      logError('❌ Failed to load patient dashboard data', { error: error instanceof Error ? error.message : error });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchaseService = async (service: any) => {
    setIsPurchasing(true);
    setSelectedService(service);
    
    try {
      logInfo('💳 Initiating service purchase', {
        serviceId: service.backend_service_id,
        serviceName: service.name,
        price: service.price_usd,
        doctorName: service.doctor_name
      });

      // Get user's backend user_id from wallet
      const buyerUserId = userData.wallet.user_id;

      // Purchase service via WalletDash API
      const purchaseResponse = await walletDashService.purchaseService({
        service_id: service.backend_service_id,
        buyer_user_id: buyerUserId
      }, userData.profile.id);

      if (!purchaseResponse.success) {
        throw new Error(`Purchase failed: ${purchaseResponse.message}`);
      }

      // Store purchase in database
      await databaseService.storeServicePurchase(
        service.id,
        userData.profile.id,
        purchaseResponse.data
      );

      // Add to local purchases list
      setPurchases(prev => [purchaseResponse.data, ...prev]);

      logSuccess('✅ Service purchased successfully!', {
        purchaseId: purchaseResponse.data.id,
        transactionHash: purchaseResponse.data.transaction_hash,
        amountPaid: `$${purchaseResponse.data.amount_usd} (${purchaseResponse.data.amount_strk} STRK)`,
        paymentSplit: purchaseResponse.data.payment_split,
        serviceName: purchaseResponse.data.service_name,
        doctorPayment: `${purchaseResponse.data.payment_split.medic} STRK (75%)`
      });

      setSelectedService(null);

    } catch (error) {
      logError('❌ Service purchase failed', { 
        error: error instanceof Error ? error.message : error,
        serviceId: service.backend_service_id 
      });
    } finally {
      setIsPurchasing(false);
    }
  };

  const formatPaymentSplit = (split: any) => {
    return [
      { label: 'Doctor (75%)', amount: split.medic, color: 'text-green-600' },
      { label: 'Platform (15%)', amount: split.treasury, color: 'text-blue-600' },
      { label: 'Liquidity (5%)', amount: split.liquidity, color: 'text-purple-600' },
      { label: 'Rewards (5%)', amount: split.rewards, color: 'text-orange-600' }
    ];
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* User Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {userData.profile.first_name} {userData.profile.last_name}
              </h2>
              <p className="text-gray-600">Patient Dashboard</p>
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
              { id: 'services', label: 'Browse Services', icon: ShoppingCart },
              { id: 'history', label: 'Purchase History', icon: History }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
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
              <h3 className="text-lg font-semibold">Patient Overview</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <ShoppingCart className="w-8 h-8 text-green-600" />
                    <div>
                      <div className="text-2xl font-bold text-green-900">{services.length}</div>
                      <div className="text-sm text-green-600">Available Services</div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <History className="w-8 h-8 text-blue-600" />
                    <div>
                      <div className="text-2xl font-bold text-blue-900">{purchases.length}</div>
                      <div className="text-sm text-blue-600">Past Purchases</div>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-8 h-8 text-purple-600" />
                    <div>
                      <div className="text-2xl font-bold text-purple-900">
                        ${purchases.reduce((sum, purchase) => sum + (purchase.amount_usd || 0), 0)}
                      </div>
                      <div className="text-sm text-purple-600">Total Spent</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Blockchain Status */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Blockchain Integration Status</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Individual wallet created and funded</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Ready for service purchases</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Automatic payment splitting enabled</span>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              {purchases.length > 0 && (
                <div className="bg-white border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Recent Activity</h4>
                  <div className="space-y-3">
                    {purchases.slice(0, 3).map((purchase, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                        <div className="flex items-center gap-3">
                          <Heart className="w-4 h-4 text-red-500" />
                          <div>
                            <div className="text-sm font-medium">{purchase.service_name}</div>
                            <div className="text-xs text-gray-500">{purchase.practice_name}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">${purchase.amount_usd}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(purchase.purchased_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Services Tab */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Browse Medical Services</h3>
                <p className="text-sm text-gray-500">
                  {services.length} services available from medical professionals
                </p>
              </div>

              {isLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-500">Loading available services...</p>
                </div>
              ) : services.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No medical services available yet.</p>
                  <p className="text-sm mt-2">Medical professionals will add services as they join the platform.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map((service) => (
                    <div key={service.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{service.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-lg font-bold text-green-600">${service.price_usd}</div>
                          {service.duration_minutes && (
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {service.duration_minutes}min
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="border-t pt-3 mt-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Heart className="w-4 h-4 text-red-500" />
                          <span className="text-sm font-medium">{service.doctor_name}</span>
                        </div>
                        <div className="text-xs text-gray-500 space-y-1">
                          <div className="flex items-center gap-1">
                            <span>🏥 {service.practice_name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{service.practice_location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>🩺 {service.doctor_specialty}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handlePurchaseService(service)}
                        disabled={isPurchasing && selectedService?.id === service.id}
                        className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isPurchasing && selectedService?.id === service.id ? (
                          <div className="flex items-center justify-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Processing...
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <CreditCard className="w-4 h-4" />
                            Purchase Service
                          </div>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Purchase History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Purchase History</h3>
                <p className="text-sm text-gray-500">
                  Your medical service purchases and transactions
                </p>
              </div>

              {purchases.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No purchases yet.</p>
                  <p className="text-sm mt-2">Your purchased services will appear here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {purchases.map((purchase, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{purchase.service_name}</h4>
                          <p className="text-sm text-gray-600">{purchase.practice_name}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Purchased on {new Date(purchase.purchased_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">${purchase.amount_usd}</div>
                          <div className="text-xs text-gray-500">{purchase.amount_strk} STRK</div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded p-3 mt-3">
                        <h5 className="text-sm font-medium text-gray-900 mb-2">Payment Split Breakdown</h5>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                          {formatPaymentSplit(purchase.payment_split).map((split, idx) => (
                            <div key={idx} className="text-center">
                              <div className={`font-medium ${split.color}`}>{split.amount} STRK</div>
                              <div className="text-gray-500">{split.label}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Transaction: {purchase.transaction_hash?.slice(0, 10)}...{purchase.transaction_hash?.slice(-6)}</span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
                            {purchase.completed ? 'Completed' : 'Processing'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 