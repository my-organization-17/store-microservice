import { mysqlTable, uniqueIndex, varchar } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

import { baseColumns } from './base-columns';
import { category } from './category.schema';

export const categoryTranslation = mysqlTable(
  'category_translation',
  {
    ...baseColumns,
    categoryId: varchar('category_id', { length: 36 })
      .notNull()
      .references(() => category.id, { onDelete: 'cascade' }),
    language: varchar({ length: 10, enum: ['en', 'ua', 'ru', 'de'] }).notNull(),
    title: varchar({ length: 255 }).notNull(),
    description: varchar({ length: 255 }),
  },
  (table) => [uniqueIndex('category_translation_unique').on(table.categoryId, table.language)],
);

export const categoryTranslationRelations = relations(categoryTranslation, ({ one }) => ({
  category: one(category, {
    fields: [categoryTranslation.categoryId],
    references: [category.id],
  }),
}));
