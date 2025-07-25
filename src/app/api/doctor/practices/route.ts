import { NextRequest, NextResponse } from 'next/server';
import { databaseService } from '@/services/database-integration';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get('doctorId');
    
    if (!doctorId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Doctor ID is required' 
      }, { status: 400 });
    }

    // Load doctor's practices
    const userPractices = await databaseService.getDoctorPractices(doctorId);

    // Load services for all practices
    let allServices: any[] = [];
    for (const practice of userPractices) {
      const practiceServices = await databaseService.getPracticeServices(practice.id);
      allServices = [...allServices, ...practiceServices];
    }

    return NextResponse.json({ 
      success: true, 
      data: {
        practices: userPractices,
        services: allServices
      },
      message: `Found ${userPractices.length} practices and ${allServices.length} services`
    });

  } catch (error) {
    console.error('Doctor Practices API Error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json({ 
      success: false, 
      error: errorMessage 
    }, { status: 500 });
  }
} 