import React from 'react';
import { User } from 'lucide-react';

type Props = {
  appointment: {
    doctor: string;
    type: string;
    date: string;
    time: string;
    price: number;
  };
};

const typeColors: Record<string, string> = {
  Consultation: 'bg-blue-100 text-blue-700',
  'Check-up': 'bg-green-100 text-green-700',
};

const AppointmentCard: React.FC<Props> = ({ appointment }) => (
  <div className="bg-white rounded-2xl shadow p-6 flex flex-col sm:flex-row items-center gap-4 mb-4">
    <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-700">
      <User className="w-8 h-8" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="font-semibold text-blue-900 text-lg">{appointment.doctor}</div>
      <div className="text-sm text-gray-500 mb-1 flex items-center gap-2">
        <span>{appointment.date}</span>
        <span className="mx-1">•</span>
        <span>{appointment.time}</span>
        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${typeColors[appointment.type] || 'bg-gray-100 text-gray-600'}`}>{appointment.type}</span>
      </div>
    </div>
    <div className="flex flex-col items-end gap-2">
      <span className="text-green-600 font-bold text-lg">${appointment.price}</span>
      <div className="flex gap-2">
        <button
          className="px-4 py-1 rounded-full bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition"
          onClick={() => console.log('View', appointment)}
        >
          View
        </button>
        <button
          className="px-4 py-1 rounded-full bg-red-100 text-red-600 font-medium text-sm hover:bg-red-200 transition"
          onClick={() => console.log('Cancel', appointment)}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
);

export default AppointmentCard; 