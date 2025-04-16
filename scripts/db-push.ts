import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from '../shared/schema';

// ANSI color codes for better logging
const reset = '\x1b[0m';
const green = '\x1b[32m';
const yellow = '\x1b[33m';
const red = '\x1b[31m';

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error(`${red}Error: DATABASE_URL is not defined${reset}`);
    process.exit(1);
  }

  try {
    console.log(`${yellow}Connecting to database...${reset}`);
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const db = drizzle(pool, { schema });

    console.log(`${yellow}Pushing schema to database...${reset}`);
    
    // First make sure we can query the database
    try {
      await db.select().from(schema.profiles).limit(1);
      console.log(`${yellow}Connected to database successfully.${reset}`);
    } catch (error) {
      console.log(`${yellow}Tables don't exist yet. Creating...${reset}`);
    }

    // Create tables manually using SQL
    await pool.connect().then(async (client) => {
      try {
        await client.query(`
          -- Create profiles table if it doesn't exist
          CREATE TABLE IF NOT EXISTS profiles (
            id SERIAL PRIMARY KEY,
            clerk_id TEXT NOT NULL UNIQUE,
            email TEXT,
            first_name TEXT,
            last_name TEXT,
            avatar_url TEXT,
            bio TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );

          -- Create quotes table if it doesn't exist
          CREATE TABLE IF NOT EXISTS quotes (
            id SERIAL PRIMARY KEY,
            text TEXT NOT NULL,
            author TEXT,
            source TEXT,
            category TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `);
      } finally {
        client.release();
      }
    });

    console.log(`${green}Schema pushed successfully!${reset}`);
    
    // Insert some sample quotes if the quotes table is empty
    const quotesResult = await db.select().from(schema.quotes).limit(1);
    
    if (quotesResult.length === 0) {
      console.log(`${yellow}Inserting sample quotes...${reset}`);
      
      await db.insert(schema.quotes).values([
        { 
          text: 'إنما الأعمال بالنيات', 
          author: 'Prophet Muhammad (peace be upon him)', 
          source: 'Hadith, Sahih Bukhari', 
          category: 'intention' 
        },
        { 
          text: 'من حسن إسلام المرء تركه ما لا يعنيه', 
          author: 'Prophet Muhammad (peace be upon him)', 
          source: 'Hadith, Tirmidhi', 
          category: 'character' 
        },
        { 
          text: 'الدنيا متاع وخير متاعها المرأة الصالحة', 
          author: 'Prophet Muhammad (peace be upon him)', 
          source: 'Hadith, Muslim', 
          category: 'family' 
        }
      ]);
      
      console.log(`${green}Sample quotes inserted successfully!${reset}`);
    }

    // Clean up and close the pool
    await pool.end();

    // Success message
    console.log(`${green}Database initialization complete!${reset}`);
  } catch (error) {
    console.error(`${red}Migration error:${reset}`, error);
    process.exit(1);
  }
}

main();