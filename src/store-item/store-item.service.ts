import { Injectable, Logger } from '@nestjs/common';

import { AppError } from 'src/utils/errors/app-error';
import { StoreItemRepository } from './store-item.repository';
import type { LanguageEnum } from 'src/database/language.enum';
import type { StoreItemListWithOption } from 'src/generated-types/store-item';
import { mapItemsToResponse } from './store-item.mapper';

@Injectable()
export class StoreItemService {
  private readonly logger = new Logger(StoreItemService.name);
  constructor(private readonly storeItemRepository: StoreItemRepository) {}

  // get store items by store category id with translations for a specific language
  async getStoreItemsByCategoryIdWithTranslation(
    categoryId: string,
    language: LanguageEnum,
  ): Promise<StoreItemListWithOption> {
    this.logger.debug(
      `Fetching store items for category id: ${categoryId} with translations for language: ${language}`,
    );
    try {
      const items = await this.storeItemRepository.findStoreItemsByCategoryIdWithTranslation(categoryId, language);
      if (!items || items.length === 0) {
        this.logger.warn(`No store items found for category id: ${categoryId} and language: ${language}`);
        return { data: [] };
      }
      return { data: mapItemsToResponse(items) };
    } catch (error) {
      this.logger.error(`Error fetching store items: ${error instanceof Error ? error.message : error}`);
      throw AppError.internalServerError('Failed to retrieve store items');
    }
  }
}
