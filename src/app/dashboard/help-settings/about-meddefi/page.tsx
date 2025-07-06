import React from "react";

export default function AboutMedDeFi() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-white flex flex-col items-start justify-start py-12 px-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl p-10 md:p-16 mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-blue-700 text-left">About MedDeFi</h1>
        <p className="text-lg text-gray-700 mb-6 text-left">
          <strong>MedDeFi</strong> is a next-generation medical tourism platform dedicated to connecting patients worldwide with top healthcare providers. Our mission is to make global healthcare accessible, transparent, and affordable for everyone.
        </p>
        <h2 className="text-2xl font-bold text-blue-700 mt-8 mb-2 text-left">Our Mission</h2>
        <p className="mb-6 text-left">
          We believe that everyone deserves access to high-quality medical care, regardless of their location. MedDeFi empowers patients to find, compare, and book medical services across borders with confidence and ease.
        </p>
        <h2 className="text-2xl font-bold text-blue-700 mt-8 mb-2 text-left">Our Values</h2>
        <ul className="list-disc pl-6 mb-6 text-left">
          <li>Transparency in pricing and provider information</li>
          <li>Patient safety and privacy</li>
          <li>Global accessibility</li>
          <li>Continuous innovation</li>
          <li>Compassionate support</li>
        </ul>
        <h2 className="text-2xl font-bold text-blue-700 mt-8 mb-2 text-left">Key Features</h2>
        <ul className="list-disc pl-6 mb-6 text-left">
          <li>Comprehensive doctor and clinic listings with verified reviews</li>
          <li>Easy-to-use search and filtering by specialty, location, and rating</li>
          <li>Secure booking and payment system</li>
          <li>Personalized support and care coordination</li>
          <li>Educational resources and guides for medical travelers</li>
        </ul>
        <div className="mt-10 text-gray-500 text-sm text-left">
          For more information, contact us at <a href="mailto:info@meddefi.com" className="text-blue-600 underline">info@meddefi.com</a>
        </div>
      </div>
    </div>
  );
} 