import { Controller, Logger } from '@nestjs/common';
import { StoreItemService } from './store-item.service';

@Controller()
export class StoreItemController {
  private readonly logger = new Logger(StoreItemController.name);
  constructor(private readonly storeItemService: StoreItemService) {}
}
