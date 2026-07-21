import { PrismaClient, BookingStatus, SubscriptionPlan } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('1324Admin@', 10);
  const today = new Date();
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date(today); lastWeek.setDate(lastWeek.getDate() - 7);
  const twoWeeksAgo = new Date(today); twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
  const nextWeek = new Date(today); nextWeek.setDate(nextWeek.getDate() + 7);
  const nextMonth = new Date(today); nextMonth.setMonth(nextMonth.getMonth() + 1);

  // ── SUPER ADMIN ──
  await prisma.user.upsert({
    where: { email: 'admin@bookflow.com' },
    update: {},
    create: { email: 'admin@bookflow.com', passwordHash, firstName: 'Super', lastName: 'Admin', role: 'SUPER_ADMIN', emailVerified: true },
  });
  console.log('✓ SUPER_ADMIN: admin@bookflow.com');

  // ── CUSTOMERS ──
  const customerData = [
    { email: 'alex@test.com', firstName: 'Alex', lastName: 'Martinez', phone: '+1-555-0200' },
    { email: 'sam@test.com', firstName: 'Sam', lastName: 'Taylor', phone: '+1-555-0201' },
    { email: 'jordan@test.com', firstName: 'Jordan', lastName: 'Lee', phone: '+1-555-0202' },
    { email: 'casey@test.com', firstName: 'Casey', lastName: 'Kim', phone: '+1-555-0203' },
    { email: 'riley@test.com', firstName: 'Riley', lastName: 'Brown', phone: '+1-555-0204' },
    { email: 'morgan@test.com', firstName: 'Morgan', lastName: 'White', phone: '+1-555-0205' },
    { email: 'jamie@test.com', firstName: 'Jamie', lastName: 'Garcia', phone: '+1-555-0206' },
    { email: 'taylor@test.com', firstName: 'Taylor', lastName: 'Reed', phone: '+1-555-0207' },
    { email: 'quinn@test.com', firstName: 'Quinn', lastName: 'Cooper', phone: '+1-555-0208' },
    { email: 'dakota@test.com', firstName: 'Dakota', lastName: 'Evans', phone: '+1-555-0209' },
  ];

  const customers: Record<string, any> = {};
  for (const c of customerData) {
    const user = await prisma.user.upsert({
      where: { email: c.email },
      update: {},
      create: { ...c, passwordHash, role: 'CUSTOMER', emailVerified: true },
    });
    customers[c.firstName.toLowerCase()] = user;
  }
  console.log(`✓ CUSTOMERS: ${customerData.length} created`);

  // ── COMPANIES DATA ──
  const companiesData = [
    {
      slug: 'luxe-salon-spa', name: 'Luxe Salon & Spa',
      desc: 'Premium hair and spa services in a relaxing environment.',
      phone: '+1-555-0100', email: 'hello@luxesalon.com', address: '123 Main Street, Downtown, NY 10001',
      plan: 'PREMIUM' as SubscriptionPlan,
      admin: { email: 'manager@luxesalon.com', firstName: 'Sarah', lastName: 'Johnson', phone: '+1-555-0101' },
      roles: [
        { name: 'Staff Member', description: 'General staff with basic access', permissions: ['dashboard', 'bookings'], isDefault: true },
        { name: 'Senior Staff', description: 'Experienced staff with broader access', permissions: ['dashboard', 'bookings', 'services', 'reviews'], isDefault: false },
        { name: 'Manager', description: 'Department manager with most permissions', permissions: ['dashboard', 'bookings', 'services', 'employees', 'reviews', 'reports', 'settings'], isDefault: false },
      ],
      services: [
        { name: 'Premium Haircut', duration: 45, price: 65, color: '#c5a880' },
        { name: 'Luxury Manicure', duration: 30, price: 45, color: '#e8a0b4' },
        { name: 'Deep Tissue Massage', duration: 60, price: 95, color: '#7eb8da' },
        { name: 'Facial Treatment', duration: 50, price: 80, color: '#86d6c8' },
        { name: 'Hair Coloring', duration: 120, price: 120, color: '#efc493' },
      ],
      employees: [
        { email: 'emma@luxesalon.com', firstName: 'Emma', lastName: 'Chen', roleName: 'Manager', bio: 'Master stylist with 8 years of experience in precision cutting and coloring.', specialties: ['Haircut', 'Coloring', 'Styling'] },
        { email: 'james@luxesalon.com', firstName: 'James', lastName: 'Rivera', roleName: 'Senior Staff', bio: 'Licensed massage therapist specializing in deep tissue and sports massage.', specialties: ['Massage', 'Sports Therapy', 'Cupping'] },
        { email: 'mia@luxesalon.com', firstName: 'Mia', lastName: 'Williams', roleName: 'Staff Member', bio: 'Skilled nail technician passionate about creative nail art and manicures.', specialties: ['Manicure', 'Pedicure', 'Nail Art'] },
        { email: 'liam@luxesalon.com', firstName: 'Liam', lastName: 'Brown', roleName: 'Staff Member', bio: 'Junior stylist eager to learn and provide excellent haircuts and styling.', specialties: ['Haircut', 'Blow-dry'] },
        { email: 'olivia@luxesalon.com', firstName: 'Olivia', lastName: 'Davis', roleName: 'Senior Staff', bio: 'Esthetician with 5 years of experience in facials, waxing, and skincare treatments.', specialties: ['Facial', 'Waxing', 'Skincare'] },
        { email: 'noah@luxesalon.com', firstName: 'Noah', lastName: 'Wilson', roleName: 'Staff Member', bio: 'Experienced colorist specializing in balayage, highlights, and creative color.', specialties: ['Coloring', 'Balayage', 'Highlights'] },
      ],
    },
    {
      slug: 'fitforge-gym', name: 'FitForge Gym',
      desc: 'Transform your body and mind with state-of-the-art equipment and expert trainers.',
      phone: '+1-555-0300', email: 'hello@fitforge.com', address: '456 Fitness Ave, Midtown, NY 10002',
      plan: 'BASIC' as SubscriptionPlan,
      admin: { email: 'manager@fitforge.com', firstName: 'Marcus', lastName: 'Wright', phone: '+1-555-0301' },
      roles: [
        { name: 'Staff Member', description: 'General staff with basic access', permissions: ['dashboard', 'bookings'], isDefault: true },
        { name: 'Senior Staff', description: 'Experienced staff with broader access', permissions: ['dashboard', 'bookings', 'services', 'reviews'], isDefault: false },
        { name: 'Manager', description: 'Department manager with most permissions', permissions: ['dashboard', 'bookings', 'services', 'employees', 'reviews', 'reports', 'settings'], isDefault: false },
      ],
      services: [
        { name: 'Personal Training Session', duration: 60, price: 60, color: '#ff6b6b' },
        { name: 'Yoga Class', duration: 60, price: 25, color: '#51cf66' },
        { name: 'HIIT Class', duration: 45, price: 30, color: '#ff922b' },
        { name: 'Nutrition Consultation', duration: 45, price: 75, color: '#845ef7' },
        { name: 'Massage Therapy', duration: 50, price: 55, color: '#20c997' },
      ],
      employees: [
        { email: 'jake@fitforge.com', firstName: 'Jake', lastName: 'Thompson', roleName: 'Manager', bio: 'Certified personal trainer with 10 years of experience in strength and conditioning.', specialties: ['Strength Training', 'Bodybuilding', 'Rehab'] },
        { email: 'elena@fitforge.com', firstName: 'Elena', lastName: 'Rodriguez', roleName: 'Senior Staff', bio: 'Yoga instructor with 500hr RYT certification specializing in vinyasa and restorative yoga.', specialties: ['Yoga', 'Meditation', 'Flexibility'] },
        { email: 'marcusl@fitforge.com', firstName: 'Marcus', lastName: 'Lee', roleName: 'Staff Member', bio: 'High-energy HIIT coach who loves helping people push past their limits.', specialties: ['HIIT', 'Cardio', 'Bootcamp'] },
        { email: 'aisha@fitforge.com', firstName: 'Aisha', lastName: 'Patel', roleName: 'Staff Member', bio: 'Certified nutritionist creating personalized meal plans for optimal performance.', specialties: ['Nutrition', 'Meal Planning', 'Weight Management'] },
        { email: 'connor@fitforge.com', firstName: 'Connor', lastName: 'OBrien', roleName: 'Senior Staff', bio: 'Sports massage therapist working with athletes to improve recovery and performance.', specialties: ['Massage', 'Sports Therapy', 'Recovery'] },
        { email: 'zara@fitforge.com', firstName: 'Zara', lastName: 'Kim', roleName: 'Staff Member', bio: 'Boxing and kickboxing coach with competitive fighting background.', specialties: ['Boxing', 'Kickboxing', 'Martial Arts'] },
      ],
    },
    {
      slug: 'paws-and-claws', name: 'Paws & Claws',
      desc: 'Professional pet grooming and veterinary care for your beloved companions.',
      phone: '+1-555-0400', email: 'hello@pawsandclaws.com', address: '789 Pet Lane, Brooklyn, NY 11201',
      plan: 'FREE' as SubscriptionPlan,
      admin: { email: 'manager@pawsandclaws.com', firstName: 'Dr.', lastName: 'Rachel Green', phone: '+1-555-0401' },
      roles: [
        { name: 'Staff Member', description: 'General staff with basic access', permissions: ['dashboard', 'bookings'], isDefault: true },
        { name: 'Senior Staff', description: 'Experienced staff with broader access', permissions: ['dashboard', 'bookings', 'services', 'reviews'], isDefault: false },
        { name: 'Manager', description: 'Department manager with most permissions', permissions: ['dashboard', 'bookings', 'services', 'employees', 'reviews', 'reports', 'settings'], isDefault: false },
      ],
      services: [
        { name: 'Full Grooming', duration: 90, price: 55, color: '#f06595' },
        { name: 'Veterinary Checkup', duration: 30, price: 80, color: '#74c0fc' },
        { name: 'Nail Trim', duration: 15, price: 20, color: '#ffe066' },
        { name: 'Pet Bath & Blow-dry', duration: 45, price: 35, color: '#63e6be' },
        { name: 'Dental Cleaning', duration: 40, price: 90, color: '#da77f2' },
      ],
      employees: [
        { email: 'sophie@pawsandclaws.com', firstName: 'Sophie', lastName: 'Martin', roleName: 'Manager', bio: 'Veterinarian with 12 years of experience in small animal medicine and surgery.', specialties: ['Veterinary', 'Surgery', 'Dentistry'] },
        { email: 'tom@pawsandclaws.com', firstName: 'Tom', lastName: 'Baker', roleName: 'Senior Staff', bio: 'Master groomer with a gentle touch, specializing in breed-specific cuts.', specialties: ['Grooming', 'Breed Cuts', 'Hand Scissoring'] },
        { email: 'lilyc@pawsandclaws.com', firstName: 'Lily', lastName: 'Chen', roleName: 'Staff Member', bio: 'Patient and caring vet tech who makes every pet feel comfortable.', specialties: ['Vet Tech', 'Lab Work', 'Vaccinations'] },
        { email: 'max@pawsandclaws.com', firstName: 'Max', lastName: 'Turner', roleName: 'Staff Member', bio: 'Pet bather and grooming assistant, loves working with nervous pets.', specialties: ['Bathing', 'Drying', 'Brushing'] },
        { email: 'ruby@pawsandclaws.com', firstName: 'Ruby', lastName: 'Santos', roleName: 'Senior Staff', bio: 'Certified animal behaviorist helping pets with anxiety and training needs.', specialties: ['Behavior', 'Training', 'Socialization'] },
        { email: 'oscar@pawsandclaws.com', firstName: 'Oscar', lastName: 'Ford', roleName: 'Staff Member', bio: 'Groomer specializing in creative grooming, dyeing, and pet styling.', specialties: ['Creative Grooming', 'Dyeing', 'Style Cuts'] },
      ],
    },
  ];

  type EmployeeInfo = {
    id: string; userId: string; companyId: string;
    user: { id: string; firstName: string; lastName: string };
  };

  const allEmployees: EmployeeInfo[] = [];
  const allServices: { id: string; name: string; price: number; companyId: string }[] = [];

  for (const companyData of companiesData) {
    // ── COMPANY ──
    const company = await prisma.company.upsert({
      where: { slug: companyData.slug },
      update: {},
      create: {
        name: companyData.name, slug: companyData.slug,
        description: companyData.desc, phone: companyData.phone,
        email: companyData.email, address: companyData.address,
        subscriptionPlan: companyData.plan, isActive: true,
      },
    });

    // ── ADMIN ──
    await prisma.user.upsert({
      where: { email: companyData.admin.email },
      update: {},
      create: {
        ...companyData.admin, passwordHash, role: 'COMPANY_ADMIN',
        emailVerified: true, companyId: company.id,
      },
    });

    // ── ROLES ──
    const createdRoles: Record<string, any> = {};
    for (const role of companyData.roles) {
      const r = await prisma.companyRole.upsert({
        where: { companyId_name: { companyId: company.id, name: role.name } },
        update: {},
        create: { ...role, companyId: company.id },
      });
      createdRoles[role.name] = r;
    }

    // ── SERVICES ──
    for (const svc of companyData.services) {
      const service = await prisma.service.upsert({
        where: { id: `${company.slug}-${svc.name.toLowerCase().replace(/\s+/g, '-')}` },
        update: {},
        create: {
          id: `${company.slug}-${svc.name.toLowerCase().replace(/\s+/g, '-')}`,
          ...svc, description: `${svc.name} at ${companyData.name}`,
          companyId: company.id,
        },
      });
      allServices.push(service);
    }

    // ── EMPLOYEES ──
    for (const emp of companyData.employees) {
      const user = await prisma.user.upsert({
        where: { email: emp.email },
        update: {
          firstName: emp.firstName, lastName: emp.lastName,
          companyId: company.id, companyRoleId: createdRoles[emp.roleName]?.id || null,
        },
        create: {
          email: emp.email, passwordHash, firstName: emp.firstName,
          lastName: emp.lastName, role: 'EMPLOYEE', emailVerified: true,
          companyId: company.id, companyRoleId: createdRoles[emp.roleName]?.id || null,
        },
      });

      const employee = await prisma.employee.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          userId: user.id, companyId: company.id,
          bio: emp.bio, specialties: emp.specialties, isActive: true,
        },
      });

      allEmployees.push({
        id: employee.id, userId: user.id, companyId: company.id,
        user: { id: user.id, firstName: user.firstName, lastName: user.lastName },
      });
    }

    // ── WORKING HOURS ──
    const employeesForCompany = allEmployees.filter((e) => e.companyId === company.id);
    const daySchedules = [
      { day: 1, start: '09:00', end: '18:00' },
      { day: 2, start: '09:00', end: '18:00' },
      { day: 3, start: '09:00', end: '18:00' },
      { day: 4, start: '09:00', end: '18:00' },
      { day: 5, start: '09:00', end: '18:00' },
      { day: 6, start: '10:00', end: '16:00' },
    ];
    for (const emp of employeesForCompany) {
      await prisma.workingHours.deleteMany({ where: { employeeId: emp.id } });
      for (const d of daySchedules) {
        await prisma.workingHours.create({
          data: { employeeId: emp.id, dayOfWeek: d.day, startTime: d.start, endTime: d.end },
        });
      }
    }

    // ── SUBSCRIPTION ──
    await prisma.subscription.upsert({
      where: { id: `sub-${company.slug}` },
      update: {},
      create: {
        id: `sub-${company.slug}`, companyId: company.id,
        plan: companyData.plan, stripeSubscriptionId: null, status: 'active',
        currentPeriodStart: today,
        currentPeriodEnd: new Date(today.getFullYear(), today.getMonth() + 1, today.getDate()),
      },
    });

    // ── COUPON ──
    if (companyData.slug === 'luxe-salon-spa') {
      await prisma.coupon.upsert({
        where: { id: `coupon-welcome-${company.slug}` },
        update: {},
        create: {
          id: `coupon-welcome-${company.slug}`, code: 'WELCOME20',
          discountPercent: 20, maxUses: 50, currentUses: 5,
          expiresAt: new Date(today.getFullYear() + 1, 11, 31),
          isActive: true, companyId: company.id,
        },
      });
    }
    await prisma.coupon.upsert({
      where: { id: `coupon-first-${company.slug}` },
      update: {},
      create: {
        id: `coupon-first-${company.slug}`, code: 'FIRST10',
        discountPercent: 10, maxUses: 100, currentUses: 12,
        expiresAt: new Date(today.getFullYear(), 11, 31),
        isActive: true, companyId: company.id,
      },
    });

    console.log(`✓ ${company.name}: ${companyData.employees.length} employees, ${companyData.services.length} services`);
  }

  // ── BOOKINGS ──
  const customerIds = customerData.map((c) => customers[c.firstName.toLowerCase()].id);
  const bookingId = (() => { let i = 0; return () => `seed-booking-${++i}`; })();

  const bookingDefs = [
    // Luxe Salon - completed/past bookings
    { companySlug: 'luxe-salon-spa', empIdx: 0, svcIdx: 0, customerIdx: 0, date: yesterday, start: '10:00', end: '10:45', status: 'COMPLETED' as BookingStatus, note: 'Great haircut as always!' },
    { companySlug: 'luxe-salon-spa', empIdx: 0, svcIdx: 4, customerIdx: 1, date: twoWeeksAgo, start: '14:00', end: '16:00', status: 'COMPLETED' as BookingStatus, note: 'Balayage touch-up' },
    { companySlug: 'luxe-salon-spa', empIdx: 1, svcIdx: 2, customerIdx: 2, date: lastWeek, start: '11:00', end: '12:00', status: 'COMPLETED' as BookingStatus },
    { companySlug: 'luxe-salon-spa', empIdx: 2, svcIdx: 1, customerIdx: 3, date: yesterday, start: '15:00', end: '15:30', status: 'COMPLETED' as BookingStatus },
    { companySlug: 'luxe-salon-spa', empIdx: 4, svcIdx: 3, customerIdx: 0, date: lastWeek, start: '09:00', end: '09:50', status: 'COMPLETED' as BookingStatus },
    // Luxe Salon - upcoming
    { companySlug: 'luxe-salon-spa', empIdx: 3, svcIdx: 0, customerIdx: 4, date: tomorrow, start: '10:00', end: '10:45', status: 'CONFIRMED' as BookingStatus },
    { companySlug: 'luxe-salon-spa', empIdx: 5, svcIdx: 4, customerIdx: 5, date: tomorrow, start: '11:00', end: '13:00', status: 'CONFIRMED' as BookingStatus },
    { companySlug: 'luxe-salon-spa', empIdx: 0, svcIdx: 0, customerIdx: 6, date: nextWeek, start: '09:00', end: '09:45', status: 'CONFIRMED' as BookingStatus },
    { companySlug: 'luxe-salon-spa', empIdx: 2, svcIdx: 1, customerIdx: 7, date: nextWeek, start: '16:00', end: '16:30', status: 'PENDING' as BookingStatus },
    { companySlug: 'luxe-salon-spa', empIdx: 1, svcIdx: 2, customerIdx: 8, date: nextMonth, start: '14:00', end: '15:00', status: 'PENDING' as BookingStatus },
    // Luxe Salon - cancelled
    { companySlug: 'luxe-salon-spa', empIdx: 3, svcIdx: 0, customerIdx: 9, date: tomorrow, start: '15:00', end: '15:45', status: 'CANCELLED' as BookingStatus },
    // FitForge Gym
    { companySlug: 'fitforge-gym', empIdx: 6, svcIdx: 5, customerIdx: 0, date: yesterday, start: '07:00', end: '08:00', status: 'COMPLETED' as BookingStatus },
    { companySlug: 'fitforge-gym', empIdx: 8, svcIdx: 7, customerIdx: 1, date: twoWeeksAgo, start: '12:00', end: '12:45', status: 'COMPLETED' as BookingStatus },
    { companySlug: 'fitforge-gym', empIdx: 7, svcIdx: 6, customerIdx: 2, date: lastWeek, start: '09:00', end: '10:00', status: 'COMPLETED' as BookingStatus },
    { companySlug: 'fitforge-gym', empIdx: 6, svcIdx: 5, customerIdx: 3, date: tomorrow, start: '06:00', end: '07:00', status: 'CONFIRMED' as BookingStatus },
    { companySlug: 'fitforge-gym', empIdx: 9, svcIdx: 9, customerIdx: 4, date: tomorrow, start: '10:00', end: '10:50', status: 'CONFIRMED' as BookingStatus },
    { companySlug: 'fitforge-gym', empIdx: 10, svcIdx: 5, customerIdx: 5, date: nextWeek, start: '17:00', end: '18:00', status: 'CONFIRMED' as BookingStatus },
    { companySlug: 'fitforge-gym', empIdx: 8, svcIdx: 7, customerIdx: 6, date: nextMonth, start: '11:00', end: '11:45', status: 'PENDING' as BookingStatus },
    // Paws & Claws
    { companySlug: 'paws-and-claws', empIdx: 12, svcIdx: 10, customerIdx: 7, date: yesterday, start: '09:00', end: '10:30', status: 'COMPLETED' as BookingStatus },
    { companySlug: 'paws-and-claws', empIdx: 11, svcIdx: 11, customerIdx: 0, date: lastWeek, start: '14:00', end: '14:30', status: 'COMPLETED' as BookingStatus },
    { companySlug: 'paws-and-claws', empIdx: 13, svcIdx: 12, customerIdx: 1, date: yesterday, start: '11:00', end: '11:15', status: 'COMPLETED' as BookingStatus },
    { companySlug: 'paws-and-claws', empIdx: 12, svcIdx: 10, customerIdx: 2, date: tomorrow, start: '10:00', end: '11:30', status: 'CONFIRMED' as BookingStatus },
    { companySlug: 'paws-and-claws', empIdx: 11, svcIdx: 14, customerIdx: 3, date: nextWeek, start: '15:00', end: '15:40', status: 'CONFIRMED' as BookingStatus },
    { companySlug: 'paws-and-claws', empIdx: 15, svcIdx: 13, customerIdx: 8, date: nextMonth, start: '13:00', end: '13:45', status: 'PENDING' as BookingStatus },
    { companySlug: 'paws-and-claws', empIdx: 14, svcIdx: 10, customerIdx: 9, date: tomorrow, start: '14:00', end: '15:00', status: 'CANCELLED' as BookingStatus },
  ];

  const createdBookingIds: string[] = [];

  for (const b of bookingDefs) {
    const companyInfo = companiesData.find((c) => c.slug === b.companySlug)!;
    const company = await prisma.company.findUnique({ where: { slug: b.companySlug } });
    if (!company) continue;

    const companyServices = allServices.filter((s) => s.companyId === company.id);
    const companyEmployees = allEmployees.filter((e) => e.companyId === company.id);

    // Map local indices to global arrays
    const globalEmpIdx = allEmployees.findIndex((e) => e.id === companyEmployees[b.empIdx - (b.empIdx >= 6 && b.companySlug === 'fitforge-gym' ? 6 : b.empIdx >= 0 && b.companySlug === 'luxe-salon-spa' ? 0 : 12)]?.id);

    // Actually, the employee indices should be local to each company. Let me use a different approach.
    // The employees are added in order. For luxe-salon-spa: indices 0-5, fitforge-gym: 6-11, paws-and-claws: 12-17
    const companyEmployeeIndex = (() => {
      if (b.companySlug === 'luxe-salon-spa') return b.empIdx;
      if (b.companySlug === 'fitforge-gym') return b.empIdx;
      if (b.companySlug === 'paws-and-claws') return b.empIdx;
      return 0;
    })();
  }

  // Better approach: rebuild booking defs with proper indices
  // Luxe employees: 0-5, FitForge: 6-11, Paws: 12-17
  // Luxe services: services[0-4], FitForge: services[5-9], Paws: services[10-14]
  // Customers: 0-9 (alex=0, sam=1, jordan=2, casey=3, riley=4, morgan=5, jamie=6, taylor=7, quinn=8, dakota=9)

  const bookingList = [
    // ── LUXE SALON (employees 0-5, services 0-4) ──
    { e: 0, s: 0, c: 0, date: yesterday, st: '10:00', et: '10:45', status: 'COMPLETED' as BookingStatus },
    { e: 0, s: 4, c: 1, date: twoWeeksAgo, st: '14:00', et: '16:00', status: 'COMPLETED' as BookingStatus },
    { e: 1, s: 2, c: 2, date: lastWeek, st: '11:00', et: '12:00', status: 'COMPLETED' as BookingStatus },
    { e: 2, s: 1, c: 3, date: yesterday, st: '15:00', et: '15:30', status: 'COMPLETED' as BookingStatus },
    { e: 4, s: 3, c: 0, date: lastWeek, st: '09:00', et: '09:50', status: 'COMPLETED' as BookingStatus },
    { e: 3, s: 0, c: 4, date: tomorrow, st: '10:00', et: '10:45', status: 'CONFIRMED' as BookingStatus },
    { e: 5, s: 4, c: 5, date: tomorrow, st: '11:00', et: '13:00', status: 'CONFIRMED' as BookingStatus },
    { e: 0, s: 0, c: 6, date: nextWeek, st: '09:00', et: '09:45', status: 'CONFIRMED' as BookingStatus },
    { e: 2, s: 1, c: 7, date: nextWeek, st: '16:00', et: '16:30', status: 'PENDING' as BookingStatus },
    { e: 1, s: 2, c: 8, date: nextMonth, st: '14:00', et: '15:00', status: 'PENDING' as BookingStatus },
    { e: 3, s: 0, c: 9, date: tomorrow, st: '15:00', et: '15:45', status: 'CANCELLED' as BookingStatus },

    // ── FITFORGE GYM (employees 6-11, services 5-9) ──
    { e: 6, s: 5, c: 0, date: yesterday, st: '07:00', et: '08:00', status: 'COMPLETED' as BookingStatus },
    { e: 8, s: 7, c: 1, date: twoWeeksAgo, st: '12:00', et: '12:45', status: 'COMPLETED' as BookingStatus },
    { e: 7, s: 6, c: 2, date: lastWeek, st: '09:00', et: '10:00', status: 'COMPLETED' as BookingStatus },
    { e: 6, s: 5, c: 3, date: tomorrow, st: '06:00', et: '07:00', status: 'CONFIRMED' as BookingStatus },
    { e: 9, s: 9, c: 4, date: tomorrow, st: '10:00', et: '10:50', status: 'CONFIRMED' as BookingStatus },
    { e: 10, s: 5, c: 5, date: nextWeek, st: '17:00', et: '18:00', status: 'CONFIRMED' as BookingStatus },
    { e: 8, s: 7, c: 6, date: nextMonth, st: '11:00', et: '11:45', status: 'PENDING' as BookingStatus },

    // ── PAWS & CLAWS (employees 12-17, services 10-14) ──
    { e: 12, s: 10, c: 7, date: yesterday, st: '09:00', et: '10:30', status: 'COMPLETED' as BookingStatus },
    { e: 11, s: 11, c: 0, date: lastWeek, st: '14:00', et: '14:30', status: 'COMPLETED' as BookingStatus },
    { e: 13, s: 12, c: 1, date: yesterday, st: '11:00', et: '11:15', status: 'COMPLETED' as BookingStatus },
    { e: 12, s: 10, c: 2, date: tomorrow, st: '10:00', et: '11:30', status: 'CONFIRMED' as BookingStatus },
    { e: 11, s: 14, c: 3, date: nextWeek, st: '15:00', et: '15:40', status: 'CONFIRMED' as BookingStatus },
    { e: 15, s: 13, c: 8, date: nextMonth, st: '13:00', et: '13:45', status: 'PENDING' as BookingStatus },
    { e: 14, s: 10, c: 9, date: tomorrow, st: '14:00', et: '15:00', status: 'CANCELLED' as BookingStatus },
  ];

  for (let i = 0; i < bookingList.length; i++) {
    const b = bookingList[i];
    const bk = await prisma.booking.upsert({
      where: { id: `seed-booking-${i + 1}` },
      update: {},
      create: {
        id: `seed-booking-${i + 1}`,
        customerId: customerIds[b.c],
        employeeId: allEmployees[b.e].id,
        serviceId: allServices[b.s].id,
        companyId: allEmployees[b.e].companyId,
        date: b.date, startTime: b.st, endTime: b.et,
        status: b.status, totalPrice: allServices[b.s].price,
      },
    });
    createdBookingIds.push(bk.id);
  }
  console.log(`✓ BOOKINGS: ${bookingList.length} created across all companies`);

  // ── REVIEWS ──
  const reviewData = [
    { bookingIdx: 0, rating: 5, comment: 'Emma did an amazing job! Best haircut I have had in years.' },
    { bookingIdx: 1, rating: 4, comment: 'Love the balayage! It turned out exactly how I wanted.' },
    { bookingIdx: 2, rating: 5, comment: 'James has magic hands. Felt amazing after the massage.' },
    { bookingIdx: 3, rating: 4, comment: 'Mia is so talented! My nails look gorgeous.' },
    { bookingIdx: 4, rating: 5, comment: 'Olivia\'s facial was incredibly relaxing. My skin glows!' },
    { bookingIdx: 11, rating: 5, comment: 'Jake pushed me to a new PR! Best trainer in the city.' },
    { bookingIdx: 12, rating: 4, comment: 'Great HIIT class! Really intense but rewarding.' },
    { bookingIdx: 13, rating: 5, comment: 'Elena\'s yoga class is so calming. Left feeling renewed.' },
    { bookingIdx: 18, rating: 5, comment: 'Sophie took such good care of my cat! Highly recommend.' },
    { bookingIdx: 19, rating: 4, comment: 'Tom did an amazing groom on my golden retriever. Looks fantastic!' },
    { bookingIdx: 20, rating: 5, comment: 'Quick and gentle nail trim. My pup didn\'t even notice!' },
  ];

  for (const r of reviewData) {
    const bookingIdx = r.bookingIdx;
    const booking = await prisma.booking.findUnique({ where: { id: createdBookingIds[bookingIdx] } });
    if (!booking) continue;
    await prisma.review.upsert({
      where: { bookingId: booking.id },
      update: {},
      create: {
        customerId: booking.customerId, companyId: booking.companyId,
        bookingId: booking.id, rating: r.rating, comment: r.comment,
      },
    });
  }
  console.log(`✓ REVIEWS: ${reviewData.length} created`);

  // ── NOTIFICATIONS ──
  // Customer notifications
  const customerNotifications = [
    { userIdIdx: 0, type: 'booking_confirmed', title: 'Booking Confirmed', message: 'Your Premium Haircut with Emma at Luxe Salon & Spa is confirmed for tomorrow at 10:00.' },
    { userIdIdx: 4, type: 'booking_confirmed', title: 'Booking Confirmed', message: 'Your Premium Haircut with Liam is confirmed for tomorrow at 10:00.' },
    { userIdIdx: 5, type: 'booking_confirmed', title: 'Booking Confirmed', message: 'Your Hair Coloring with Noah is confirmed for tomorrow at 11:00.' },
    { userIdIdx: 0, type: 'booking_created', title: 'Booking Received', message: 'Your Deep Tissue Massage with James at Luxe Salon & Spa is pending confirmation.' },
    { userIdIdx: 3, type: 'booking_cancelled', title: 'Booking Cancelled', message: 'Your Personal Training Session with Jake at FitForge Gym has been cancelled.' },
    { userIdIdx: 7, type: 'booking_created', title: 'Booking Received', message: 'Your Full Grooming with Sophie at Paws & Claws is pending confirmation.' },
    { userIdIdx: 2, type: 'booking_confirmed', title: 'Booking Confirmed', message: 'Your Full Grooming at Paws & Claws with Sophie is confirmed for tomorrow at 10:00.' },
  ];

  // Employee notifications
  const employeeNotificationUsers = allEmployees.map(e => e.userId);
  const employeeNotifications = [
    { userId: employeeNotificationUsers[0], type: 'booking_created', title: 'New Booking Assigned', message: 'Alex Martinez booked Premium Haircut with you on ' + tomorrow.toISOString().split('T')[0] + ' at 10:00.' },
    { userId: employeeNotificationUsers[2], type: 'booking_created', title: 'New Booking Assigned', message: 'Taylor Reed booked Luxury Manicure with you on ' + nextWeek.toISOString().split('T')[0] + ' at 16:00.' },
    { userId: employeeNotificationUsers[1], type: 'booking_confirmed', title: 'Booking Confirmed', message: 'Quinn Cooper\'s Deep Tissue Massage has been confirmed for ' + nextMonth.toISOString().split('T')[0] + ' at 14:00.' },
    { userId: employeeNotificationUsers[5], type: 'booking_confirmed', title: 'Booking Confirmed', message: 'Morgan White\'s Hair Coloring has been confirmed for tomorrow at 11:00.' },
    { userId: employeeNotificationUsers[6], type: 'booking_created', title: 'New Booking Assigned', message: 'Casey Kim booked Personal Training Session with you for tomorrow at 06:00.' },
  ];

  // Company admin notifications
  const adminEmails = ['manager@luxesalon.com', 'manager@fitforge.com', 'manager@pawsandclaws.com'];
  const adminUsers = await prisma.user.findMany({ where: { email: { in: adminEmails } }, select: { id: true } });
  const adminNotifications = adminUsers.map((u, i) => ({
    userId: u.id,
    type: 'employee_booking',
    title: 'Staff Booking Update',
    message: i === 0 ? 'Emma received a new booking for Premium Haircut.' : i === 1 ? 'Jake received a new booking for Personal Training.' : 'Sophie received a new booking for Full Grooming.',
  }));

  // Super admin notifications
  const superAdminUser = await prisma.user.findUnique({ where: { email: 'admin@bookflow.com' }, select: { id: true } });
  const superAdminNotifications = superAdminUser ? [
    { userId: superAdminUser.id, type: 'subscription_changed', title: 'Plan Upgrade', message: 'Paws & Claws upgraded from FREE to BASIC plan.' },
    { userId: superAdminUser.id, type: 'subscription_changed', title: 'Plan Upgrade', message: 'FitForge Gym upgraded from BASIC to PREMIUM plan.' },
    { userId: superAdminUser.id, type: 'employee_booking', title: 'Platform Activity', message: '25 bookings were made across all businesses this week.' },
  ] : [];

  const allNotifications = [
    ...customerNotifications.map(n => ({ userId: customerIds[n.userIdIdx], type: n.type, title: n.title, message: n.message })),
    ...employeeNotifications,
    ...adminNotifications,
    ...superAdminNotifications,
  ];

  // Delete existing notifications first to avoid duplicates on reseed
  await prisma.notification.deleteMany({});
  for (const n of allNotifications) {
    await prisma.notification.create({ data: n });
  }
  console.log(`✓ NOTIFICATIONS: ${allNotifications.length} created across all user types`);

  console.log('\n✓ Seed complete!');
  console.log('  ── Logins ──');
  console.log('  Super Admin:   admin@bookflow.com / 1324Admin@');
  console.log('  Salon Manager: manager@luxesalon.com / 1324Admin@');
  console.log('  Gym Manager:   manager@fitforge.com / 1324Admin@');
  console.log('  Pet Manager:   manager@pawsandclaws.com / 1324Admin@');
  console.log('  Employee:      emma@luxesalon.com / 1324Admin@');
  console.log('  Customer:      alex@test.com / 1324Admin@');
  console.log('  (All accounts use password: 1324Admin@)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
