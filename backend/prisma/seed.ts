import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('1324Admin@', 10);

  // ── SUPER ADMIN ──
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@bookflow.com' },
    update: {},
    create: {
      email: 'admin@bookflow.com',
      passwordHash,
      firstName: 'Super',
      lastName: 'Admin',
      role: 'SUPER_ADMIN',
      emailVerified: true,
    },
  });
  console.log(`✓ SUPER_ADMIN: ${superAdmin.email}`);

  // ── COMPANY ──
  const company = await prisma.company.upsert({
    where: { slug: 'luxe-salon-spa' },
    update: {},
    create: {
      name: 'Luxe Salon & Spa',
      slug: 'luxe-salon-spa',
      description: 'Premium hair and spa services in a relaxing environment.',
      phone: '+1-555-0100',
      email: 'hello@luxesalon.example.com',
      address: '123 Main Street, Downtown, NY 10001',
      subscriptionPlan: 'PREMIUM',
      isActive: true,
    },
  });
  console.log(`✓ COMPANY: ${company.name}`);

  // ── COMPANY ADMIN (business manager) ──
  const companyAdmin = await prisma.user.upsert({
    where: { email: 'manager@luxesalon.com' },
    update: {},
    create: {
      email: 'manager@luxesalon.com',
      passwordHash,
      firstName: 'Sarah',
      lastName: 'Johnson',
      phone: '+1-555-0101',
      role: 'COMPANY_ADMIN',
      emailVerified: true,
      companyId: company.id,
    },
  });
  console.log(`✓ COMPANY_ADMIN: ${companyAdmin.email}`);

  // ── CUSTOMER ──
  const customer = await prisma.user.upsert({
    where: { email: 'customer@test.com' },
    update: {},
    create: {
      email: 'customer@test.com',
      passwordHash,
      firstName: 'Alex',
      lastName: 'Martinez',
      phone: '+1-555-0200',
      role: 'CUSTOMER',
      emailVerified: true,
    },
  });
  console.log(`✓ CUSTOMER: ${customer.email}`);

  // ── SERVICES ──
  const services = await Promise.all([
    prisma.service.upsert({
      where: { id: 'seed-service-haircut' },
      update: {},
      create: {
        id: 'seed-service-haircut',
        name: 'Premium Haircut',
        description: 'A precision cut tailored to your face shape and style.',
        duration: 45,
        price: 65,
        color: '#c5a880',
        isActive: true,
        companyId: company.id,
      },
    }),
    prisma.service.upsert({
      where: { id: 'seed-service-manicure' },
      update: {},
      create: {
        id: 'seed-service-manicure',
        name: 'Luxury Manicure',
        description: 'Nail shaping, cuticle care, and a hand massage with organic oils.',
        duration: 30,
        price: 45,
        color: '#e8a0b4',
        isActive: true,
        companyId: company.id,
      },
    }),
    prisma.service.upsert({
      where: { id: 'seed-service-massage' },
      update: {},
      create: {
        id: 'seed-service-massage',
        name: 'Deep Tissue Massage',
        description: 'Targets deep muscle layers and chronic tension.',
        duration: 60,
        price: 95,
        color: '#7eb8da',
        isActive: true,
        companyId: company.id,
      },
    }),
  ]);
  console.log(`✓ SERVICES: ${services.length} created`);

  // ── EMPLOYEES ──
  const empUser1 = await prisma.user.upsert({
    where: { email: 'emma@luxesalon.com' },
    update: {},
    create: {
      email: 'emma@luxesalon.com',
      passwordHash,
      firstName: 'Emma',
      lastName: 'Chen',
      role: 'EMPLOYEE',
      emailVerified: true,
      companyId: company.id,
    },
  });

  const empUser2 = await prisma.user.upsert({
    where: { email: 'james@luxesalon.com' },
    update: {},
    create: {
      email: 'james@luxesalon.com',
      passwordHash,
      firstName: 'James',
      lastName: 'Rivera',
      role: 'EMPLOYEE',
      emailVerified: true,
      companyId: company.id,
    },
  });

  const employee1 = await prisma.employee.upsert({
    where: { userId: empUser1.id },
    update: {},
    create: {
      userId: empUser1.id,
      companyId: company.id,
      bio: 'Master stylist with 8 years of experience in precision cutting and coloring.',
      specialties: ['Haircut', 'Coloring', 'Styling'],
      isActive: true,
    },
  });

  const employee2 = await prisma.employee.upsert({
    where: { userId: empUser2.id },
    update: {},
    create: {
      userId: empUser2.id,
      companyId: company.id,
      bio: 'Licensed massage therapist specializing in deep tissue and sports massage.',
      specialties: ['Massage', 'Sports Therapy', 'Cupping'],
      isActive: true,
    },
  });
  console.log(`✓ EMPLOYEES: Emma & James`);

  // ── WORKING HOURS (Mon-Fri 9am-6pm, Sat 10am-4pm) ──
  const days = [
    { day: 1, start: '09:00', end: '18:00' },
    { day: 2, start: '09:00', end: '18:00' },
    { day: 3, start: '09:00', end: '18:00' },
    { day: 4, start: '09:00', end: '18:00' },
    { day: 5, start: '09:00', end: '18:00' },
    { day: 6, start: '10:00', end: '16:00' },
  ];

  for (const emp of [employee1, employee2]) {
    await prisma.workingHours.deleteMany({ where: { employeeId: emp.id } });
    for (const d of days) {
      await prisma.workingHours.create({
        data: { employeeId: emp.id, dayOfWeek: d.day, startTime: d.start, endTime: d.end },
      });
    }
  }
  console.log('✓ WORKING HOURS: Mon-Fri 9-6, Sat 10-4');

  // ── BOOKINGS ──
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const booking1 = await prisma.booking.upsert({
    where: { id: 'seed-booking-1' },
    update: {},
    create: {
      id: 'seed-booking-1',
      customerId: customer.id,
      employeeId: employee1.id,
      serviceId: services[0].id,
      companyId: company.id,
      date: tomorrow,
      startTime: '10:00',
      endTime: '10:45',
      status: 'CONFIRMED',
      totalPrice: 65,
    },
  });

  const booking2 = await prisma.booking.upsert({
    where: { id: 'seed-booking-2' },
    update: {},
    create: {
      id: 'seed-booking-2',
      customerId: customer.id,
      employeeId: employee2.id,
      serviceId: services[2].id,
      companyId: company.id,
      date: tomorrow,
      startTime: '14:00',
      endTime: '15:00',
      status: 'CONFIRMED',
      totalPrice: 95,
    },
  });
  console.log(`✓ BOOKINGS: 2 created for tomorrow`);

  // ── REVIEW ──
  await prisma.review.upsert({
    where: { bookingId: booking1.id },
    update: {},
    create: {
      customerId: customer.id,
      companyId: company.id,
      bookingId: booking1.id,
      rating: 5,
      comment: 'Emma did an amazing job! Best haircut I have had in years.',
    },
  });
  console.log('✓ REVIEW: 5-star review from Alex');

  // ── COUPON ──
  await prisma.coupon.upsert({
    where: { id: 'seed-coupon-welcome' },
    update: {},
    create: {
      id: 'seed-coupon-welcome',
      code: 'WELCOME20',
      discountPercent: 20,
      maxUses: 50,
      currentUses: 5,
      expiresAt: new Date(today.getFullYear() + 1, 11, 31),
      isActive: true,
      companyId: company.id,
    },
  });
  console.log('✓ COUPON: WELCOME20 (20% off)');

  // ── SUBSCRIPTION ──
  await prisma.subscription.upsert({
    where: { id: 'seed-sub-1' },
    update: {},
    create: {
      id: 'seed-sub-1',
      companyId: company.id,
      plan: 'PREMIUM',
      stripeSubscriptionId: null,
      status: 'active',
      currentPeriodStart: today,
      currentPeriodEnd: new Date(today.getFullYear(), today.getMonth() + 1, today.getDate()),
    },
  });
  console.log('✓ SUBSCRIPTION: Premium plan');

  // ── NOTIFICATION for customer ──
  await prisma.notification.create({
    data: {
      userId: customer.id,
      type: 'booking_confirmed',
      title: 'Booking Confirmed',
      message: 'Your Premium Haircut with Emma is confirmed for tomorrow at 10:00.',
    },
  });
  console.log('✓ NOTIFICATION: booking confirmed');

  console.log('\n✓ Seed complete. Set VITE_DEV_PASSWORD in .env to show dev accounts.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
