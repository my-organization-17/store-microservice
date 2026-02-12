import type { ItemWithRelations } from 'src/database/schema';
import type {
  StoreItemWithOption,
  ItemVariant,
  ItemBasePrice,
  ItemImage,
  ItemInfoAttribute,
} from 'src/generated-types/store-item';

export function mapItemsToResponse(items: ItemWithRelations[]): StoreItemWithOption[] {
  return items.map(mapItem);
}

function mapItem(item: ItemWithRelations): StoreItemWithOption {
  const translation = item.translations[0];
  const variantAttrs = item.attributes.filter((a) => a.prices.length > 0);
  const infoAttrs = item.attributes.filter((a) => a.prices.length === 0);

  return {
    id: item.id,
    brand: item.brand ?? null,
    slug: item.slug,
    isAvailable: item.isAvailable,
    sortOrder: item.sortOrder,
    expectedDate: item.expectedDate ?? null,
    categoryId: item.categoryId,
    title: translation?.title ?? '',
    description: translation?.description ?? null,
    detailedDescription: translation?.detailedDescription ?? null,
    images: item.images.map(mapImage),
    variants: variantAttrs.map(mapVariant),
    prices: item.prices.filter((p) => !p.itemAttributeId).map(mapBasePrice),
    attributes: mapInfoAttributes(infoAttrs),
  };
}

function mapInfoAttributes(attrs: ItemWithRelations['attributes']): ItemInfoAttribute[] {
  return attrs.map((attr) => ({
    name: attr.attribute.slug,
    value: attr.translations[0]?.value ?? '',
  }));
}

function mapVariant(attr: ItemWithRelations['attributes'][number]): ItemVariant {
  const regularPrice = attr.prices.find((p) => p.priceType === 'regular');
  const discountPrice = attr.prices.find((p) => p.priceType === 'discount');

  return {
    id: attr.id,
    attributeName: attr.attribute.slug,
    attributeValue: attr.translations[0]?.value ?? '',
    regularPrice: regularPrice?.value ?? null,
    discountPrice: discountPrice?.value ?? null,
    currency: regularPrice?.currency ?? discountPrice?.currency ?? 'UAH',
  };
}

function mapBasePrice(price: ItemWithRelations['prices'][number]): ItemBasePrice {
  return {
    priceType: price.priceType,
    value: price.value,
    currency: price.currency,
  };
}

function mapImage(img: ItemWithRelations['images'][number]): ItemImage {
  return {
    id: img.id,
    url: img.url,
    alt: img.alt ?? null,
    sortOrder: img.sortOrder,
  };
}
