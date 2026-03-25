import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
    const users = await prisma.users.findMany({ take: 1, orderBy: { updated_at: 'desc' } });
    const user = users[0];
    
    console.log(JSON.stringify(user, null, 2));
}

check().finally(() => prisma.$disconnect());
