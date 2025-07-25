import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { databaseService } from '@/services/database-integration';
import { walletDashService } from '@/services/walletdash-integration';
import { UserRegistrationForm } from '@/types/walletdash-api';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  console.log('[Registration API] Starting registration process...');
  
  try {
    const formData: UserRegistrationForm = await request.json();
    console.log('[Registration API] Form data received:', {
      email: formData.email,
      userType: formData.userType,
      firstName: formData.firstName,
      lastName: formData.lastName
    });
    
    // Initialize Supabase client with service role key
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    console.log('[Registration API] Environment check:', {
      supabaseUrl: supabaseUrl ? 'SET' : 'MISSING',
      supabaseServiceKey: supabaseServiceKey ? 'SET' : 'MISSING'
    });
    
    if (!supabaseUrl || !supabaseServiceKey) {
      const error = 'Missing Supabase configuration. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.';
      console.error('[Registration API] Environment error:', error);
      return NextResponse.json({ success: false, error }, { status: 500 });
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    
    // Validate required fields
    if (!formData.firstName?.trim()) {
      return NextResponse.json({ success: false, error: 'First name is required' }, { status: 400 });
    }
    if (!formData.lastName?.trim()) {
      return NextResponse.json({ success: false, error: 'Last name is required' }, { status: 400 });
    }
    if (!formData.email?.trim()) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }
    if (!formData.country?.trim()) {
      return NextResponse.json({ success: false, error: 'Country is required' }, { status: 400 });
    }
    
    if (formData.userType === 'doctor') {
      if (!formData.specialty?.trim()) {
        return NextResponse.json({ success: false, error: 'Specialty is required for doctors' }, { status: 400 });
      }
      if (!formData.city?.trim()) {
        return NextResponse.json({ success: false, error: 'City is required for doctors' }, { status: 400 });
      }
    }

    // Step 1: Create new auth user (Supabase handles email uniqueness)
    console.log('[Registration API] Creating auth user...');
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: formData.email,
      password: crypto.randomUUID(), // Generate random password for demo
      email_confirm: true, // Auto-confirm email for demo
      user_metadata: {
        first_name: formData.firstName,
        last_name: formData.lastName,
        user_type: formData.userType
      }
    });

    console.log('[Registration API] Auth user creation result:', {
      success: !authError,
      userId: authUser?.user?.id,
      error: authError?.message
    });

    if (authError) {
      // Handle specific error cases
      if (authError.message.includes('already registered') || authError.message.includes('email')) {
        return NextResponse.json({ 
          success: false, 
          error: 'Email already registered. Please use a different email or contact support.' 
        }, { status: 409 });
      }
      throw new Error(`Failed to create auth user: ${authError.message}`);
    }

    if (!authUser.user) {
      throw new Error('Failed to create auth user: No user returned');
    }

    const authUserId = authUser.user.id;
    
    // Step 2: Create user profile in database
    console.log('[Registration API] Creating user profile...');
    const profile = await databaseService.createUserProfile(formData, authUserId);
    console.log('[Registration API] Profile created:', { profileId: profile.id });
    
    // Step 3: Create blockchain wallet
    const blockchainUserType = walletDashService.mapUserType(formData.userType);
    const fundingAmount = walletDashService.getFundingAmount(blockchainUserType);
    
    console.log('[Registration API] Creating blockchain wallet...', {
      userType: blockchainUserType,
      fundingAmount
    });
    
    const walletResponse = await walletDashService.createWallet({
      user_id: authUserId,
      user_type: blockchainUserType
    }, profile.id);

    console.log('[Registration API] Wallet creation result:', {
      success: walletResponse.success,
      error: walletResponse.success ? null : (walletResponse as any).error
    });

    if (!walletResponse.success) {
      // If wallet creation fails, we should ideally rollback the profile creation
      // For now, we'll just return the error
      return NextResponse.json({ 
        success: false, 
        error: `Wallet creation failed: ${walletResponse.message}` 
      }, { status: 500 });
    }

    // Step 4: Store wallet data in database
    console.log('[Registration API] Storing wallet data in database...');
    const walletData = await databaseService.storeBlockchainWallet(profile.id, walletResponse.data);
    console.log('[Registration API] Wallet data stored successfully');

    // Return success response with all data
    const successData = {
      profile,
      wallet: walletData,
      blockchainData: walletResponse.data,
      userType: formData.userType,
      authUserId: authUserId
    };

    const duration = Date.now() - startTime;
    console.log('[Registration API] Registration completed successfully in', duration, 'ms');

    return NextResponse.json({ 
      success: true, 
      data: successData,
      message: 'Registration completed successfully'
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('[Registration API] Unhandled error after', duration, 'ms:', error);
    console.error('[Registration API] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json({ 
      success: false, 
      error: errorMessage 
    }, { status: 500 });
  }
} 