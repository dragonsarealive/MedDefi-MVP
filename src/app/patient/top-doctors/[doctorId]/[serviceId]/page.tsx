'use client';

import { useState } from 'react';
import { Star, Calendar, Clock, Wallet, CheckCircle, AlertCircle, ArrowLeft, CreditCard, Shield } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Types
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

type BookingStep = 'schedule' | 'confirm' | 'wallet' | 'escrow' | 'success';

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
        { id: 'service-1', name: 'Cardiac Consultation', price: 150 },
        { id: 'service-2', name: 'Echocardiogram', price: 300 },
        { id: 'service-3', name: 'Stress Test', price: 250 },
        { id: 'service-4', name: 'Cardiac Catheterization', price: 1200 }
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
        { id: 'service-5', name: 'Dental Checkup', price: 80 },
        { id: 'service-6', name: 'Teeth Cleaning', price: 120 },
        { id: 'service-7', name: 'Crown Placement', price: 800 },
        { id: 'service-8', name: 'Root Canal', price: 600 }
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
        { id: 'service-9', name: 'Skin Consultation', price: 100 },
        { id: 'service-10', name: 'Mole Removal', price: 200 },
        { id: 'service-11', name: 'Acne Treatment', price: 150 },
        { id: 'service-12', name: 'Skin Cancer Screening', price: 180 }
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
        { id: 'service-13', name: 'Well Child Visit', price: 90 },
        { id: 'service-14', name: 'Vaccination', price: 60 },
        { id: 'service-15', name: 'Sick Child Visit', price: 110 },
        { id: 'service-16', name: 'Developmental Assessment', price: 130 }
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
        { id: 'service-17', name: 'Neurological Consultation', price: 200 },
        { id: 'service-18', name: 'EEG Test', price: 350 },
        { id: 'service-19', name: 'MRI Interpretation', price: 400 },
        { id: 'service-20', name: 'Stroke Assessment', price: 250 }
      ]
    }
  };
  
  const doctor = mockDoctors[doctorId];
  if (!doctor) {
    throw new Error(`Doctor with ID ${doctorId} not found`);
  }
  
  return doctor;
}

// Available time slots
const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
];

// Available dates (next 7 days)
const getAvailableDates = () => {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    dates.push(date);
  }
  return dates;
};

export default function AppointmentBookingPage({ 
  params 
}: { 
  params: { doctorId: string; serviceId: string } 
}) {
  const [currentStep, setCurrentStep] = useState<BookingStep>('schedule');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const doctor = getDoctorData(params.doctorId);
  const service = doctor.services.find(s => s.id === params.serviceId);
  const availableDates = getAvailableDates();

  if (!service) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h1>
          <Link href={`/patient/top-doctors/${params.doctorId}`} className="text-blue-600 hover:text-blue-700">
            ← Back to Doctor Profile
          </Link>
        </div>
      </div>
    );
  }

  const handleScheduleAppointment = () => {
    if (selectedDate && selectedTime) {
      setCurrentStep('confirm');
    }
  };

  const handleConfirmBooking = () => {
    setCurrentStep('wallet');
  };

  const handleConnectWallet = () => {
    setIsLoading(true);
    // Simulate wallet connection
    setTimeout(() => {
      setIsWalletConnected(true);
      setIsLoading(false);
      setCurrentStep('escrow');
    }, 2000);
  };

  const handleEscrowPayment = () => {
    setIsLoading(true);
    // Simulate smart contract call
    setTimeout(() => {
      setTransactionHash('0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef');
      setIsLoading(false);
      setCurrentStep('success');
    }, 3000);
  };

  const renderScheduleStep = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Date</h3>
        <div className="grid grid-cols-7 gap-2">
          {availableDates.map((date) => (
            <button
              key={date.toISOString()}
              onClick={() => setSelectedDate(date)}
              className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                selectedDate?.toDateString() === date.toDateString()
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-xs text-gray-500">
                {date.toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div>{date.getDate()}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Time</h3>
        <div className="grid grid-cols-4 gap-3">
          {timeSlots.map((time) => (
            <button
              key={time}
              onClick={() => setSelectedTime(time)}
              className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                selectedTime === time
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleScheduleAppointment}
        disabled={!selectedDate || !selectedTime}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        Continue to Confirmation
      </button>
    </div>
  );

  const renderConfirmStep = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Your Appointment</h3>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
              <Image
                src={doctor.photoUrl}
                alt={doctor.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{doctor.name}</h4>
              <p className="text-gray-600">{doctor.specialty}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-2">Service</h5>
              <p className="text-gray-600">{service.name}</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-2">Date & Time</h5>
              <p className="text-gray-600">
                {selectedDate?.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <p className="text-gray-600">{selectedTime}</p>
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">Total Amount:</span>
              <span className="text-2xl font-bold text-blue-600">${service.price}</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">50% will be held in escrow</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setCurrentStep('schedule')}
          className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleConfirmBooking}
          className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Confirm & Connect Wallet
        </button>
      </div>
    </div>
  );

  const renderWalletStep = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Wallet className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect Your Wallet</h3>
        <p className="text-gray-600 mb-6">
          Connect your cryptocurrency wallet to proceed with the payment
        </p>
        
        <button
          onClick={handleConnectWallet}
          disabled={isLoading}
          className="bg-blue-600 text-white py-3 px-8 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Connecting...' : 'Connect Wallet'}
        </button>
      </div>
    </div>
  );

  const renderEscrowStep = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border text-center">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-yellow-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Escrow Payment</h3>
        <p className="text-gray-600 mb-4">
          We'll hold 50% of the payment in escrow until your appointment is completed
        </p>
        
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-900">Amount to hold in escrow:</span>
            <span className="text-xl font-bold text-blue-600">${service.price * 0.5}</span>
          </div>
        </div>
        
        <button
          onClick={handleEscrowPayment}
          disabled={isLoading}
          className="bg-green-600 text-white py-3 px-8 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Processing Payment...' : 'Confirm Escrow Payment'}
        </button>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Successful!</h3>
        <p className="text-gray-600 mb-6">
          Your appointment has been confirmed and payment has been processed
        </p>
        
        <div className="bg-green-50 rounded-lg p-4 mb-6 text-left">
          <h4 className="font-medium text-gray-900 mb-2">Appointment Details:</h4>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Doctor:</span> {doctor.name}</p>
            <p><span className="font-medium">Service:</span> {service.name}</p>
            <p><span className="font-medium">Date:</span> {selectedDate?.toLocaleDateString()}</p>
            <p><span className="font-medium">Time:</span> {selectedTime}</p>
            <p><span className="font-medium">Amount:</span> ${service.price}</p>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <h4 className="font-medium text-gray-900 mb-2">Transaction Hash:</h4>
          <p className="text-sm font-mono text-gray-600 break-all">{transactionHash}</p>
        </div>
        
        <Link
          href="/patient/appointments"
          className="inline-block bg-blue-600 text-white py-3 px-8 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          View My Appointments
        </Link>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'schedule':
        return renderScheduleStep();
      case 'confirm':
        return renderConfirmStep();
      case 'wallet':
        return renderWalletStep();
      case 'escrow':
        return renderEscrowStep();
      case 'success':
        return renderSuccessStep();
      default:
        return renderScheduleStep();
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href={`/patient/top-doctors/${params.doctorId}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Doctor Profile
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Book Appointment</h1>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {['schedule', 'confirm', 'wallet', 'escrow', 'success'].map((step, index) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === step 
                  ? 'bg-blue-600 text-white' 
                  : index < ['schedule', 'confirm', 'wallet', 'escrow', 'success'].indexOf(currentStep)
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {index + 1}
              </div>
              {index < 4 && (
                <div className={`w-16 h-1 mx-2 ${
                  index < ['schedule', 'confirm', 'wallet', 'escrow', 'success'].indexOf(currentStep)
                    ? 'bg-green-500'
                    : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>Schedule</span>
          <span>Confirm</span>
          <span>Wallet</span>
          <span>Escrow</span>
          <span>Success</span>
        </div>
      </div>

      {/* Main Content */}
      {renderCurrentStep()}
    </div>
  );
} 