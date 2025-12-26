import pg from 'pg'

const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: true
})

// Test PostgreSQL connection
pool.on('error', (err) => {
  console.error('❌ PostgreSQL pool error:', err)
})

pool.on('connect', () => {
  console.log('✅ PostgreSQL connected from pool')
})

export default pool
