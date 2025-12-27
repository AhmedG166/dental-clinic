'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Doctors() {
  const [doctors, setDoctors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('http://localhost:5000/api/doctors')
      .then(res => {
        setDoctors(res.data.doctors)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading">Loading doctors...</div>

  return (
    <section id="doctors" className="doctors">
      <h2>Meet Our Doctors</h2>
      <div className="doctors-grid">
        {doctors.map(d => (
          <div key={d.id} className="doctor-card">
            <div className="doctor-header">
              <div className="doctor-avatar">👨‍⚕️</div>
              <div className="doctor-info">
                <h3>Dr. {d.firstName} {d.lastName}</h3>
                <div className="specialty">{d.specialization}</div>
                <div className="rating">⭐ {d.rating}/5</div>
              </div>
            </div>
            <p>{d.bio}</p>
            <p>{d.yearsOfExperience} years of experience</p>
            <button>Book Appointment</button>
          </div>
        ))}
      </div>
    </section>
  )
}
