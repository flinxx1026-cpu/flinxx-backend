import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

async function countPremiumUsers() {
  try {
    console.log('🔍 Counting premium users...\n');

    // Count users with any active premium feature
    const activeFeatures = await pool.query(`
      SELECT COUNT(*) as active_premium_users
      FROM users
      WHERE (
        (has_blue_tick = true AND blue_tick_expires_at > NOW()) OR
        (has_match_boost = true AND match_boost_expires_at > NOW()) OR
        (has_unlimited_skip = true AND unlimited_skip_expires_at > NOW())
      );
    `);

    console.log('📊 Active Premium Users (with active features):');
    console.log(`   Total: ${activeFeatures.rows[0].active_premium_users}\n`);

    // Count successful payments
    const paidPayments = await pool.query(`
      SELECT COUNT(*) as successful_payments
      FROM payments
      WHERE status = 'paid';
    `);

    console.log('💳 Successful Payments:');
    console.log(`   Total: ${paidPayments.rows[0].successful_payments}\n`);

    // Breakdown by plan
    const byPlan = await pool.query(`
      SELECT plan_id, plan_name, COUNT(*) as count
      FROM payments
      WHERE status = 'paid'
      GROUP BY plan_id, plan_name
      ORDER BY count DESC;
    `);

    console.log('📈 Breakdown by Plan:');
    byPlan.rows.forEach(row => {
      console.log(`   ${row.plan_name}: ${row.count}`);
    });
    console.log();

    // Count unique users who have made at least one successful payment
    const uniqueUsers = await pool.query(`
      SELECT COUNT(DISTINCT user_id) as unique_users
      FROM payments
      WHERE status = 'paid';
    `);

    console.log('👥 Unique Users with Successful Payments:');
    console.log(`   Total: ${uniqueUsers.rows[0].unique_users}\n`);

    // Count currently active premium subscriptions by feature
    const blueTickActive = await pool.query(`
      SELECT COUNT(*) as count FROM users
      WHERE has_blue_tick = true AND blue_tick_expires_at > NOW();
    `);

    const matchBoostActive = await pool.query(`
      SELECT COUNT(*) as count FROM users
      WHERE has_match_boost = true AND match_boost_expires_at > NOW();
    `);

    const unlimitedSkipActive = await pool.query(`
      SELECT COUNT(*) as count FROM users
      WHERE has_unlimited_skip = true AND unlimited_skip_expires_at > NOW();
    `);

    console.log('🎯 Active Features Right Now:');
    console.log(`   Blue Tick: ${blueTickActive.rows[0].count}`);
    console.log(`   Match Boost: ${matchBoostActive.rows[0].count}`);
    console.log(`   Unlimited Skip: ${unlimitedSkipActive.rows[0].count}\n`);

    await pool.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

countPremiumUsers();
