import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

async function resetProfile() {
  try {
    console.log('📋 Finding all users in database...\n')
    
    // Get all users
    const users = await prisma.users.findMany()
    
    if (users.length === 0) {
      console.log('❌ No users found in database')
      await prisma.$disconnect()
      process.exit(1)
    }
    
    console.log(`Found ${users.length} user(s):\n`)
    users.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email}`)
      console.log(`   ID: ${user.id}`)
      console.log(`   profileCompleted: ${user.profileCompleted}`)
      console.log(`   birthday: ${user.birthday}`)
      console.log(`   gender: ${user.gender}`)
      console.log(`   age: ${user.age}\n`)
    })
    
    // Reset the first user (you)
    if (users.length > 0) {
      const userToReset = users[0]
      console.log(`\n🔄 Resetting profile for: ${userToReset.email}`)
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`)
      
      const updated = await prisma.users.update({
        where: { id: userToReset.id },
        data: {
          profileCompleted: false,
          birthday: null,
          gender: null,
          age: null
        }
      })
      
      console.log('✅ Profile reset successfully!')
      console.log('\nUpdated user data:')
      console.log(`  Email: ${updated.email}`)
      console.log(`  ID: ${updated.id}`)
      console.log(`  profileCompleted: ${updated.profileCompleted}`)
      console.log(`  birthday: ${updated.birthday}`)
      console.log(`  gender: ${updated.gender}`)
      console.log(`  age: ${updated.age}`)
      console.log(`\n📌 User ID to use in frontend: ${updated.id}`)
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

resetProfile()
