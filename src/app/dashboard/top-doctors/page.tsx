'use client';

import { useState } from 'react';
import SearchInput from '@/components/dashboard/TopDoctors/SearchInput';
import FilterSelect from '@/components/dashboard/TopDoctors/FilterSelect';
import DoctorCard from '@/components/dashboard/TopDoctors/DoctorCard';

const specialties = [
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
  'Costa Rica',
  'Panama',
  'USA',
  'Chile',
  'Argentina',
  'Colombia',
  'Mexico',
];

// Mock data
const doctors = [
  { id: 'doc-1', name: 'Dr. Alice Johnson', specialty: 'Cardiology', rating: 4.9, country: 'Costa Rica', language: 'Spanish' },
  { id: 'doc-2', name: 'Dr. Bob Smith', specialty: 'Dentistry', rating: 4.7, country: 'USA', language: 'English' },
  { id: 'doc-3', name: 'Dr. Carla Gomez', specialty: 'Dermatology', rating: 4.8, country: 'Panama', language: 'Spanish' },
  { id: 'doc-4', name: 'Dr. Daniel Lee', specialty: 'Pediatrics', rating: 4.6, country: 'Chile', language: 'Spanish' },
  { id: 'doc-5', name: 'Dr. Eva Martinez', specialty: 'Neurology', rating: 5.0, country: 'Argentina', language: 'Spanish' },
  { id: 'doc-6', name: 'Dr. Frank Heller', specialty: 'Oncology', rating: 4.5, country: 'Colombia', language: 'English' },
  { id: 'doc-7', name: 'Dr. Grace Kim', specialty: 'Ophthalmology', rating: 4.2, country: 'Mexico', language: 'Spanish' },
  { id: 'doc-8', name: 'Dr. Henry Wu', specialty: 'Endocrinology', rating: 4.3, country: 'USA', language: 'English' },
  { id: 'doc-9', name: 'Dr. Isabella Rossi', specialty: 'Urology', rating: 4.6, country: 'Argentina', language: 'Spanish' },
  { id: 'doc-10', name: 'Dr. Juan Perez', specialty: 'Gastroenterology', rating: 4.8, country: 'Mexico', language: 'Spanish' },
  { id: 'doc-11', name: 'Dr. Karen Smith', specialty: 'Psychiatry', rating: 4.7, country: 'USA', language: 'English' },
  { id: 'doc-12', name: 'Dr. Luis Fernandez', specialty: 'Rheumatology', rating: 4.9, country: 'Mexico', language: 'Spanish' },
  { id: 'doc-13', name: 'Dr. Maria Silva', specialty: 'Surgery', rating: 4.5, country: 'Colombia', language: 'Spanish' },
  { id: 'doc-14', name: 'Dr. Nia Brown', specialty: 'Radiology', rating: 4.4, country: 'USA', language: 'English' },
  { id: 'doc-15', name: 'Dr. Omar Haddad', specialty: 'Pulmonology', rating: 4.6, country: 'Chile', language: 'Spanish' },
  { id: 'doc-16', name: 'Dr. Priya Patel', specialty: 'Infectious Disease', rating: 4.8, country: 'Panama', language: 'Spanish' },
  { id: 'doc-17', name: 'Dr. Quentin Dubois', specialty: 'Nephrology', rating: 4.7, country: 'Argentina', language: 'Spanish' },
  { id: 'doc-18', name: 'Dr. Rosa Lopez', specialty: 'Allergy & Immunology', rating: 4.9, country: 'Costa Rica', language: 'Spanish' },
  { id: 'doc-19', name: 'Dr. Samir Khan', specialty: 'Otolaryngology (ENT)', rating: 4.3, country: 'Colombia', language: 'Spanish' },
  { id: 'doc-20', name: 'Dr. Tina Chen', specialty: 'Plastic Surgery', rating: 4.5, country: 'Mexico', language: 'Spanish' },
  { id: 'doc-21', name: 'Dr. Usha Reddy', specialty: 'Cardiology', rating: 4.6, country: 'USA', language: 'English' },
  { id: 'doc-22', name: 'Dr. Victor Hugo', specialty: 'Dentistry', rating: 4.8, country: 'Costa Rica', language: 'Spanish' },
  { id: 'doc-23', name: 'Dr. Wendy Lee', specialty: 'Dermatology', rating: 4.7, country: 'Mexico', language: 'Spanish' },
  { id: 'doc-24', name: 'Dr. Xavier Torres', specialty: 'Pediatrics', rating: 4.2, country: 'Panama', language: 'Spanish' },
  { id: 'doc-25', name: 'Dr. Yara Costa', specialty: 'Neurology', rating: 4.4, country: 'Argentina', language: 'Spanish' },
  { id: 'doc-26', name: 'Dr. Zoe Müller', specialty: 'Oncology', rating: 4.9, country: 'Chile', language: 'Spanish' },
  { id: 'doc-27', name: 'Dr. Ahmed Ali', specialty: 'Ophthalmology', rating: 4.5, country: 'Panama', language: 'Spanish' },
  { id: 'doc-28', name: 'Dr. Beatriz Lima', specialty: 'Endocrinology', rating: 4.6, country: 'Mexico', language: 'Spanish' },
  { id: 'doc-29', name: 'Dr. Carlos Ruiz', specialty: 'Urology', rating: 4.7, country: 'Colombia', language: 'Spanish' },
  { id: 'doc-30', name: 'Dr. Diana Ivanova', specialty: 'Gastroenterology', rating: 4.8, country: 'Costa Rica', language: 'Spanish' },
  { id: 'doc-31', name: 'Dr. Elena Petrova', specialty: 'Psychiatry', rating: 4.5, country: 'USA', language: 'English' },
  { id: 'doc-32', name: 'Dr. Farid Rahman', specialty: 'Rheumatology', rating: 4.7, country: 'Argentina', language: 'Spanish' },
  { id: 'doc-33', name: 'Dr. Gabriela Torres', specialty: 'Surgery', rating: 4.8, country: 'Mexico', language: 'Spanish' },
  { id: 'doc-34', name: 'Dr. Hugo Silva', specialty: 'Radiology', rating: 4.6, country: 'Chile', language: 'Spanish' },
  { id: 'doc-35', name: 'Dr. Ingrid Svensson', specialty: 'Pulmonology', rating: 4.9, country: 'Costa Rica', language: 'Spanish' },
  { id: 'doc-36', name: 'Dr. Jorge Castillo', specialty: 'Infectious Disease', rating: 4.4, country: 'Panama', language: 'Spanish' },
  { id: 'doc-37', name: 'Dr. Katya Ivanova', specialty: 'Nephrology', rating: 4.6, country: 'Argentina', language: 'Spanish' },
  { id: 'doc-38', name: 'Dr. Lucas Moreira', specialty: 'Allergy & Immunology', rating: 4.7, country: 'Mexico', language: 'Spanish' },
  { id: 'doc-39', name: 'Dr. Monica Sanchez', specialty: 'Otolaryngology (ENT)', rating: 4.5, country: 'Colombia', language: 'Spanish' },
  { id: 'doc-40', name: 'Dr. Nestor Gutierrez', specialty: 'Plastic Surgery', rating: 4.8, country: 'Mexico', language: 'Spanish' },
];

export default function TopDoctorsPage() {
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('All Specialties');
  const [country, setCountry] = useState('All Countries');
  const [language, setLanguage] = useState('All Languages');
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
    // Language filter
    const languageMatch = language === 'All Languages' || doc.language === language;
    // Rating filter
    let ratingMatch = true;
    if (rating !== 'All Ratings') {
      if (rating === '5') ratingMatch = doc.rating === 5;
      else if (rating === '4+') ratingMatch = doc.rating >= 4;
      else if (rating === '3+') ratingMatch = doc.rating >= 3;
      else if (rating === '2+') ratingMatch = doc.rating >= 2;
      else if (rating === '1+') ratingMatch = doc.rating >= 1;
    }

    return searchMatch && specialtyMatch && countryMatch && languageMatch && ratingMatch;
  });

  return (
    <div className="max-w-6xl mx-auto py-8 px-2 sm:px-4 flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-2">Top Doctors</h1>
      <div className="flex flex-col md:flex-row gap-4 md:items-end">
        <SearchInput value={search} onChange={setSearch} />
        <FilterSelect label="Specialty" value={specialty} onChange={setSpecialty} options={["All Specialties", ...specialties]} />
        <FilterSelect label="Country" value={country} onChange={setCountry} options={["All Countries", ...countries]} />
        <FilterSelect label="Language" value={language} onChange={setLanguage} options={["All Languages", "English", "Spanish", "Portuguese"]} />
        <FilterSelect label="Rating" value={rating} onChange={setRating} options={["All Ratings", "5", "4+", "3+", "2+", "1+"]} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {filteredDoctors.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-8">No doctors found matching your criteria.</div>
        ) : (
          filteredDoctors.map((doc) => (
            <DoctorCard key={doc.id} doctor={doc} />
          ))
        )}
      </div>
    </div>
  );
} 