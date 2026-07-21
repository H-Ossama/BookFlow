const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
(async () => {
  const emps = await p.employee.findMany({
    include: { user: { select: { firstName: true, lastName: true, companyRole: { select: { name: true } }, company: { select: { name: true } } } } },
  });
  emps.forEach(e => console.log(e.user.firstName, e.user.lastName, '|', e.user.company?.name, '|', e.user.companyRole?.name || 'No Role'));
  await p.$disconnect();
})();
