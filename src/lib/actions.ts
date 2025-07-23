// lib/actions.ts
'use server';

import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

function getSupabaseClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Service Key: Ensure this is server-side only!
    { cookies: () => cookieStore } // Required for SSR session
  );
}

export async function selectUserType(userType: string) {
  const supabase = getSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (!user) throw new Error('You must be logged in.');

  const { error: updateErr } = await supabase
    .from('profiles')
    .update({ user_type: userType, onboarding_step: 2 })
    .eq('id', user.id);

  if (updateErr) throw new Error(updateErr.message);

  // Next.js Redirect
  return { redirect: '/onboarding/2' };
}

export async function createUsername(formData: FormData) {
  const username = formData.get('username') as string;
  const supabase = getSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('You must be logged in.');

  // Username validation (must be unique)
  const { count, error: checkErr } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true })
    .eq('username', username);

  if (checkErr) throw new Error(checkErr.message);

  if ((count ?? 0) > 0) {
    return { error: 'This username is already taken.' };
  }

  const { error: updateErr } = await supabase
    .from('profiles')
    .update({ username: username, onboarding_step: 3 })
    .eq('id', user.id);

  if (updateErr) throw new Error(updateErr.message);

  return { redirect: '/onboarding/3' };
}

export async function createPassword(formData: FormData) {
  const password = formData.get('password') as string;
  // Optionally add more validation here

  const supabase = getSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('You must be logged in.');

  // Update password *via Supabase Auth API*
  const { error: passwordErr } = await supabase.auth.updateUser({ password });
  if (passwordErr) throw new Error(passwordErr.message);

  // Mark onboarding as completed
  const { error: updateErr } = await supabase
    .from('profiles')
    .update({ onboarding_completed: true })
    .eq('id', user.id);

  if (updateErr) throw new Error(updateErr.message);

  return { redirect: '/dashboard' };
}
