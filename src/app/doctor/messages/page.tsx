'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ConversationList from '@/components/dashboard/ConversationList';
import MessageThread, { Message } from '@/components/dashboard/MessageThread';
import MessageInput from '@/components/dashboard/MessageInput';

interface Doctor {
  id: string;
  name: string;
  initials: string;
}

// Full doctors array from Top Doctors
const doctors = [
  { id: 'doc-1', name: 'Dr. Alice Johnson', initials: 'DA' },
  { id: 'doc-2', name: 'Dr. Bob Smith', initials: 'DB' },
  { id: 'doc-3', name: 'Dr. Carla Gomez', initials: 'DC' },
  { id: 'doc-4', name: 'Dr. Daniel Lee', initials: 'DD' },
  { id: 'doc-5', name: 'Dr. Eva Martinez', initials: 'DE' },
  { id: 'doc-6', name: 'Dr. Frank Heller', initials: 'DF' },
  { id: 'doc-7', name: 'Dr. Grace Kim', initials: 'DG' },
  { id: 'doc-8', name: 'Dr. Henry Wu', initials: 'DH' },
  { id: 'doc-9', name: 'Dr. Isabella Rossi', initials: 'DI' },
  { id: 'doc-10', name: 'Dr. Juan Perez', initials: 'DJ' },
  { id: 'doc-11', name: 'Dr. Karen Smith', initials: 'DK' },
  { id: 'doc-12', name: 'Dr. Luis Fernandez', initials: 'DL' },
  { id: 'doc-13', name: 'Dr. Maria Silva', initials: 'DM' },
  { id: 'doc-14', name: 'Dr. Nia Brown', initials: 'DN' },
  { id: 'doc-15', name: 'Dr. Omar Haddad', initials: 'DO' },
  { id: 'doc-16', name: 'Dr. Priya Patel', initials: 'DP' },
  { id: 'doc-17', name: 'Dr. Quentin Dubois', initials: 'DQ' },
  { id: 'doc-18', name: 'Dr. Rosa Lopez', initials: 'DR' },
  { id: 'doc-19', name: 'Dr. Samir Khan', initials: 'DS' },
  { id: 'doc-20', name: 'Dr. Tina Chen', initials: 'DT' },
  { id: 'doc-21', name: 'Dr. Usha Reddy', initials: 'DU' },
  { id: 'doc-22', name: 'Dr. Victor Hugo', initials: 'DV' },
  { id: 'doc-23', name: 'Dr. Wendy Lee', initials: 'DW' },
  { id: 'doc-24', name: 'Dr. Xavier Torres', initials: 'DX' },
  { id: 'doc-25', name: 'Dr. Yara Costa', initials: 'DY' },
  { id: 'doc-26', name: 'Dr. Zoe Müller', initials: 'DZ' },
  { id: 'doc-27', name: 'Dr. Ahmed Ali', initials: 'DA' },
  { id: 'doc-28', name: 'Dr. Beatriz Lima', initials: 'DB' },
  { id: 'doc-29', name: 'Dr. Carlos Ruiz', initials: 'DC' },
  { id: 'doc-30', name: 'Dr. Diana Ivanova', initials: 'DD' },
  { id: 'doc-31', name: 'Dr. Elena Petrova', initials: 'DE' },
  { id: 'doc-32', name: 'Dr. Farid Rahman', initials: 'DF' },
  { id: 'doc-33', name: 'Dr. Gabriela Torres', initials: 'DG' },
  { id: 'doc-34', name: 'Dr. Hugo Silva', initials: 'DH' },
  { id: 'doc-35', name: 'Dr. Ingrid Svensson', initials: 'DI' },
  { id: 'doc-36', name: 'Dr. Jorge Castillo', initials: 'DJ' },
  { id: 'doc-37', name: 'Dr. Katya Ivanova', initials: 'DK' },
  { id: 'doc-38', name: 'Dr. Lucas Moreira', initials: 'DL' },
  { id: 'doc-39', name: 'Dr. Monica Sanchez', initials: 'DM' },
  { id: 'doc-40', name: 'Dr. Nestor Gutierrez', initials: 'DN' },
];

// Use this array for chat creation
const availableDoctors = doctors;

interface Conversation {
  id: string;
  name: string;
  initials: string;
  preview: string;
  unread: boolean;
}

const initialConversations: Conversation[] = [
  {
    id: '1',
    name: 'Dr. Alice Johnson',
    initials: 'AJ',
    preview: 'Your test results are ready.',
    unread: true,
  },
  {
    id: '2',
    name: 'Dr. Bob Smith',
    initials: 'BS',
    preview: 'Let me know if you have any questions.',
    unread: false,
  },
];

const initialMessages: { [id: string]: Message[] } = {
  '1': [
    { id: '1', sender: 'doctor', text: 'Hello! Your test results are ready.', timestamp: '09:00 AM' },
    { id: '2', sender: 'user', text: 'Thank you, doctor! Can you explain them?', timestamp: '09:01 AM' },
    { id: '3', sender: 'doctor', text: 'Of course! Your results look good. No issues found.', timestamp: '09:02 AM' },
    { id: '4', sender: 'user', text: "That\'s great to hear. Thanks!", timestamp: '09:03 AM' },
  ],
  '2': [
    { id: '1', sender: 'doctor', text: 'Hi! Let me know if you have any questions about your dental checkup.', timestamp: '10:00 AM' },
  ],
};

function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const AUTO_REPLY = 'I will answer as soon as possible. Thank you for reaching out.';

const MessagesPage: React.FC = () => {
  const searchParams = useSearchParams();
  const doctorIdFromQuery = searchParams.get('doctorId');

  const [selectedId, setSelectedId] = useState('1');
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [messagesByConv, setMessagesByConv] = useState<{ [id: string]: Message[] }>(initialMessages);
  const [showNewChat, setShowNewChat] = useState(false);
  const [newChatDoctorId, setNewChatDoctorId] = useState('');

  // Doctors not already in conversations
  const doctorsNotInChat = availableDoctors.filter(
    (doc) => !conversations.some((conv) => conv.id === doc.id)
  );

  // Auto-create/select chat if doctorId is in query
  useEffect(() => {
    if (!doctorIdFromQuery) return;
    if (selectedId === doctorIdFromQuery) return;
    const doctor = availableDoctors.find((d) => d.id === doctorIdFromQuery);
    if (!doctor) return;
    const exists = conversations.some((conv) => conv.id === doctorIdFromQuery);
    if (!exists) {
      setConversations((prev) => [
        ...prev,
        {
          id: doctor.id,
          name: doctor.name,
          initials: doctor.initials,
          preview: '',
          unread: false,
        },
      ]);
      setMessagesByConv((prev) => ({ ...prev, [doctor.id]: [] }));
    }
    setSelectedId(doctorIdFromQuery);
  }, [doctorIdFromQuery, conversations, selectedId]);

  const handleSend = (text: string) => {
    setMessagesByConv((prev) => {
      const convMsgs = prev[selectedId] || [];
      return {
        ...prev,
        [selectedId]: [
          ...convMsgs,
          {
            id: (convMsgs.length + 1).toString(),
            sender: 'user',
            text,
            timestamp: getCurrentTime(),
          },
        ],
      };
    });
    // Auto-answer after a short delay
    setTimeout(() => {
      setMessagesByConv((prev) => {
        const convMsgs = prev[selectedId] || [];
        return {
          ...prev,
          [selectedId]: [
            ...convMsgs,
            {
              id: (convMsgs.length + 2).toString(),
              sender: 'doctor',
              text: AUTO_REPLY,
              timestamp: getCurrentTime(),
            },
          ],
        };
      });
    }, 1200);
  };

  const handleCreateChat = () => {
    if (!newChatDoctorId) return;
    const doctor = availableDoctors.find((d) => d.id === newChatDoctorId);
    if (!doctor) return;
    setConversations((prev) => [
      ...prev,
      {
        id: doctor.id,
        name: doctor.name,
        initials: doctor.initials,
        preview: '',
        unread: false,
      },
    ]);
    setMessagesByConv((prev) => ({ ...prev, [doctor.id]: [] }));
    setSelectedId(doctor.id);
    setShowNewChat(false);
    setNewChatDoctorId('');
  };

  return (
    <div className="flex flex-col sm:flex-row h-[80vh] bg-gray-50 rounded-2xl shadow max-w-5xl mx-auto my-8 overflow-hidden relative">
      <div className="absolute left-4 top-4 z-10">
        <button
          className="px-3 py-1 rounded-full bg-blue-600 text-white text-sm font-medium shadow hover:bg-blue-700 transition"
          onClick={() => setShowNewChat(true)}
        >
          + New Chat
        </button>
      </div>
      <ConversationList selectedId={selectedId} onSelect={setSelectedId} conversations={conversations} />
      <div className="flex-1 flex flex-col bg-white rounded-r-2xl">
        <MessageThread messages={messagesByConv[selectedId] || []} />
        <MessageInput onSend={handleSend} />
      </div>
      {showNewChat && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-20">
          <div className="bg-white rounded-xl shadow-lg p-6 w-80 flex flex-col gap-4">
            <h2 className="text-lg font-bold mb-2">Start New Chat</h2>
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              value={newChatDoctorId}
              onChange={e => setNewChatDoctorId(e.target.value)}
            >
              <option value="">Select a doctor...</option>
              {doctorsNotInChat.map((doc) => (
                <option key={doc.id} value={doc.id}>{doc.name}</option>
              ))}
            </select>
            <div className="flex gap-2 justify-end">
              <button
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
                onClick={() => setShowNewChat(false)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                onClick={handleCreateChat}
                disabled={!newChatDoctorId}
              >
                Start Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesPage; 