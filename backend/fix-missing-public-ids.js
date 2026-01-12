import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

function generate8DigitId() {
  return Math.floor(10000000 + Math.random() * 90000000).toString()
}

async function generateUniquePublicId() {
  let publicId
  let exists = true
  let attempts = 0
  const maxAttempts = 100

  while (exists && attempts < maxAttempts) {
    publicId = generate8DigitId()
    
    // Check if already exists in database
    const existingUser = await prisma.users.findUnique({
      where: { public_id: publicId }
    })
    
    exists = !!existingUser
    attempts++
  }

  if (attempts >= maxAttempts) {
    throw new Error('Failed to generate unique public_id after maximum attempts')
  }

  return publicId
}

async function fixMissingPublicIds() {
  try {
    console.log('🔍 Searching for users with missing public_id...\n')
    
    // Find all users with null public_id
    const usersWithoutPublicId = await prisma.users.findMany({
      where: {
        public_id: null
      }
    })
    
    if (usersWithoutPublicId.length === 0) {
      console.log('✅ All users have public_id assigned!')
      return
    }
    
    console.log(`Found ${usersWithoutPublicId.length} users without public_id\n`)
    
    let fixed = 0
    
    for (const user of usersWithoutPublicId) {
      try {
        const publicId = await generateUniquePublicId()
        await prisma.users.update({
          where: { id: user.id },
          data: { public_id: publicId }
        })
        fixed++
        console.log(`✅ Fixed user ${user.email}: generated public_id ${publicId}`)
      } catch (error) {
        console.error(`❌ Failed to fix user ${user.email}:`, error.message)
      }
    }
    
    console.log(`\n✅ Successfully fixed ${fixed}/${usersWithoutPublicId.length} users`)
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

fixMissingPublicIds()
