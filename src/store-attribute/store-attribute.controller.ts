import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { StoreAttributeService } from './store-attribute.service';
import {
  type AttributeList,
  type AttributeResponse,
  type AttributeTranslationRequest,
  type ChangeAttributePositionRequest,
  type CreateAttributeRequest,
  type GetAttributesByCategoryIdRequest,
  type Id,
  type StatusResponse,
  STORE_ATTRIBUTE_SERVICE_NAME,
  type UpdateAttributeRequest,
} from 'src/generated-types/store-attribute';

@Controller()
export class StoreAttributeController {
  private readonly logger = new Logger(StoreAttributeController.name);
  constructor(private readonly storeAttributeService: StoreAttributeService) {}

  @GrpcMethod(STORE_ATTRIBUTE_SERVICE_NAME, 'GetAttributesByCategoryId')
  async getAttributesByCategoryId(data: GetAttributesByCategoryIdRequest): Promise<AttributeList> {
    this.logger.debug(`Received request to get attributes for category id: ${data.categoryId}`);
    return await this.storeAttributeService.getAttributesByCategoryId(data.categoryId);
  }

  @GrpcMethod(STORE_ATTRIBUTE_SERVICE_NAME, 'CreateAttribute')
  async createAttribute(data: CreateAttributeRequest): Promise<Id> {
    this.logger.debug(`Received request to create attribute with data: ${JSON.stringify(data)}`);
    return await this.storeAttributeService.createAttribute(data);
  }

  @GrpcMethod(STORE_ATTRIBUTE_SERVICE_NAME, 'UpdateAttribute')
  async updateAttribute(data: UpdateAttributeRequest): Promise<Id> {
    this.logger.debug(`Received request to update attribute with data: ${JSON.stringify(data)}`);
    return await this.storeAttributeService.updateAttribute(data);
  }

  @GrpcMethod(STORE_ATTRIBUTE_SERVICE_NAME, 'DeleteAttribute')
  async deleteAttribute(data: Id): Promise<StatusResponse> {
    this.logger.debug(`Received request to delete attribute with id: ${data.id}`);
    return await this.storeAttributeService.deleteAttribute(data.id);
  }

  @GrpcMethod(STORE_ATTRIBUTE_SERVICE_NAME, 'ChangeAttributePosition')
  async changeAttributePosition(data: ChangeAttributePositionRequest): Promise<AttributeResponse> {
    this.logger.debug(`Received request to change attribute position with data: ${JSON.stringify(data)}`);
    return await this.storeAttributeService.changeAttributePosition(data);
  }

  @GrpcMethod(STORE_ATTRIBUTE_SERVICE_NAME, 'UpsertAttributeTranslation')
  async upsertAttributeTranslation(data: AttributeTranslationRequest): Promise<Id> {
    this.logger.debug(`Received request to create or update attribute translation with data: ${JSON.stringify(data)}`);
    return await this.storeAttributeService.upsertAttributeTranslation(data);
  }

  @GrpcMethod(STORE_ATTRIBUTE_SERVICE_NAME, 'DeleteAttributeTranslation')
  async deleteAttributeTranslation(data: Id): Promise<StatusResponse> {
    this.logger.debug(`Received request to delete attribute translation with id: ${data.id}`);
    return await this.storeAttributeService.deleteAttributeTranslation(data.id);
  }
}
