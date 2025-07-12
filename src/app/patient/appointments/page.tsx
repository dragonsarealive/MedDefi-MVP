'use client';

import { useState } from 'react';
import Tabs from '@/components/dashboard/Appointments/Tabs';
import AppointmentList from '@/components/dashboard/Appointments/AppointmentList';
import { HeartPulse, Stethoscope, Brain, User } from 'lucide-react';

const upcomingAppointments = [
  {
    doctor: 'Dr. Alice Johnson',
    specialty: 'General',
    specialtyColor: 'bg-blue-100 text-blue-700',
    specialtyIcon: <User className="w-4 h-4" />,
    date: '2024-07-10',
    time: '09:00 AM',
    price: 50,
  },
  {
    doctor: 'Dr. Bob Smith',
    specialty: 'Cardiology',
    specialtyColor: 'bg-red-100 text-red-700',
    specialtyIcon: <HeartPulse className="w-4 h-4" />,
    date: '2024-07-15',
    time: '02:00 PM',
    price: 75,
  },
];

const pastAppointments = [
  {
    doctor: 'Dr. Carla Gomez',
    specialty: 'Dentistry',
    specialtyColor: 'bg-green-100 text-green-700',
    specialtyIcon: <Stethoscope className="w-4 h-4" />,
    date: '2024-06-01',
    time: '10:00 AM',
    price: 60,
  },
  {
    doctor: 'Dr. Daniel Lee',
    specialty: 'Neurology',
    specialtyColor: 'bg-purple-100 text-purple-700',
    specialtyIcon: <Brain className="w-4 h-4" />,
    date: '2024-05-20',
    time: '11:30 AM',
    price: 80,
  },
];

export default function AppointmentsPage() {
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');

  return (
    <div className="max-w-3xl mx-auto py-8 px-2 sm:px-4">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">Appointments</h1>
      <Tabs selected={tab} onTabChange={setTab} />
      <AppointmentList appointments={tab === 'upcoming' ? upcomingAppointments : pastAppointments} />
    </div>
  );
} 