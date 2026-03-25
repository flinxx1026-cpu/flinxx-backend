import pg from 'pg';

const pool = new pg.Pool({
  connectionString: 'postgresql://postgres:Nikhil6002@flinxx-db.chiwiam80lbl.eu-north-1.rds.amazonaws.com:5432/flinxx',
  ssl: { rejectUnauthorized: false }
});

async function main() {
  try {
    const res2 = await pool.query(`SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema NOT IN ('pg_catalog', 'information_schema')`);
    console.log('Tables in flinxx database:', res2.rows.map(r => r.table_name));

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}
main();
