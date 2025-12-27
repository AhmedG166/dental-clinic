import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

router.post('/send-test', async (req, res) => {
  try {
    const { toEmail } = req.body;
    
    console.log('\n📧 ========== EMAIL TEST START ==========');
    console.log('To Email:', toEmail);
    console.log('From Email:', process.env.EMAIL_USER);
    console.log('Password Length:', process.env.EMAIL_PASS?.length);
    
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      debug: true,
    });

    console.log('🔧 Transporter created');

    // Verify connection
    console.log('🔍 Verifying connection...');
    await transporter.verify();
    console.log('✅ Connection verified!');

    // Send test email
    console.log('📨 Sending email...');
    const info = await transporter.sendMail({
      from: `"SmileCare Test" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: '✅ Test Email from SmileCare',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f3f4f6; border-radius: 10px;">
          <h1 style="color: #3b82f6;">🎉 Email is Working!</h1>
          <p>If you received this email, your email configuration is correct.</p>
          <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
          <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 14px;">SmileCare Dental Clinic - Email Test</p>
        </div>
      `,
    });

    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    console.log('========== EMAIL TEST END ==========\n');

    res.json({
      success: true,
      message: 'Test email sent successfully!',
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info),
    });
  } catch (error: any) {
    console.error('\n❌ ========== EMAIL TEST FAILED ==========');
    console.error('Error:', error.message);
    console.error('Full error:', error);
    console.error('========== ERROR END ==========\n');

    res.status(500).json({
      success: false,
      error: error.message,
      details: error.toString(),
    });
  }
});

export default router;
