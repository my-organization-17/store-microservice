import { Inject, Injectable, Logger } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/mysql2';

import * as schema from 'src/database/schema';

@Injectable()
export class StoreItemRepository {
  private readonly logger = new Logger(StoreItemRepository.name);
  constructor(
    @Inject('DATABASE_CONNECTION')
    private readonly drizzleDb: ReturnType<typeof drizzle<typeof schema>>,
  ) {}
  // logic for store item repository will be implemented here in the future
}
