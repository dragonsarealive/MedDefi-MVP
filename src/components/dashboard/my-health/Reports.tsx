import { FaFileMedical } from 'react-icons/fa';

const reports = [
  { name: 'Blood Test Report', date: '2024-03-11', format: 'PDF' },
  { name: 'X-Ray Chest', date: '2024-02-20', format: 'Image' },
];

export default function Reports() {
  return (
    <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-2">
        <FaFileMedical className="text-blue-600 w-5 h-5" />
        <h2 className="text-lg font-bold text-blue-700">Reports</h2>
      </div>
      <ul className="space-y-2">
        {reports.map((item, idx) => (
          <li key={idx} className="flex items-center justify-between border-b last:border-b-0 pb-2 last:pb-0">
            <div>
              <span className="font-medium text-gray-900">{item.name}</span>
              <span className="ml-2 text-xs text-gray-500">({item.format})</span>
              <div className="text-xs text-gray-400">{item.date}</div>
            </div>
            <button className="px-3 py-1 rounded bg-blue-600 text-white text-xs font-medium shadow hover:bg-blue-700 transition">View</button>
          </li>
        ))}
      </ul>
    </div>
  );
} 