'use client'
import React from 'react';

interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  initials: string;
  preview: string;
  unread: boolean;
}

interface Props {
  selectedId: string;
  onSelect: (id: string) => void;
  conversations: Conversation[];
}

const ConversationList: React.FC<Props> = ({ selectedId, onSelect, conversations }) => (
  <aside className="w-full sm:w-72 bg-white border-r rounded-l-2xl overflow-y-auto h-full">
    <div className="p-4 border-b font-bold text-blue-700 text-lg">Messages</div>
    <ul>
      {conversations.map((conv) => (
        <li
          key={conv.id}
          className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-blue-50 transition group ${selectedId === conv.id ? 'bg-blue-100' : ''}`}
          onClick={() => onSelect(conv.id)}
          aria-current={selectedId === conv.id}
        >
          <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center font-bold text-blue-700 text-lg">
            {conv.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-900 truncate">{conv.name}</div>
            <div className="text-xs text-gray-500 truncate">{conv.preview}</div>
          </div>
          {conv.unread && (
            <span className="ml-2 w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" aria-label="unread message" />
          )}
        </li>
      ))}
    </ul>
  </aside>
);

export default ConversationList; 