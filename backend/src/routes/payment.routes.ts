import express from 'express';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();
const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

router.use(authenticateToken);

// Create payment intent
router.post('/create-intent', async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const userId = (req as any).user.userId;

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { service: true },
    });

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(appointment.service.price * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        appointmentId,
        userId,
      },
    });

    // Create payment record
    await prisma.payment.create({
      data: {
        appointmentId,
        userId,
        amount: appointment.service.price,
        currency: 'USD',
        status: 'PENDING',
        stripePaymentId: paymentIntent.id,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      amount: appointment.service.price,
    });
  } catch (error) {
    console.error('Payment intent error:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

// Confirm payment
router.post('/confirm', async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Update payment status
      await prisma.payment.updateMany({
        where: { stripePaymentId: paymentIntentId },
        data: { 
          status: 'COMPLETED',
          paymentMethod: paymentIntent.payment_method_types[0],
        },
      });

      // Update appointment status
      const payment = await prisma.payment.findFirst({
        where: { stripePaymentId: paymentIntentId },
      });

      if (payment) {
        await prisma.appointment.update({
          where: { id: payment.appointmentId },
          data: { status: 'CONFIRMED' },
        });
      }

      res.json({ message: 'Payment confirmed successfully' });
    } else {
      res.status(400).json({ error: 'Payment not completed' });
    }
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ error: 'Failed to confirm payment' });
  }
});

export default router;
