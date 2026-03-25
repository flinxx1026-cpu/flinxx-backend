import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env.local') });

import pool from './db/pool.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function test() {
  console.log('Testing PG Pool connection...');
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('PG POOL SUCCESS:', res.rows[0]);
  } catch (err) {
    console.error('PG POOL ERROR:', err.message);
  }

  console.log('Testing Prisma connection...');
  try {
    const count = await prisma.users.count();
    console.log('PRISMA SUCCESS, user count:', count);
  } catch (err) {
    console.error('PRISMA ERROR:', err.message);
  }
}

test().finally(() => {
  pool.end();
  prisma.$disconnect();
});
