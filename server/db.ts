import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

console.log('🔌 Connecting to database...');
console.log('📍 Database URL configured:', process.env.DATABASE_URL ? 'Yes' : 'No');

const connectionConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 10,
  min: 1
};

export const pool = new Pool(connectionConfig);
export const db = drizzle(pool, { schema });

// Test connection on startup
pool.on('connect', () => {
  console.log('✅ Database connected successfully');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected database error:', err);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🔄 Received SIGINT, closing database connections...');
  await pool.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🔄 Received SIGTERM, closing database connections...');
  await pool.end();
  process.exit(0);
});