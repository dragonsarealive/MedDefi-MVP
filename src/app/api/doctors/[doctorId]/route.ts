import { NextRequest, NextResponse } from 'next/server';

// Mock doctor data with services
const doctors = [
  {
    id: 'doc-1',
    name: 'Dr. Alice Johnson',
    photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
    specialty: 'Cardiology',
    rating: 4.9,
    bio: 'Dr. Alice Johnson is a board-certified cardiologist with over 15 years of experience in cardiovascular medicine. She specializes in interventional cardiology and has performed thousands of successful procedures. Dr. Johnson is known for her compassionate approach to patient care and her commitment to staying at the forefront of cardiac treatment innovations.',
    services: [
      { id: 'service-1', name: 'Cardiac Consultation', price: 150 },
      { id: 'service-2', name: 'Echocardiogram', price: 300 },
      { id: 'service-3', name: 'Stress Test', price: 250 },
      { id: 'service-4', name: 'Cardiac Catheterization', price: 1200 }
    ]
  },
  {
    id: 'doc-2',
    name: 'Dr. Bob Smith',
    photoUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
    specialty: 'Dentistry',
    rating: 4.7,
    bio: 'Dr. Bob Smith is a highly skilled dentist with expertise in cosmetic dentistry and oral surgery. With 12 years of practice, he has helped thousands of patients achieve their perfect smile through advanced dental procedures and personalized treatment plans.',
    services: [
      { id: 'service-5', name: 'Dental Checkup', price: 80 },
      { id: 'service-6', name: 'Teeth Cleaning', price: 120 },
      { id: 'service-7', name: 'Crown Placement', price: 800 },
      { id: 'service-8', name: 'Root Canal', price: 600 }
    ]
  },
  {
    id: 'doc-3',
    name: 'Dr. Carla Gomez',
    photoUrl: 'https://images.unsplash.com/photo-1594824475050-7da46b84c6e8?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
    specialty: 'Dermatology',
    rating: 4.8,
    bio: 'Dr. Carla Gomez is a renowned dermatologist specializing in medical and cosmetic dermatology. She has extensive experience in treating skin conditions, performing skin cancer screenings, and providing advanced cosmetic treatments.',
    services: [
      { id: 'service-9', name: 'Skin Consultation', price: 100 },
      { id: 'service-10', name: 'Mole Removal', price: 200 },
      { id: 'service-11', name: 'Acne Treatment', price: 150 },
      { id: 'service-12', name: 'Skin Cancer Screening', price: 180 }
    ]
  },
  {
    id: 'doc-4',
    name: 'Dr. Daniel Lee',
    photoUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
    specialty: 'Pediatrics',
    rating: 4.6,
    bio: 'Dr. Daniel Lee is a dedicated pediatrician with a passion for children\'s health. He provides comprehensive care for infants, children, and adolescents, focusing on preventive medicine and early intervention.',
    services: [
      { id: 'service-13', name: 'Well Child Visit', price: 90 },
      { id: 'service-14', name: 'Vaccination', price: 60 },
      { id: 'service-15', name: 'Sick Child Visit', price: 110 },
      { id: 'service-16', name: 'Developmental Assessment', price: 130 }
    ]
  },
  {
    id: 'doc-5',
    name: 'Dr. Eva Martinez',
    photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
    specialty: 'Neurology',
    rating: 5.0,
    bio: 'Dr. Eva Martinez is a leading neurologist with expertise in treating complex neurological disorders. She specializes in stroke treatment, epilepsy management, and neurodegenerative diseases.',
    services: [
      { id: 'service-17', name: 'Neurological Consultation', price: 200 },
      { id: 'service-18', name: 'EEG Test', price: 350 },
      { id: 'service-19', name: 'MRI Interpretation', price: 400 },
      { id: 'service-20', name: 'Stroke Assessment', price: 250 }
    ]
  }
];

export async function GET(
  request: NextRequest,
  { params }: { params: { doctorId: string } }
) {
  try {
    const { doctorId } = params;
    
    const doctor = doctors.find(doc => doc.id === doctorId);
    
    if (!doctor) {
      return NextResponse.json(
        { error: 'Doctor not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(doctor);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 