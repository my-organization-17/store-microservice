import { boolean, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

import { baseColumns } from './base-columns';
import { categories } from './categories.schema';

export const items = mysqlTable('items', {
  ...baseColumns,
  title: varchar('title', { length: 255 }).notNull(),
  description: varchar('description', { length: 255 }),
  isAvailable: boolean('is_available').default(true).notNull(),
  categoryId: varchar('category_id', { length: 36 }).notNull(),
});

export const itemsRelations = relations(items, ({ one }) => ({
  category: one(categories, {
    fields: [items.categoryId],
    references: [categories.id],
  }),
}));
