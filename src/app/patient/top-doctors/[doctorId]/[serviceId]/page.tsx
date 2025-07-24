'use client';

import { useState } from 'react';
import { Star, Calendar, Clock, Wallet, CheckCircle, AlertCircle, ArrowLeft, CreditCard, Shield } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '@/contexts/UserContext';
import { shortenAddress } from '@/lib/utils';
import { createAppointment } from '@/utils/api/appointments';
import { createPurchase } from '@/utils/api/purchases';

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
type PaymentMethod = 'wallet' | 'credit-card';

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
  const { addAppointment } = useUser();
  const [currentStep, setCurrentStep] = useState<BookingStep>('schedule');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [transactionHash, setTransactionHash] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('wallet');

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
    if (paymentMethod === 'credit-card') {
      // Skip wallet step and go directly to escrow for credit card
      setCurrentStep('escrow');
    } else {
      setCurrentStep('wallet');
    }
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
    // Simulate smart contract call or credit card payment
    setTimeout(() => {
      const newTransactionHash = paymentMethod === 'credit-card' 
        ? 'CC-' + Math.random().toString(36).substr(2, 9).toUpperCase()
        : '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
      setTransactionHash(newTransactionHash);
      setIsLoading(false);
      setCurrentStep('success');
      
      // TODO - Create purchase - Replace buyer_user_id with actual user ID
      var purchaseResponse = createPurchase({
        service_id: service.id,
        buyer_user_id: "leaindividual"
      });


      console.log("Purchase response:", purchaseResponse);
      
      // Add appointment to user's appointments
      if (selectedDate && selectedTime) {
        addAppointment({
          doctorName: doctor.name,
          doctorId: doctor.id,
          serviceName: service.name,
          serviceId: service.id,
          date: selectedDate.toISOString().split('T')[0],
          time: selectedTime,
          price: service.price,
          status: 'confirmed',
          transactionHash: newTransactionHash,
        });
        // TODO: Remove harcoded values and replace with actual IDs
        createAppointment({
          patient_id: 1, // Replace with actual patient ID
          //doctor_id: doctor.id,
          doctor_id: 1,
          clinic_id: 1, // Replace with actual clinic ID if applicable
          appointment_date: selectedDate,
          start_time: selectedTime,
          end_time: '01:00 PM', // Example end time, adjust as needed
          status: 'confirmed',
          reason: 'Initial consultation',
          notes: doctor.name + ' - Appointment booking for' + service.name,
          created_at: new Date(),
          updated_at: new Date()
        })

      }
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
              className={`p-3 rounded-lg border text-sm font-semibold transition-colors ${
                selectedDate?.toDateString() === date.toDateString()
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-800'
              }`}
              style={{
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, Helvetica, sans-serif',
                fontWeight: '600',
                fontSize: '14px',
                lineHeight: '1.2',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                textRendering: 'optimizeLegibility',
                fontFeatureSettings: '"liga" 1, "kern" 1'
              }}
            >
              <div className="text-xs text-gray-500 font-medium" style={{
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, Helvetica, sans-serif',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale'
              }}>
                {date.toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div className="font-bold" style={{
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, Helvetica, sans-serif',
                fontWeight: '700',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale'
              }}>{date.getDate()}</div>
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
              className={`p-3 rounded-lg border text-sm font-semibold transition-colors ${
                selectedTime === time
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-800'
              }`}
              style={{
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, Helvetica, sans-serif',
                fontWeight: '600',
                fontSize: '14px',
                lineHeight: '1.2',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                textRendering: 'optimizeLegibility',
                fontFeatureSettings: '"liga" 1, "kern" 1'
              }}
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

          {/* Payment Method Selection */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <h5 className="font-medium text-gray-900 mb-3">Payment Method</h5>
            <div className="space-y-3">
              <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="wallet"
                  checked={paymentMethod === 'wallet'}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <div className="ml-3 flex items-center">
                  <Wallet className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="font-medium text-gray-900">Crypto Wallet</span>
                </div>
              </label>
              
              <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="credit-card"
                  checked={paymentMethod === 'credit-card'}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <div className="ml-3 flex items-center">
                  <CreditCard className="w-5 h-5 text-green-600 mr-2" />
                  <span className="font-medium text-gray-900">Credit Card</span>
                </div>
              </label>
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900" style={{
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, Helvetica, sans-serif',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale'
              }}>Total Amount:</span>
              <span className="text-2xl font-bold text-blue-600" style={{
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, Helvetica, sans-serif',
                fontWeight: '700',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
                textRendering: 'optimizeLegibility'
              }}>${service.price}</span>
            </div>
            <p className="text-sm text-gray-600 mt-1" style={{
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, Helvetica, sans-serif',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale'
            }}>50% will be held in escrow</p>
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
          Confirm & Checkout
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
          {paymentMethod === 'credit-card' ? (
            <CreditCard className="w-8 h-8 text-green-600" />
          ) : (
            <Shield className="w-8 h-8 text-yellow-600" />
          )}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {paymentMethod === 'credit-card' ? 'Credit Card Payment' : 'Escrow Payment'}
        </h3>
        <p className="text-gray-600 mb-4">
          {paymentMethod === 'credit-card' 
            ? 'Complete your payment with your credit card. 50% will be held in escrow until your appointment is completed.'
            : 'We\'ll hold 50% of the payment in escrow until your appointment is completed'
          }
        </p>
        
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-900" style={{
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, Helvetica, sans-serif',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale'
            }}>
              {paymentMethod === 'credit-card' ? 'Total Amount:' : 'Amount to hold in escrow:'}
            </span>
            <span className="text-xl font-bold text-blue-600" style={{
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, Helvetica, sans-serif',
              fontWeight: '700',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              textRendering: 'optimizeLegibility'
            }}>
              ${paymentMethod === 'credit-card' ? service.price : service.price * 0.5}
            </span>
          </div>
        </div>

        {/* Credit Card Form */}
        {paymentMethod === 'credit-card' && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
            <h4 className="font-medium text-gray-900 mb-4">Credit Card Information</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  style={{
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, Helvetica, sans-serif',
                    fontSize: '14px',
                    color: '#374151',
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale'
                  }}
                  maxLength={19}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    style={{
                      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, Helvetica, sans-serif',
                      fontSize: '14px',
                      color: '#374151',
                      WebkitFontSmoothing: 'antialiased',
                      MozOsxFontSmoothing: 'grayscale'
                    }}
                    maxLength={5}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    style={{
                      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, Helvetica, sans-serif',
                      fontSize: '14px',
                      color: '#374151',
                      WebkitFontSmoothing: 'antialiased',
                      MozOsxFontSmoothing: 'grayscale'
                    }}
                    maxLength={4}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  style={{
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, Helvetica, sans-serif',
                    fontSize: '14px',
                    color: '#374151',
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale'
                  }}
                />
              </div>
            </div>
          </div>
        )}
        
        <button
          onClick={handleEscrowPayment}
          disabled={isLoading}
          className="bg-green-600 text-white py-3 px-8 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading 
            ? 'Processing Payment...' 
            : paymentMethod === 'credit-card' 
              ? 'Pay with Credit Card' 
              : 'Confirm Escrow Payment'
          }
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
        <h3 className="text-lg font-semibold text-gray-900 mb-2" style={{
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, Helvetica, sans-serif',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          color: '#1f2937'
        }}>Payment Successful!</h3>
        <p className="text-gray-600 mb-6" style={{
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, Helvetica, sans-serif',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          color: '#4b5563'
        }}>
          Your appointment has been confirmed and payment has been processed
        </p>
        
        <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
          <h4 className="font-medium text-gray-900 mb-2" style={{
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, Helvetica, sans-serif',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            color: '#1f2937'
          }}>Appointment Details:</h4>
          <div className="space-y-2 text-sm">
            <p style={{
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, Helvetica, sans-serif',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              color: '#374151'
            }}><span className="font-medium" style={{color: '#1f2937'}}>Doctor:</span> {doctor.name}</p>
            <p style={{
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, Helvetica, sans-serif',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              color: '#374151'
            }}><span className="font-medium" style={{color: '#1f2937'}}>Service:</span> {service.name}</p>
            <p style={{
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, Helvetica, sans-serif',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              color: '#374151'
            }}><span className="font-medium" style={{color: '#1f2937'}}>Date:</span> {selectedDate?.toLocaleDateString()}</p>
            <p style={{
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, Helvetica, sans-serif',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              color: '#374151'
            }}><span className="font-medium" style={{color: '#1f2937'}}>Time:</span> {selectedTime}</p>
            <p style={{
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, Helvetica, sans-serif',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              color: '#374151'
            }}><span className="font-medium" style={{color: '#1f2937'}}>Amount:</span> <span style={{
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, Helvetica, sans-serif',
              fontWeight: '700',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              textRendering: 'optimizeLegibility',
              color: '#2563eb'
            }}>${service.price}</span></p>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <h4 className="font-medium text-gray-900 mb-2" style={{
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, Helvetica, sans-serif',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            color: '#1f2937'
          }}>
            {paymentMethod === 'credit-card' ? 'Transaction ID:' : 'Transaction Hash:'}
          </h4>
          <p className="text-sm font-mono text-gray-600 break-all" style={{
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, Helvetica, sans-serif',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            color: '#4b5563'
          }}>
            {paymentMethod === 'credit-card' ? transactionHash : shortenAddress(transactionHash)}
          </p>
        </div>
        
        <Link
          href="/patient/appointments"
          className="inline-block bg-blue-600 text-white py-3 px-8 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          style={{
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, Helvetica, sans-serif',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            color: '#ffffff'
          }}
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
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  currentStep === step 
                    ? 'bg-blue-600 text-white' 
                    : index < ['schedule', 'confirm', 'wallet', 'escrow', 'success'].indexOf(currentStep)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
                style={{
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, Helvetica, sans-serif',
                  fontWeight: '700',
                  fontSize: '14px',
                  lineHeight: '1',
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                  textRendering: 'optimizeLegibility',
                  fontFeatureSettings: '"liga" 1, "kern" 1'
                }}
              >
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
          <span style={{
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, Helvetica, sans-serif',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale'
          }}>Schedule</span>
          <span style={{
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, Helvetica, sans-serif',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale'
          }}>Confirm</span>
          <span style={{
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, Helvetica, sans-serif',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale'
          }}>Wallet</span>
          <span style={{
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, Helvetica, sans-serif',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale'
          }}>Escrow</span>
          <span style={{
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, Helvetica, sans-serif',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale'
          }}>Success</span>
        </div>
      </div>

      {/* Alternative SVG-based numbers (uncomment if font issues persist):
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {['schedule', 'confirm', 'wallet', 'escrow', 'success'].map((step, index) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === step 
                  ? 'bg-blue-600' 
                  : index < ['schedule', 'confirm', 'wallet', 'escrow', 'success'].indexOf(currentStep)
                  ? 'bg-green-500'
                  : 'bg-gray-200'
              }`}>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <text x="12" y="16" textAnchor="middle" className="text-sm font-bold" fill="currentColor">
                    {index + 1}
                  </text>
                </svg>
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
      */}

      {/* Guaranteed SVG-based numbers (uncomment this section and comment out the above progress steps if issues persist) */}
      {/* 
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {['schedule', 'confirm', 'wallet', 'escrow', 'success'].map((step, index) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === step 
                  ? 'bg-blue-600 text-white' 
                  : index < ['schedule', 'confirm', 'wallet', 'escrow', 'success'].indexOf(currentStep)
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}>
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 16 16" 
                  fill="currentColor"
                  style={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}
                >
                  <text 
                    x="8" 
                    y="12" 
                    textAnchor="middle" 
                    fontSize="12" 
                    fill="currentColor"
                    style={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}
                  >
                    {index + 1}
                  </text>
                </svg>
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
      */}

      {/* Main Content */}
      {renderCurrentStep()}
    </div>
  );
}