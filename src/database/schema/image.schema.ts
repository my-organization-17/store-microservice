import { int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

import { baseColumns } from './base-columns';
import { item } from './item.schema';

export const image = mysqlTable('image', {
  ...baseColumns,
  url: varchar({ length: 255 }).notNull(),
  alt: varchar({ length: 255 }),
  sortOrder: int('sort_order').default(0).notNull(),
  itemId: varchar('item_id', { length: 36 })
    .notNull()
    .references(() => item.id, { onDelete: 'cascade' }),
});

export const imageRelations = relations(image, ({ one }) => ({
  item: one(item, {
    fields: [image.itemId],
    references: [item.id],
  }),
}));

export type Image = typeof image.$inferSelect;
export type NewImage = typeof image.$inferInsert;
