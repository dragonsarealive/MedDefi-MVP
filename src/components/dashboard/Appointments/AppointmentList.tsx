import React from 'react';
import AppointmentCard, { Appointment } from './AppointmentCard';
import { HeartPulse, Stethoscope, Brain, Baby, User, Shield, Users } from 'lucide-react';

const mockAppointments: Appointment[] = [
  {
    doctor: 'Dr. John Smith',
    specialty: 'Cardiology',
    specialtyColor: 'bg-red-100 text-red-700',
    specialtyIcon: <HeartPulse className="w-4 h-4" />,
    date: '22 May 2025',
    time: '08:00 am',
    price: 50
  },
  {
    doctor: 'Dr. Maria Garcia',
    specialty: 'Dentistry',
    specialtyColor: 'bg-blue-100 text-blue-700',
    specialtyIcon: <Stethoscope className="w-4 h-4" />,
    date: '23 May 2025',
    time: '02:00 pm',
    price: 75
  },
  {
    doctor: 'Dr. Frank Heller',
    specialty: 'Neurology',
    specialtyColor: 'bg-purple-100 text-purple-700',
    specialtyIcon: <Brain className="w-4 h-4" />,
    date: '24 May 2025',
    time: '10:00 am',
    price: 200
  }
];

type Props = {
  appointments?: Appointment[];
};

const AppointmentList: React.FC<Props> = ({ appointments = mockAppointments }) => (
  <div>
    {appointments.length === 0 ? (
      <div className="text-center text-gray-500 py-8">No appointments found.</div>
    ) : (
      appointments.map((appt, idx) => (
        <AppointmentCard
          key={idx}
          appointment={appt}
          onView={() => {}}
          onCancel={() => {}}
        />
      ))
    )}
  </div>
);

export default AppointmentList; 