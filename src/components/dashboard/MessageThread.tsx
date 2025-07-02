import React from 'react';

export interface Message {
  id: string;
  sender: 'doctor' | 'user';
  text: string;
  timestamp: string;
}

interface Props {
  messages: Message[];
}

const MessageThread: React.FC<Props> = ({ messages }) => (
  <div className="flex-1 flex flex-col gap-2 p-4 overflow-y-auto">
    {messages.map((msg) => (
      <div
        key={msg.id}
        className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
      >
        <div
          className={`max-w-xs sm:max-w-md md:max-w-lg px-4 py-2 rounded-2xl shadow text-sm mb-1
            ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-900 rounded-bl-none'}`}
        >
          {msg.text}
        </div>
        <span className="text-xs text-gray-400 mt-0.5 pr-1 self-end">{msg.timestamp}</span>
      </div>
    ))}
  </div>
);

export default MessageThread; 