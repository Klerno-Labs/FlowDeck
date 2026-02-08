import * as dotenv from 'dotenv';
import { query, closePool } from '../src/lib/db/client';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function deleteDemoUser() {
  try {
    console.log('Deleting demo user...');
    const result = await query('DELETE FROM users WHERE email = $1', ['demo@ftc.com']);
    console.log('Demo user deleted successfully');
  } catch (error) {
    console.error('Error deleting demo user:', error);
  } finally {
    await closePool();
    process.exit(0);
  }
}

deleteDemoUser();
