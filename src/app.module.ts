import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { validateEnv } from './utils/validators/env-validator';
import { EnvironmentVariables } from './utils/env.dto';
import { HealthCheckModule } from './health-check/health-check.module';
import { DatabaseModule } from './database/database.module';
import { StoreCategoryModule } from './store-category/store-category.module';
import { StoreItemModule } from './store-item/store-item.module';
import { StoreAttributeModule } from './store-attribute/store-attribute.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local'],
      validate: (config) => validateEnv(config, EnvironmentVariables),
    }),
    HealthCheckModule,
    DatabaseModule,
    StoreCategoryModule,
    StoreItemModule,
    StoreAttributeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
