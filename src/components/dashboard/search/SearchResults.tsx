import React from 'react';
import { Star } from 'lucide-react';

const placeholderImg = 'https://ui-avatars.com/api/?name=Dr&background=E0E7FF&color=1E40AF&size=64';

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  country: string;
  rating: number;
};

type Props = {
  doctors: Doctor[];
};

const SearchResults: React.FC<Props> = ({ doctors }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {doctors.length === 0 ? (
      <div className="col-span-full text-center text-gray-500 py-8">No doctors found.</div>
    ) : (
      doctors.map((doc) => (
        <div key={doc.id} className="bg-white rounded-2xl shadow p-6 flex flex-col gap-3 items-center text-center">
          <img src={placeholderImg} alt={doc.name} className="w-16 h-16 rounded-full object-cover mb-2" />
          <div className="font-semibold text-blue-900 text-lg">{doc.name}</div>
          <div className="text-sm text-gray-500 mb-1">{doc.specialty}</div>
          <div className="flex items-center gap-1 text-yellow-500 mb-1">
            <Star className="w-4 h-4" />
            <span className="font-medium">{doc.rating}</span>
          </div>
          <div className="text-xs text-gray-400 mb-2">{doc.country}</div>
          <button className="mt-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-medium transition">Book Appointment</button>
        </div>
      ))
    )}
  </div>
);

export default SearchResults; 