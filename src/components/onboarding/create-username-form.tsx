'use client';
import React, { useState } from 'react';
import Button from '@/components/ui/Button';

interface CreateUsernameFormProps {
  onSubmit?: (username: string) => void;
}

const CreateUsernameForm: React.FC<CreateUsernameFormProps> = ({ onSubmit }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Username is required');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    // Placeholder for actual submit logic
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSubmitting(false);
    if (onSubmit) onSubmit(username);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto mt-8">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
          Choose a Username *
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter your username"
          disabled={isSubmitting}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Continue'}
      </Button>
    </form>
  );
};

export default CreateUsernameForm; 