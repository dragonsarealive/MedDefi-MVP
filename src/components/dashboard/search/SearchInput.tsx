import React from 'react';

type Props = {
  value: string;
  onChange: (val: string) => void;
};

const SearchInput: React.FC<Props> = ({ value, onChange }) => (
  <input
    type="text"
    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-lg"
    placeholder="Search by name, specialty, or location…"
    value={value}
    onChange={e => onChange(e.target.value)}
    aria-label="Search doctors"
  />
);

export default SearchInput; 