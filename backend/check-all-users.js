// script to check how many users have unlimited skip and what their expiry dates are
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const allUsers = await prisma.users.findMany({
    where: {
      has_unlimited_skip: true
    },
    select: {
      id: true,
      email: true,
      has_unlimited_skip: true,
      unlimited_skip_expires_at: true,
      daily_skip_count: true,
    }
  });

  console.log(`There are ${allUsers.length} users with has_unlimited_skip = true in the DB.`);
  for (const user of allUsers) {
    const isExpired = user.unlimited_skip_expires_at && new Date(user.unlimited_skip_expires_at) <= new Date();
    console.log(`- ${user.email} (ID: ${user.id})`);
    console.log(`  Expires at: ${user.unlimited_skip_expires_at}`);
    console.log(`  Is Expired based on new Date(): ${isExpired}`);
    console.log(`  Daily skips used: ${user.daily_skip_count}`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
