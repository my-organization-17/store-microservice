import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/mysql2';
import * as mysql from 'mysql2/promise';
import * as schema from './schema';

@Module({
  providers: [
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: async (configService: ConfigService) => {
        const logger = new Logger('DatabaseModule');
        const uri = configService.getOrThrow<string>('DATABASE_URL');
        const maxRetries = 5;
        const retryDelay = 5000;

        let pool!: mysql.Pool;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
          try {
            pool = mysql.createPool({
              uri,
              waitForConnections: true,
              connectionLimit: 10,
            });
            await pool.query('SELECT 1');
            logger.log('Database connection established');
            break;
          } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            logger.error(`Database connection attempt ${attempt}/${maxRetries} failed: ${message}`);
            if (attempt === maxRetries) {
              throw error;
            }
            await new Promise((resolve) => setTimeout(resolve, retryDelay));
          }
        }

        return drizzle(pool, {
          schema,
          mode: 'default',
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: ['DATABASE_CONNECTION'],
})
export class DatabaseModule {}
