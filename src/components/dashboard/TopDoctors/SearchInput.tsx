'use client'

import React from 'react';

type Props = {
  value: string;
  onChange: (val: string) => void;
};

const SearchInput: React.FC<Props> = ({ value, onChange }) => (
  <input
    type="text"
    className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
    placeholder="Search doctors by name, specialty, or country..."
    value={value}
    onChange={e => onChange(e.target.value)}
  />
);

export default SearchInput; 