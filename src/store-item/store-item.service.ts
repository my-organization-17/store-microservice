import { Injectable, Logger } from '@nestjs/common';
import { StoreItemRepository } from './store-item.repository';

@Injectable()
export class StoreItemService {
  private readonly logger = new Logger(StoreItemService.name);
  constructor(private readonly storeItemRepository: StoreItemRepository) {}
}
