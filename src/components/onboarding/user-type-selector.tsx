import React from 'react';
import Button from '@/components/ui/button';

interface UserTypeSelectorProps {
  onSelect?: (type: 'patient' | 'doctor') => void;
}

const UserTypeSelector: React.FC<UserTypeSelectorProps> = ({ onSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] gap-8 mt-12">
      <h2 className="text-2xl font-semibold mb-6">Select Your User Type</h2>
      <div className="flex gap-8">
        <Button
          className="px-8 py-6 text-lg rounded-xl shadow-md border border-blue-500 hover:bg-blue-50"
          onClick={() => onSelect && onSelect('patient')}
        >
          I am a Patient
        </Button>
        <Button
          className="px-8 py-6 text-lg rounded-xl shadow-md border border-green-500 hover:bg-green-50"
          onClick={() => onSelect && onSelect('doctor')}
        >
          I am a Doctor
        </Button>
      </div>
    </div>
  );
};

export default UserTypeSelector; 