'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Mitchell',
    role: 'Marketing Director',
    content:
      'Best dental experience ever! The staff is incredibly professional and caring. My teeth whitening results exceeded expectations.',
    rating: 5,
    avatar: '👩',
  },
  {
    name: 'James Rodriguez',
    role: 'Software Engineer',
    content:
      'Finally found a dentist I can trust. They explained everything clearly and made me feel comfortable throughout the procedure.',
    rating: 5,
    avatar: '👨',
  },
  {
    name: 'Emily Chen',
    role: 'Teacher',
    content:
      'My family has been coming here for years. Great with kids and always professional. Highly recommend SmileCare!',
    rating: 5,
    avatar: '👩‍🦰',
  },
];

export default function Testimonials() {
  return (
    <section className="bg-gradient-to-br from-gray-50 to-white py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold text-gray-900 md:text-4xl">
            What Our Patients Say
          </h2>
          <p className="text-gray-600">
            Real experiences from real people who trust us with their smiles
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="rounded-2xl bg-white p-6 shadow-lg"
            >
              <div className="mb-4 flex gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              <p className="mb-6 text-gray-700">{testimonial.content}</p>

              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-2xl">
                  {testimonial.avatar}
                </span>
                <div>
                  <p className="font-semibold text-gray-900">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
