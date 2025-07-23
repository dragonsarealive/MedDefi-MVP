'use client';

import { Calendar, User, Star, Stethoscope, Brain, Baby, HeartPulse, Users, Shield, Search, MessageCircle, UserCheck, LogOut, Copy, Eye, Bone, Pill, Activity, Zap, Droplets, Thermometer, Microscope } from 'lucide-react';
import Image from 'next/image';
import { CalendarDemo } from '@/components/dashboard/CalendarDemo';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { shortenAddress } from '@/lib/utils';

const specialties = [
  { label: 'Cardiology', icon: <HeartPulse className="w-5 h-5" /> },
  { label: 'Dentistry', icon: <Stethoscope className="w-5 h-5" /> },
  { label: 'Dermatology', icon: <Shield className="w-5 h-5" /> },
  { label: 'Pediatrics', icon: <Baby className="w-5 h-5" /> },
  { label: 'General', icon: <User className="w-5 h-5" /> },
  { label: 'Neurology', icon: <Brain className="w-5 h-5" /> },
  { label: 'Orthopedics', icon: <Bone className="w-5 h-5" /> },
  { label: 'Gynecology', icon: <Stethoscope className="w-5 h-5" /> },
  { label: 'Ophthalmology', icon: <Eye className="w-5 h-5" /> },
  { label: 'Psychiatry', icon: <Brain className="w-5 h-5" /> },
  { label: 'Oncology', icon: <Activity className="w-5 h-5" /> },
  { label: 'Endocrinology', icon: <Zap className="w-5 h-5" /> },
  { label: 'Gastroenterology', icon: <Stethoscope className="w-5 h-5" /> },
  { label: 'Urology', icon: <Droplets className="w-5 h-5" /> },
  { label: 'Pulmonology', icon: <Thermometer className="w-5 h-5" /> },
  { label: 'Rheumatology', icon: <Bone className="w-5 h-5" /> },
  { label: 'Pathology', icon: <Microscope className="w-5 h-5" /> },
  { label: 'Pharmacology', icon: <Pill className="w-5 h-5" /> },
  { label: 'Emergency Medicine', icon: <Activity className="w-5 h-5" /> },
  { label: 'Anesthesiology', icon: <Zap className="w-5 h-5" /> },
  { label: 'Radiology', icon: <Eye className="w-5 h-5" /> },
  { label: 'Nephrology', icon: <Droplets className="w-5 h-5" /> },
  { label: 'Hematology', icon: <Activity className="w-5 h-5" /> },
  { label: 'Infectious Disease', icon: <Microscope className="w-5 h-5" /> },
];

const appointments = [
  { name: 'Dr. John Smith', date: '22 May 2025, 08:00 am', type: 'Consultation', price: 2500 },
  { name: 'Dr. Maria Garcia', date: '23 May 2025, 02:00 pm', type: 'Check-up', price: 4500 },
  { name: 'Dr. Frank Heller', date: '24 May 2025, 10:00 am', type: 'Surgery', price: 3800 },
];

const recentConsultations = [
  { initials: 'JS', name: 'Dr. John Smith', specialty: 'Neurologist', rating: 4.9, date: '22 May 2025, 08:00 am' },
  { initials: 'FH', name: 'Dr. Frank Heller', specialty: 'Cardiologist', rating: 4.8, date: '10 May 2025, 02:00 pm' },
  { initials: 'MF', name: 'Dr. Maria Flores', specialty: 'Dentist', rating: 4.7, date: '8 May 2025, 08:00 am' },
];

export default function DashboardPage() {
  const { user, isLoading, setUser, getAppointments } = useUser();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  // Mock Starknet address (replace with user.address if available)
  const starknetAddress = user && user.address ? user.address : '0x04a3...b7e9';
  const shortenedAddress = shortenAddress(starknetAddress);
  
  // Get actual appointments from user context
  const userAppointments = getAppointments();
  const upcomingAppointments = userAppointments.filter(apt => 
    new Date(apt.date) >= new Date() && apt.status !== 'cancelled'
  ).slice(0, 3); // Show only first 3 upcoming appointments
  
  const handleCopy = () => {
    navigator.clipboard.writeText(starknetAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const handleLogout = () => {
    setUser(null);
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Sign Up</h2>
          <p className="text-gray-600">You need to create an account to access the dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Book Appointment Banner */}
        <div className="bg-gradient-to-r from-white to-blue-50 rounded-2xl p-6 flex items-center justify-between shadow border border-blue-100">
          <div>
            <div className="text-gray-800 text-lg font-semibold mb-1">Book an Appointment Now</div>
            <div className="text-gray-600 text-sm mb-3">Find and schedule consultations with top doctors in your area</div>
            <button 
              onClick={() => router.push('/patient/top-doctors')}
              className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-full shadow hover:bg-blue-700 transition"
            >
              Book Now
            </button>
          </div>
          <div className="hidden md:block">
            <Image src="/images/2149355015.jpg" alt="Doctors" width={144} height={144} className="rounded-full object-cover border-4 border-blue-200 w-36 h-36" />
          </div>
        </div>

        {/* Medical Specialties */}
        <div className="bg-white rounded-2xl p-6 shadow flex flex-col gap-4">
          <div className="text-lg font-semibold text-gray-800 mb-2">Medical Specialties</div>
          <div className="flex flex-wrap gap-3">
            {specialties.slice(0, 15).map((s, i) => (
              <button key={s.label} className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full font-medium shadow-sm">
                {s.icon}
                <span>{s.label}</span>
              </button>
            ))}
          </div>
          <div className="flex justify-center mt-2">
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm underline">
              See More
            </button>
          </div>
        </div>

        {/* Appointments */}
        <div className="bg-white rounded-2xl p-6 shadow flex flex-col gap-4">
          <div className="text-lg font-semibold text-gray-800 mb-2">Your Appointments</div>
          <div className="flex gap-2 mb-4">
            <button className="px-4 py-1 rounded-full bg-blue-600 text-white font-medium">Upcoming</button>
            <button className="px-4 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">Past</button>
          </div>
          <div className="flex flex-col gap-3">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between bg-blue-50 rounded-xl px-4 py-3 shadow-sm">
                  <div>
                    <div className="font-semibold text-blue-900">{appointment.doctorName}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(appointment.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })} • {appointment.time}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium" style={{
                      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, Helvetica, sans-serif',
                      WebkitFontSmoothing: 'antialiased',
                      MozOsxFontSmoothing: 'grayscale'
                    }}>{appointment.serviceName}</span>
                    <button className="text-blue-600 hover:underline font-medium text-sm" style={{
                      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, Helvetica, sans-serif',
                      WebkitFontSmoothing: 'antialiased',
                      MozOsxFontSmoothing: 'grayscale'
                    }}>View</button>
                    <button className="text-red-500 hover:underline font-medium text-sm" style={{
                      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, Helvetica, sans-serif',
                      WebkitFontSmoothing: 'antialiased',
                      MozOsxFontSmoothing: 'grayscale'
                    }}>Cancel</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-sm mb-2">No upcoming appointments</div>
                <button 
                  onClick={() => router.push('/patient/top-doctors')}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm underline"
                >
                  Book your first appointment
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-full lg:w-80 flex flex-col gap-6">
        {/* User Info Card */}
        <div className="bg-white rounded-2xl p-6 shadow flex items-center gap-4">
          <div className="flex-1">
            <div className="text-blue-700 font-bold">{user.firstName} {user.lastName}</div>
            <div className="text-xs text-gray-500">ID: {user.id}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-500 font-semibold">Address:</span>
              <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded text-gray-900">{shortenedAddress}</span>
              <button onClick={handleCopy} className="ml-1 p-1 rounded hover:bg-blue-100 transition flex-shrink-0" title="Copy address">
                <Copy className="w-4 h-4 text-blue-600" />
              </button>
              {copied && <span className="text-green-600 text-xs ml-1">Copied!</span>}
            </div>
            <div className="flex items-center gap-2 mt-2">
              {user.role === 'doctor' ? (
                <UserCheck className="w-4 h-4 text-green-600" />
              ) : (
                <User className="w-4 h-4 text-blue-600" />
              )}
              <span className={`text-xs font-medium ${
                user.role === 'doctor' ? 'text-green-600' : 'text-blue-600'
              }`}>
                You are registered as a {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700">
            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
          </div>
        </div>
        
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-4 py-2 rounded-full shadow transition"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
        
        {/* Calendar */}
        <div className="bg-white rounded-2xl p-6 shadow">
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold text-gray-800">Calendar</div>
          </div>
          <div className="flex justify-center">
            <CalendarDemo />
          </div>
        </div>
        {/* Recent Consultations */}
        <div className="bg-white rounded-2xl p-6 shadow flex flex-col gap-4">
          <div className="font-semibold text-gray-800 mb-2">Recent Consultations</div>
          <div className="flex flex-col gap-3">
            {recentConsultations.map((c, i) => (
              <div key={c.name} className="flex items-center gap-3 bg-blue-50 rounded-xl p-3">
                <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center font-bold text-blue-700 text-lg">{c.initials}</div>
                <div className="flex-1">
                  <div className="font-semibold text-blue-900 text-sm">{c.name}</div>
                  <div className="text-xs text-gray-500">{c.specialty}</div>
                  <div className="flex items-center gap-1 text-xs text-yellow-500">
                    <Star className="w-3 h-3" />
                    <span>{c.rating}</span>
                  </div>
                  <div className="text-xs text-blue-600 font-medium mt-1">{c.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 