'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MessageSquare } from 'lucide-react';
import Booking from './Booking';

export default function Hero() {
  const [showBooking, setShowBooking] = useState(false);

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 py-16 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 md:grid-cols-2">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600"></span>
                </span>
                Accepting New Patients
              </div>

              <h1 className="mb-4 text-4xl font-bold leading-tight text-gray-900 md:text-5xl lg:text-6xl">
                Your Smile,{' '}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Our Priority
                </span>
              </h1>

              <p className="mb-8 text-lg text-gray-600">
                Premium dental care with state-of-the-art technology. Experience
                compassionate treatment from our expert team.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row">
                <button
                  onClick={() => setShowBooking(true)}
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-700 hover:shadow-xl"
                >
                  <Calendar className="h-5 w-5" />
                  Book Appointment
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </button>

                <button className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-8 py-4 text-base font-semibold text-gray-700 transition-all hover:border-blue-600 hover:text-blue-600">
                  <MessageSquare className="h-5 w-5" />
                  Chat with Us
                </button>
              </div>

              {/* Trust Badges */}
              <div className="mt-10 grid grid-cols-3 gap-6 border-t border-gray-200 pt-6">
                <div>
                  <p className="text-3xl font-bold text-blue-600">10+</p>
                  <p className="text-sm text-gray-600">Years Experience</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-blue-600">5K+</p>
                  <p className="text-sm text-gray-600">Happy Patients</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-blue-600">4.9★</p>
                  <p className="text-sm text-gray-600">Patient Rating</p>
                </div>
              </div>
            </motion.div>

            {/* Right Content - Feature Cards */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="space-y-4">
                <div className="rounded-2xl bg-white p-6 shadow-xl">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-2xl">🦷</span>
                    <h3 className="font-semibold text-gray-900">
                      Advanced Technology
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Latest dental equipment for precise, comfortable treatment
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-xl">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-2xl">⚡</span>
                    <h3 className="font-semibold text-gray-900">
                      Same-Day Appointments
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Emergency care available - we're here when you need us
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-xl">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-2xl">💳</span>
                    <h3 className="font-semibold text-gray-900">
                      Flexible Payment Plans
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Insurance accepted • Payment plans • Transparent pricing
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {showBooking && <Booking onClose={() => setShowBooking(false)} />}
    </>
  );
}
