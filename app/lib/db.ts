import { drizzle } from 'drizzle-orm/neon-serverless';
import { neon, neonConfig } from '@neondatabase/serverless';
import * as schema from './schema';

// Environment variables with defaults for development
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/spiritualfit';

// Configure neon
neonConfig.fetchConnectionCache = true;

// Initialize database connection (server-side only)
let db: ReturnType<typeof initializeDb> | null = null;

function initializeDb() {
  const sql = DATABASE_URL ? neon(DATABASE_URL) : null;
  
  if (!sql) {
    console.warn('No DATABASE_URL found. Using in-memory storage instead.');
    return null;
  }
  
  // Create and return drizzle database instance
  return drizzle(sql, { schema });
}

// Lazy initialization of database
export function getDb() {
  // This will only run on the server
  if (typeof window === 'undefined' && !db) {
    db = initializeDb();
  }
  return db;
}