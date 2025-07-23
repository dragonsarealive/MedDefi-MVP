import OnboardingStep from '@/components/onboarding/OnboardingStep';
import SignupUserOption from '@/components/authsteps/SignupUserOption';

export default function OnboardingStepPage({ params }: { params: { step: string } }) {
  return (
    <SignupUserOption />
  );
}