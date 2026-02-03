/**
 * Neon Database Client Configuration
 * Uses pg Pool with Neon connection string for reliable PostgreSQL access
 */

import { Pool } from 'pg';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create a connection pool
// Use POSTGRES_URL (pooled) from Neon, fallback to DATABASE_URL
const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
  // Optimized for serverless/Vercel
  max: 3, // Lower for serverless cold starts
  idleTimeoutMillis: 10000, // 10 seconds
  connectionTimeoutMillis: 5000, // 5 seconds timeout
});

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected database pool error:', err);
});

/**
 * Execute a parameterized SQL query
 * Usage: await query('SELECT * FROM users WHERE email = $1', ['user@example.com'])
 */
export async function query<T = any>(
  text: string,
  params: any[] = []
): Promise<T[]> {
  try {
    const result = await pool.query(text, params);
    return result.rows as T[];
  } catch (error) {
    console.error('Database query error:', error);
    console.error('Query:', text);
    console.error('Params:', params);
    throw error;
  }
}

/**
 * Execute a query and return the first result
 */
export async function queryOne<T = any>(
  text: string,
  params: any[] = []
): Promise<T | null> {
  const results = await query<T>(text, params);
  return results[0] || null;
}

/**
 * Close the pool (useful for cleanup in scripts)
 */
export async function closePool(): Promise<void> {
  await pool.end();
}
