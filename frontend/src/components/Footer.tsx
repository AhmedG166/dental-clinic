import Link from 'next/link';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="text-3xl">🦷</span>
              <div>
                <p className="text-lg font-bold text-white">SmileCare</p>
                <p className="text-xs text-gray-400">Dental Clinic</p>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              Premium dental care with state-of-the-art technology since 2013.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-blue-400">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-blue-400">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/doctors" className="hover:text-blue-400">
                  Doctors
                </Link>
              </li>
              <li>
                <Link href="/booking" className="hover:text-blue-400">
                  Book Appointment
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-4 font-semibold text-white">Our Services</h3>
            <ul className="space-y-2 text-sm">
              <li>Teeth Whitening</li>
              <li>Dental Implants</li>
              <li>Orthodontic Treatment</li>
              <li>Root Canal Treatment</li>
              <li>Preventive Checkup</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 font-semibold text-white">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 text-blue-400" />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 text-blue-400" />
                <span>info@smilecare.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-blue-400" />
                <span>123 Dental St, City, State 12345</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 text-blue-400" />
                <div>
                  <p>Mon-Fri: 8AM-6PM</p>
                  <p>Sat: 8AM-3PM</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm">
          <p>&copy; 2025 SmileCare Dental Clinic. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
