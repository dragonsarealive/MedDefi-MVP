import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-white flex flex-col items-start justify-start py-12 px-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl p-10 md:p-16 mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-blue-700 text-left">Privacy Policy</h1>
        <p className="text-lg text-gray-700 mb-6 text-left">
          At MedDeFi, your privacy is our top priority. This Privacy Policy explains how we collect, use, and protect your personal information when you use our platform.
        </p>
        <h2 className="text-2xl font-bold text-blue-700 mt-8 mb-2 text-left">Information We Collect</h2>
        <ul className="list-disc pl-6 mb-6 text-left">
          <li>Personal identification information (name, email, phone number, etc.)</li>
          <li>Medical information provided for booking and consultation</li>
          <li>Usage data and cookies for improving our services</li>
        </ul>
        <h2 className="text-2xl font-bold text-blue-700 mt-8 mb-2 text-left">How We Use Your Information</h2>
        <ul className="list-disc pl-6 mb-6 text-left">
          <li>To provide and improve our services</li>
          <li>To process bookings and payments securely</li>
          <li>To communicate with you about your account and services</li>
          <li>To comply with legal obligations</li>
        </ul>
        <h2 className="text-2xl font-bold text-blue-700 mt-8 mb-2 text-left">Your Rights & Choices</h2>
        <ul className="list-disc pl-6 mb-6 text-left">
          <li>Access, update, or delete your personal information</li>
          <li>Opt out of marketing communications</li>
          <li>Request information about our data practices</li>
        </ul>
        <h2 className="text-2xl font-bold text-blue-700 mt-8 mb-2 text-left">Data Security</h2>
        <p className="mb-6 text-left">
          We use industry-standard security measures to protect your data from unauthorized access, disclosure, or alteration.
        </p>
        <h2 className="text-2xl font-bold text-blue-700 mt-8 mb-2 text-left">Contact Us</h2>
        <p className="mb-6 text-left">
          If you have any questions or concerns about our privacy policy, please contact us at <a href="mailto:privacy@meddefi.com" className="text-blue-600 underline">privacy@meddefi.com</a>.
        </p>
        <div className="mt-10 text-gray-500 text-sm text-left">
          This Privacy Policy may be updated from time to time. Please review it regularly for any changes.
        </div>
      </div>
    </div>
  );
} 