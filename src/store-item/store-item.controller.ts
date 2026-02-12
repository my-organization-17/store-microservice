import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { StoreItemService } from './store-item.service';
import {
  type GetStoreItemByIdRequest,
  type GetStoreItemsByCategoryIdWithOptionRequest,
  STORE_ITEM_SERVICE_NAME,
  type StoreItemListWithOption,
} from 'src/generated-types/store-item';
import type { LanguageEnum } from 'src/database/language.enum';

@Controller()
export class StoreItemController {
  private readonly logger = new Logger(StoreItemController.name);
  constructor(private readonly storeItemService: StoreItemService) {}

  @GrpcMethod(STORE_ITEM_SERVICE_NAME, 'GetStoreItemsByCategoryIdWithOption')
  async getStoreItemsByCategoryIdWithOption(
    data: GetStoreItemsByCategoryIdWithOptionRequest,
  ): Promise<StoreItemListWithOption> {
    this.logger.debug(
      `Received request to find store items for category id: ${data.categoryId} with language: ${data.language}`,
    );
    return await this.storeItemService.getStoreItemsByCategoryIdWithTranslation(
      data.categoryId,
      data.language as LanguageEnum,
    );
  }

  @GrpcMethod(STORE_ITEM_SERVICE_NAME, 'GetStoreItemById')
  async getStoreItemById(data: GetStoreItemByIdRequest) {
    this.logger.debug(`Received request to find store item for id: ${data.itemId} with language: ${data.language}`);
    return await this.storeItemService.getStoreItemByIdWithTranslation(data.itemId, data.language as LanguageEnum);
  }
}
