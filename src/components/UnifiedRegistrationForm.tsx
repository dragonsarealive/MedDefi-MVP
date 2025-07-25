'use client';

import React, { useState } from 'react';
import { UserRegistrationForm } from '@/types/walletdash-api';
import { walletDashService } from '@/services/walletdash-integration';
import { databaseService } from '@/services/database-integration';
import { logInfo, logSuccess, logError } from '@/components/TestingTerminal';
import { User, Stethoscope, Loader2, CheckCircle, AlertCircle, Terminal, Sparkles, Shield, Zap } from 'lucide-react';

interface UnifiedRegistrationFormProps {
  onSuccess: (userData: any) => void;
  onShowTerminal: () => void;
}

export default function UnifiedRegistrationForm({ onSuccess, onShowTerminal }: UnifiedRegistrationFormProps) {
  const [formData, setFormData] = useState<UserRegistrationForm>({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    country: '',
    userType: 'patient',
    specialty: '',
    bio: '',
    city: 'San José'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'creating' | 'success' | 'error'>('form');
  const [error, setError] = useState<string | null>(null);
  const [createdData, setCreatedData] = useState<any>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

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
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      country: '',
      userType: 'patient',
      specialty: '',
      bio: '',
      city: 'San José'
    });
  };

  // Render loading state
  if (step === 'creating') {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse"></div>
          </div>
          <h2 className="text-xl font-semibold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Creating Your Account
          </h2>
          <p className="text-gray-600 mb-6">
            Setting up your profile and blockchain wallet...
          </p>
          <div className="space-y-3 text-sm text-left bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <span>Creating user profile</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
              </div>
              <span>Setting up blockchain wallet</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 rounded-full border-2 border-gray-300 border-t-transparent animate-spin"></div>
              </div>
              <span className="text-gray-500">Configuring integrations</span>
            </div>
          </div>
          <button
            onClick={onShowTerminal}
            className="mt-6 text-sm text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <Terminal className="w-4 h-4" />
            View detailed progress →
          </button>
        </div>
      </div>
    );
  }

  // Render success state
  if (step === 'success') {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -inset-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-xl animate-pulse"></div>
          </div>
          <h2 className="text-xl font-semibold text-green-800 mb-2">Account Created Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Your profile and blockchain wallet have been set up.
          </p>
          
          {createdData && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 backdrop-blur-sm rounded-xl p-4 mb-6 border border-green-200/50 text-left">
              <h3 className="font-medium mb-3 text-green-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Account Details:
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{createdData.profile.first_name} {createdData.profile.last_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium">{createdData.userType === 'doctor' ? 'Medical Professional' : 'Patient'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Wallet:</span>
                  <span className="font-mono text-xs">{createdData.blockchainData.wallet_address.slice(0, 10)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Funding:</span>
                  <span className="font-medium text-green-600">{createdData.blockchainData.funding_amount_strk} STRK</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-green-600 flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Ready for transactions
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            Redirecting to dashboard...
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (step === 'error') {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -inset-2 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse"></div>
          </div>
          <h2 className="text-xl font-semibold text-red-800 mb-2">Registration Failed</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          
          <div className="space-y-3">
            <button
              onClick={handleReset}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Try Again
            </button>
            <button
              onClick={onShowTerminal}
              className="w-full px-4 py-3 bg-white/80 text-gray-700 rounded-xl hover:bg-white transition-all duration-200 border border-gray-200/50 hover:border-gray-300/50"
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
    <div className="w-full max-w-md mx-auto">
      {/* User Type Selection */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-800 mb-3">I am a:</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => handleInputChange('userType', 'patient')}
            className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
              formData.userType === 'patient'
                ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-900 shadow-lg shadow-blue-500/25'
                : 'border-gray-200 bg-white/80 backdrop-blur-sm text-gray-800 hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-md'
            }`}
          >
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
            <div className="relative">
              <User className={`w-6 h-6 mx-auto mb-3 transition-transform duration-300 group-hover:scale-110 ${
                formData.userType === 'patient' ? 'text-blue-600' : 'text-gray-600'
              }`} />
              <div className="font-semibold text-base mb-1">Patient</div>
              <div className={`text-xs ${
                formData.userType === 'patient' ? 'text-blue-700' : 'text-gray-600'
              }`}>Seek medical services</div>
            </div>
          </button>
          <button
            onClick={() => handleInputChange('userType', 'doctor')}
            className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
              formData.userType === 'doctor'
                ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 text-purple-900 shadow-lg shadow-purple-500/25'
                : 'border-gray-200 bg-white/80 backdrop-blur-sm text-gray-800 hover:border-purple-300 hover:bg-purple-50/50 hover:shadow-md'
            }`}
          >
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
            <div className="relative">
              <Stethoscope className={`w-6 h-6 mx-auto mb-3 transition-transform duration-300 group-hover:scale-110 ${
                formData.userType === 'doctor' ? 'text-purple-600' : 'text-gray-600'
              }`} />
              <div className="font-semibold text-base mb-1">Doctor</div>
              <div className={`text-xs ${
                formData.userType === 'doctor' ? 'text-purple-700' : 'text-gray-600'
              }`}>Provide medical services</div>
            </div>
          </button>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-800 mb-2">First Name *</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              onFocus={() => setFocusedField('firstName')}
              onBlur={() => setFocusedField(null)}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm placeholder-gray-500 text-sm ${
                focusedField === 'firstName' 
                  ? 'border-blue-500 shadow-lg shadow-blue-500/25' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              placeholder="John"
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-800 mb-2">Last Name *</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              onFocus={() => setFocusedField('lastName')}
              onBlur={() => setFocusedField(null)}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm placeholder-gray-500 text-sm ${
                focusedField === 'lastName' 
                  ? 'border-blue-500 shadow-lg shadow-blue-500/25' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              placeholder="Doe"
            />
          </div>
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-800 mb-2">Email *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm placeholder-gray-500 text-sm ${
              focusedField === 'email' 
                ? 'border-blue-500 shadow-lg shadow-blue-500/25' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            placeholder="john.doe@example.com"
          />
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-800 mb-2">Country *</label>
          <select
            value={formData.country}
            onChange={(e) => handleInputChange('country', e.target.value)}
            onFocus={() => setFocusedField('country')}
            onBlur={() => setFocusedField(null)}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm text-sm ${
              focusedField === 'country' 
                ? 'border-blue-500 shadow-lg shadow-blue-500/25' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
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
          <div className="space-y-5 animate-in slide-in-from-top-2 duration-300">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-800 mb-2">Medical Specialty *</label>
              <select
                value={formData.specialty}
                onChange={(e) => handleInputChange('specialty', e.target.value)}
                onFocus={() => setFocusedField('specialty')}
                onBlur={() => setFocusedField(null)}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm text-sm ${
                  focusedField === 'specialty' 
                    ? 'border-purple-500 shadow-lg shadow-purple-500/25' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
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

            <div className="relative">
              <label className="block text-sm font-medium text-gray-800 mb-2">City *</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                onFocus={() => setFocusedField('city')}
                onBlur={() => setFocusedField(null)}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm placeholder-gray-500 text-sm ${
                  focusedField === 'city' 
                    ? 'border-purple-500 shadow-lg shadow-purple-500/25' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                placeholder="San José"
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-800 mb-2">Bio (Optional)</label>
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                onFocus={() => setFocusedField('bio')}
                onBlur={() => setFocusedField(null)}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 resize-vertical bg-white/80 backdrop-blur-sm placeholder-gray-500 text-sm ${
                  focusedField === 'bio' 
                    ? 'border-purple-500 shadow-lg shadow-purple-500/25' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                rows={3}
                placeholder="Brief description of your practice and experience..."
              />
            </div>
          </div>
        )}
      </div>

      {/* Blockchain Info */}
      <div className="mt-8 p-4 bg-gradient-to-r from-blue-50/80 to-purple-50/80 backdrop-blur-sm border border-blue-200/50 rounded-2xl">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-1 text-sm">🔗 Blockchain Integration</h3>
            <p className="text-xs text-gray-700 leading-relaxed">
              {formData.userType === 'doctor' 
                ? 'Your Medical wallet will be funded with 2 STRK for practice creation and transactions.'
                : 'Your Individual wallet will be funded with 5 STRK for service purchases and transactions.'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-6 p-4 bg-gradient-to-r from-red-50/80 to-pink-50/80 backdrop-blur-sm border border-red-200/50 rounded-2xl animate-in slide-in-from-top-2 duration-300">
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
        className="w-full mt-8 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-2xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm"
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin" />
            Creating Account...
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            Create Account & Blockchain Wallet
          </div>
        )}
      </button>

      {/* Debug Terminal Link */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={onShowTerminal}
          className="flex items-center gap-2 px-4 py-2 text-xs text-gray-600 hover:text-blue-600 hover:bg-white/50 rounded-xl transition-all duration-200 border border-gray-200/50 hover:border-blue-300/50 backdrop-blur-sm"
        >
          <Terminal className="w-3 h-3" />
          Show Debug Terminal
        </button>
        
        <div className="text-xs text-gray-500">
          Real-time blockchain logging
        </div>
      </div>
    </div>
  );
} 