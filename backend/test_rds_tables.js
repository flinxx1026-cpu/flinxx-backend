import dotenv from 'dotenv';
import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env.local') });

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function main() {
  try {
    const res1 = await pool.query('SELECT datname FROM pg_database');
    console.log('Databases:', res1.rows.map(r => r.datname));

    const res2 = await pool.query(`SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema NOT IN ('pg_catalog', 'information_schema')`);
    console.log('Tables:', res2.rows);

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}
main();
