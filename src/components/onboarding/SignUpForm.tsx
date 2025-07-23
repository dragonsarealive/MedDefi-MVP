'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/modal';
import  Button  from '@/components/ui/Button';
import { User, Mail, MapPin, UserCheck } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  role: 'patient' | 'doctor';
}

interface SignUpFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const countries = [
  // North America
  'Antigua and Barbuda', 'Bahamas', 'Barbados', 'Belize', 'Canada', 'Costa Rica', 'Cuba', 'Dominica', 'Dominican Republic', 'El Salvador', 'Grenada', 'Guatemala', 'Haiti', 'Honduras', 'Jamaica', 'Mexico', 'Nicaragua', 'Panama', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Trinidad and Tobago', 'United States',
  // South America
  'Argentina', 'Bolivia', 'Brazil', 'Chile', 'Colombia', 'Ecuador', 'Guyana', 'Paraguay', 'Peru', 'Suriname', 'Uruguay', 'Venezuela'
];

export function SignUpForm({ isOpen, onClose }: SignUpFormProps) {
  const router = useRouter();
  const { setUser } = useUser();
  const [formData, setFormData] = useState<SignUpFormData>({
    firstName: '',
    lastName: '',
    email: '',
    country: '',
    role: 'patient'
  });
  const [errors, setErrors] = useState<Partial<SignUpFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: Partial<SignUpFormData> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.country) {
      newErrors.country = 'Please select a country';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setAuthError(null);

    try {
      // Simulate API call - replace with actual backend integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a mock wallet address
      const generateWalletAddress = () => {
        const chars = '0123456789abcdef';
        let address = '0x';
        for (let i = 0; i < 40; i++) {
          address += chars[Math.floor(Math.random() * chars.length)];
        }
        return address;
      };
      
      // Create user data
      const userData = {
        ...formData,
        id: `MD${Date.now()}`,
        createdAt: new Date().toISOString(),
        address: generateWalletAddress() // Add wallet address
      };
      
      // Set user in context (this will also save to localStorage)
      setUser(userData);
      
      // Close modal
      onClose();
      
      // Role-based routing
      if (formData.role === 'doctor') {
        // Redirect doctors to KYC
        router.push('/auth/kyc');
      } else if (formData.role === 'patient') {
        // Redirect patients to their dashboard
        router.push('/patient');
      }
      
    } catch (error) {
      console.error('Sign up error:', error);
      setAuthError('An error occurred during sign up. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof SignUpFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Create Your Account">
        <form onSubmit={handleSubmit} className="space-y-6">
        {/* First Name */}
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
            First Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.firstName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your first name"
            />
          </div>
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
            Last Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.lastName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your last name"
            />
          </div>
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your email address"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Country */}
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
            Country *
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
            <select
              id="country"
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-gray-900 font-medium ${
                errors.country ? 'border-red-500' : 'border-gray-300'
              } ${formData.country ? 'text-gray-900' : 'text-gray-500'}`}
              style={{ 
                color: formData.country ? '#111827' : '#6B7280',
                backgroundColor: 'white'
              }}
            >
              <option value="" style={{ color: '#6B7280' }}>Select your country</option>
              {countries.map(country => (
                <option key={country} value={country} style={{ color: '#111827' }}>
                  {country}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {errors.country && (
            <p className="mt-1 text-sm text-red-600">{errors.country}</p>
          )}
        </div>

        {/* Role Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            I am a *
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleInputChange('role', 'patient')}
              className={`flex items-center justify-center gap-2 p-4 border-2 rounded-lg transition-all duration-200 ${
                formData.role === 'patient'
                  ? 'border-blue-600 bg-blue-600 text-white shadow-md'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              <User className={`w-5 h-5 ${formData.role === 'patient' ? 'text-white' : 'text-gray-600'}`} />
              <span className="font-medium">Patient</span>
            </button>
            <button
              type="button"
              onClick={() => handleInputChange('role', 'doctor')}
              className={`flex items-center justify-center gap-2 p-4 border-2 rounded-lg transition-all duration-200 ${
                formData.role === 'doctor'
                  ? 'border-blue-600 bg-blue-600 text-white shadow-md'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              <UserCheck className={`w-5 h-5 ${formData.role === 'doctor' ? 'text-white' : 'text-gray-600'}`} />
              <span className="font-medium">Doctor</span>
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Creating Account...
            </div>
          ) : (
            'Create Account'
          )}
        </Button>

        {/* Terms */}
        <p className="text-xs text-gray-500 text-center">
          By creating an account, you agree to our{' '}
          <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
        </p>
      </form>
    </Modal>

      {/* Error Modal */}
      <Modal 
        isOpen={!!authError} 
        onClose={() => setAuthError(null)} 
        title="Sign Up Error"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-red-900">Authentication Error</h4>
              <p className="text-sm text-red-700">{authError}</p>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button
              onClick={() => setAuthError(null)}
              variant="primary"
              size="sm"
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
} 

export function StandaloneSignUpForm() {
  const router = useRouter();
  const { setUser } = useUser();
  const [formData, setFormData] = useState<SignUpFormData>({
    firstName: '',
    lastName: '',
    email: '',
    country: '',
    role: 'patient'
  });
  const [errors, setErrors] = useState<Partial<SignUpFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: Partial<SignUpFormData> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email address';
    if (!formData.country) newErrors.country = 'Please select a country';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setAuthError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const generateWalletAddress = () => {
        const chars = '0123456789abcdef';
        let address = '0x';
        for (let i = 0; i < 40; i++) address += chars[Math.floor(Math.random() * chars.length)];
        return address;
      };
      const userData = {
        ...formData,
        id: `MD${Date.now()}`,
        createdAt: new Date().toISOString(),
        address: generateWalletAddress()
      };
      setUser(userData);
      // Role-based routing
      if (formData.role === 'doctor') {
        router.push('/auth/kyc');
      } else if (formData.role === 'patient') {
        router.push('/patient');
      }
    } catch (error) {
      setAuthError('An error occurred during sign up. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof SignUpFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  return (
    <div className="max-w-lg w-full mx-auto bg-white rounded-2xl shadow-xl p-8 my-12">
      <h2 className="text-2xl font-bold mb-6 text-center">Create Your Account</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* First Name */}
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type="text" id="firstName" value={formData.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`} placeholder="Enter your first name" />
          </div>
          {errors.firstName && (<p className="mt-1 text-sm text-red-600">{errors.firstName}</p>)}
        </div>
        {/* Last Name */}
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type="text" id="lastName" value={formData.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)} className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`} placeholder="Enter your last name" />
          </div>
          {errors.lastName && (<p className="mt-1 text-sm text-red-600">{errors.lastName}</p>)}
        </div>
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input type="email" id="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'}`} placeholder="Enter your email address" />
          </div>
          {errors.email && (<p className="mt-1 text-sm text-red-600">{errors.email}</p>)}
        </div>
        {/* Country */}
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
            <select id="country" value={formData.country} onChange={(e) => handleInputChange('country', e.target.value)} className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-gray-900 font-medium ${errors.country ? 'border-red-500' : 'border-gray-300'} ${formData.country ? 'text-gray-900' : 'text-gray-500'}`} style={{ color: formData.country ? '#111827' : '#6B7280', backgroundColor: 'white' }}>
              <option value="" style={{ color: '#6B7280' }}>Select your country</option>
              {countries.map(country => (<option key={country} value={country} style={{ color: '#111827' }}>{country}</option>))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
          {errors.country && (<p className="mt-1 text-sm text-red-600">{errors.country}</p>)}
        </div>
        {/* Role Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">I am a *</label>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => handleInputChange('role', 'patient')} className={`flex items-center justify-center gap-2 p-4 border-2 rounded-lg transition-all duration-200 ${formData.role === 'patient' ? 'border-blue-600 bg-blue-600 text-white shadow-md' : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'}`}>
              <User className={`w-5 h-5 ${formData.role === 'patient' ? 'text-white' : 'text-gray-600'}`} />
              <span className="font-medium">Patient</span>
            </button>
            <button type="button" onClick={() => handleInputChange('role', 'doctor')} className={`flex items-center justify-center gap-2 p-4 border-2 rounded-lg transition-all duration-200 ${formData.role === 'doctor' ? 'border-blue-600 bg-blue-600 text-white shadow-md' : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'}`}>
              <UserCheck className={`w-5 h-5 ${formData.role === 'doctor' ? 'text-white' : 'text-gray-600'}`} />
              <span className="font-medium">Doctor</span>
            </button>
          </div>
        </div>
        {/* Submit Button */}
        <Button type="submit" variant="primary" size="lg" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (<div className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Creating Account...</div>) : ('Create Account')}
        </Button>
        <p className="text-xs text-gray-500 text-center">By creating an account, you agree to our{' '}<a href="#" className="text-blue-600 hover:underline">Terms of Service</a>{' '}and{' '}<a href="#" className="text-blue-600 hover:underline">Privacy Policy</a></p>
      </form>
      {authError && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{authError}</div>
      )}
    </div>
  );
} 