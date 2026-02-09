import { Inject, Injectable, Logger } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/mysql2';
import { eq } from 'drizzle-orm';

import * as schema from 'src/database/schema';

@Injectable()
export class StoreCategoryRepository {
  private readonly logger = new Logger(StoreCategoryRepository.name);
  constructor(
    @Inject('DATABASE_CONNECTION')
    private readonly drizzleDb: ReturnType<typeof drizzle<typeof schema>>,
  ) {}

  async findStoreCategoryById(
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

  findAllStoreCategoriesWithTranslation(
    language: schema.LanguageEnum,
  ): Promise<(schema.Category & { translations: schema.CategoryTranslation[] })[]> {
    this.logger.debug(`Finding all store categories with translations for language: ${language}`);
    return this.drizzleDb.query.category.findMany({
      with: {
        translations: {
          where: eq(schema.categoryTranslation.language, language),
        },
      },
    });
  }
}
