'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/button';

interface CreatePasswordFormProps {
  onSubmit?: (password: string) => void;
}

const CreatePasswordForm: React.FC<CreatePasswordFormProps> = ({ onSubmit }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      setError('Both fields are required');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    // Placeholder for actual submit logic
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSubmitting(false);
    if (onSubmit) onSubmit(password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto mt-8">
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Create a Password *
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            error && !password ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter your password"
          disabled={isSubmitting}
        />
      </div>
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
          Confirm Password *
        </label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            error && !confirmPassword ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Re-enter your password"
          disabled={isSubmitting}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Continue'}
      </Button>
    </form>
  );
};

export default CreatePasswordForm; 