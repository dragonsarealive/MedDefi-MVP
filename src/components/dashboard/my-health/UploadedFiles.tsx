import { FaUpload, FaFileAlt } from 'react-icons/fa';

const files = [
  { name: 'InsuranceCard.pdf', type: 'PDF' },
  { name: 'AllergyList.jpg', type: 'Image' },
];

export default function UploadedFiles() {
  return (
    <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-2">
        <FaFileAlt className="text-blue-600 w-5 h-5" />
        <h2 className="text-lg font-bold text-blue-700">Uploaded Files</h2>
      </div>
      <ul className="space-y-2">
        {files.map((item, idx) => (
          <li key={idx} className="flex items-center justify-between border-b last:border-b-0 pb-2 last:pb-0">
            <div>
              <span className="font-medium text-gray-900">{item.name}</span>
              <span className="ml-2 text-xs text-gray-500">({item.type})</span>
            </div>
            <button className="px-3 py-1 rounded bg-blue-600 text-white text-xs font-medium shadow hover:bg-blue-700 transition">View</button>
          </li>
        ))}
      </ul>
      <button className="mt-2 flex items-center gap-2 px-3 py-2 rounded bg-green-600 text-white text-xs font-semibold shadow hover:bg-green-700 transition">
        <FaUpload className="w-4 h-4" /> Upload New File
      </button>
    </div>
  );
} 