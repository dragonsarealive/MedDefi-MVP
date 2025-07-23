'use client';

import React from 'react';
import { FiStar } from 'react-icons/fi';

const PatientReview = () => {
  const reviews = [
    {
      name: 'John Smith',
      role: 'Patient',
      rating: 5,
      comment: 'The care I received was exceptional. The doctors were knowledgeable and the staff was very friendly.',
      image: '/placeholder-avatar.jpg'
    },
    {
      name: 'Sarah Johnson',
      role: 'Patient',
      rating: 5,
      comment: 'I was impressed by the level of professionalism and the quality of care. Highly recommended!',
      image: '/placeholder-avatar.jpg'
    },
    {
      name: 'Michael Brown',
      role: 'Patient',
      rating: 5,
      comment: 'The online consultation was smooth and efficient. The doctor was very thorough in addressing my concerns.',
      image: '/placeholder-avatar.jpg'
    }
  ];

  return (
    <div className="w-full py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Our Patients Say
          </h2>
          <p className="text-xl text-gray-600">
            Read about experiences from our valued patients
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 mr-4"></div>
                <div>
                  <h3 className="font-semibold text-gray-900">{review.name}</h3>
                  <p className="text-gray-600 text-sm">{review.role}</p>
                </div>
              </div>
              <div className="flex text-yellow-400 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <FiStar key={i} className="fill-current" />
                ))}
              </div>
              <p className="text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientReview; 