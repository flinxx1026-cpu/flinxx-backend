const { validateSkipLimit } = require('./services/skipLimitValidator.js');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  const users = await prisma.users.findMany({
    take: 5,
    select: { id: true, email: true, daily_skip_count: true, last_skip_reset_date: true }
  });
  console.log("Random users:", users);
  
  // Test one user
  if (users.length > 0) {
    const result = await validateSkipLimit({
      userId: users[0].id,
      prisma,
      redis: null,
      increment: false
    });
    console.log("Validate result:", result);
  }
}

test().catch(console.error).finally(() => prisma.$disconnect());
