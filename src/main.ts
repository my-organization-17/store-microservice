import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';
import { GrpcExceptionFilter } from './utils/filters/grpc-exception.filter';
import { HEALTH_CHECK_V1_PACKAGE_NAME } from './generated-types/health-check';
import { STORE_CATEGORY_V1_PACKAGE_NAME } from './generated-types/store-category';
import { STORE_ITEM_V1_PACKAGE_NAME } from './generated-types/store-item';
import { STORE_ATTRIBUTE_V1_PACKAGE_NAME } from './generated-types/store-attribute';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: process.env.NODE_ENV === 'production' ? ['error'] : ['log', 'debug', 'warn', 'error', 'verbose'],
  });

  const logger = new Logger('Main');

  const configService = app.get(ConfigService);
  const url = configService.getOrThrow<string>('TRANSPORT_URL');
  const PORT = configService.getOrThrow<number>('HTTP_PORT');

  app.useGlobalFilters(new GrpcExceptionFilter());

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: [
        HEALTH_CHECK_V1_PACKAGE_NAME,
        STORE_CATEGORY_V1_PACKAGE_NAME,
        STORE_ITEM_V1_PACKAGE_NAME,
        STORE_ATTRIBUTE_V1_PACKAGE_NAME,
      ],
      protoPath: [
        'proto/health-check.proto',
        'proto/store-category.proto',
        'proto/store-item.proto',
        'proto/store-attribute.proto',
      ],
      url,
    },
  });

  await app.startAllMicroservices();
  await app.listen(PORT);
  logger.log('Store microservice is running on ' + url);
}
void bootstrap();
