import React from 'react';

type Props = {
  selected: 'upcoming' | 'past';
  onTabChange: (tab: 'upcoming' | 'past') => void;
};

const Tabs: React.FC<Props> = ({ selected, onTabChange }) => (
  <div className="flex gap-6 border-b mb-6">
    <button
      className={`pb-2 text-lg font-semibold transition border-b-2 ${selected === 'upcoming' ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-blue-600'}`}
      onClick={() => onTabChange('upcoming')}
      aria-current={selected === 'upcoming'}
    >
      Upcoming
    </button>
    <button
      className={`pb-2 text-lg font-semibold transition border-b-2 ${selected === 'past' ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-blue-600'}`}
      onClick={() => onTabChange('past')}
      aria-current={selected === 'past'}
    >
      Past
    </button>
  </div>
);

export default Tabs; 