'use client'

import { useState } from 'react'
import Link from 'next/link'
import Booking from './Booking'

export default function Navbar() {
  const [showBooking, setShowBooking] = useState(false)

  return (
    <>
      <nav className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gray-900">
            🦷 <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">SmileCare</span>
          </Link>
          
          <div className="hidden items-center gap-8 md:flex">
            <Link href="#services" className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600">
              Services
            </Link>
            <Link href="#doctors" className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600">
              Doctors
            </Link>
            <Link href="#about" className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600">
              About
            </Link>
            <Link href="#contact" className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600">
              Contact
            </Link>
            <button
              onClick={() => setShowBooking(true)}
              className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg"
            >
              Book Now
            </button>
          </div>
        </div>
      </nav>

      {/* Booking Modal */}
      {showBooking && <Booking onClose={() => setShowBooking(false)} />}
    </>
  )
}
