import { decimal, foreignKey, mysqlTable, uniqueIndex, varchar } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

import { currencyEnum, priceTypeEnum } from '../enums';
import { baseColumns } from './base-columns';
import { item } from './item.schema';
import { itemAttribute } from './item-attribute.schema';

export const itemPrice = mysqlTable(
  'item_price',
  {
    ...baseColumns,
    itemId: varchar('item_id', { length: 36 })
      .notNull()
      .references(() => item.id, { onDelete: 'cascade' }),
    itemAttributeId: varchar('item_attribute_id', { length: 36 }),
    priceType: varchar('price_type', {
      length: 50,
      enum: priceTypeEnum,
    })
      .notNull()
      .default('regular'),
    value: decimal({ precision: 10, scale: 2 }).notNull(),
    currency: varchar({ length: 10, enum: currencyEnum }).notNull().default('UAH'),
  },
  (table) => [
    uniqueIndex('type_item_attr_unique').on(table.itemId, table.priceType, table.itemAttributeId),
    foreignKey({
      name: 'item_price_item_attr_id_fk',
      columns: [table.itemAttributeId],
      foreignColumns: [itemAttribute.id],
    }).onDelete('cascade'),
  ],
);

export const itemPriceRelations = relations(itemPrice, ({ one }) => ({
  item: one(item, {
    fields: [itemPrice.itemId],
    references: [item.id],
  }),
  itemAttribute: one(itemAttribute, {
    fields: [itemPrice.itemAttributeId],
    references: [itemAttribute.id],
  }),
}));

export type ItemPrice = typeof itemPrice.$inferSelect;
export type NewItemPrice = typeof itemPrice.$inferInsert;
