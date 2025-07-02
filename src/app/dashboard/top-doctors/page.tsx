'use client';

import { useState } from 'react';
import SearchInput from '@/components/dashboard/TopDoctors/SearchInput';
import FilterSelect from '@/components/dashboard/TopDoctors/FilterSelect';
import DoctorCard from '@/components/dashboard/TopDoctors/DoctorCard';

// Mock data
const doctors = [
  { id: 'doc-1', name: 'Dr. Alice Johnson', specialty: 'Cardiology', rating: 4.9, country: 'Costa Rica', language: 'Spanish' },
  { id: 'doc-2', name: 'Dr. Bob Smith', specialty: 'Dentistry', rating: 4.7, country: 'USA', language: 'English' },
  { id: 'doc-3', name: 'Dr. Carla Gomez', specialty: 'Dermatology', rating: 4.8, country: 'Panama', language: 'Spanish' },
  { id: 'doc-4', name: 'Dr. Daniel Lee', specialty: 'Pediatrics', rating: 4.6, country: 'Chile', language: 'Portuguese' },
  { id: 'doc-5', name: 'Dr. Eva Martinez', specialty: 'Neurology', rating: 5.0, country: 'Argentina', language: 'Spanish' },
  { id: 'doc-6', name: 'Dr. Frank Heller', specialty: 'Cardiology', rating: 4.5, country: 'Colombia', language: 'English' },
  { id: 'doc-7', name: 'Dr. Grace Kim', specialty: 'Dermatology', rating: 4.2, country: 'Mexico', language: 'Spanish' },
];

export default function TopDoctorsPage() {
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('All Specialties');
  const [country, setCountry] = useState('All Countries');
  const [language, setLanguage] = useState('All Languages');
  const [rating, setRating] = useState('All Ratings');

  return (
    <div className="max-w-6xl mx-auto py-8 px-2 sm:px-4 flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-2">Top Doctors</h1>
      <div className="flex flex-col md:flex-row gap-4 md:items-end">
        <SearchInput value={search} onChange={setSearch} />
        <FilterSelect label="Specialty" value={specialty} onChange={setSpecialty} options={["All Specialties", "Cardiology", "Dentistry", "Dermatology", "Pediatrics", "Neurology"]} />
        <FilterSelect label="Country" value={country} onChange={setCountry} options={["All Countries", "Costa Rica", "Panama", "USA", "Chile", "Argentina", "Colombia", "Mexico"]} />
        <FilterSelect label="Language" value={language} onChange={setLanguage} options={["All Languages", "English", "Spanish", "Portuguese"]} />
        <FilterSelect label="Rating" value={rating} onChange={setRating} options={["All Ratings", "5", "4+", "3+", "2+", "1+"]} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {doctors.map((doc) => (
          <DoctorCard key={doc.id} doctor={doc} />
        ))}
      </div>
    </div>
  );
} 