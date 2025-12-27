'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, X, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface PaymentModalProps {
  appointmentId: string
  onClose: () => void
}

export default function PaymentModal({ appointmentId, onClose }: PaymentModalProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleDemoPayment = async () => {
    setLoading(true)
    
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      toast.success('Payment Successful! (Demo Mode)')
      
      // Close after 2 seconds
      setTimeout(() => {
        onClose()
      }, 2000)
    }, 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {!success ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Complete Payment</h2>
              <button
                onClick={onClose}
                className="hover:bg-gray-100 p-2 rounded-full transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Demo Notice */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-sm text-blue-800 font-medium">
                🎯 Demo Mode - No real payment required
              </p>
              <p className="text-xs text-blue-600 mt-1">
                This is a portfolio demonstration project
              </p>
            </div>

            {/* Fake Card Form */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  value="4242 4242 4242 4242"
                  disabled
                  className="w-full p-3 border-2 border-gray-200 rounded-xl bg-gray-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry
                  </label>
                  <input
                    type="text"
                    value="12/25"
                    disabled
                    className="w-full p-3 border-2 border-gray-200 rounded-xl bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVC
                  </label>
                  <input
                    type="text"
                    value="123"
                    disabled
                    className="w-full p-3 border-2 border-gray-200 rounded-xl bg-gray-50"
                  />
                </div>
              </div>
            </div>

            {/* Pay Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDemoPayment}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Pay Now (Demo)
                </>
              )}
            </motion.button>
          </>
        ) : (
          <div className="text-center py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="inline-block"
            >
              <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Payment Successful!
            </h3>
            <p className="text-gray-600">
              Your appointment has been confirmed
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Check your email for details
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
