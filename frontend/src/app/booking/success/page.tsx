// src/app/booking/success/page.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Home, Calendar, Phone, Mail } from "lucide-react";

export default function BookingSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "your email";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Appointment Booked Successfully!
        </h1>

        <p className="text-gray-600 mb-2">
          We've received your booking request.
        </p>

        <p className="text-gray-600 mb-6">
          You'll receive a confirmation email shortly at{" "}
          <span className="font-semibold text-blue-600">{email}</span>
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-blue-900 mb-3">📋 What's Next?</h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-green-600">✅</span>
              <span>Check your email for confirmation details</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">👨‍⚕️</span>
              <span>Our team will review and confirm your appointment</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600">📱</span>
              <span>You'll receive an SMS reminder 24 hours before</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-600">⏰</span>
              <span>Please arrive 10 minutes early</span>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => router.push("/")}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>

          <button
            onClick={() => router.push("/booking")}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-all font-semibold flex items-center justify-center gap-2"
          >
            <Calendar className="w-5 h-5" />
            Book Another Appointment
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-3">
            Need to make changes or have questions?
          </p>
          <div className="space-y-2">
            <a
              href="tel:5551234567"
              className="flex items-center justify-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="font-semibold">(555) 123-4567</span>
            </a>
            <a
              href="mailto:info@smilecare.com"
              className="flex items-center justify-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>info@smilecare.com</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
