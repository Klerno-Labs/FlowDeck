import { config } from 'dotenv';
import * as path from 'path';

config({ path: path.join(__dirname, '..', '.env.local') });

async function check() {
  const { queryOne, closePool } = await import('../src/lib/db/client');

  const draftsResult = await queryOne<{ exists: boolean }>(
    'SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = $1 AND table_name = $2) as exists',
    ['public', 'content_drafts']
  );

  const versionsResult = await queryOne<{ exists: boolean }>(
    'SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = $1 AND table_name = $2) as exists',
    ['public', 'content_versions']
  );

  console.log('content_drafts exists:', draftsResult?.exists);
  console.log('content_versions exists:', versionsResult?.exists);

  await closePool();
}

check();
