import nodemailer from 'nodemailer';

interface Appointment {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  appointmentDate: Date | string;
  appointmentTime: string;
  status: string;
  notes?: string;
  service: {
    name: string;
    price: number;
  };
  doctor: {
    firstName: string;
    lastName: string;
  };
}

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

// Email Templates
const getBookingConfirmationEmail = (appointment: Appointment) => {
  return {
    subject: '✅ Booking Confirmation - SmileCare Dental Clinic',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
          .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
          .info-label { font-weight: bold; color: #6b7280; }
          .info-value { color: #111827; }
          .status-badge { background: #fef3c7; color: #92400e; padding: 5px 15px; border-radius: 20px; display: inline-block; font-size: 14px; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🦷 SmileCare Dental Clinic</h1>
            <p>Your appointment has been booked successfully!</p>
          </div>
          <div class="content">
            <h2>Hello ${appointment.patientName}! 👋</h2>
            <p>Thank you for choosing SmileCare Dental Clinic. Your appointment has been received and is currently <strong>pending confirmation</strong>.</p>
            
            <div class="info-box">
              <h3 style="margin-top: 0; color: #667eea;">📋 Appointment Details</h3>
              <div class="info-row">
                <span class="info-label">Patient Name:</span>
                <span class="info-value">${appointment.patientName}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Service:</span>
                <span class="info-value">${appointment.service.name}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Doctor:</span>
                <span class="info-value">Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Date:</span>
                <span class="info-value">${new Date(appointment.appointmentDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Time:</span>
                <span class="info-value">${appointment.appointmentTime}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Price:</span>
                <span class="info-value">$${appointment.service.price}</span>
              </div>
              <div class="info-row" style="border-bottom: none;">
                <span class="info-label">Status:</span>
                <span class="status-badge">⏳ Pending Confirmation</span>
              </div>
            </div>

            <div style="background: #eff6ff; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6;">
              <h4 style="margin-top: 0; color: #1e40af;">📌 What's Next?</h4>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Our team will review your appointment request</li>
                <li>You'll receive a confirmation email within 24 hours</li>
                <li>Please arrive 10 minutes before your appointment</li>
                <li>Bring a valid ID and insurance card (if applicable)</li>
              </ul>
            </div>

            <div class="footer">
              <p><strong>SmileCare Dental Clinic</strong></p>
              <p>123 Dental Street, Cairo, Egypt</p>
              <p>📞 +20 123 456 7890 | 📧 info@smilecare.com</p>
              <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">
                If you didn't book this appointment, please contact us immediately.
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  };
};

const getAppointmentConfirmedEmail = (appointment: Appointment) => {
  return {
    subject: '✅ Appointment Confirmed - SmileCare Dental Clinic',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
          .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
          .info-label { font-weight: bold; color: #6b7280; }
          .info-value { color: #111827; }
          .status-badge { background: #d1fae5; color: #065f46; padding: 5px 15px; border-radius: 20px; display: inline-block; font-size: 14px; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Appointment Confirmed!</h1>
            <p>Your appointment has been confirmed by our team</p>
          </div>
          <div class="content">
            <h2>Great news, ${appointment.patientName}! 🎊</h2>
            <p>Your appointment at SmileCare Dental Clinic has been <strong>confirmed</strong>. We look forward to seeing you!</p>
            
            <div class="info-box">
              <h3 style="margin-top: 0; color: #10b981;">📋 Confirmed Appointment Details</h3>
              <div class="info-row">
                <span class="info-label">Patient Name:</span>
                <span class="info-value">${appointment.patientName}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Service:</span>
                <span class="info-value">${appointment.service.name}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Doctor:</span>
                <span class="info-value">Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Date:</span>
                <span class="info-value">${new Date(appointment.appointmentDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Time:</span>
                <span class="info-value">${appointment.appointmentTime}</span>
              </div>
              <div class="info-row" style="border-bottom: none;">
                <span class="info-label">Status:</span>
                <span class="status-badge">✅ Confirmed</span>
              </div>
            </div>

            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b;">
              <h4 style="margin-top: 0; color: #92400e;">⏰ Important Reminders</h4>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li><strong>Arrive 10 minutes early</strong> for check-in</li>
                <li>Bring your ID and insurance card</li>
                <li>If you need to reschedule, call us at least 24 hours in advance</li>
                <li>Wear comfortable clothing</li>
              </ul>
            </div>

            <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin-top: 20px; text-align: center;">
              <p style="margin: 0; font-size: 16px;">📍 <strong>Clinic Location</strong></p>
              <p style="margin: 10px 0;">123 Dental Street, Cairo, Egypt</p>
              <p style="margin: 5px 0;">📞 +20 123 456 7890</p>
            </div>

            <div class="footer">
              <p><strong>SmileCare Dental Clinic</strong></p>
              <p>We're excited to help you achieve your perfect smile! 😁</p>
              <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">
                Need to cancel or reschedule? Contact us at info@smilecare.com
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  };
};

const getAppointmentCancelledEmail = (appointment: Appointment) => {
  return {
    subject: '❌ Appointment Cancelled - SmileCare Dental Clinic',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Appointment Cancelled</h1>
          </div>
          <div class="content">
            <h2>Hello ${appointment.patientName},</h2>
            <p>We're sorry to inform you that your appointment has been cancelled.</p>
            
            <div class="info-box">
              <h3 style="margin-top: 0; color: #ef4444;">Cancelled Appointment Details</h3>
              <p><strong>Service:</strong> ${appointment.service.name}</p>
              <p><strong>Date:</strong> ${new Date(appointment.appointmentDate).toLocaleDateString()}</p>
              <p><strong>Time:</strong> ${appointment.appointmentTime}</p>
            </div>

            <div style="background: #eff6ff; padding: 20px; border-radius: 8px; text-align: center;">
              <p style="font-size: 16px; margin: 0;">Want to book another appointment?</p>
              <p style="margin: 10px 0;">Call us at <strong>+20 123 456 7890</strong></p>
              <p style="margin: 5px 0;">or visit our website</p>
            </div>

            <div class="footer">
              <p><strong>SmileCare Dental Clinic</strong></p>
              <p>📞 +20 123 456 7890 | 📧 info@smilecare.com</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  };
};

const getAdminNotificationEmail = (appointment: Appointment) => {
  return {
    subject: '🔔 New Appointment Booking - SmileCare Admin',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #6366f1; }
          .info-row { padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
          .button { background: #6366f1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔔 New Appointment Request</h1>
          </div>
          <div class="content">
            <h2>New Booking Alert!</h2>
            <p>A new appointment has been booked and requires your confirmation.</p>
            
            <div class="info-box">
              <h3 style="margin-top: 0; color: #6366f1;">Patient & Appointment Details</h3>
              <div class="info-row"><strong>Patient:</strong> ${appointment.patientName}</div>
              <div class="info-row"><strong>Email:</strong> ${appointment.patientEmail}</div>
              <div class="info-row"><strong>Phone:</strong> ${appointment.patientPhone}</div>
              <div class="info-row"><strong>Service:</strong> ${appointment.service.name} ($${appointment.service.price})</div>
              <div class="info-row"><strong>Doctor:</strong> Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}</div>
              <div class="info-row"><strong>Date:</strong> ${new Date(appointment.appointmentDate).toLocaleDateString()}</div>
              <div class="info-row" style="border-bottom: none;"><strong>Time:</strong> ${appointment.appointmentTime}</div>
              ${appointment.notes ? `<div style="margin-top: 15px;"><strong>Notes:</strong><br/>${appointment.notes}</div>` : ''}
            </div>

            <div style="text-align: center;">
              <a href="http://localhost:3000/admin/appointments" class="button">
                View in Admin Dashboard →
              </a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  };
};

// Send Email Function
const sendEmail = async (to: string, emailContent: { subject: string; html: string }) => {
  try {
    const mailOptions = {
      from: '"SmileCare Dental Clinic" <noreply@smilecare.com>',
      to: to,
      subject: emailContent.subject,
      html: emailContent.html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('❌ Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Main notification functions
export const sendBookingConfirmation = async (appointment: Appointment) => {
  const emailContent = getBookingConfirmationEmail(appointment);
  return await sendEmail(appointment.patientEmail, emailContent);
};

export const sendAppointmentConfirmed = async (appointment: Appointment) => {
  const emailContent = getAppointmentConfirmedEmail(appointment);
  return await sendEmail(appointment.patientEmail, emailContent);
};

export const sendAppointmentCancelled = async (appointment: Appointment) => {
  const emailContent = getAppointmentCancelledEmail(appointment);
  return await sendEmail(appointment.patientEmail, emailContent);
};

export const sendAdminNotification = async (appointment: Appointment) => {
  const emailContent = getAdminNotificationEmail(appointment);
  // Replace with actual admin email
  return await sendEmail('admin@smilecare.com', emailContent);
};
