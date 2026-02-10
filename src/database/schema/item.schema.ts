import { boolean, date, int, mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

import { baseColumns } from './base-columns';
import { Category, category } from './category.schema';
import { Image, image } from './image.schema';
import { ItemPrice, itemPrice } from './item-price.schema';
import { ItemAttribute, itemAttribute } from './item-attribute.schema';
import { ItemTranslation, itemTranslation } from './item-translation.schema';

export const item = mysqlTable('item', {
  ...baseColumns,
  slug: varchar({ length: 255 }).notNull(),
  brand: varchar({ length: 255 }),
  isAvailable: boolean('is_available').default(true).notNull(),
  expectedDate: date('expected_date'),
  sortOrder: int('sort_order').default(0).notNull(),
  categoryId: varchar('category_id', { length: 36 })
    .notNull()
    .references(() => category.id, { onDelete: 'cascade' }),
});

export const itemRelations = relations(item, ({ one, many }) => ({
  category: one(category, {
    fields: [item.categoryId],
    references: [category.id],
  }),
  translations: many(itemTranslation),
  images: many(image),
  prices: many(itemPrice),
  attributes: many(itemAttribute),
}));

export type Item = typeof item.$inferSelect;
export type NewItem = typeof item.$inferInsert;
export type ItemAttributeWithPrices = ItemAttribute & {
  prices: ItemPrice[];
};

export type ItemWithRelations = Item & {
  category: Category;
  translations: ItemTranslation[];
  images: Image[];
  prices: ItemPrice[];
  attributes: ItemAttributeWithPrices[];
};
