import { boolean, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

import { baseColumns } from './base-columns';
import { items } from './items.schema';

export const categories = mysqlTable('categories', {
  ...baseColumns,
  title: varchar('title', { length: 255 }).notNull(),
  description: varchar('description', { length: 255 }),
  isAvailable: boolean('is_available').default(true).notNull(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  items: many(items),
}));
