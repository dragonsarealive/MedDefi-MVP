'use client'

import React from 'react';

type Props = {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: string[];
};

const FilterSelect: React.FC<Props> = ({ label, value, onChange, options }) => (
  <div className="flex flex-col">
    <label className="text-xs text-gray-500 mb-1">{label}</label>
    <select
      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-gray-700 bg-white"
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{ color: '#374151', backgroundColor: '#ffffff' }}
    >
      {options.map(opt => (
        <option key={opt} value={opt} style={{ color: '#374151', backgroundColor: '#ffffff' }}>{opt}</option>
      ))}
    </select>
  </div>
);

export default FilterSelect; 