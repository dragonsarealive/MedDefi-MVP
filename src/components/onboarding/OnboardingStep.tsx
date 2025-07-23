'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';

// Import your step components
import UserTypeSelector from '@/components/onboarding/user-type-selector';
import CreateUsernameForm from '@/components/onboarding/create-username-form';
import CreatePasswordForm from '@/components/onboarding/create-password-form';

// Add type definition
type User = {
  onboardingStep: number;
  [key: string]: any;
};

export default function OnboardingStepPage({ params }: { params: { step?: string } }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const sessionUser = await getSessionUser();
      if (!sessionUser) {
        // Comment out this redirect for development
        // router.push('/login');
        // return;
        
        // Create a mock user for development
        const mockUser = { onboardingStep: 1, id: 'dev-user' };
        setUser(mockUser);
        setLoading(false);
        return;
      }
      setUser(sessionUser);
      setLoading(false);
    };

    checkUser();
  }, [router]);

  useEffect(() => {
    if (!loading && user) {
      // If no step parameter is provided, redirect to user's current step
      if (!params.step) {
        const userExpectedStep = user.onboardingStep || 1;
        router.push(`/onboarding/${userExpectedStep}`);
        return;
      }

      const currentStep = parseInt(params.step, 10);
      const userExpectedStep = user.onboardingStep || 1;

      // Prevents user from skipping steps by changing the URL
      if (currentStep !== userExpectedStep) {
        router.push(`/onboarding/${userExpectedStep}`);
      }
    }
  }, [loading, user, params.step, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null; // Will redirect to login
  }

  const currentStep = parseInt(params.step || '1', 10);

  // Render the component for the current step
  switch (currentStep) {
    case 1:
      return <UserTypeSelector />; // Contains the 3 buttons
    case 2:
      return <CreateUsernameForm />; // Contains the username form
    case 3:
      return <CreatePasswordForm />; // Contains the password form
    default:
      // If something is wrong, send them back to the start
      router.push('/onboarding/1');
      return null;
  }
}