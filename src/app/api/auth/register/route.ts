import { NextRequest, NextResponse } from 'next/server';
import { databaseService } from '@/services/database-integration';
import { walletDashService } from '@/services/walletdash-integration';
import { UserRegistrationForm } from '@/types/walletdash-api';

export async function POST(request: NextRequest) {
  try {
    const formData: UserRegistrationForm = await request.json();
    
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

    // Generate mock auth user ID as UUID (in real app, this would come from Supabase Auth)
    const mockAuthUserId = crypto.randomUUID();
    
    // Step 1: Create user profile in database
    const profile = await databaseService.createUserProfile(formData, mockAuthUserId);
    
    // Step 2: Create blockchain wallet
    const blockchainUserType = walletDashService.mapUserType(formData.userType);
    const fundingAmount = walletDashService.getFundingAmount(blockchainUserType);
    
    const walletResponse = await walletDashService.createWallet({
      user_id: mockAuthUserId,
      user_type: blockchainUserType
    }, profile.id);

    if (!walletResponse.success) {
      // If wallet creation fails, we should ideally rollback the profile creation
      // For now, we'll just return the error
      return NextResponse.json({ 
        success: false, 
        error: `Wallet creation failed: ${walletResponse.message}` 
      }, { status: 500 });
    }

    // Step 3: Store wallet data in database
    const walletData = await databaseService.storeBlockchainWallet(profile.id, walletResponse.data);

    // Return success response with all data
    const successData = {
      profile,
      wallet: walletData,
      blockchainData: walletResponse.data,
      userType: formData.userType,
      authUserId: mockAuthUserId
    };

    return NextResponse.json({ 
      success: true, 
      data: successData,
      message: 'Registration completed successfully'
    });

  } catch (error) {
    console.error('Registration API Error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json({ 
      success: false, 
      error: errorMessage 
    }, { status: 500 });
  }
} 