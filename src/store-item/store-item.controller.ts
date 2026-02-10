import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { StoreItemService } from './store-item.service';
import {
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
}
