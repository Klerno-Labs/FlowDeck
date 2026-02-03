/**
 * Seed Demo User Script
 * Creates the demo user in the database with proper bcrypt password hash
 */

const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

async function seedUser() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  console.log('🌱 Seeding demo user...');

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    // Hash the password
    const passwordHash = await bcrypt.hash('password123', 10);

    // Insert demo user
    await pool.query(
      `INSERT INTO users (id, email, password_hash, name, role, created_at)
       VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
       ON CONFLICT (email) DO UPDATE
       SET password_hash = $3`,
      ['demo-user-id', 'demo@ftc.com', passwordHash, 'Demo User', 'admin']
    );

    console.log('✅ Demo user created/updated successfully!');
    console.log('\n📧 Login credentials:');
    console.log('   Email: demo@ftc.com');
    console.log('   Password: password123');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seedUser();
