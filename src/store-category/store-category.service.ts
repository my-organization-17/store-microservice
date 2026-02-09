import { Injectable, Logger } from '@nestjs/common';

import { AppError } from 'src/utils/errors/app-error';
import { StoreCategoryRepository } from './store.category.repository';

import type { StoreCategoryList, StoreCategoryWithTranslations } from 'src/generated-types/store-category';
import type { LanguageEnum } from 'src/database/schema';

@Injectable()
export class StoreCategoryService {
  private readonly logger = new Logger(StoreCategoryService.name);
  constructor(private readonly storeCategoryRepository: StoreCategoryRepository) {}

  async findStoreCategoryById(id: string): Promise<StoreCategoryWithTranslations> {
    this.logger.debug(`Finding store category with id: ${id}`);
    try {
      const category = await this.storeCategoryRepository.findStoreCategoryById(id);
      if (!category) {
        this.logger.warn(`Store category with id: ${id} not found`);
        throw AppError.notFound('Store category not found');
      }
      this.logger.debug(`Store category with id: ${id} found: ${JSON.stringify(category)}`);
      return {
        category: {
          id: category.id,
          slug: category.slug,
          isAvailable: category.isAvailable,
          sortOrder: category.sortOrder,
        },
        translation:
          category.translations.length > 0
            ? category.translations.map((t) => ({
                id: t.id,
                title: t.title,
                description: t.description ?? '',
                language: t.language,
              }))
            : [],
      };
    } catch (error) {
      this.logger.error(`Error fetching full menu: ${error instanceof Error ? error.message : error}`);
      if (error instanceof AppError) throw error;
      throw AppError.internalServerError('Failed to retrieve store category');
    }
  }

  async findAllStoreCategoriesWithTranslation(language: LanguageEnum): Promise<StoreCategoryList> {
    this.logger.debug(`Finding all store categories with translations for language: ${language}`);
    try {
      const categories = await this.storeCategoryRepository.findAllStoreCategoriesWithTranslation(language);

      const data = categories.map((category) => ({
        id: category.id,
        slug: category.slug,
        isAvailable: category.isAvailable,
        sortOrder: category.sortOrder,
        description: category.translations.length > 0 ? (category.translations[0].description ?? '') : '',
        title: category.translations.length > 0 ? category.translations[0].title : '',
      }));

      return { data };
    } catch (error) {
      this.logger.error(`Error fetching full menu: ${error instanceof Error ? error.message : error}`);
      throw AppError.internalServerError('Failed to retrieve store categories');
    }
  }
}
