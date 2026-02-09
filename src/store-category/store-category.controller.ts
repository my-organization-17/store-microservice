import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { StoreCategoryService } from './store-category.service';
import {
  type Id,
  STORE_CATEGORY_SERVICE_NAME,
  type StoreCategoryList,
  type StoreCategoryWithTranslations,
} from 'src/generated-types/store-category';
import type { LanguageEnum } from 'src/database/schema';

@Controller()
export class StoreCategoryController {
  private readonly logger = new Logger(StoreCategoryController.name);
  constructor(private readonly storeCategoryService: StoreCategoryService) {}

  @GrpcMethod(STORE_CATEGORY_SERVICE_NAME, 'GetStoreCategoryById')
  async getStoreCategoryById(data: Id): Promise<StoreCategoryWithTranslations> {
    this.logger.debug(`Received request to find store category with id: ${data.id}`);
    return this.storeCategoryService.findStoreCategoryById(data.id);
  }

  @GrpcMethod(STORE_CATEGORY_SERVICE_NAME, 'GetStoreCategoriesByLanguage')
  async getAllStoreCategoriesWithTranslation(data: { language: LanguageEnum }): Promise<StoreCategoryList> {
    this.logger.debug(`Received request to find all store categories with translations for language: ${data.language}`);
    return this.storeCategoryService.findAllStoreCategoriesWithTranslation(data.language);
  }
}
