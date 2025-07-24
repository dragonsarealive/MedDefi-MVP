"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import Button from '@/components/ui/button';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement password reset logic
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-6">Reset Email Sent</h1>
          <p className="text-gray-600 text-center">
            If an account with that email exists, we've sent you a password reset link.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Forgot Password</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email address"
            />
          </div>
          <Button type="submit" variant="primary" className="w-full">
            Send Reset Email
          </Button>
        </form>
      </Card>
    </div>
  );
}
