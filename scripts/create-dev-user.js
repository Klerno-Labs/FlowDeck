/**
 * Create Dev User Script
 * Creates the super admin dev user with full access
 */

const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

async function createDevUser() {
  const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

  if (!connectionString) {
    console.error('❌ POSTGRES_URL or DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  console.log('🔄 Creating dev user...');

  const pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    const email = 'c.hatfield309@gmail.com';
    const password = 'FILTERS2026!';
    const name = 'Chris Hatfield';
    const role = 'dev';

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id, role FROM users WHERE email = $1',
      [email]
    );

    const passwordHash = await bcrypt.hash(password, 12);

    if (existingUser.rows.length > 0) {
      // Update existing user to dev role
      await pool.query(
        `UPDATE users
         SET password_hash = $1,
             name = $2,
             role = $3,
             failed_login_attempts = 0,
             locked_until = NULL
         WHERE email = $4`,
        [passwordHash, name, role, email]
      );
      console.log('   ✓ Dev user updated:', email);
    } else {
      // Create new dev user
      const result = await pool.query(
        `INSERT INTO users (email, password_hash, name, role)
         VALUES ($1, $2, $3, $4)
         RETURNING id, email, role`,
        [email, passwordHash, name, role]
      );
      console.log('   ✓ Dev user created:', result.rows[0].email);
      console.log('   ✓ User ID:', result.rows[0].id);
    }

    console.log('\n✅ Dev user setup completed!');
    console.log(`   Email: ${email}`);
    console.log(`   Role: ${role}`);
    console.log(`   Access: Full system access`);

  } catch (error) {
    console.error('❌ Failed to create dev user:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

createDevUser();
