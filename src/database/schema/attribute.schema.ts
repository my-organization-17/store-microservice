import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

import { baseColumns } from './base-columns';
import { category } from './category.schema';
import { itemAttribute } from './item-attribute.schema';
import { attributeTranslation } from './attribute-translation.schema';

export const attribute = mysqlTable('attribute', {
  ...baseColumns,
  categoryId: varchar('category_id', { length: 36 })
    .notNull()
    .references(() => category.id, { onDelete: 'cascade' }),
  slug: varchar({ length: 255 }).notNull(),
  sortOrder: int('sort_order').default(0).notNull(),
});

export const attributeRelations = relations(attribute, ({ one, many }) => ({
  category: one(category, {
    fields: [attribute.categoryId],
    references: [category.id],
  }),
  translations: many(attributeTranslation),
  itemAttributes: many(itemAttribute),
}));

export type Attribute = typeof attribute.$inferSelect;
export type NewAttribute = typeof attribute.$inferInsert;
