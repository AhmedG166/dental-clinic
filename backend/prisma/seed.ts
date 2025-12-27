import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.appointment.deleteMany();
  await prisma.service.deleteMany();
  await prisma.doctor.deleteMany();

  console.log('🗑️  Cleared existing data');

  // Seed Doctors
  const doctor1 = await prisma.doctor.create({
    data: {
      firstName: 'Sarah',
      lastName: 'Johnson',
      specialization: 'General Dentistry',
      email: 'sarah.johnson@smilecare.com',
      phone: '(555) 123-4567',
      bio: 'Dr. Sarah Johnson has over 10 years of experience in general and cosmetic dentistry.',
      yearsOfExperience: 10,
      rating: 4.9,
    },
  });

  const doctor2 = await prisma.doctor.create({
    data: {
      firstName: 'Michael',
      lastName: 'Chen',
      specialization: 'Orthodontics',
      email: 'michael.chen@smilecare.com',
      phone: '(555) 123-4568',
      bio: 'Specializing in orthodontics and smile design with 8 years of experience.',
      yearsOfExperience: 8,
      rating: 4.8,
    },
  });

  console.log('👨‍⚕️  Created 2 doctors');

  // Seed Services
  await prisma.service.create({
    data: {
      name: 'Teeth Whitening',
      description: 'Professional teeth whitening for a brighter smile',
      price: 299,
      duration: 60,
      category: 'Cosmetic',
      isActive: true,
    },
  });

  await prisma.service.create({
    data: {
      name: 'Dental Implants',
      description: 'Permanent tooth replacement solution',
      price: 2500,
      duration: 120,
      category: 'Restorative',
      isActive: true,
    },
  });

  await prisma.service.create({
    data: {
      name: 'Orthodontic Treatment',
      description: 'Braces and aligners for perfect teeth alignment',
      price: 3500,
      duration: 90,
      category: 'Orthodontics',
      isActive: true,
    },
  });

  await prisma.service.create({
    data: {
      name: 'Root Canal Treatment',
      description: 'Save your natural tooth with root canal therapy',
      price: 800,
      duration: 90,
      category: 'Endodontics',
      isActive: true,
    },
  });

  await prisma.service.create({
    data: {
      name: 'Preventive Checkup',
      description: 'Regular dental cleaning and examination',
      price: 150,
      duration: 45,
      category: 'Preventive',
      isActive: true,
    },
  });

  console.log('🦷 Created 5 services');
  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
