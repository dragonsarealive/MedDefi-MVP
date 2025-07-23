'use client';

import { useUser } from '@/contexts/UserContext';
import { Calendar, Clock, User, Plus, Edit, Trash2 } from 'lucide-react';

const mockSchedule = [
  {
    id: '1',
    date: '2025-01-20',
    time: '09:00 AM',
    patientName: 'John Smith',
    type: 'Consultation',
    duration: '30 min',
    status: 'Confirmed'
  },
  {
    id: '2',
    date: '2025-01-20',
    time: '10:00 AM',
    patientName: 'Maria Garcia',
    type: 'Follow-up',
    duration: '45 min',
    status: 'Confirmed'
  },
  {
    id: '3',
    date: '2025-01-21',
    time: '02:00 PM',
    patientName: 'Ahmed Hassan',
    type: 'Initial Visit',
    duration: '60 min',
    status: 'Pending'
  }
];

const timeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
];

export default function SchedulePage() {
  const { user } = useUser();

  if (!user || user.role !== 'doctor') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600">Only doctors can access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Schedule</h1>
          <p className="text-gray-600">Manage your appointments and availability</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Appointment
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Calendar</h2>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg">Today</button>
              <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg">Week</button>
              <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg">Month</button>
            </div>
          </div>
          
          {/* Simple Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
            {Array.from({ length: 35 }, (_, i) => (
              <div key={i} className="p-2 text-center text-sm border border-gray-200 min-h-[60px] hover:bg-gray-50">
                <div className="text-gray-900">{i + 1}</div>
                {i === 19 && (
                  <div className="text-xs bg-blue-100 text-blue-700 rounded px-1 mt-1">
                    John Smith
                  </div>
                )}
                {i === 20 && (
                  <div className="text-xs bg-green-100 text-green-700 rounded px-1 mt-1">
                    Maria Garcia
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Appointments</h2>
          <div className="space-y-4">
            {mockSchedule.map((appointment) => (
              <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900">{appointment.date}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    appointment.status === 'Confirmed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {appointment.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{appointment.time}</span>
                  <span className="text-xs text-gray-500">({appointment.duration})</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-900">{appointment.patientName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1">
                    <Edit className="w-3 h-3" />
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1">
                    <Trash2 className="w-3 h-3" />
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Availability Settings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Availability Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Working Hours</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Monday - Friday</span>
                <span className="text-sm font-medium">9:00 AM - 5:00 PM</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Saturday</span>
                <span className="text-sm font-medium">9:00 AM - 2:00 PM</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Sunday</span>
                <span className="text-sm font-medium text-gray-400">Closed</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Appointment Duration</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="radio" name="duration" value="30" defaultChecked className="mr-2" />
                <span className="text-sm">30 minutes</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="duration" value="45" className="mr-2" />
                <span className="text-sm">45 minutes</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="duration" value="60" className="mr-2" />
                <span className="text-sm">60 minutes</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 