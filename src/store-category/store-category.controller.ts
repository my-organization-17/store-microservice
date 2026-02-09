import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { StoreCategoryService } from './store-category.service';
import {
  type ChangeStoreCategoryPositionRequest,
  type CreateStoreCategoryRequest,
  type Id,
  type StatusResponse,
  STORE_CATEGORY_SERVICE_NAME,
  type StoreCategory,
  type StoreCategoryList,
  type StoreCategoryTranslationRequest,
  type StoreCategoryWithTranslations,
  type UpdateStoreCategoryRequest,
} from 'src/generated-types/store-category';
import type { LanguageEnum } from 'src/database/language.enum';

@Controller()
export class StoreCategoryController {
  private readonly logger = new Logger(StoreCategoryController.name);
  constructor(private readonly storeCategoryService: StoreCategoryService) {}

  @GrpcMethod(STORE_CATEGORY_SERVICE_NAME, 'GetStoreCategoryById')
  async getStoreCategoryById(data: Id): Promise<StoreCategoryWithTranslations> {
    this.logger.debug(`Received request to find store category with id: ${data.id}`);
    return await this.storeCategoryService.findStoreCategoryByIdWithTranslation(data.id);
  }

  @GrpcMethod(STORE_CATEGORY_SERVICE_NAME, 'GetStoreCategoriesByLanguage')
  async getStoreCategoryListWithTranslation(data: { language: LanguageEnum }): Promise<StoreCategoryList> {
    this.logger.debug(`Received request to find all store categories with translations for language: ${data.language}`);
    return await this.storeCategoryService.findStoreCategoryListWithTranslation(data.language);
  }

  @GrpcMethod(STORE_CATEGORY_SERVICE_NAME, 'CreateStoreCategory')
  async createStoreCategory(data: CreateStoreCategoryRequest): Promise<Id> {
    this.logger.debug(`Received request to create store category with data: ${JSON.stringify(data)}`);
    return await this.storeCategoryService.createStoreCategory(data);
  }

  @GrpcMethod(STORE_CATEGORY_SERVICE_NAME, 'UpdateStoreCategory')
  async updateStoreCategory(data: UpdateStoreCategoryRequest): Promise<Id> {
    this.logger.debug(`Received request to update store category with data: ${JSON.stringify(data)}`);
    return await this.storeCategoryService.updateStoreCategory(data);
  }

  @GrpcMethod(STORE_CATEGORY_SERVICE_NAME, 'DeleteStoreCategory')
  async deleteStoreCategory(data: Id): Promise<StatusResponse> {
    this.logger.debug(`Received request to delete store category with id: ${data.id}`);
    return await this.storeCategoryService.deleteStoreCategory(data.id);
  }

  @GrpcMethod(STORE_CATEGORY_SERVICE_NAME, 'ChangeStoreCategoryPosition')
  async changeStoreCategoryPosition(data: ChangeStoreCategoryPositionRequest): Promise<StoreCategory> {
    this.logger.debug(`Received request to change position of store category with data: ${JSON.stringify(data)}`);
    return await this.storeCategoryService.changeStoreCategoryPosition(data);
  }

  @GrpcMethod(STORE_CATEGORY_SERVICE_NAME, 'UpsertStoreCategoryTranslation')
  async upsertStoreCategoryTranslation(data: StoreCategoryTranslationRequest): Promise<Id> {
    this.logger.debug(
      `Received request to create or update store category translation with data: ${JSON.stringify(data)}`,
    );
    return await this.storeCategoryService.createOrUpdateStoreCategoryTranslation(data);
  }

  @GrpcMethod(STORE_CATEGORY_SERVICE_NAME, 'DeleteStoreCategoryTranslation')
  async deleteStoreCategoryTranslation(data: Id): Promise<StatusResponse> {
    this.logger.debug(`Received request to delete store category translation with id: ${data.id}`);
    return await this.storeCategoryService.deleteStoreCategoryTranslation(data.id);
  }
}
