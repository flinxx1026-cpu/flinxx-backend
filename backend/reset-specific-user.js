import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

async function resetUser() {
  try {
    const userId = '6131568b-89fc-4ad1-9acd-93c1bbc0a9d7'
    
    console.log('🔄 Resetting user profile...')
    console.log('User ID:', userId)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    
    // Find user first
    const user = await prisma.users.findUnique({
      where: { id: userId }
    })
    
    if (!user) {
      console.error('❌ User not found with ID:', userId)
      await prisma.$disconnect()
      process.exit(1)
    }
    
    console.log('✓ User found:')
    console.log(`  Email: ${user.email}`)
    console.log(`  Current profileCompleted: ${user.profileCompleted}`)
    console.log(`  Current birthday: ${user.birthday}`)
    console.log(`  Current gender: ${user.gender}`)
    console.log(`  Current age: ${user.age}`)
    console.log()
    
    // Reset profile
    console.log('🔄 Resetting to:')
    console.log('  profileCompleted: false')
    console.log('  birthday: null')
    console.log('  gender: null')
    console.log('  age: null')
    console.log()
    
    const updated = await prisma.users.update({
      where: { id: userId },
      data: {
        profileCompleted: false,
        birthday: null,
        gender: null,
        age: null
      }
    })
    
    console.log('✅ Profile reset successfully!\n')
    console.log('Updated user data:')
    console.log(`  Email: ${updated.email}`)
    console.log(`  profileCompleted: ${updated.profileCompleted}`)
    console.log(`  birthday: ${updated.birthday}`)
    console.log(`  gender: ${updated.gender}`)
    console.log(`  age: ${updated.age}`)
    console.log()
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('\n🔍 Verifying /api/profile will return profileCompleted: false')
    console.log('   Next time this user logs in, they will see ProfileSetupModal')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

resetUser()
