import { foreignKey, mysqlTable, uniqueIndex, varchar } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

import { baseColumns } from './base-columns';
import { itemAttribute } from './item-attribute.schema';
import { languageEnum } from '../language.enum';

export const itemAttributeTranslation = mysqlTable(
  'item_attribute_translation',
  {
    ...baseColumns,
    itemAttributeId: varchar('item_attribute_id', { length: 36 }).notNull(),
    language: varchar({ length: 10, enum: languageEnum }).notNull(),
    value: varchar({ length: 255 }).notNull(),
  },
  (table) => [
    foreignKey({
      name: 'item_attr_trans_item_attr_id_fk',
      columns: [table.itemAttributeId],
      foreignColumns: [itemAttribute.id],
    }).onDelete('cascade'),
    uniqueIndex('item_attribute_translation_unique').on(table.itemAttributeId, table.language),
  ],
);

export const itemAttributeTranslationRelations = relations(itemAttributeTranslation, ({ one }) => ({
  itemAttribute: one(itemAttribute, {
    fields: [itemAttributeTranslation.itemAttributeId],
    references: [itemAttribute.id],
  }),
}));
