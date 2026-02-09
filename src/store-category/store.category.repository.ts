import { Inject, Injectable, Logger } from '@nestjs/common';
import { drizzle, MySqlRawQueryResult } from 'drizzle-orm/mysql2';
import { eq, and } from 'drizzle-orm';

import * as schema from 'src/database/schema';
import { UpdateStoreCategoryRequest } from 'src/generated-types/store-category';
import type { LanguageEnum } from 'src/database/language.enum';

@Injectable()
export class StoreCategoryRepository {
  private readonly logger = new Logger(StoreCategoryRepository.name);
  constructor(
    @Inject('DATABASE_CONNECTION')
    private readonly drizzleDb: ReturnType<typeof drizzle<typeof schema>>,
  ) {}

  async findStoreCategoryById(id: string): Promise<schema.Category | null> {
    this.logger.debug(`Finding store category with id: ${id}`);
    const result = await this.drizzleDb.query.category.findFirst({
      where: eq(schema.category.id, id),
    });
    return result ?? null;
  }

  async findStoreCategoryList(): Promise<schema.Category[]> {
    this.logger.debug(`Finding all store categories`);
    return await this.drizzleDb.query.category.findMany();
  }

  async findStoreCategoryByIdWithTranslation(
    id: string,
  ): Promise<(schema.Category & { translations: schema.CategoryTranslation[] }) | null> {
    this.logger.debug(`Finding store category with id: ${id}`);
    const result = await this.drizzleDb.query.category.findFirst({
      where: eq(schema.category.id, id),
      with: {
        translations: true,
      },
    });
    return result ?? null;
  }

  async findStoreCategoryListWithTranslation(
    language: LanguageEnum,
  ): Promise<(schema.Category & { translations: schema.CategoryTranslation[] })[]> {
    this.logger.debug(`Finding all store categories with translations for language: ${language}`);
    return await this.drizzleDb.query.category.findMany({
      with: {
        translations: {
          where: eq(schema.categoryTranslation.language, language),
        },
      },
    });
  }

  async getDefaultTranslationForCategory(categoryId: string): Promise<schema.CategoryTranslation | null> {
    this.logger.debug(`Getting default translation for store category with id: ${categoryId}`);
    const result = await this.drizzleDb.query.categoryTranslation.findFirst({
      where: and(eq(schema.categoryTranslation.categoryId, categoryId), eq(schema.categoryTranslation.language, 'en')),
    });
    return result ?? null;
  }

  async createStoreCategory(data: {
    slug: string;
    sortOrder: number;
    isAvailable?: boolean;
  }): Promise<Array<{ id: string }>> {
    this.logger.debug(`Creating store category with data: ${JSON.stringify(data)}`);
    return await this.drizzleDb.insert(schema.category).values(data).$returningId();
  }

  async updateStoreCategory(data: UpdateStoreCategoryRequest): Promise<MySqlRawQueryResult> {
    this.logger.debug(`Updating store category with data: ${JSON.stringify(data)}`);
    return await this.drizzleDb
      .insert(schema.category)
      .values({
        id: data.id,
        slug: data.slug ?? '',
        ...(data.isAvailable !== undefined && data.isAvailable !== null && { isAvailable: data.isAvailable }),
      })
      .onDuplicateKeyUpdate({
        set: {
          ...(data.slug !== undefined && data.slug !== null && { slug: data.slug }),
          ...(data.isAvailable !== undefined && data.isAvailable !== null && { isAvailable: data.isAvailable }),
        },
      });
  }

  async deleteStoreCategory(id: string): Promise<MySqlRawQueryResult> {
    this.logger.debug(`Deleting store category with id: ${id}`);
    return await this.drizzleDb.delete(schema.category).where(eq(schema.category.id, id));
  }

  async changeStoreCategoryPosition(
    id: string,
    sortOrderUpdates: Array<{ id: string; position: number }>,
  ): Promise<void> {
    this.logger.debug(
      `Changing position of store category with id: ${id} and sortOrderUpdates: ${JSON.stringify(sortOrderUpdates)}`,
    );
    await this.drizzleDb.transaction(async (tx) => {
      for (const update of sortOrderUpdates) {
        await tx.update(schema.category).set({ sortOrder: update.position }).where(eq(schema.category.id, update.id));
      }
    });
  }

  async createOrUpdateStoreCategoryTranslation(data: {
    categoryId: string;
    title: string;
    description?: string | null;
    language: LanguageEnum;
  }): Promise<MySqlRawQueryResult> {
    this.logger.debug(`Creating or updating store category translation with data: ${JSON.stringify(data)}`);
    return await this.drizzleDb
      .insert(schema.categoryTranslation)
      .values({
        categoryId: data.categoryId,
        title: data.title,
        description: data.description ?? '',
        language: data.language,
      })
      .onDuplicateKeyUpdate({
        set: {
          title: data.title,
          description: data.description ?? '',
        },
      });
  }

  async deleteStoreCategoryTranslation(id: string): Promise<MySqlRawQueryResult> {
    this.logger.debug(`Deleting store category translation with id: ${id}`);
    return await this.drizzleDb.delete(schema.categoryTranslation).where(eq(schema.categoryTranslation.id, id));
  }
}
