import { mysqlTable, uniqueIndex, varchar } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

import { baseColumns } from './base-columns';
import { attribute } from './attribute.schema';
import { languageEnum } from './language.enum';

export const attributeTranslation = mysqlTable(
  'attribute_translation',
  {
    ...baseColumns,
    attributeId: varchar('attribute_id', { length: 36 })
      .notNull()
      .references(() => attribute.id, { onDelete: 'cascade' }),
    language: varchar({ length: 10, enum: languageEnum }).notNull(),
    name: varchar({ length: 255 }).notNull(),
  },
  (table) => [uniqueIndex('attribute_translation_unique').on(table.attributeId, table.language)],
);

export const attributeTranslationRelations = relations(attributeTranslation, ({ one }) => ({
  attribute: one(attribute, {
    fields: [attributeTranslation.attributeId],
    references: [attribute.id],
  }),
}));
