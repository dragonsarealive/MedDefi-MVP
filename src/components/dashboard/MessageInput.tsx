import React, { useState } from 'react';
import { FiSend } from 'react-icons/fi';

interface Props {
  onSend: (text: string) => void;
}

const MessageInput: React.FC<Props> = ({ onSend }) => {
  const [value, setValue] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() === '') return;
    onSend(value);
    setValue('');
  };

  return (
    <form onSubmit={handleSend} className="flex items-center gap-2 p-4 border-t bg-white rounded-b-2xl">
      <input
        type="text"
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
        placeholder="Type your message..."
        value={value}
        onChange={e => setValue(e.target.value)}
        aria-label="Type your message"
      />
      <button
        type="submit"
        className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label="Send message"
      >
        <FiSend className="w-5 h-5" />
      </button>
    </form>
  );
};

export default MessageInput; 