import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    const result = await prisma.$queryRaw`SELECT id, email, is_banned FROM users WHERE email='nikhggf180@gmail.com'`;
    console.log('Flinxx users table query result:');
    console.dir(result, { depth: null });
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
