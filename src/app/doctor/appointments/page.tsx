'use client';

import { useState } from 'react';
import Tabs from '@/components/dashboard/Appointments/Tabs';
import AppointmentList from '@/components/dashboard/Appointments/AppointmentList';

const upcomingAppointments = [
  {
    doctor: 'Dr. Alice Johnson',
    type: 'Consultation',
    date: '2024-07-10',
    time: '09:00 AM',
    price: 50,
  },
  {
    doctor: 'Dr. Bob Smith',
    type: 'Check-up',
    date: '2024-07-15',
    time: '02:00 PM',
    price: 75,
  },
];

const pastAppointments = [
  {
    doctor: 'Dr. Carla Gomez',
    type: 'Consultation',
    date: '2024-06-01',
    time: '10:00 AM',
    price: 60,
  },
  {
    doctor: 'Dr. Daniel Lee',
    type: 'Check-up',
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