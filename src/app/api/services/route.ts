import { NextRequest, NextResponse } from 'next/server';
import { databaseService } from '@/services/database-integration';

export async function GET(request: NextRequest) {
  try {
    // Load all available services
    const availableServices = await databaseService.getCompleteServiceListings();

    return NextResponse.json({ 
      success: true, 
      data: availableServices,
      message: `Found ${availableServices.length} services`
    });

  } catch (error) {
    console.error('Services API Error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json({ 
      success: false, 
      error: errorMessage 
    }, { status: 500 });
  }
} 