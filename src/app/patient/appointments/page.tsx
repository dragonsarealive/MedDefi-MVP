'use client';

import { useState } from 'react';
import Tabs from '@/components/dashboard/Appointments/Tabs';

import { HeartPulse, Stethoscope, Brain, User } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

export default function AppointmentsPage() {
  const { getAppointments } = useUser();
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');

  // Get actual appointments from user context
  const userAppointments = getAppointments();
  
  // Filter appointments based on tab
  const upcomingAppointments = userAppointments.filter(apt => 
    new Date(apt.date) >= new Date() && apt.status !== 'cancelled'
  );
  
  const pastAppointments = userAppointments.filter(apt => 
    new Date(apt.date) < new Date() || apt.status === 'cancelled'
  );

  // Convert to the format expected by AppointmentList component
  const formatAppointments = (appointments: any[]) => {
    return appointments.map(apt => ({
      doctor: apt.doctorName,
      specialty: apt.serviceName,
      specialtyColor: 'bg-blue-100 text-blue-700',
      specialtyIcon: <User className="w-4 h-4" />,
      date: apt.date,
      time: apt.time,
      price: apt.price,
    }));
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-2 sm:px-4">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">Appointments</h1>
      <Tabs selected={tab} onTabChange={setTab} />
              <div className="p-8 text-center text-gray-500 border rounded-md">
          <User className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Appointments feature coming soon</h3>
          <p>Complete appointment management will be available in the next release</p>
        </div>
    </div>
  );
} 