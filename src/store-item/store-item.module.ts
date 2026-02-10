import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/database/database.module';
import { StoreItemService } from './store-item.service';
import { StoreItemController } from './store-item.controller';
import { StoreItemRepository } from './store-item.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [StoreItemController],
  providers: [StoreItemService, StoreItemRepository],
})
export class StoreItemModule {}
