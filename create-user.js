/**
 * Create user account directly in database
 * Run with: node create-user.js
 */

require('dotenv').config({ path: '.env.local' });
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

async function createUser() {
  console.log('=== Creating User Account ===\n');

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('❌ DATABASE_URL not found in .env.local');
    return;
  }

  const pool = new Pool({
    connectionString,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });

  try {
    // User details
    const email = 'c.hatfield309@gmail.com';
    const password = 'Filters2026!';
    const name = 'Chris Hatfield';
    const role = 'admin'; // or 'dev', 'sales'

    console.log('Creating user:');
    console.log('  Email:', email);
    console.log('  Name:', name);
    console.log('  Role:', role);
    console.log('');

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      console.log('⚠️  User already exists!');
      console.log('   Would you like to update the password? (Y/N)');
      console.log('   Updating password...');

      // Hash new password
      const passwordHash = await bcrypt.hash(password, 10);

      // Update password
      await pool.query(
        'UPDATE users SET password_hash = $1 WHERE email = $2',
        [passwordHash, email]
      );

      console.log('✅ Password updated successfully!');
    } else {
      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create user
      const result = await pool.query(
        `INSERT INTO users (email, password_hash, name, role, created_at)
         VALUES ($1, $2, $3, $4, NOW())
         RETURNING id, email, name, role, created_at`,
        [email, passwordHash, name, role]
      );

      console.log('✅ User created successfully!');
      console.log('');
      console.log('User Details:');
      console.log('  ID:', result.rows[0].id);
      console.log('  Email:', result.rows[0].email);
      console.log('  Name:', result.rows[0].name);
      console.log('  Role:', result.rows[0].role);
      console.log('  Created:', result.rows[0].created_at);
    }

    console.log('');
    console.log('✅ You can now login with:');
    console.log('   Email:', email);
    console.log('   Password:', password);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await pool.end();
  }

  console.log('\n=== Done ===');
}

createUser().catch(console.error);
