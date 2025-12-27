import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are an AI dental assistant for SmileCare Dental Clinic. 
You help patients with:
- Booking appointments
- Answering questions about services (teeth whitening, implants, orthodontics, etc.)
- Providing clinic information (hours: Mon-Fri 8AM-6PM, Sat 9AM-3PM)
- Emergency dental care (24/7 available)
- Insurance questions
- Pricing information

Be friendly, professional, and concise. If you don't know something, direct them to call (555) 123-4567.`;

export const chat = async (req: Request, res: Response) => {
  try {
    const { message, sessionId } = req.body;

    // Save user message
    await prisma.chatMessage.create({
      data: {
        sessionId,
        message,
        sender: 'user',
      },
    });

    // Get conversation history
    const history = await prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { timestamp: 'asc' },
      take: 10, // Last 10 messages
    });

    // Prepare messages for OpenAI
    const messages: any[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.message,
      })),
    ];

    // Get AI response
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
      max_tokens: 200,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0].message.content || 'I apologize, I could not process that request.';

    // Save bot message
    await prisma.chatMessage.create({
      data: {
        sessionId,
        message: aiResponse,
        sender: 'bot',
      },
    });

    res.json({
      message: aiResponse,
      sessionId,
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ error: 'Chatbot service unavailable' });
  }
};
