import { Star, Calendar, Clock, Wallet, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Types for the doctor data
type Service = {
  id: string;
  name: string;
  price: number;
};

type Doctor = {
  id: string;
  name: string;
  photoUrl: string;
  specialty: string;
  rating: number;
  bio: string;
  services: Service[];
};

// Mock data for demonstration (in real app, this would come from API)
const mockDoctor: Doctor = {
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
};

// Function to get doctor data based on doctorId
function getDoctorData(doctorId: string): Doctor {
  const mockDoctors: Record<string, Doctor> = {
    'doc-1': {
      id: 'doc-1',
      name: 'Dr. Alice Johnson',
      photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
      specialty: 'Cardiology',
      rating: 4.9,
      bio: 'Dr. Alice Johnson is a board-certified cardiologist with over 15 years of experience.',
      services: [
        { id: 'service-1', name: 'Cardiac Consultation', price: 2500 },
        { id: 'service-2', name: 'Echocardiogram', price: 3500 },
        { id: 'service-3', name: 'Stress Test', price: 2800 },
        { id: 'service-4', name: 'Cardiac Catheterization', price: 6500 }
      ]
    },
    'doc-2': {
      id: 'doc-2',
      name: 'Dr. Bob Smith',
      photoUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
      specialty: 'Dentistry',
      rating: 4.7,
      bio: 'Dr. Bob Smith is a highly skilled dentist with expertise in cosmetic dentistry and oral surgery.',
      services: [
        { id: 'service-5', name: 'Dental Checkup', price: 1800 },
        { id: 'service-6', name: 'Teeth Cleaning', price: 2200 },
        { id: 'service-7', name: 'Crown Placement', price: 4800 },
        { id: 'service-8', name: 'Root Canal', price: 3800 }
      ]
    },
    'doc-3': {
      id: 'doc-3',
      name: 'Dr. Carla Gomez',
      photoUrl: 'https://images.unsplash.com/photo-1594824475050-7da46b84c6e8?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
      specialty: 'Dermatology',
      rating: 4.8,
      bio: 'Dr. Carla Gomez is a renowned dermatologist specializing in medical and cosmetic dermatology.',
      services: [
        { id: 'service-9', name: 'Skin Consultation', price: 2000 },
        { id: 'service-10', name: 'Mole Removal', price: 3200 },
        { id: 'service-11', name: 'Acne Treatment', price: 2500 },
        { id: 'service-12', name: 'Skin Cancer Screening', price: 2800 }
      ]
    },
    'doc-4': {
      id: 'doc-4',
      name: 'Dr. Daniel Lee',
      photoUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
      specialty: 'Pediatrics',
      rating: 4.6,
      bio: 'Dr. Daniel Lee is a dedicated pediatrician with a passion for children\'s health.',
      services: [
        { id: 'service-13', name: 'Well Child Visit', price: 1900 },
        { id: 'service-14', name: 'Vaccination', price: 1600 },
        { id: 'service-15', name: 'Sick Child Visit', price: 2100 },
        { id: 'service-16', name: 'Developmental Assessment', price: 2300 }
      ]
    },
    'doc-5': {
      id: 'doc-5',
      name: 'Dr. Eva Martinez',
      photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
      specialty: 'Neurology',
      rating: 5.0,
      bio: 'Dr. Eva Martinez is a leading neurologist with expertise in treating complex neurological disorders.',
      services: [
        { id: 'service-17', name: 'Neurological Consultation', price: 3000 },
        { id: 'service-18', name: 'EEG Test', price: 4500 },
        { id: 'service-19', name: 'MRI Interpretation', price: 5200 },
        { id: 'service-20', name: 'Stroke Assessment', price: 3500 }
      ]
    }
  };
  
  const doctor = mockDoctors[doctorId];
  if (!doctor) {
    throw new Error(`Doctor with ID ${doctorId} not found`);
  }
  
  return doctor;
}

// Booking steps component
function BookingSteps() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Process</h3>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">1. Schedule Appointment</p>
            <p className="text-sm text-gray-500">Choose date and time</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">2. Confirm Selection</p>
            <p className="text-sm text-gray-500">Review service & slot</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <Wallet className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">3. Connect Wallet</p>
            <p className="text-sm text-gray-500">Trigger wallet modal</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">4. Hold Money (50% Escrow)</p>
            <p className="text-sm text-gray-500">Smart contract call</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">5. ✅ Successful Transaction</p>
            <p className="text-sm text-gray-500">Summary with tx hash</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function DoctorDetailPage({ 
  params 
}: { 
  params: { doctorId: string } 
}) {
  const doctor = getDoctorData(params.doctorId);

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/patient/top-doctors"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
        >
          ← Back to Top Doctors
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Doctor Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Doctor Info Card */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Doctor Photo */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
                  <Image
                    src={doctor.photoUrl}
                    alt={doctor.name}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Doctor Details */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{doctor.name}</h2>
                
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {doctor.specialty}
                  </span>
                </div>
                
                <div className="flex items-center gap-1 mb-3">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-medium text-gray-900">{doctor.rating}</span>
                  <span className="text-gray-500">/ 5.0</span>
                </div>
                
                <p className="text-gray-600 leading-relaxed">{doctor.bio}</p>
              </div>
            </div>
          </div>

          {/* Services Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Available Services</h3>
            <div className="grid gap-4">
              {doctor.services.map((service) => (
                <div 
                  key={service.id} 
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                >
                  <div>
                    <h4 className="font-medium text-gray-900" style={{
                      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, Helvetica, sans-serif',
                      WebkitFontSmoothing: 'antialiased',
                      MozOsxFontSmoothing: 'grayscale'
                    }}>{service.name}</h4>
                    <p className="text-2xl font-bold text-blue-600" style={{
                      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, Helvetica, sans-serif',
                      fontWeight: '700',
                      WebkitFontSmoothing: 'antialiased',
                      MozOsxFontSmoothing: 'grayscale',
                      textRendering: 'optimizeLegibility'
                    }}>${service.price}</p>
                  </div>
                  <Link
                    href={`/patient/top-doctors/${doctor.id}/${service.id}`}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Set Appointment
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Booking Steps */}
          <BookingSteps />
          
          {/* Quick Info */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Info</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">Available 24/7</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">Next available: Today</span>
              </div>
              <div className="flex items-center gap-3">
                <Wallet className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">Crypto payments accepted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 