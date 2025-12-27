'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Services() {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('http://localhost:5000/api/services')
      .then(res => {
        setServices(res.data.services)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading">Loading services...</div>

  return (
    <section id="services" className="services">
      <h2>Our Services</h2>
      <div className="services-grid">
        {services.map(s => (
          <div key={s.id} className="service-card">
            <div className="icon">🦷</div>
            <h3>{s.name}</h3>
            <p>{s.description}</p>
            <div className="price">${s.price}</div>
            <button>Book Now</button>
          </div>
        ))}
      </div>
    </section>
  )
}
