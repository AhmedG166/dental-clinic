'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Clock, User, CreditCard } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { appointmentsAPI } from '@/lib/api'
import toast from 'react-hot-toast'
import PaymentModal from './PaymentModal'

interface BookingProps {
  onClose: () => void
}

export default function Booking({ onClose }: BookingProps) {
  const [services, setServices] = useState([])
  const [doctors, setDoctors] = useState([])
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [appointmentId, setAppointmentId] = useState('')
  const [showPayment, setShowPayment] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm()

  useEffect(() => {
    loadServices()
    loadDoctors()
  }, [])

  const loadServices = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/services')
      const data = await response.json()
      console.log('✅ Services loaded:', data.services.length)
      setServices(data.services)
    } catch (error) {
      console.error('❌ Failed to load services:', error)
      toast.error('Failed to load services')
    }
  }

  const loadDoctors = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/doctors')
      const data = await response.json()
      console.log('✅ Doctors loaded:', data.doctors.length)
      setDoctors(data.doctors)
    } catch (error) {
      console.error('❌ Failed to load doctors:', error)
      toast.error('Failed to load doctors')
    }
  }

  const onSubmit = async (data: any) => {
    console.log('🔥 BUTTON CLICKED! Form data:', data)
    
    try {
      console.log('📤 Submitting booking...')

      const response = await appointmentsAPI.create({
        patientName: data.patientName,
        patientEmail: data.patientEmail,
        patientPhone: data.patientPhone,
        serviceId: data.serviceId,
        doctorId: data.doctorId,
        appointmentDate: data.date,
        appointmentTime: data.time,
        notes: data.notes || '',
      })

      console.log('✅ Booking successful:', response.data)
      setAppointmentId(response.data.appointment.id)
      toast.success('Appointment created! Check your email.')
      setShowPayment(true)
    } catch (error: any) {
      console.error('❌ Booking failed:', error.response?.data || error)
      toast.error(error.response?.data?.error || 'Failed to create appointment')
    }
  }

  const watchDate = watch('date')
  const watchDoctorId = watch('doctorId')

  useEffect(() => {
    if (watchDoctorId && watchDate) {
      const defaultSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
        '15:00', '15:30', '16:00', '16:30'
      ]
      setAvailableSlots(defaultSlots)
      console.log('✅ Time slots loaded:', defaultSlots.length)
    } else {
      setAvailableSlots([])
    }
  }, [watchDoctorId, watchDate])

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-white">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">Book Appointment</h2>
                <button
                  onClick={onClose}
                  className="hover:bg-white/20 p-2 rounded-full transition"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Patient Information
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    {...register('patientName', { required: true })}
                    placeholder="Enter your full name"
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    {...register('patientEmail', { required: true })}
                    placeholder="your.email@example.com"
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    {...register('patientPhone', { required: true })}
                    placeholder="01234567890"
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <hr className="border-gray-200" />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Service *
                </label>
                <select
                  {...register('serviceId', { required: true })}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Choose a service...</option>
                  {services.map((service: any) => (
                    <option key={service.id} value={service.id}>
                      {service.name} - ${service.price}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Doctor *
                </label>
                <select
                  {...register('doctorId', { required: true })}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Choose a doctor...</option>
                  {doctors.map((doctor: any) => (
                    <option key={doctor.id} value={doctor.id}>
                      Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialization}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date *
                </label>
                <input
                  type="date"
                  {...register('date', { required: true })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                />
              </div>

              {availableSlots.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Time *
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {availableSlots.map((slot: string) => (
                      <label key={slot} className="relative cursor-pointer">
                        <input
                          type="radio"
                          {...register('time', { required: true })}
                          value={slot}
                          className="peer sr-only"
                        />
                        <div className="p-3 border-2 border-gray-200 rounded-xl text-center peer-checked:border-blue-500 peer-checked:bg-blue-50 hover:border-blue-300 transition">
                          <Clock className="w-4 h-4 mx-auto mb-1" />
                          <span className="text-sm font-medium">{slot}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  {...register('notes')}
                  rows={3}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  placeholder="Any special requirements or concerns..."
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition"
              >
                Continue to Payment
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {showPayment && (
        <PaymentModal
          appointmentId={appointmentId}
          onClose={() => {
            setShowPayment(false)
            onClose()
          }}
        />
      )}
    </>
  )
}
