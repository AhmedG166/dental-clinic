import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get all doctors
router.get('/', async (req, res) => {
  try {
    const doctors = await prisma.doctor.findMany({
      orderBy: { rating: 'desc' },
    });
    res.json({ doctors });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
});

// Get doctor availability
router.get('/:id/availability', async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId: id,
        appointmentDate: new Date(date as string),
        status: { not: 'CANCELLED' },
      },
      select: { appointmentTime: true },
    });

    const bookedSlots = appointments.map((a) => a.appointmentTime);
    
    // Available time slots (9 AM - 5 PM)
    const allSlots = [
      '09:00', '10:00', '11:00', '12:00',
      '13:00', '14:00', '15:00', '16:00', '17:00',
    ];
    
    const availableSlots = allSlots.filter((slot) => !bookedSlots.includes(slot));

    res.json({ availableSlots });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
});

export default router;
