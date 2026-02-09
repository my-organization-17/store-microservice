import { decimal, int, mysqlTable, uniqueIndex, varchar } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

import { baseColumns } from './base-columns';
import { item } from './item.schema';

export const itemPrice = mysqlTable(
  'item_price',
  {
    ...baseColumns,
    itemId: varchar('item_id', { length: 36 })
      .notNull()
      .references(() => item.id, { onDelete: 'cascade' }),
    priceType: varchar('price_type', {
      length: 50,
      enum: ['regular', 'discount', 'wholesale'],
    })
      .notNull()
      .default('regular'),
    value: decimal({ precision: 10, scale: 2 }).notNull(),
    currency: varchar({ length: 10 }).notNull().default('UAH'),
    sortOrder: int('sort_order').default(0).notNull(),
  },
  (table) => [uniqueIndex('type_item_unique').on(table.itemId, table.priceType)],
);

export const itemPriceRelations = relations(itemPrice, ({ one }) => ({
  item: one(item, {
    fields: [itemPrice.itemId],
    references: [item.id],
  }),
}));

export type ItemPrice = typeof itemPrice.$inferSelect;
export type NewItemPrice = typeof itemPrice.$inferInsert;
