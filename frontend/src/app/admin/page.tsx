'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

interface Appointment {
  id: string
  patientName: string
  patientEmail: string
  patientPhone: string
  service: { name: string; price: number }
  doctor: { firstName: string; lastName: string }
  appointmentDate: string
  appointmentTime: string
  status: string
  notes?: string
  createdAt: string
}

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/appointments')
      setAppointments(res.data.appointments)
    } catch (error) {
      console.error('Failed to fetch appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      await axios.patch(`http://localhost:5000/api/appointments/${id}`, { status })
      fetchAppointments()
      alert(`Appointment ${status} successfully!`)
    } catch (error) {
      alert('Failed to update status')
    }
  }

  const deleteAppointment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this appointment?')) return
    try {
      await axios.delete(`http://localhost:5000/api/appointments/${id}`)
      fetchAppointments()
      alert('Appointment deleted successfully!')
    } catch (error) {
      alert('Failed to delete appointment')
    }
  }

  // Statistics
  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
    completed: appointments.filter(a => a.status === 'completed').length,
  }

  // Filtered appointments
  const filteredAppointments = appointments
    .filter(a => filter === 'all' || a.status === filter)
    .filter(a => 
      a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.patientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.patientPhone.includes(searchTerm)
    )

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="admin-loading">Loading dashboard...</div>
        <Footer />
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      <div className="admin-container">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <p>Manage appointments and view statistics</p>
        </div>

        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card stat-total">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Appointments</div>
            </div>
          </div>
          <div className="stat-card stat-pending">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <div className="stat-value">{stats.pending}</div>
              <div className="stat-label">Pending</div>
            </div>
          </div>
          <div className="stat-card stat-confirmed">
            <div className="stat-icon">✓</div>
            <div className="stat-info">
              <div className="stat-value">{stats.confirmed}</div>
              <div className="stat-label">Confirmed</div>
            </div>
          </div>
          <div className="stat-card stat-completed">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <div className="stat-value">{stats.completed}</div>
              <div className="stat-label">Completed</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="admin-controls">
          <div className="filter-tabs">
            <button 
              className={filter === 'all' ? 'active' : ''} 
              onClick={() => setFilter('all')}
            >
              All ({stats.total})
            </button>
            <button 
              className={filter === 'pending' ? 'active' : ''} 
              onClick={() => setFilter('pending')}
            >
              Pending ({stats.pending})
            </button>
            <button 
              className={filter === 'confirmed' ? 'active' : ''} 
              onClick={() => setFilter('confirmed')}
            >
              Confirmed ({stats.confirmed})
            </button>
            <button 
              className={filter === 'completed' ? 'active' : ''} 
              onClick={() => setFilter('completed')}
            >
              Completed ({stats.completed})
            </button>
          </div>
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Appointments Table */}
        <div className="appointments-table-container">
          {filteredAppointments.length === 0 ? (
            <div className="no-appointments">
              <p>No appointments found</p>
            </div>
          ) : (
            <table className="appointments-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Contact</th>
                  <th>Service</th>
                  <th>Doctor</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map(apt => (
                  <tr key={apt.id}>
                    <td>
                      <div className="patient-name">{apt.patientName}</div>
                    </td>
                    <td>
                      <div className="contact-info">
                        <div>{apt.patientEmail}</div>
                        <div className="phone">{apt.patientPhone}</div>
                      </div>
                    </td>
                    <td>
                      <div className="service-info">
                        <div>{apt.service.name}</div>
                        <div className="price">${apt.service.price}</div>
                      </div>
                    </td>
                    <td>Dr. {apt.doctor.firstName} {apt.doctor.lastName}</td>
                    <td>
                      <div className="datetime">
                        <div>{new Date(apt.appointmentDate).toLocaleDateString()}</div>
                        <div className="time">{apt.appointmentTime}</div>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge status-${apt.status}`}>
                        {apt.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        {apt.status === 'pending' && (
                          <>
                            <button 
                              className="btn-confirm"
                              onClick={() => updateStatus(apt.id, 'confirmed')}
                              title="Confirm"
                            >
                              ✓
                            </button>
                            <button 
                              className="btn-cancel"
                              onClick={() => updateStatus(apt.id, 'cancelled')}
                              title="Cancel"
                            >
                              ✕
                            </button>
                          </>
                        )}
                        {apt.status === 'confirmed' && (
                          <button 
                            className="btn-complete"
                            onClick={() => updateStatus(apt.id, 'completed')}
                            title="Complete"
                          >
                            ✓
                          </button>
                        )}
                        <button 
                          className="btn-delete"
                          onClick={() => deleteAppointment(apt.id)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
