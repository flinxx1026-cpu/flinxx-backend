import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.users.findMany({ take: 1, orderBy: { updated_at: 'desc' } });
    if (users.length === 0) return console.log('No user');
    const user = users[0];
    
    console.log('--- USER DATA ---');
    console.log('Email:', user.email);
    console.log('daily_skip_count:', user.daily_skip_count);
    console.log('last_skip_reset_date:', user.last_skip_reset_date);
    
    const nowMs = Date.now();
    const istOffsetMs = 5.5 * 60 * 60 * 1000;
    const shiftMs = (4 * 60 * 60 * 1000) + (8 * 60 * 1000);
    const logicalTime = new Date(nowMs + istOffsetMs + shiftMs);
    const todayUtc = new Date(Date.UTC(logicalTime.getUTCFullYear(), logicalTime.getUTCMonth(), logicalTime.getUTCDate()));
    const todayKey = `${todayUtc.getUTCFullYear()}-${String(todayUtc.getUTCMonth() + 1).padStart(2, '0')}-${String(todayUtc.getUTCDate()).padStart(2, '0')}`;

    let lastResetKey = null;
    if (user.last_skip_reset_date) {
        const d = new Date(user.last_skip_reset_date);
        if (!Number.isNaN(d.getTime())) {
            lastResetKey = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
        }
    }

    const shouldReset = !lastResetKey || lastResetKey !== todayKey;
    const skipCount = shouldReset ? 0 : (user.daily_skip_count || 0);

    console.log('--- LOGIC EVALUATION ---');
    console.log('logicalTime:', logicalTime.toISOString());
    console.log('todayUtc:', todayUtc.toISOString());
    console.log('todayKey:', todayKey);
    console.log('lastResetKey:', lastResetKey);
    console.log('shouldReset:', shouldReset);
    console.log('FINAL skipCount:', skipCount);
}

main().finally(() => prisma.$disconnect());
