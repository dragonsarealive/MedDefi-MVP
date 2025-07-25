'use client';

import React, { useState } from 'react';
import { UserRegistrationForm } from '@/types/walletdash-api';
import { walletDashService } from '@/services/walletdash-integration';
import { databaseService } from '@/services/database-integration';
import { logInfo, logSuccess, logError } from '@/components/TestingTerminal';
import { User, Stethoscope, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface UnifiedRegistrationFormProps {
  onSuccess: (userData: any) => void;
  onShowTerminal: () => void;
}

export default function UnifiedRegistrationForm({ onSuccess, onShowTerminal }: UnifiedRegistrationFormProps) {
  const [formData, setFormData] = useState<UserRegistrationForm>({
    firstName: '',
    lastName: '',
    email: '',
    country: '',
    userType: 'patient',
    specialty: '',
    bio: '',
    city: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'creating' | 'success' | 'error'>('form');
  const [error, setError] = useState<string | null>(null);
  const [createdData, setCreatedData] = useState<any>(null);

  // Handle form input changes
  const handleInputChange = (field: keyof UserRegistrationForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Validate form data
  const validateForm = (): string | null => {
    if (!formData.firstName.trim()) return 'First name is required';
    if (!formData.lastName.trim()) return 'Last name is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!formData.country.trim()) return 'Country is required';
    
    if (formData.userType === 'doctor') {
      if (!formData.specialty?.trim()) return 'Specialty is required for doctors';
      if (!formData.city?.trim()) return 'City is required for doctors';
    }

    return null;
  };

  // Main registration flow
  const handleRegistration = async () => {
    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setStep('creating');
    setError(null);
    
    const startTime = Date.now();
    
    try {
      logInfo('🚀 Starting unified registration process', {
        userType: formData.userType,
        name: `${formData.firstName} ${formData.lastName}`,
        country: formData.country,
        ...(formData.userType === 'doctor' && { specialty: formData.specialty })
      });

      // Step 1: Create mock auth user ID (in real app, this would come from Supabase Auth)
      const mockAuthUserId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      logInfo('👤 Generated user ID', { authUserId: mockAuthUserId });

      // Step 2: Create user profile in database
      logInfo('💾 Creating user profile in Supabase database', formData);
      const profile = await databaseService.createUserProfile(formData, mockAuthUserId);
      
      // Step 3: Create blockchain wallet
      const blockchainUserType = walletDashService.mapUserType(formData.userType);
      const fundingAmount = walletDashService.getFundingAmount(blockchainUserType);
      
      logInfo('⛓️ Creating blockchain wallet', {
        userId: mockAuthUserId,
        userType: blockchainUserType,
        expectedFunding: `${fundingAmount} STRK`
      });

      const walletResponse = await walletDashService.createWallet({
        user_id: mockAuthUserId,
        user_type: blockchainUserType
      }, profile.id);

      if (!walletResponse.success) {
        throw new Error(`Wallet creation failed: ${walletResponse.message}`);
      }

      // Step 4: Store wallet data in database
      logInfo('💾 Storing blockchain wallet data in database', {
        walletAddress: walletResponse.data.wallet_address,
        claimToken: walletResponse.data.claim_token,
        fundingAmount: walletResponse.data.funding_amount_strk
      });

      const walletData = await databaseService.storeBlockchainWallet(profile.id, walletResponse.data);

      // Step 5: Set up services integration callbacks
      walletDashService.setLogCallback((log) => {
        // @ts-ignore
        if (typeof window !== 'undefined' && window.addTerminalLog) {
          // @ts-ignore
          window.addTerminalLog(log);
        }
      });

      databaseService.setLogCallback((log) => {
        // @ts-ignore
        if (typeof window !== 'undefined' && window.addTerminalLog) {
          // @ts-ignore
          window.addTerminalLog(log);
        }
      });

      // Prepare success data
      const successData = {
        profile,
        wallet: walletData,
        blockchainData: walletResponse.data,
        userType: formData.userType,
        authUserId: mockAuthUserId
      };

      setCreatedData(successData);
      setStep('success');

      const duration = Date.now() - startTime;
      logSuccess('🎉 Registration completed successfully!', {
        duration: `${duration}ms`,
        profileId: profile.id,
        walletAddress: walletResponse.data.wallet_address,
        fundingAmount: walletResponse.data.funding_amount_strk,
        userType: blockchainUserType,
        readyForTransactions: walletResponse.data.ready_for_transactions
      }, duration);

      // Call success callback after a brief delay to show success state
      setTimeout(() => {
        onSuccess(successData);
      }, 2000);

    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      setError(errorMessage);
      setStep('error');
      
      logError('❌ Registration failed', {
        error: errorMessage,
        duration: `${duration}ms`,
        formData: { ...formData, email: '[REDACTED]' }
      }, duration);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setStep('form');
    setError(null);
    setCreatedData(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      country: '',
      userType: 'patient',
      specialty: '',
      bio: '',
      city: ''
    });
  };

  // Render loading state
  if (step === 'creating') {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Creating Your Account</h2>
          <p className="text-gray-600 mb-4">
            Setting up your profile and blockchain wallet...
          </p>
          <div className="space-y-2 text-sm text-left">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Creating user profile</span>
            </div>
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
              <span>Setting up blockchain wallet</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <div className="w-4 h-4 rounded-full border border-gray-300" />
              <span>Configuring integrations</span>
            </div>
          </div>
          <button
            onClick={onShowTerminal}
            className="mt-4 text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            View detailed progress →
          </button>
        </div>
      </div>
    );
  }

  // Render success state
  if (step === 'success') {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-green-800 mb-2">Account Created Successfully!</h2>
          <p className="text-gray-600 mb-4">
            Your profile and blockchain wallet have been set up.
          </p>
          
          {createdData && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4 text-left">
              <h3 className="font-medium mb-2">Account Details:</h3>
              <div className="space-y-1 text-sm">
                <div><strong>Name:</strong> {createdData.profile.first_name} {createdData.profile.last_name}</div>
                <div><strong>Type:</strong> {createdData.userType === 'doctor' ? 'Medical Professional' : 'Patient'}</div>
                <div><strong>Wallet:</strong> {createdData.blockchainData.wallet_address.slice(0, 10)}...</div>
                <div><strong>Funding:</strong> {createdData.blockchainData.funding_amount_strk} STRK</div>
                <div><strong>Status:</strong> Ready for transactions</div>
              </div>
            </div>
          )}

          <p className="text-sm text-gray-500">
            Redirecting to dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Render error state
  if (step === 'error') {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-800 mb-2">Registration Failed</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          
          <div className="space-y-2">
            <button
              onClick={handleReset}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={onShowTerminal}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
            >
              View Error Details
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render main form
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Join MedDefi</h2>
        <p className="text-gray-600">Create your account with blockchain integration</p>
      </div>

      {/* User Type Selection */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-3">I am a:</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => handleInputChange('userType', 'patient')}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              formData.userType === 'patient'
                ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-25 hover:shadow-sm'
            }`}
          >
            <User className={`w-6 h-6 mx-auto mb-2 ${
              formData.userType === 'patient' ? 'text-blue-600' : 'text-gray-500'
            }`} />
            <div className="font-medium">Patient</div>
            <div className={`text-xs mt-1 ${
              formData.userType === 'patient' ? 'text-blue-600' : 'text-gray-500'
            }`}>Seek medical services</div>
          </button>
          <button
            onClick={() => handleInputChange('userType', 'doctor')}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              formData.userType === 'doctor'
                ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-25 hover:shadow-sm'
            }`}
          >
            <Stethoscope className={`w-6 h-6 mx-auto mb-2 ${
              formData.userType === 'doctor' ? 'text-blue-600' : 'text-gray-500'
            }`} />
            <div className="font-medium">Doctor</div>
            <div className={`text-xs mt-1 ${
              formData.userType === 'doctor' ? 'text-blue-600' : 'text-gray-500'
            }`}>Provide medical services</div>
          </button>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="John"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Doe"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="john.doe@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
          <select
            value={formData.country}
            onChange={(e) => handleInputChange('country', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
          >
            <option value="">Select your country</option>
            <option value="USA">United States</option>
            <option value="Canada">Canada</option>
            <option value="Mexico">Mexico</option>
            <option value="Costa Rica">Costa Rica</option>
            <option value="Colombia">Colombia</option>
            <option value="Thailand">Thailand</option>
            <option value="India">India</option>
            <option value="Turkey">Turkey</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Doctor-specific fields */}
        {formData.userType === 'doctor' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Medical Specialty *</label>
              <select
                value={formData.specialty}
                onChange={(e) => handleInputChange('specialty', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
              >
                <option value="">Select your specialty</option>
                <option value="General Medicine">General Medicine</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Dermatology">Dermatology</option>
                <option value="Dentistry">Dentistry</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Plastic Surgery">Plastic Surgery</option>
                <option value="Neurology">Neurology</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Gynecology">Gynecology</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="San José"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio (Optional)</label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
                rows={3}
                placeholder="Brief description of your practice and experience..."
              />
            </div>
          </>
        )}
      </div>

      {/* Blockchain Info */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-lg">
        <h3 className="font-medium text-blue-800 mb-2">🔗 Blockchain Integration</h3>
        <p className="text-sm text-blue-700">
          {formData.userType === 'doctor' 
            ? 'Your Medical wallet will be funded with 2 STRK for practice creation and transactions.'
            : 'Your Individual wallet will be funded with 5 STRK for service purchases and transactions.'
          }
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleRegistration}
        disabled={isLoading}
        className="w-full mt-8 px-6 py-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Creating Account...
          </div>
        ) : (
          'Create Account & Blockchain Wallet'
        )}
      </button>

      {/* Debug Terminal Link */}
      <div className="text-center mt-6">
        <button
          onClick={onShowTerminal}
          className="text-sm text-gray-500 hover:text-blue-600 transition-colors duration-200 underline-offset-2 hover:underline"
        >
          🔧 Show Debug Terminal
        </button>
      </div>
    </div>
  );
} 