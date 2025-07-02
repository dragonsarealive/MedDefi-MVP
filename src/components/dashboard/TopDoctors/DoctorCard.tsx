import { Star } from 'lucide-react';

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  country: string;
  language: string;
};

type Props = {
  doctor: Doctor;
};

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const DoctorCard: React.FC<Props> = ({ doctor }) => (
  <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-3 items-center text-center">
    <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-700 mb-2">
      {getInitials(doctor.name)}
    </div>
    <div className="font-semibold text-blue-900 text-lg">{doctor.name}</div>
    <div className="text-sm text-gray-500 mb-1">{doctor.specialty}</div>
    <div className="flex items-center gap-1 text-yellow-500 mb-1">
      <Star className="w-4 h-4" />
      <span className="font-medium">{doctor.rating}</span>
    </div>
    <div className="text-xs text-gray-400 mb-2">{doctor.country} &bull; {doctor.language}</div>
    <button className="mt-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-medium transition">View Profile</button>
  </div>
);

export default DoctorCard; 