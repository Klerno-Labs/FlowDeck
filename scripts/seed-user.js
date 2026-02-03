/**
 * Seed a demo user into the database
 * Run with: node scripts/seed-user.js
 */

const bcrypt = require('bcryptjs');

async function seedUser() {
  const { createClient } = await import('@supabase/supabase-js');

  // Load environment variables
  require('dotenv').config({ path: '.env.local' });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Error: Missing Supabase credentials in .env.local');
    console.error('   Please add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Demo user credentials
  const email = 'demo@ftc.com';
  const password = 'password123';
  const name = 'Demo User';
  const role = 'admin';

  try {
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    if (existingUser) {
      console.log('⚠️  Demo user already exists!');
      console.log('   Email:', email);
      console.log('   Password:', password);
      return;
    }

    // Insert user
    const { data, error } = await supabase
      .from('users')
      .insert({
        email,
        password_hash: passwordHash,
        name,
        role,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    console.log('✅ Demo user created successfully!');
    console.log('');
    console.log('   Email:', email);
    console.log('   Password:', password);
    console.log('   Role:', role);
    console.log('');
    console.log('🚀 You can now sign in at http://localhost:3000/login');
  } catch (error) {
    console.error('❌ Error creating user:', error.message);
    process.exit(1);
  }
}

seedUser();
