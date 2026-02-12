import { Inject, Injectable, Logger } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/mysql2';
import { asc, eq } from 'drizzle-orm';

import * as schema from 'src/database/schema';
import type { LanguageEnum } from 'src/database/language.enum';

@Injectable()
export class StoreItemRepository {
  private readonly logger = new Logger(StoreItemRepository.name);
  constructor(
    @Inject('DATABASE_CONNECTION')
    private readonly drizzleDb: ReturnType<typeof drizzle<typeof schema>>,
  ) {}

  // get store items by store category id with translations for a specific language
  async findStoreItemsByCategoryIdWithTranslation(
    categoryId: string,
    language: LanguageEnum,
  ): Promise<schema.ItemWithRelations[]> {
    this.logger.debug(
      `Querying store items for category id: ${categoryId} with translations for language: ${language}`,
    );
    const items = await this.drizzleDb.query.item.findMany({
      where: eq(schema.item.categoryId, categoryId),
      orderBy: asc(schema.item.sortOrder),
      with: {
        translations: {
          where: eq(schema.itemTranslation.language, language),
        },
        prices: true,
        images: true,
        attributes: {
          with: {
            prices: true,
            translations: {
              where: eq(schema.itemAttributeTranslation.language, language),
            },
            attribute: {
              with: {
                translations: {
                  where: eq(schema.attributeTranslation.language, language),
                },
              },
            },
          },
        },
      },
    });

    return items;
  }

  // get store item by id with translations for a specific language
  async findStoreItemsByIdWithTranslation(
    itemId: string,
    language: LanguageEnum,
  ): Promise<schema.ItemWithRelations | null> {
    this.logger.debug(`Querying store item for id: ${itemId} with translations for language: ${language}`);
    const item = await this.drizzleDb.query.item.findFirst({
      where: eq(schema.item.id, itemId),
      with: {
        translations: {
          where: eq(schema.itemTranslation.language, language),
        },
        prices: true,
        images: true,
        attributes: {
          with: {
            prices: true,
            translations: {
              where: eq(schema.itemAttributeTranslation.language, language),
            },
            attribute: {
              with: {
                translations: {
                  where: eq(schema.attributeTranslation.language, language),
                },
              },
            },
          },
        },
      },
    });

    return item || null;
  }
}
