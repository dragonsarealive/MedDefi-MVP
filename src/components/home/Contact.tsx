import React from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Plus,
  Send,
  MessageCircle
} from 'lucide-react';

const Contact = () => {
  return (
    <div className="bg-gray-100 py-8 md:py-12">
      <div className="w-full">
        <div className="bg-white mx-4 sm:mx-6 lg:mx-8 rounded-3xl p-4 sm:p-6 md:p-8 shadow-lg">
          
          {/* Header Section */}
          <div className="text-center mb-8 lg:mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ready to start your medical tourism journey? Contact us today for personalized assistance.
            </p>
          </div>

          {/* Contact Form and Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Contact Form */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <MessageCircle className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-800">Send us a Message</h3>
              </div>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Full Name"
                  />
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Email"
                  />
                </div>
                <input 
                  type="tel" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Phone Number"
                />
                <textarea 
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Your message..."
                ></textarea>
                <button 
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="bg-blue-600 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-3 mb-6">
                <Plus className="w-6 h-6 text-white" />
                <span className="text-2xl font-bold">MedDeFi</span>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-blue-200" />
                  <div>
                    <p className="text-sm text-blue-200">24/7 Support</p>
                    <p className="text-lg font-semibold">+1-800-MEDDEFI</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-200" />
                  <div>
                    <p className="text-sm text-blue-200">Email</p>
                    <p className="text-lg font-semibold">care@meddefi.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-blue-200" />
                  <div>
                    <p className="text-sm text-blue-200">Location</p>
                    <p className="text-lg font-semibold">San José, Costa Rica</p>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-blue-500">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">2K+</div>
                    <div className="text-sm text-blue-200">Patients</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">50</div>
                    <div className="text-sm text-blue-200">Providers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">4</div>
                    <div className="text-sm text-blue-200">Countries</div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Copyright */}
          <div className="border-t border-gray-200 pt-6 mt-8">
            <div className="text-center">
              <p className="text-sm text-gray-600">&copy; 2025 MedDeFi. All rights reserved.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact; 