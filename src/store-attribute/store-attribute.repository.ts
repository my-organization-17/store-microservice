import { Inject, Injectable, Logger } from '@nestjs/common';
import { drizzle, MySqlRawQueryResult } from 'drizzle-orm/mysql2';
import { eq, max, asc } from 'drizzle-orm';

import * as schema from 'src/database/schema';
import type { UpdateAttributeRequest } from 'src/generated-types/store-attribute';
import type { LanguageEnum } from 'src/database/enums/language.enum';

@Injectable()
export class StoreAttributeRepository {
  private readonly logger = new Logger(StoreAttributeRepository.name);
  constructor(
    @Inject('DATABASE_CONNECTION')
    private readonly drizzleDb: ReturnType<typeof drizzle<typeof schema>>,
  ) {}

  // find attribute by id
  async findAttributeById(id: string): Promise<schema.Attribute | null> {
    this.logger.debug(`Finding attribute with id: ${id}`);
    const result = await this.drizzleDb.query.attribute.findFirst({
      where: eq(schema.attribute.id, id),
    });
    return result ?? null;
  }

  // find all attributes for a category
  async findAttributesByCategoryId(categoryId: string): Promise<schema.Attribute[]> {
    this.logger.debug(`Finding attributes for category id: ${categoryId}`);
    return await this.drizzleDb.query.attribute.findMany({
      where: eq(schema.attribute.categoryId, categoryId),
      orderBy: asc(schema.attribute.sortOrder),
    });
  }

  // find all attributes for a category with translations
  async findAttributesByCategoryIdWithTranslations(
    categoryId: string,
  ): Promise<(schema.Attribute & { translations: schema.AttributeTranslation[] })[]> {
    this.logger.debug(`Finding attributes with translations for category id: ${categoryId}`);
    return await this.drizzleDb.query.attribute.findMany({
      where: eq(schema.attribute.categoryId, categoryId),
      orderBy: asc(schema.attribute.sortOrder),
      with: {
        translations: true,
      },
    });
  }

  // create attribute with auto-calculated sort order within the category
  async createAttribute(data: { categoryId: string; slug: string }): Promise<Array<{ id: string }>> {
    this.logger.debug(`Creating attribute with data: ${JSON.stringify(data)}`);
    return await this.drizzleDb.transaction(async (tx) => {
      const [{ maxOrder }] = await tx
        .select({ maxOrder: max(schema.attribute.sortOrder) })
        .from(schema.attribute)
        .where(eq(schema.attribute.categoryId, data.categoryId));
      const nextSortOrder = (maxOrder ?? 0) + 1;
      return await tx
        .insert(schema.attribute)
        .values({ ...data, sortOrder: nextSortOrder })
        .$returningId();
    });
  }

  // update attribute by id
  async updateAttribute(data: UpdateAttributeRequest): Promise<MySqlRawQueryResult> {
    this.logger.debug(`Updating attribute with data: ${JSON.stringify(data)}`);
    return await this.drizzleDb
      .update(schema.attribute)
      .set({
        ...(data.slug !== undefined && data.slug !== null && { slug: data.slug }),
      })
      .where(eq(schema.attribute.id, data.id));
  }

  // delete attribute by id and update positions of remaining attributes in the same category
  async deleteAttributeWithPositionUpdate(
    id: string,
    positionUpdates: Array<{ id: string; position: number }> = [],
  ): Promise<void> {
    this.logger.debug(`Deleting attribute with id: ${id} and position updates: ${JSON.stringify(positionUpdates)}`);
    await this.drizzleDb.transaction(async (tx) => {
      await tx.delete(schema.attribute).where(eq(schema.attribute.id, id));
      for (const update of positionUpdates) {
        await tx.update(schema.attribute).set({ sortOrder: update.position }).where(eq(schema.attribute.id, update.id));
      }
    });
  }

  // change position of attribute within its category
  async changeAttributePosition(id: string, sortOrderUpdates: Array<{ id: string; position: number }>): Promise<void> {
    this.logger.debug(
      `Changing position of attribute with id: ${id} and sortOrderUpdates: ${JSON.stringify(sortOrderUpdates)}`,
    );
    await this.drizzleDb.transaction(async (tx) => {
      for (const update of sortOrderUpdates) {
        await tx.update(schema.attribute).set({ sortOrder: update.position }).where(eq(schema.attribute.id, update.id));
      }
    });
  }

  // create or update attribute translation
  async createOrUpdateAttributeTranslation(data: {
    attributeId: string;
    language: LanguageEnum;
    name: string;
  }): Promise<MySqlRawQueryResult> {
    this.logger.debug(`Upserting attribute translation with data: ${JSON.stringify(data)}`);
    return await this.drizzleDb
      .insert(schema.attributeTranslation)
      .values(data)
      .onDuplicateKeyUpdate({
        set: { name: data.name },
      });
  }

  // delete attribute translation by id
  async deleteAttributeTranslation(id: string): Promise<MySqlRawQueryResult> {
    this.logger.debug(`Deleting attribute translation with id: ${id}`);
    return await this.drizzleDb.delete(schema.attributeTranslation).where(eq(schema.attributeTranslation.id, id));
  }
}
