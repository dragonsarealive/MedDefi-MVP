export async function getSessionUser() {
  // Only run on client side
  if (typeof window === 'undefined') return null;

  try {
    const savedUser = localStorage.getItem('meddefi_user');
    if (!savedUser) return null;
    const user = JSON.parse(savedUser);
    // Ensure onboardingStep exists for onboarding flow
    if (user && user.onboardingStep === undefined) {
      user.onboardingStep = 1;
    }
    return user;
  } catch (err) {
    // If parsing fails, treat as no session
    return null;
  }
}
