/**
 * Populate test users with real profile data
 * This ensures users have display_name, location, photo_url, etc.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function populateTestUsers() {
  console.log('🌱 Starting to populate ALL users with profile data...\n');

  try {
    // Get ALL users from database
    const allUsers = await prisma.users.findMany({
      select: {
        id: true,
        email: true,
        display_name: true,
        location: true,
        age: true,
        gender: true
      }
    });

    console.log(`Found ${allUsers.length} total users in database\n`);

    // Updated count
    let updatedCount = 0;

    for (let i = 0; i < allUsers.length; i++) {
      const user = allUsers[i];
      const needsUpdate = !user.display_name || !user.location;

      if (needsUpdate) {
        // Generate realistic name and location
        const testNames = [
          'Priya Singh', 'Rajesh Kumar', 'Ananya Sharma', 'Vikram Patel',
          'Zara Khan', 'Arjun Verma', 'Neha Gupta', 'Aditya Nair',
          'Sneha Roy', 'Kabir Hassan', 'Pooja Iyer', 'Rohan Desai'
        ];

        const testLocations = [
          'Mumbai, India', 'Delhi, India', 'Bangalore, India', 'Pune, India',
          'Hyderabad, India', 'Chennai, India', 'Kolkata, India', 'Gurugram, India',
          'Ahmedabad, India', 'Jaipur, India'
        ];

        const name = user.display_name || testNames[i % testNames.length];
        const location = user.location || testLocations[i % testLocations.length];
        const age = user.age || (20 + (i % 10));
        const gender = user.gender || (i % 2 === 0 ? 'female' : 'male');

        const updated = await prisma.users.update({
          where: { id: user.id },
          data: {
            display_name: name,
            location: location,
            age: age,
            gender: gender,
            profileCompleted: true
          }
        });

        console.log(`✅ Updated: ${updated.email}`);
        console.log(`   "${updated.display_name}" - ${updated.location}, Age: ${updated.age}`);
        updatedCount++;
      } else {
        console.log(`⏭️  Skipped: ${user.email} (already has profile data)`);
      }
    }

    console.log(`\n📊 Summary: Updated ${updatedCount} users`);

    // Show updated users
    console.log('\n📊 Verification - showing updated users:');
    const updated = await prisma.users.findMany({
      where: {
        display_name: {
          not: null
        }
      },
      select: {
        id: true,
        email: true,
        display_name: true,
        location: true,
        age: true,
        gender: true
      },
      take: 10
    });

    console.log(`\nFound ${updated.length} users with complete profiles:`);
    updated.forEach((user, idx) => {
      console.log(`   ${idx + 1}. ${user.display_name}`);
      console.log(`      📧 ${user.email}`);
      console.log(`      📍 ${user.location}`);
      console.log(`      👤 Age: ${user.age}, Gender: ${user.gender}`);
    });

    console.log('\n✅ Population complete! Users ready for matching.\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

populateTestUsers();
