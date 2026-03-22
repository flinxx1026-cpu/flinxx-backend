#!/usr/bin/env node

/**
 * Debug script to verify /api/profile response for existing users
 * This checks if the API is returning profileCompleted correctly
 */

import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

async function debugProfileAPI() {
  try {
    console.log('\n🔧 ===== DEBUG PROFILE API RESPONSE =====\n');

    // Find an existing user with profile data
    const userWithProfile = await prisma.users.findFirst({
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
        profileCompleted: true,
        photo_url: true,
        location: true,
        auth_provider: true
      }
    });

    if (!userWithProfile) {
      console.log('❌ No users found with profile data');
      await prisma.$disconnect();
      process.exit(0);
    }

    console.log('📊 Selected test user:');
    console.log(`   Email: ${userWithProfile.email}`);
    console.log(`   Name: ${userWithProfile.display_name}`);
    console.log(`   Birthday: ${userWithProfile.birthday?.toLocaleDateString()}`);
    console.log(`   Gender: ${userWithProfile.gender}`);
    console.log(`   profileCompleted (DB): ${userWithProfile.profileCompleted}\n`);

    // Simulate what /api/profile does
    console.log('🔄 Simulating /api/profile logic:\n');
    
    let profileCompleted = userWithProfile.profileCompleted === true;
    console.log(`   1. Initial profileCompleted = ${profileCompleted}`);
    
    if (!profileCompleted && userWithProfile.birthday && userWithProfile.gender) {
      console.log(`   2. User has birthday (${userWithProfile.birthday.toLocaleDateString()}) + gender (${userWithProfile.gender})`);
      console.log(`   3. Auto-setting profileCompleted = true`);
      profileCompleted = true;
    }
    
    console.log(`   4. Final profileCompleted = ${profileCompleted}\n`);

    // Generate a test JWT like the backend would
    const testJWT = jwt.sign(
      {
        userId: userWithProfile.id,
        email: userWithProfile.email
      },
      'test-secret-key',
      { expiresIn: '365d' }
    );

    console.log('🔐 Test JWT created:');
    console.log(`   ${testJWT.substring(0, 30)}...\n`);

    // Show what the API would return
    console.log('📤 API Response would be:');
    console.log(JSON.stringify({
      success: true,
      user: {
        uuid: userWithProfile.id,
        email: userWithProfile.email,
        name: userWithProfile.display_name,
        picture: userWithProfile.photo_url,
        gender: userWithProfile.gender,
        birthday: userWithProfile.birthday?.toISOString().split('T')[0],
        location: userWithProfile.location || null,
        profileCompleted: profileCompleted,
        authProvider: userWithProfile.auth_provider
      }
    }, null, 2));

    console.log('\n✅ ===== DEBUG COMPLETE =====\n');

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

debugProfileAPI();
