'use client'

import React from 'react';
import Image from 'next/image';
import { Heart, Shield, Globe, Users } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About MedDeFi
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Revolutionizing healthcare across borders with blockchain technology and decentralized finance
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Image */}
          <div className="relative">
            <div className="relative h-96 rounded-2xl overflow-hidden">
              <Image
                src="/images/2149355015.jpg"
                alt="Medical professionals working together"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent"></div>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Our Mission
              </h3>
              <p className="text-gray-600 leading-relaxed">
                MedDeFi is dedicated to making healthcare accessible and affordable across borders. 
                We leverage blockchain technology to create a secure, transparent, and efficient 
                platform for medical tourism and cross-border healthcare payments.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Heart className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Patient-Centered Care</h4>
                  <p className="text-sm text-gray-600">
                    Every decision we make is focused on improving patient outcomes and experience.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Secure & Transparent</h4>
                  <p className="text-sm text-gray-600">
                    Blockchain technology ensures all transactions are secure and transparent.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Globe className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Global Network</h4>
                  <p className="text-sm text-gray-600">
                    Connect with healthcare providers worldwide through our extensive network.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Community Driven</h4>
                  <p className="text-sm text-gray-600">
                    Built by the community, for the community, ensuring fair and accessible healthcare.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-colors">
                Learn More About Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs; 