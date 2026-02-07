import { timestamp, varchar } from 'drizzle-orm/mysql-core';
import { v4 as uuidv4 } from 'uuid';

export const baseColumns = {
  id: varchar('id', { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
};
