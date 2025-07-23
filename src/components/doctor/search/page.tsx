'use client';

import { useState } from 'react';
import SearchInput from '@/components/dashboard/search/SearchInput';
import FilterPanel from '@/components/dashboard/search/FilterPanel';
import SearchResults from '@/components/dashboard/search/SearchResults';

const doctors = [
  { id: 'doc-1', name: 'Dr. Alice Johnson', specialty: 'Cardiology', country: 'Costa Rica', rating: 4.9 },
  { id: 'doc-2', name: 'Dr. Bob Smith', specialty: 'Dentistry', country: 'USA', rating: 4.7 },
  { id: 'doc-3', name: 'Dr. Carla Gomez', specialty: 'Dermatology', country: 'Panama', rating: 4.8 },
  { id: 'doc-4', name: 'Dr. Daniel Lee', specialty: 'Pediatrics', country: 'Chile', rating: 4.6 },
  { id: 'doc-5', name: 'Dr. Eva Martinez', specialty: 'Neurology', country: 'Argentina', rating: 5.0 },
  { id: 'doc-6', name: 'Dr. Frank Heller', specialty: 'Oncology', country: 'Colombia', rating: 4.5 },
  { id: 'doc-7', name: 'Dr. Grace Kim', specialty: 'Ophthalmology', country: 'Mexico', rating: 4.2 },
  { id: 'doc-8', name: 'Dr. Henry Wu', specialty: 'Endocrinology', country: 'USA', rating: 4.3 },
  { id: 'doc-9', name: 'Dr. Isabella Rossi', specialty: 'Urology', country: 'Argentina', rating: 4.6 },
  { id: 'doc-10', name: 'Dr. Juan Perez', specialty: 'Gastroenterology', country: 'Mexico', rating: 4.8 },
];

export default function SearchPage() {
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('All Specialties');
  const [country, setCountry] = useState('All Countries');
  const [rating, setRating] = useState('All Ratings');

  const filteredDoctors = doctors.filter((doc) => {
    // Search filter (case-insensitive, matches name, specialty, or country)
    const searchMatch =
      search.trim() === '' ||
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(search.toLowerCase()) ||
      doc.country.toLowerCase().includes(search.toLowerCase());
    // Specialty filter
    const specialtyMatch = specialty === 'All Specialties' || doc.specialty === specialty;
    // Country filter
    const countryMatch = country === 'All Countries' || doc.country === country;
    // Rating filter
    let ratingMatch = true;
    if (rating !== 'All Ratings') {
      if (rating === '5') ratingMatch = doc.rating === 5;
      else if (rating === '4+') ratingMatch = doc.rating >= 4;
      else if (rating === '3+') ratingMatch = doc.rating >= 3;
      else if (rating === '2+') ratingMatch = doc.rating >= 2;
      else if (rating === '1+') ratingMatch = doc.rating >= 1;
    }
    return searchMatch && specialtyMatch && countryMatch && ratingMatch;
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-2 sm:px-4">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">Search Doctors</h1>
      <div className="mb-6">
        <SearchInput value={search} onChange={setSearch} />
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4 w-full">
          <FilterPanel
            specialty={specialty}
            setSpecialty={setSpecialty}
            country={country}
            setCountry={setCountry}
            rating={rating}
            setRating={setRating}
          />
        </div>
        <div className="flex-1">
          <SearchResults doctors={filteredDoctors} />
        </div>
      </div>
    </div>
  );
} 