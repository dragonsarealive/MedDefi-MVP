import { FaNotesMedical } from 'react-icons/fa';

const history = [
  { title: 'Annual Physical Exam', subtitle: 'General checkup', date: '2024-03-10' },
  { title: 'Blood Test', subtitle: 'Routine bloodwork', date: '2024-01-15' },
];

export default function MedicalHistory() {
  return (
    <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-2">
        <FaNotesMedical className="text-blue-600 w-5 h-5" />
        <h2 className="text-lg font-bold text-blue-700">Medical History</h2>
      </div>
      <ul className="space-y-2">
        {history.map((item, idx) => (
          <li key={idx} className="flex flex-col border-b last:border-b-0 pb-2 last:pb-0">
            <span className="font-medium text-gray-900">{item.title}</span>
            <span className="text-sm text-gray-500">{item.subtitle}</span>
            <span className="text-xs text-gray-400 mt-1">{item.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
} 