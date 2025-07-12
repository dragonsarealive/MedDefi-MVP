'use client';

import { useUser } from '@/contexts/UserContext';
import { Star, MessageCircle, ThumbsUp, ThumbsDown, Calendar } from 'lucide-react';

const mockRatings = [
  {
    id: '1',
    patientName: 'John Smith',
    rating: 5,
    review: 'Excellent doctor! Very knowledgeable and caring. Explained everything clearly.',
    date: '2025-01-15',
    appointmentType: 'Consultation',
    response: null
  },
  {
    id: '2',
    patientName: 'Maria Garcia',
    rating: 4,
    review: 'Good experience overall. Doctor was professional and helpful.',
    date: '2025-01-10',
    appointmentType: 'Follow-up',
    response: 'Thank you for your feedback, Maria. I\'m glad I could help!'
  },
  {
    id: '3',
    patientName: 'Ahmed Hassan',
    rating: 5,
    review: 'Outstanding care and attention to detail. Highly recommend!',
    date: '2025-01-08',
    appointmentType: 'Initial Visit',
    response: null
  },
  {
    id: '4',
    patientName: 'Sarah Johnson',
    rating: 3,
    review: 'The consultation was okay, but I felt rushed. Could have spent more time explaining.',
    date: '2025-01-05',
    appointmentType: 'Consultation',
    response: 'I apologize for the rushed feeling. I\'ll make sure to allocate more time for detailed explanations in future appointments.'
  }
];

export default function MyRatingsPage() {
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

  const averageRating = mockRatings.reduce((acc, rating) => acc + rating.rating, 0) / mockRatings.length;
  const totalReviews = mockRatings.length;
  const fiveStarReviews = mockRatings.filter(r => r.rating === 5).length;
  const fourStarReviews = mockRatings.filter(r => r.rating === 4).length;
  const threeStarReviews = mockRatings.filter(r => r.rating === 3).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Ratings & Reviews</h1>
          <p className="text-gray-600">View and respond to patient feedback</p>
        </div>
      </div>

      {/* Rating Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="flex items-center justify-center gap-1 mb-2">
            <Star className="w-6 h-6 text-yellow-500 fill-current" />
            <span className="text-2xl font-bold text-gray-900">{averageRating.toFixed(1)}</span>
          </div>
          <p className="text-sm text-gray-600">Average Rating</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-2xl font-bold text-gray-900 mb-2">{totalReviews}</div>
          <p className="text-sm text-gray-600">Total Reviews</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-2xl font-bold text-green-600 mb-2">{fiveStarReviews}</div>
          <p className="text-sm text-gray-600">5-Star Reviews</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-2xl font-bold text-blue-600 mb-2">{fourStarReviews}</div>
          <p className="text-sm text-gray-600">4-Star Reviews</p>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h2>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map(stars => {
            const count = mockRatings.filter(r => r.rating === stars).length;
            const percentage = (count / totalReviews) * 100;
            return (
              <div key={stars} className="flex items-center gap-4">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm font-medium">{stars}</span>
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full" 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-12">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Patient Reviews</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {mockRatings.map((rating) => (
            <div key={rating.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700">
                    {rating.patientName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{rating.patientName}</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < rating.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">{rating.rating}/5</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    {rating.date}
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {rating.appointmentType}
                  </span>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-700">{rating.review}</p>
              </div>

              {rating.response && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                  <div className="flex items-start gap-2">
                    <MessageCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900 mb-1">Your Response:</p>
                      <p className="text-sm text-blue-800">{rating.response}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm">
                  <MessageCircle className="w-4 h-4" />
                  {rating.response ? 'Edit Response' : 'Respond'}
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-gray-700 text-sm">
                  <ThumbsUp className="w-4 h-4" />
                  Helpful
                </button>
                <button className="flex items-center gap-2 text-gray-600 hover:text-gray-700 text-sm">
                  <ThumbsDown className="w-4 h-4" />
                  Not Helpful
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 