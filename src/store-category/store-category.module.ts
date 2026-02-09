import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/database/database.module';
import { StoreCategoryService } from './store-category.service';
import { StoreCategoryController } from './store-category.controller';
import { StoreCategoryRepository } from './store.category.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [StoreCategoryController],
  providers: [StoreCategoryService, StoreCategoryRepository],
})
export class StoreCategoryModule {}
