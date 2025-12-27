import axios from 'axios'

const API_URL = 'http://localhost:5000/api'  // غيّر ده

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth API
export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
}

// Services API
export const servicesAPI = {
  getAll: () => api.get('/services'),
  getById: (id: string) => api.get(`/services/${id}`),
}

// Doctors API
export const doctorsAPI = {
  getAll: () => api.get('/doctors'),
  getAvailability: (id: string, date: string) =>
    api.get(`/doctors/${id}/availability?date=${date}`),
}

// Appointments API
export const appointmentsAPI = {
  create: (data: any) => api.post('/appointments', data),
  getAll: () => api.get('/appointments'),
  updateStatus: (id: string, status: string) =>
    api.patch(`/appointments/${id}/status`, { status }),
}

// Payment API
export const paymentAPI = {
  createIntent: (appointmentId: string) =>
    api.post('/payments/create-intent', { appointmentId }),
  confirm: (paymentIntentId: string) =>
    api.post('/payments/confirm', { paymentIntentId }),
}

// Chatbot API
export const chatbotAPI = {
  sendMessage: (message: string, sessionId: string) =>
    api.post('/chatbot/chat', { message, sessionId }),
}

export default api
