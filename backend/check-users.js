import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.users.findMany({
    where: {
      has_unlimited_skip: true
    },
    select: {
      email: true,
      has_unlimited_skip: true,
      unlimited_skip_expires_at: true,
    }
  });

  console.log('Users with unlimited skip:', users.length);
  console.log(users);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
