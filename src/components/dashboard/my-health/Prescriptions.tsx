import { FaPills } from 'react-icons/fa';

const prescriptions = [
  { medicine: 'Atorvastatin', dosage: '10mg', frequency: 'Once daily', doctor: 'Dr. Alice Johnson', date: '2024-03-12' },
  { medicine: 'Metformin', dosage: '500mg', frequency: 'Twice daily', doctor: 'Dr. Bob Smith', date: '2024-02-28' },
];

export default function Prescriptions() {
  return (
    <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-2">
        <FaPills className="text-blue-600 w-5 h-5" />
        <h2 className="text-lg font-bold text-blue-700">Prescriptions</h2>
      </div>
      <ul className="space-y-2">
        {prescriptions.map((item, idx) => (
          <li key={idx} className="flex flex-col border-b last:border-b-0 pb-2 last:pb-0">
            <span className="font-medium text-gray-900">{item.medicine} <span className="text-xs text-gray-500">({item.dosage}, {item.frequency})</span></span>
            <span className="text-sm text-gray-500">Prescribed by {item.doctor}</span>
            <span className="text-xs text-gray-400 mt-1">{item.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
} 