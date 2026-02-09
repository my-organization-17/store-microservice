import { mysqlTable, text, uniqueIndex, varchar } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

import { baseColumns } from './base-columns';
import { item } from './item.schema';
import { languageEnum } from '../language.enum';

export const itemTranslation = mysqlTable(
  'item_translation',
  {
    ...baseColumns,
    itemId: varchar('item_id', { length: 36 })
      .notNull()
      .references(() => item.id, { onDelete: 'cascade' }),
    language: varchar({ length: 10, enum: languageEnum }).notNull(),
    title: varchar({ length: 255 }).notNull(),
    description: varchar({ length: 255 }),
    detailedDescription: text('detailed_description'),
  },
  (table) => [uniqueIndex('item_translation_unique').on(table.itemId, table.language)],
);

export const itemTranslationRelations = relations(itemTranslation, ({ one }) => ({
  item: one(item, {
    fields: [itemTranslation.itemId],
    references: [item.id],
  }),
}));
