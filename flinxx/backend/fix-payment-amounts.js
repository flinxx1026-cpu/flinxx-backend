/**
 * Fix payment amounts - divide by 100 to correct the 100x multiplication issue
 * All payments were stored with amounts * 100 (e.g., ₹149 stored as ₹14900)
 */

import pg from 'pg'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

// Load .env files from current directory
const envPath = '.env.local'
let envConfig = {}

try {
  const envFile = fs.readFileSync(envPath, 'utf8')
  envFile.split('\n').forEach(line => {
    if (line && !line.startsWith('#')) {
      const [key, value] = line.split('=')
      if (key && value) {
        envConfig[key.trim()] = value.trim()
      }
    }
  })
} catch (e) {
  console.log('Warning: Could not read .env.local')
}

const DATABASE_URL = envConfig.DATABASE_URL || process.env.DATABASE_URL
console.log(`🔗 Connecting to database...`)

const { Pool } = pg

const pool = new Pool({
  connectionString: DATABASE_URL,
})

async function fixPaymentAmounts() {
  let client
  try {
    client = await pool.connect()
    
    console.log('🔧 Starting payment amount fix...')
    
    // First, show current amounts
    const beforeResult = await client.query(`
      SELECT plan_name, amount, COUNT(*) as count, SUM(amount) as total
      FROM payments
      GROUP BY plan_name, amount
      ORDER BY plan_name
    `)
    
    console.log('\n📊 BEFORE FIX:')
    beforeResult.rows.forEach(row => {
      console.log(`  ${row.plan_name}: ₹${row.amount} × ${row.count} txns = ₹${row.total}`)
    })
    
    // Calculate total revenue before
    const revenueBefore = await client.query(`
      SELECT SUM(amount) as total FROM payments
      WHERE status = 'completed' OR status = 'paid'
    `)
    const totalBefore = revenueBefore.rows[0]?.total || 0
    console.log(`\n💰 Total Revenue BEFORE: ₹${totalBefore}`)
    
    // Fix amounts - divide by 100
    const fixResult = await client.query(`
      UPDATE payments
      SET amount = amount / 100
      WHERE amount > 100
      RETURNING id, plan_name, amount
    `)
    
    console.log(`\n✅ Fixed ${fixResult.rowCount} payment records`)
    
    // Show fixed amounts
    const afterResult = await client.query(`
      SELECT plan_name, amount, COUNT(*) as count, SUM(amount) as total
      FROM payments
      GROUP BY plan_name, amount
      ORDER BY plan_name
    `)
    
    console.log('\n📊 AFTER FIX:')
    afterResult.rows.forEach(row => {
      console.log(`  ${row.plan_name}: ₹${row.amount} × ${row.count} txns = ₹${row.total}`)
    })
    
    // Calculate total revenue after
    const revenueAfter = await client.query(`
      SELECT SUM(amount) as total FROM payments
      WHERE status = 'completed' OR status = 'paid'
    `)
    const totalAfter = revenueAfter.rows[0]?.total || 0
    console.log(`\n💰 Total Revenue AFTER: ₹${totalAfter}`)
    
    console.log(`\n✅ Difference: ₹${totalBefore} → ₹${totalAfter}`)
    
  } catch (error) {
    console.error('❌ Error fixing payments:', error.message)
    console.error(error)
  } finally {
    if (client) client.release()
    await pool.end()
  }
}

fixPaymentAmounts()
