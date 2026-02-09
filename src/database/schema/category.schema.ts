import { boolean, int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

import { baseColumns } from './base-columns';
import { item } from './item.schema';
import { attribute } from './attribute.schema';
import { categoryTranslation } from './category-translation.schema';

export const category = mysqlTable('category', {
  ...baseColumns,
  slug: varchar({ length: 255 }).notNull(),
  isAvailable: boolean('is_available').default(true).notNull(),
  sortOrder: int('sort_order').default(0).notNull(),
});

export const categoryRelations = relations(category, ({ many }) => ({
  translations: many(categoryTranslation),
  items: many(item),
  attributes: many(attribute),
}));

export type Category = typeof category.$inferSelect;
export type NewCategory = typeof category.$inferInsert;
