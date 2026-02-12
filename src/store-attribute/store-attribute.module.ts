import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/database/database.module';
import { StoreAttributeService } from './store-attribute.service';
import { StoreAttributeController } from './store-attribute.controller';
import { StoreAttributeRepository } from './store-attribute.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [StoreAttributeController],
  providers: [StoreAttributeService, StoreAttributeRepository],
})
export class StoreAttributeModule {}
