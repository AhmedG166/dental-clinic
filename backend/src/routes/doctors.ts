// Get doctor availability
router.get('/:id/availability', async (req, res) => {
  try {
    const { id } = req.params
    const { date } = req.query

    if (!date) {
      return res.status(400).json({ error: 'Date is required' })
    }

    // Get doctor
    const doctor = await prisma.doctor.findUnique({
      where: { id },
    })

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' })
    }

    // Get booked slots for this doctor on this date
    const bookedAppointments = await prisma.appointment.findMany({
      where: {
        doctorId: id,
        appointmentDate: new Date(date as string),
        status: { not: 'cancelled' },
      },
      select: { appointmentTime: true },
    })

    const bookedSlots = bookedAppointments.map((apt) => apt.appointmentTime)

    // Generate all available slots (9 AM - 5 PM, 30-minute intervals)
    const allSlots = []
    for (let hour = 9; hour <= 16; hour++) {
      allSlots.push(`${hour.toString().padStart(2, '0')}:00`)
      if (hour < 16) allSlots.push(`${hour.toString().padStart(2, '0')}:30`)
    }

    // Filter out booked slots
    const availableSlots = allSlots.filter((slot) => !bookedSlots.includes(slot))

    res.json({ availableSlots })
  } catch (error) {
    console.error('Error fetching availability:', error)
    res.status(500).json({ error: 'Failed to fetch availability' })
  }
})
