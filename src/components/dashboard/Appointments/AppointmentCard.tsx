import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Button  from '@/components/ui/Button';
import { User } from 'lucide-react';

export type Appointment = {
  doctor: string;
  specialty: string;
  specialtyColor: string; // e.g. 'bg-pink-100 text-pink-700'
  specialtyIcon: React.ReactNode;
  date: string;
  time: string;
  price: number;
};

type Props = {
  appointment: Appointment;
  onView: (appointment: Appointment) => void;
  onCancel: (appointment: Appointment) => void;
};

const AppointmentCard: React.FC<Props> = ({ appointment, onView, onCancel }) => (
  <Card className="flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl shadow mb-4">
    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-700">
      <User className="w-10 h-10" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="font-semibold text-blue-900 text-lg">{appointment.doctor}</div>
      <div className="flex items-center gap-2 mt-1">
        <Badge className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${appointment.specialtyColor}`}>
          <span className="text-lg">{appointment.specialtyIcon}</span>
          {appointment.specialty}
        </Badge>
        <span className="text-xs text-gray-500 ml-2">{appointment.date} • {appointment.time}</span>
      </div>
    </div>
    <div className="flex flex-col items-end gap-2">
      <span className="text-green-600 font-bold text-lg">${appointment.price}</span>
      <div className="flex gap-2">
        <Button variant="primary" size="sm" onClick={() => onView(appointment)}>
          View Details
        </Button>
        <Button variant="secondary" size="sm" onClick={() => onCancel(appointment)}>
          Cancel
        </Button>
      </div>
    </div>
  </Card>
);

export default AppointmentCard; 