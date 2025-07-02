import React from 'react';
import AppointmentCard from './AppointmentCard';

type Props = {
  appointments: Array<{
    doctor: string;
    type: string;
    date: string;
    time: string;
    price: number;
  }>;
};

const AppointmentList: React.FC<Props> = ({ appointments }) => (
  <div>
    {appointments.length === 0 ? (
      <div className="text-center text-gray-500 py-8">No appointments found.</div>
    ) : (
      appointments.map((appt, idx) => <AppointmentCard key={idx} appointment={appt} />)
    )}
  </div>
);

export default AppointmentList; 