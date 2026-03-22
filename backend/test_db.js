import pg from 'pg';
import { v4 as uuidv4 } from 'uuid';

const pool = new pg.Pool({
  connectionString: 'postgresql://neondb_owner:npg_s5bwKSBpT8AQ@ep-shy-dream-a1fw21bf.ap-southeast-1.aws.neon.tech/neondb?sslmode=require'
});

async function test() {
  try {
    const res = await pool.query("SELECT column_name, column_default FROM information_schema.columns WHERE table_name = 'reports'");
    import('fs').then(fs => fs.writeFileSync('err.txt', JSON.stringify(res.rows, null, 2)));
    console.log("Success! Fetched defaults");
  } catch (err) {
    import('fs').then(fs => fs.writeFileSync('err.txt', err.message || err.toString()));
  } finally {
    pool.end();
  }
}
test();
