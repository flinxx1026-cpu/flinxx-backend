#!/usr/bin/env node

/**
 * Fix profileCompleted status for existing users who have profile data
 * This script updates all users who have birthday + gender to profileCompleted = true
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixProfileCompleted() {
  try {
    console.log('\n🔧 ===== FIX PROFILE COMPLETION STATUS =====\n');

    // Find all users with profile data but profileCompleted is null or false
    console.log('📊 Checking for users with profile data (birthday + gender)...');
    const usersWithData = await prisma.users.findMany({
      where: {
        AND: [
          { birthday: { not: null } },
          { gender: { not: null } }
        ]
      },
      select: {
        id: true,
        email: true,
        display_name: true,
        birthday: true,
        gender: true,
        profileCompleted: true
      }
    });

    console.log(`✅ Found ${usersWithData.length} users with profile data\n`);

    if (usersWithData.length === 0) {
      console.log('✅ No users need to be fixed\n');
      await prisma.$disconnect();
      process.exit(0);
    }

    // Show breakdown
    const needsUpdate = usersWithData.filter(u => u.profileCompleted !== true);
    console.log(`📋 Breakdown:`);
    console.log(`   - With profileCompleted = true: ${usersWithData.length - needsUpdate.length}`);
    console.log(`   - Need update to true: ${needsUpdate.length}\n`);

    if (needsUpdate.length === 0) {
      console.log('✅ All users with profile data already have profileCompleted = true\n');
      await prisma.$disconnect();
      process.exit(0);
    }

    // Update all users with profile data to profileCompleted = true
    console.log(`🔄 Updating ${needsUpdate.length} users...\n`);
    
    const updateResult = await prisma.users.updateMany({
      where: {
        AND: [
          { birthday: { not: null } },
          { gender: { not: null } },
          {
            OR: [
              { profileCompleted: false },
              { profileCompleted: null }
            ]
          }
        ]
      },
      data: { profileCompleted: true }
    });

    console.log(`✅ Updated ${updateResult.count} users\n`);

    if (updateResult.count > 0) {
      console.log('📝 Updated users:');
      for (const user of needsUpdate) {
        console.log(`   ✓ ${user.email} (${user.display_name || 'No name'}) - Birthday: ${user.birthday?.toLocaleDateString()}, Gender: ${user.gender}`);
      }
      console.log();
    }

    // Verify the update
    console.log('🔍 Verifying changes...');
    const allUsers = await prisma.users.findMany({
      where: {
        AND: [
          { birthday: { not: null } },
          { gender: { not: null } }
        ]
      },
      select: {
        email: true,
        profileCompleted: true
      }
    });

    const allComplete = allUsers.every(u => u.profileCompleted === true);
    
    if (allComplete) {
      console.log(`✅ All ${allUsers.length} users with profile data now have profileCompleted = true\n`);
      console.log('✅ ===== FIX COMPLETE =====\n');
    } else {
      const incomplete = allUsers.filter(u => u.profileCompleted !== true);
      console.log(`⚠️  ${incomplete.length} users still have profileCompleted != true`);
      for (const user of incomplete) {
        console.log(`   - ${user.email}: ${user.profileCompleted}`);
      }
    }

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('\nStack:', error.stack);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

fixProfileCompleted();
