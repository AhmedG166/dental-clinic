import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

dotenv.config();

console.log('🔍 Environment Variables Check:');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? '✅ Loaded' : '❌ Missing');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Loaded (length: ' + process.env.EMAIL_PASS?.length + ')' : '❌ Missing');

const app = express();
const PORT = process.env.PORT || 5000;
const prisma = new PrismaClient();

// Create email transporter once (reusable)
const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json());

// ============= TEST EMAIL ENDPOINT (FIRST!) =============
app.post('/api/test-email', async (req: Request, res: Response) => {
  try {
    const { toEmail } = req.body;
    
    console.log('\n📧 ========== EMAIL TEST START ==========');
    console.log('To Email:', toEmail || 'Not provided');
    console.log('From Email:', process.env.EMAIL_USER);
    console.log('Password length:', process.env.EMAIL_PASS?.length);
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error('EMAIL_USER or EMAIL_PASS not configured');
    }

    console.log('🔍 Verifying connection...');
    await emailTransporter.verify();
    console.log('✅ Connection verified!');

    console.log('📨 Sending email...');
    const info = await emailTransporter.sendMail({
      from: `"SmileCare Test" <${process.env.EMAIL_USER}>`,
      to: toEmail || process.env.EMAIL_USER,
      subject: '✅ Test Email from SmileCare',
      html: `
        <div style="font-family: Arial; padding: 20px; background: #f3f4f6; border-radius: 10px;">
          <h1 style="color: #3b82f6;">🎉 Email is Working!</h1>
          <p>If you received this email, your configuration is correct!</p>
          <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>From:</strong> ${process.env.EMAIL_USER}</p>
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
    console.error('========== ERROR END ==========\n');

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
// ============= END TEST EMAIL =============

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

// Get all services
app.get('/api/services', async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
    });
    console.log('✅ Services fetched:', services.length);
    res.json({ services });
  } catch (error) {
    console.error('❌ Services error:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// Get all doctors
app.get('/api/doctors', async (req, res) => {
  try {
    const doctors = await prisma.doctor.findMany();
    console.log('✅ Doctors fetched:', doctors.length);
    res.json({ doctors });
  } catch (error) {
    console.error('❌ Doctors error:', error);
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
});

// Get available time slots
app.get('/api/appointments/available-slots', async (req, res) => {
  try {
    const { doctorId, date } = req.query;

    const allSlots = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
      '15:00', '15:30', '16:00', '16:30', '17:00'
    ];

    if (!doctorId || !date) {
      return res.json({ slots: allSlots });
    }

    const bookedAppointments = await prisma.appointment.findMany({
      where: {
        doctorId: doctorId as string,
        appointmentDate: new Date(date as string),
        status: { not: 'cancelled' }
      }
    });

    const bookedSlots = bookedAppointments.map(apt => apt.appointmentTime);
    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

    console.log(`✅ Available slots for ${date}:`, availableSlots.length);
    res.json({ slots: availableSlots });
  } catch (error) {
    console.error('❌ Available slots error:', error);
    res.status(500).json({ error: 'Failed to fetch available slots' });
  }
});

// Get all appointments
app.get('/api/appointments', async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        service: true,
        doctor: true
      },
      orderBy: {
        appointmentDate: 'desc'
      }
    });
    console.log('✅ Appointments fetched:', appointments.length);
    res.json({ appointments });
  } catch (error) {
    console.error('❌ Get appointments error:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// Helper function to send confirmation email
async function sendConfirmationEmail(appointment: any, patientEmail: string, patientName: string) {
  try {
    console.log('📧 Sending confirmation email to:', patientEmail);
    
    // Verify connection first
    await emailTransporter.verify();
    console.log('✅ Email connection verified');

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb; border-radius: 10px;">
        <div style="background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0;">🦷 SmileCare Dental Clinic</h1>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1f2937;">Hi ${patientName}! 👋</h2>
          <p style="font-size: 16px; color: #4b5563;">Your appointment has been successfully booked!</p>
          
          <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #3b82f6; margin-top: 0;">📅 Appointment Details:</h3>
            <p style="margin: 10px 0;"><strong>Service:</strong> ${appointment.service.name}</p>
            <p style="margin: 10px 0;"><strong>Doctor:</strong> Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}</p>
            <p style="margin: 10px 0;"><strong>Date:</strong> ${new Date(appointment.appointmentDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p style="margin: 10px 0;"><strong>Time:</strong> ${appointment.appointmentTime}</p>
            <p style="margin: 10px 0;"><strong>Duration:</strong> ${appointment.service.duration} minutes</p>
            <p style="margin: 10px 0;"><strong>Price:</strong> $${appointment.service.price}</p>
          </div>
          
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <p style="margin: 0; color: #92400e;"><strong>⏰ Important:</strong> Please arrive 10 minutes before your appointment.</p>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            <strong>Questions?</strong> Contact us at:<br>
            📞 (555) 123-4567<br>
            ✉️ info@smilecare.com
          </p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">
            SmileCare Dental Clinic<br>
            123 Dental Street, City Center, State 12345
          </p>
        </div>
      </div>
    `;

    const info = await emailTransporter.sendMail({
      from: `"SmileCare Clinic" <${process.env.EMAIL_USER}>`,
      to: patientEmail,
      subject: '✅ Appointment Confirmed - SmileCare',
      html: emailHtml,
    });

    console.log('✅ Confirmation email sent successfully to:', patientEmail);
    console.log('📧 Message ID:', info.messageId);
    return true;
  } catch (emailError: any) {
    console.error('❌ Failed to send confirmation email:', emailError.message);
    console.error('❌ Email error details:', emailError);
    return false;
  }
}

// Create new appointment
app.post('/api/appointments', async (req, res) => {
  try {
    const {
      patientName,
      patientEmail,
      patientPhone,
      serviceId,
      doctorId,
      appointmentDate,
      appointmentTime,
      notes
    } = req.body;

    // Validation
    if (!patientName || !patientEmail || !patientPhone || !serviceId || !doctorId || !appointmentDate || !appointmentTime) {
      return res.status(400).json({ error: 'All required fields must be filled' });
    }

    // Check for existing appointment
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        doctorId,
        appointmentDate: new Date(appointmentDate),
        appointmentTime,
        status: { not: 'cancelled' }
      }
    });

    if (existingAppointment) {
      return res.status(400).json({ error: 'This time slot is already booked' });
    }

    // Create appointment
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
        status: 'pending'
      },
      include: {
        service: true,
        doctor: true
      }
    });

    console.log('✅ Appointment created:', appointment.id);

    // Send confirmation email (non-blocking)
    sendConfirmationEmail(appointment, patientEmail, patientName).catch(err => {
      console.error('❌ Email sending failed in background:', err);
    });

    // Return success response immediately
    res.status(201).json({
      message: 'Appointment booked successfully! Check your email for confirmation.',
      appointment
    });
  } catch (error: any) {
    console.error('❌ Create appointment error:', error);
    res.status(500).json({ error: 'Failed to create appointment' });
  }
});

// Update appointment status
app.patch('/api/appointments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status },
      include: {
        service: true,
        doctor: true
      }
    });

    console.log(`✅ Appointment ${id} updated to ${status}`);
    res.json({ appointment });
  } catch (error) {
    console.error('❌ Update appointment error:', error);
    res.status(500).json({ error: 'Failed to update appointment' });
  }
});

// Delete appointment
app.delete('/api/appointments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.appointment.delete({ where: { id } });
    console.log(`✅ Appointment ${id} deleted`);
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('❌ Delete appointment error:', error);
    res.status(500).json({ error: 'Failed to delete appointment' });
  }
});

// Enhanced AI Chatbot
app.post('/api/chatbot/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const lowerMessage = message.toLowerCase();

    const services = await prisma.service.findMany({ where: { isActive: true } });
    const doctors = await prisma.doctor.findMany();

    let response = '';

    // Services & Prices
    if (
      lowerMessage.includes('service') ||
      lowerMessage.includes('treatment') ||
      lowerMessage.includes('offer') ||
      lowerMessage.includes('what do you')
    ) {
      response = '🦷 **Our Dental Services:**\n\n';
      services.forEach(s => {
        response += `• **${s.name}**: $${s.price}\n  ${s.description}\n  Duration: ${s.duration} minutes\n\n`;
      });
      response += 'Which service interests you?';
    }
    // Specific service prices
    else if (
      lowerMessage.includes('price') ||
      lowerMessage.includes('cost') ||
      lowerMessage.includes('how much')
    ) {
      if (lowerMessage.includes('whitening')) {
        const service = services.find(s => s.name.toLowerCase().includes('whitening'));
        response = service
          ? `Teeth Whitening costs $${service.price} and takes ${service.duration} minutes. 😁`
          : 'Please check our services for pricing details.';
      } else if (lowerMessage.includes('implant')) {
        const service = services.find(s => s.name.toLowerCase().includes('implant'));
        response = service
          ? `Dental Implants cost $${service.price}. This includes consultation and procedure. 🦷`
          : 'Please check our services for pricing details.';
      } else if (lowerMessage.includes('root canal')) {
        const service = services.find(s => s.name.toLowerCase().includes('root'));
        response = service
          ? `Root Canal Treatment costs $${service.price}. 💪`
          : 'Please check our services for pricing details.';
      } else if (lowerMessage.includes('orthodontic') || lowerMessage.includes('braces')) {
        const service = services.find(s => s.name.toLowerCase().includes('orthodontic'));
        response = service
          ? `Orthodontic Treatment costs $${service.price}. This includes braces and aligners. 😬`
          : 'Please check our services for pricing details.';
      } else {
        response = '💰 **Service Prices:**\n\n';
        services.forEach(s => {
          response += `• ${s.name}: $${s.price}\n`;
        });
        response += '\nNeed details on a specific service?';
      }
    }
    // Doctors
    else if (
      lowerMessage.includes('doctor') ||
      lowerMessage.includes('dentist') ||
      lowerMessage.includes('specialist') ||
      lowerMessage.includes('who are')
    ) {
      response = '👨‍⚕️ **Meet Our Expert Team:**\n\n';
      doctors.forEach(d => {
        response += `**Dr. ${d.firstName} ${d.lastName}**\n`;
        response += `${d.specialization}\n`;
        response += `⭐ ${d.rating}/5 rating | ${d.yearsOfExperience} years experience\n`;
        response += `${d.bio}\n\n`;
      });
      response += 'Would you like to book with a specific doctor?';
    }
    // Working Hours
    else if (
      lowerMessage.includes('hour') ||
      lowerMessage.includes('time') ||
      lowerMessage.includes('open') ||
      lowerMessage.includes('close') ||
      lowerMessage.includes('when') ||
      lowerMessage.includes('weekend')
    ) {
      response = '🕐 **Working Hours:**\n\n';
      response += '📅 Monday - Friday: 8:00 AM - 6:00 PM\n';
      response += '📅 Saturday: 9:00 AM - 3:00 PM\n';
      response += '📅 Sunday: Closed\n\n';
      response += 'We also offer emergency appointments! 🚨';
    }
    // Location & Contact
    else if (
      lowerMessage.includes('location') ||
      lowerMessage.includes('address') ||
      lowerMessage.includes('where') ||
      lowerMessage.includes('contact') ||
      lowerMessage.includes('phone') ||
      lowerMessage.includes('email')
    ) {
      response = '📍 **SmileCare Dental Clinic**\n\n';
      response += '🏢 123 Dental Street\nCity Center, State 12345\n\n';
      response += '📞 Phone: (555) 123-4567\n';
      response += '✉️ Email: info@smilecare.com\n\n';
      response += 'Conveniently located in the heart of the city!';
    }
    // Booking
    else if (
      lowerMessage.includes('book') ||
      lowerMessage.includes('appointment') ||
      lowerMessage.includes('schedule') ||
      lowerMessage.includes('reserve') ||
      lowerMessage.includes('visit')
    ) {
      response = '📅 **Book Your Appointment:**\n\n';
      response += '1️⃣ Click "Book Now" button on our website\n';
      response += '2️⃣ Select your preferred service\n';
      response += '3️⃣ Choose your doctor\n';
      response += '4️⃣ Pick a convenient date & time\n\n';
      response += 'Or call us at (555) 123-4567 for immediate booking! 📞';
    }
    // Insurance
    else if (lowerMessage.includes('insurance') || lowerMessage.includes('payment')) {
      response = '💳 **Insurance & Payment:**\n\n';
      response += '✅ We accept most major insurance plans\n';
      response += '✅ Flexible payment plans available\n';
      response += '✅ Credit cards accepted\n';
      response += '✅ Transparent pricing - no hidden fees\n\n';
      response += 'Contact us to verify your insurance coverage!';
    }
    // Emergency
    else if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent')) {
      response = '🚨 **Emergency Dental Care:**\n\n';
      response += 'We provide same-day emergency appointments!\n\n';
      response += '📞 Call us immediately at (555) 123-4567\n';
      response += 'Available during working hours and on-call for emergencies.';
    }
    // Greetings
    else if (
      lowerMessage.includes('hello') ||
      lowerMessage.includes('hi') ||
      lowerMessage.includes('hey')
    ) {
      response = 'Hello! 👋 Welcome to SmileCare Dental Clinic!\n\n';
      response += 'How can I assist you today?\n\n';
      response += 'You can ask me about:\n';
      response += '• Our services and prices 🦷\n';
      response += '• Our doctors 👨‍⚕️\n';
      response += '• Booking appointments 📅\n';
      response += '• Working hours 🕐\n';
      response += '• Location and contact 📍';
    }
    // Default
    else {
      response = '🤖 I\'m here to help!\n\n';
      response += 'You can ask me about:\n\n';
      response += '🦷 Our dental services and prices\n';
      response += '👨‍⚕️ Our experienced doctors\n';
      response += '📅 Booking an appointment\n';
      response += '🕐 Working hours\n';
      response += '📍 Location and contact info\n';
      response += '💳 Insurance and payment options\n';
      response += '🚨 Emergency dental care\n\n';
      response += 'What would you like to know?';
    }

    res.json({
      message: response,
      sessionId: 'web-session',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Chatbot error:', error);
    res.status(500).json({
      message: 'Sorry, I encountered an error. Please call us at (555) 123-4567.',
      error: 'Internal server error',
    });
  }
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health: http://localhost:${PORT}/health`);
  console.log(`🔗 Test Email: http://localhost:${PORT}/api/test-email`);
  console.log(`🔗 Services: http://localhost:${PORT}/api/services`);
  console.log(`🔗 Doctors: http://localhost:${PORT}/api/doctors`);
  console.log(`🔗 Appointments: http://localhost:${PORT}/api/appointments`);
  console.log(`💬 Chatbot: http://localhost:${PORT}/api/chatbot/chat\n`);
});

export default app;
