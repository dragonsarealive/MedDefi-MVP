import OnboardingStep from '@/components/onboarding/OnboardingStep';
import SignupUserOption from '@/components/authsteps/SignupUserOption';

// Generate static params for all onboarding steps
export async function generateStaticParams() {
  return [
    { step: '1' },
    { step: '2' },
    { step: '3' },
    { step: 'user-type' },
    { step: 'username' },
    { step: 'password' },
  ];
}

export default async function OnboardingStepPage({ 
  params 
}: { 
  params: Promise<{ step: string }> 
}) {
  const { step } = await params;
  
  return (
    <SignupUserOption />
  );
}