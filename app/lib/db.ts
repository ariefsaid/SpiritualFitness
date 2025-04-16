import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, PoolClient } from '@neondatabase/serverless';
import * as schema from '@/lib/schema';

let _client: PoolClient | null = null;
let _db: ReturnType<typeof drizzle> | null = null;

function initializeDb() {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    // Create a connection pool
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    
    // Create a database client
    _db = drizzle(pool, { schema });
    
    console.log('🔌 Connected to database successfully');
    return _db;
  } catch (error) {
    console.error('❌ Failed to connect to database:', error);
    throw error;
  }
}

export function getDb() {
  if (!_db) {
    return initializeDb();
  }
  return _db;
}