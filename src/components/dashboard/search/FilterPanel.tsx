import React from 'react';

const specialties = [
  'All Specialties',
  'Cardiology',
  'Dentistry',
  'Dermatology',
  'Pediatrics',
  'Neurology',
  'Oncology',
  'Ophthalmology',
  'Endocrinology',
  'Urology',
  'Gastroenterology',
  'Psychiatry',
  'Rheumatology',
  'Surgery',
  'Radiology',
  'Pulmonology',
  'Infectious Disease',
  'Nephrology',
  'Allergy & Immunology',
  'Otolaryngology (ENT)',
  'Plastic Surgery',
];

const countries = [
  'All Countries',
  'Costa Rica',
  'Panama',
  'USA',
  'Chile',
  'Argentina',
  'Colombia',
  'Mexico',
];

const ratings = [
  'All Ratings',
  '5',
  '4+',
  '3+',
  '2+',
  '1+',
];

type Props = {
  specialty: string;
  setSpecialty: (val: string) => void;
  country: string;
  setCountry: (val: string) => void;
  rating: string;
  setRating: (val: string) => void;
};

const FilterPanel: React.FC<Props> = ({ specialty, setSpecialty, country, setCountry, rating, setRating }) => (
  <div className="bg-white rounded-2xl shadow p-4 flex flex-col gap-4 w-full md:w-64">
    <div>
      <label className="block text-xs text-gray-500 mb-1">Specialty</label>
      <select
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
        value={specialty}
        onChange={e => setSpecialty(e.target.value)}
      >
        {specialties.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
    <div>
      <label className="block text-xs text-gray-500 mb-1">Country</label>
      <select
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
        value={country}
        onChange={e => setCountry(e.target.value)}
      >
        {countries.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
    <div>
      <label className="block text-xs text-gray-500 mb-1">Rating</label>
      <select
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
        value={rating}
        onChange={e => setRating(e.target.value)}
      >
        {ratings.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  </div>
);

export default FilterPanel; 