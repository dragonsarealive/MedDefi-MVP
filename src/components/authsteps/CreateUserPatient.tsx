'use client';

import React, { useState } from 'react';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';

const MedDeFiLogo = () => (
    <div className="flex items-center space-x-2">
      <Image 
        src="/MedDeFi logo.svg" 
        alt="MedDeFi Logo" 
        width={32} 
        height={32}
        className="w-8 h-8"
      />
      <span className="font-bold text-xl text-blue-600">MedDeFi</span>
    </div>
  );

export default function CreateUserPatient() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { setUser } = useUser();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // For MVP, default to 'Individual' user type
    const type = 'Individual';
    
    try {
      // Simulate user creation - in real app this would call your backend
      const newUser = {
        id: Date.now().toString(),
        firstName: email.split('@')[0],
        lastName: 'User',
        email,
        country: 'United States',
        role: 'patient' as const,
        createdAt: new Date().toISOString(),
        address: `0x${Math.random().toString(16).substr(2, 40)}`
      };
      
      setUser(newUser);
      
      // For MVP, always go to patient dashboard
      router.push('/patient');
    } catch (error) {
      console.error('Signup error:', error);
      alert('Signup failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md border border-gray-100">
        <div className="mb-8 flex items-center">
          <MedDeFiLogo />
        </div>
        <h1 className="text-3xl font-bold mb-2 text-gray-800">Sign up for free</h1>
        <p className="mb-6 text-gray-600 text-sm">
          Create a unique <span className="font-semibold">username</span> to signup for free.
        </p>
        <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-500 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
            required
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-500 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          Create Account
        </button>
      </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <button
              onClick={() => router.push('/auth/login')}
              className="text-blue-600 hover:underline font-medium"
          >
              Sign in
          </button>
        </p>
      </div>
        
        <div className="mt-8 border-t border-gray-200 pt-6">
          <div className="flex items-center text-xs text-gray-500 space-x-4">
            <span>🔒 Secure & Encrypted</span>
            <span>⚡ Fast Setup</span>
            <span>🌍 Global Access</span>
          </div>
      </div>
    </div>
    </div>
  );
}
