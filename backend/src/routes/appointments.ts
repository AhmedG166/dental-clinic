import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { authenticateToken } from '../middleware/auth.middleware';
import { PrismaClient } from '@prisma/client';
import * as emailService from '../services/emailService';
import nodemailer from 'nodemailer';

const router = express.Router();
const prisma = new PrismaClient();

// ============= TEST EMAIL ENDPOINT =============
router.post('/test-email', async (req: Request, res: Response) => {
  try {
    const { toEmail } = req.body;
    
    console.log('\n📧 ========== EMAIL TEST START ==========');
    console.log('To Email:', toEmail || 'Not provided');
    console.log('From Email:', process.env.EMAIL_USER);
    console.log('Password exists:', !!process.env.EMAIL_PASS);
    console.log('Password length:', process.env.EMAIL_PASS?.length);
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error('EMAIL_USER or EMAIL_PASS not configured in .env');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      debug: true,
    });

    console.log('🔧 Transporter created');
    console.log('🔍 Verifying connection...');
    await transporter.verify();
    console.log('✅ Connection verified!');

    console.log('📨 Sending email...');
    const info = await transporter.sendMail({
      from: `"SmileCare Test" <${process.env.EMAIL_USER}>`,
      to: toEmail || process.env.EMAIL_USER,
      subject: '✅ Test Email from SmileCare',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f3f4f6; border-radius: 10px;">
          <h1 style="color: #3b82f6;">🎉 Email is Working!</h1>
          <p>If you received this email, your email configuration is correct.</p>
          <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>From:</strong> ${process.env.EMAIL_USER}</p>
          <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 14px;">SmileCare Dental Clinic - Email Test</p>
        </div>
      `,
    });

    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('========== EMAIL TEST END ==========\n');

    res.json({
      success: true,
      message: 'Test email sent successfully!',
      messageId: info.messageId,
      sentTo: toEmail || process.env.EMAIL_USER,
    });
  } catch (error: any) {
    console.error('\n❌ ========== EMAIL TEST FAILED ==========');
    console.error('Error:', error.message);
    if (error.code) console.error('Error Code:', error.code);
    if (error.response) console.error('SMTP Response:', error.response);
    console.error('========== ERROR END ==========\n');

    res.status(500).json({
      success: false,
      error: error.message,
      code: error.code,
      details: error.toString(),
    });
  }
});

// Get user's own appointments
router.get('/my/appointments', authenticateToken, async (req: any, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        patientEmail: req.user?.email,
      },
      include: {
        service: true,
        doctor: true,
      },
      orderBy: {
        appointmentDate: 'desc',
      },
    });

    res.json({ appointments });
  } catch (error) {
    console.error('Error fetching user appointments:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// Get all appointments
router.get('/', async (req: Request, res: Response) => {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        service: true,
        doctor: true,
      },
      orderBy: {
        appointmentDate: 'desc',
      },
    });

    res.json({ appointments });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// Get single appointment by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        service: true,
        doctor: true,
      },
    });

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json({ appointment });
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({ error: 'Failed to fetch appointment' });
  }
});

// Create appointment
router.post(
  '/',
  [
    body('patientName').notEmpty().withMessage('Patient name is required'),
    body('patientEmail').isEmail().withMessage('Valid email is required'),
    body('patientPhone').notEmpty().withMessage('Phone number is required'),
    body('serviceId').notEmpty().withMessage('Service is required'),
    body('doctorId').notEmpty().withMessage('Doctor is required'),
    body('appointmentDate').isISO8601().withMessage('Valid date is required'),
    body('appointmentTime').notEmpty().withMessage('Time is required'),
  ],
  async (req: Request, res: Response) => {
    try {
      const {
        patientName,
        patientEmail,
        patientPhone,
        serviceId,
        doctorId,
        appointmentDate,
        appointmentTime,
        notes,
      } = req.body;

      const appointment = await prisma.appointment.create({
        data: {
          patientName,
          patientEmail,
          patientPhone,
          serviceId,
          doctorId,
          appointmentDate: new Date(appointmentDate),
          appointmentTime,
          notes: notes || '',
          status: 'pending',
        },
        include: {
          service: true,
          doctor: true,
        },
      });

      try {
        await emailService.sendBookingConfirmation(appointment);
        await emailService.sendAdminNotification(appointment);
        console.log('✅ Email notifications sent successfully');
      } catch (emailError) {
        console.error('⚠️ Email sending failed:', emailError);
      }

      res.status(201).json({
        message: 'Appointment created successfully! Confirmation email sent.',
        appointment,
      });
    } catch (error) {
      console.error('Error creating appointment:', error);
      res.status(500).json({ error: 'Failed to create appointment' });
    }
  }
);

// Update appointment status
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status },
      include: {
        service: true,
        doctor: true,
      },
    });

    try {
      if (status === 'confirmed') {
        await emailService.sendAppointmentConfirmed(appointment);
        console.log('✅ Confirmation email sent');
      } else if (status === 'cancelled') {
        await emailService.sendAppointmentCancelled(appointment);
        console.log('✅ Cancellation email sent');
      }
    } catch (emailError) {
      console.error('⚠️ Email sending failed:', emailError);
    }

    res.json({
      message: `Appointment ${status}! Email notification sent.`,
      appointment,
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ error: 'Failed to update appointment' });
  }
});

// Delete appointment
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.appointment.delete({
      where: { id },
    });

    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ error: 'Failed to delete appointment' });
  }
});

export default router;
