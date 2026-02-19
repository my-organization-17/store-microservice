import { Injectable, Logger } from '@nestjs/common';

import { AppError } from 'src/utils/errors/app-error';
import { StoreAttributeRepository } from './store-attribute.repository';
import type {
  AttributeList,
  AttributeResponse,
  AttributeTranslationRequest,
  ChangeAttributePositionRequest,
  CreateAttributeRequest,
  Id,
  StatusResponse,
  UpdateAttributeRequest,
} from 'src/generated-types/store-attribute';
import type { LanguageEnum } from 'src/database/enums/language.enum';

@Injectable()
export class StoreAttributeService {
  private readonly logger = new Logger(StoreAttributeService.name);
  constructor(private readonly storeAttributeRepository: StoreAttributeRepository) {}

  async getAttributesByCategoryId(categoryId: string): Promise<AttributeList> {
    this.logger.debug(`Fetching attributes for category id: ${categoryId}`);
    try {
      const attributes = await this.storeAttributeRepository.findAttributesByCategoryIdWithTranslations(categoryId);
      return {
        data: attributes.map((attr) => ({
          id: attr.id,
          categoryId: attr.categoryId,
          slug: attr.slug,
          sortOrder: attr.sortOrder,
          translations: attr.translations.map((t) => ({
            id: t.id,
            language: t.language,
            name: t.name,
          })),
        })),
      };
    } catch (error) {
      this.logger.error(`Error fetching attributes: ${error instanceof Error ? error.message : error}`);
      throw AppError.internalServerError('Failed to retrieve attributes');
    }
  }

  async createAttribute(data: CreateAttributeRequest): Promise<Id> {
    this.logger.debug(`Creating attribute with data: ${JSON.stringify(data)}`);
    try {
      const result = await this.storeAttributeRepository.createAttribute({
        categoryId: data.categoryId,
        slug: data.slug,
      });
      return result[0];
    } catch (error) {
      this.logger.error(`Error creating attribute: ${error instanceof Error ? error.message : error}`);
      throw AppError.internalServerError('Failed to create attribute');
    }
  }

  async updateAttribute(data: UpdateAttributeRequest): Promise<Id> {
    this.logger.debug(`Updating attribute with data: ${JSON.stringify(data)}`);
    try {
      const existing = await this.storeAttributeRepository.findAttributeById(data.id);
      if (!existing) {
        throw AppError.notFound('Attribute not found');
      }
      await this.storeAttributeRepository.updateAttribute(data);
      return { id: data.id };
    } catch (error) {
      this.logger.error(`Error updating attribute: ${error instanceof Error ? error.message : error}`);
      if (error instanceof AppError) throw error;
      throw AppError.internalServerError('Failed to update attribute');
    }
  }

  async deleteAttribute(id: string): Promise<StatusResponse> {
    this.logger.debug(`Deleting attribute with id: ${id}`);
    try {
      const attributeToDelete = await this.storeAttributeRepository.findAttributeById(id);
      if (!attributeToDelete) {
        throw AppError.notFound('Attribute not found');
      }
      const categoryAttributes = await this.storeAttributeRepository.findAttributesByCategoryId(
        attributeToDelete.categoryId,
      );
      const positionUpdates = categoryAttributes
        .filter((attr) => attr.sortOrder > attributeToDelete.sortOrder)
        .map((attr) => ({ id: attr.id, position: attr.sortOrder - 1 }));
      await this.storeAttributeRepository.deleteAttributeWithPositionUpdate(id, positionUpdates);
      return { success: true, message: 'Attribute deleted successfully' };
    } catch (error) {
      this.logger.error(`Error deleting attribute: ${error instanceof Error ? error.message : error}`);
      if (error instanceof AppError) throw error;
      throw AppError.internalServerError('Failed to delete attribute');
    }
  }

  async changeAttributePosition(data: ChangeAttributePositionRequest): Promise<AttributeResponse> {
    this.logger.debug(`Changing position of attribute with data: ${JSON.stringify(data)}`);
    try {
      const attributeToUpdate = await this.storeAttributeRepository.findAttributeById(data.id);
      if (!attributeToUpdate) {
        throw AppError.notFound('Attribute not found');
      }
      const categoryAttributes = await this.storeAttributeRepository.findAttributesByCategoryId(
        attributeToUpdate.categoryId,
      );
      if (data.sortOrder < 1 || data.sortOrder > categoryAttributes.length) {
        throw AppError.badRequest(`Sort order must be between 1 and ${categoryAttributes.length}`);
      }
      const positionUpdates = this.calculatePositionUpdates(categoryAttributes, attributeToUpdate, data.sortOrder);
      await this.storeAttributeRepository.changeAttributePosition(data.id, positionUpdates);
      const updated = await this.storeAttributeRepository.findAttributeById(data.id);
      if (!updated) {
        throw AppError.notFound('Attribute not found after update');
      }
      return { id: updated.id, categoryId: updated.categoryId, slug: updated.slug, sortOrder: updated.sortOrder };
    } catch (error) {
      this.logger.error(`Error changing attribute position: ${error instanceof Error ? error.message : error}`);
      if (error instanceof AppError) throw error;
      throw AppError.internalServerError('Failed to change attribute position');
    }
  }

  async upsertAttributeTranslation(data: AttributeTranslationRequest): Promise<Id> {
    this.logger.debug(`Upserting attribute translation with data: ${JSON.stringify(data)}`);
    try {
      await this.storeAttributeRepository.createOrUpdateAttributeTranslation({
        attributeId: data.attributeId,
        language: data.language as LanguageEnum,
        name: data.name,
      });
      return { id: data.attributeId };
    } catch (error) {
      this.logger.error(`Error upserting attribute translation: ${error instanceof Error ? error.message : error}`);
      throw AppError.internalServerError('Failed to upsert attribute translation');
    }
  }

  async deleteAttributeTranslation(id: string): Promise<StatusResponse> {
    this.logger.debug(`Deleting attribute translation with id: ${id}`);
    try {
      const result = await this.storeAttributeRepository.deleteAttributeTranslation(id);
      if (result[0].affectedRows === 0) {
        throw AppError.notFound('Attribute translation not found');
      }
      return { success: true, message: 'Attribute translation deleted successfully' };
    } catch (error) {
      this.logger.error(`Error deleting attribute translation: ${error instanceof Error ? error.message : error}`);
      if (error instanceof AppError) throw error;
      throw AppError.internalServerError('Failed to delete attribute translation');
    }
  }

  private calculatePositionUpdates(
    attributes: AttributeResponse[],
    attributeToUpdate: AttributeResponse,
    newPosition: number,
  ): Array<{ id: string; position: number }> {
    return attributes
      .map((attr) => {
        if (attr.id === attributeToUpdate.id) {
          return { id: attr.id, position: newPosition };
        }
        if (attributeToUpdate.sortOrder < newPosition) {
          if (attr.sortOrder > attributeToUpdate.sortOrder && attr.sortOrder <= newPosition) {
            return { id: attr.id, position: attr.sortOrder - 1 };
          }
        } else if (attributeToUpdate.sortOrder > newPosition) {
          if (attr.sortOrder < attributeToUpdate.sortOrder && attr.sortOrder >= newPosition) {
            return { id: attr.id, position: attr.sortOrder + 1 };
          }
        }
        return { id: attr.id, position: attr.sortOrder };
      })
      .filter((update) => {
        const original = attributes.find((a) => a.id === update.id);
        return original && original.sortOrder !== update.position;
      });
  }
}
