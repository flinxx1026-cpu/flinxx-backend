import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.users.findMany({
    where: { has_unlimited_skip: true }
  });

  for (const user of users) {
    console.log(`\nUser: ${user.email} (${user.id})`);
    
    // Simulate /api/profile EXACT LOGIC
    const isPremium = !!(user.is_premium && (!user.premium_expiry || new Date(user.premium_expiry) > new Date()));
    const hasUnlimitedSkip = !!(user.has_unlimited_skip && (!user.unlimited_skip_expires_at || new Date(user.unlimited_skip_expires_at) > new Date()));
    
    console.log('  isPremium computed:', isPremium);
    console.log('  hasUnlimitedSkip computed:', hasUnlimitedSkip);
    
    // Also simulate frontend Chat.jsx EXACT LOGIC
    const profileDataUser = {
      is_premium: user.is_premium,
      has_unlimited_skip: user.has_unlimited_skip,
      isPremium: isPremium,
      hasUnlimitedSkip: hasUnlimitedSkip
    };
    
    // AuthContext normalized
    const freshUser = {
      isPremium: !!(profileDataUser.isPremium || profileDataUser.is_premium),
      hasUnlimitedSkip: !!(profileDataUser.hasUnlimitedSkip || profileDataUser.has_unlimited_skip),
    };
    
    // Chat.jsx
    const isPremiumUser = !!(freshUser?.isPremium || freshUser?.hasUnlimitedSkip || freshUser?.is_premium || freshUser?.has_unlimited_skip);
    
    console.log('  isPremiumUser (Frontend):', isPremiumUser);
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
