import { drizzle } from 'drizzle-orm/mysql2';
import { config } from 'dotenv';

config();

export const db = drizzle(process.env.DATABASE_URL!);
