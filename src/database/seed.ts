import { drizzle } from 'drizzle-orm/mysql2';
import { sql } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';
import * as mysql from 'mysql2/promise';
import { config } from 'dotenv';

config({ path: '.env.local' });

import {
  category,
  categoryTranslation,
  attribute,
  attributeTranslation,
  item,
  itemTranslation,
  image,
  itemAttribute,
  itemAttributeTranslation,
  itemPrice,
} from './schema';

async function seed() {
  const pool = mysql.createPool({
    uri: process.env.DATABASE_URL,
    waitForConnections: true,
  });

  const db = drizzle(pool, { mode: 'default' });

  // Generate IDs upfront so children can reference parents
  const catCoffeeId = uuid();
  const catEquipmentId = uuid();
  const catTeaId = uuid();

  const attrWeightId = uuid();
  const attrRoastId = uuid();
  const attrOriginId = uuid();
  const attrProcessingTypeId = uuid();
  const attrScoreId = uuid();
  const attrMaterialId = uuid();

  const itemEthiopiaId = uuid();
  const itemColombiaId = uuid();
  const itemHondurasId = uuid();
  const itemV60Id = uuid();

  const iaEthiopiaWeightId = uuid();
  const iaEthiopiaRoastId = uuid();
  const iaColombiaWeightIdSmall = uuid();
  const iaColombiaWeightIdMedium = uuid();
  const iaColombiaWeightIdLarge = uuid();
  const iaV60MaterialId = uuid();

  // Clear existing data (respecting FK order — children first)
  await db.execute(sql`SET FOREIGN_KEY_CHECKS = 0`);
  await db.delete(itemPrice);
  await db.delete(itemAttributeTranslation);
  await db.delete(itemAttribute);
  await db.delete(image);
  await db.delete(itemTranslation);
  await db.delete(item);
  await db.delete(attributeTranslation);
  await db.delete(attribute);
  await db.delete(categoryTranslation);
  await db.delete(category);
  await db.execute(sql`SET FOREIGN_KEY_CHECKS = 1`);

  console.log('Cleared existing data.');

  // ── 1. Categories ──
  await db.insert(category).values([
    { id: catCoffeeId, slug: 'coffee-beans', isAvailable: true, sortOrder: 0 },
    { id: catEquipmentId, slug: 'brewing-equipment', isAvailable: true, sortOrder: 1 },
    { id: catTeaId, slug: 'leaf-tea', isAvailable: true, sortOrder: 2 },
  ]);

  // ── 2. Category Translations (→ category) ──
  await db.insert(categoryTranslation).values([
    { categoryId: catCoffeeId, language: 'en', title: 'Coffee Beans', description: 'Freshly roasted coffee' },
    { categoryId: catCoffeeId, language: 'ua', title: 'Кавові зерна', description: 'Свіжообсмажена кава' },
    { categoryId: catEquipmentId, language: 'en', title: 'Brewing Equipment', description: 'Tools for coffee brewing' },
    {
      categoryId: catEquipmentId,
      language: 'ua',
      title: 'Обладнання',
      description: 'Інструменти для приготування кави',
    },
    {
      categoryId: catTeaId,
      language: 'en',
      title: 'Leaf Tea',
      description:
        'Natural black, green, herbal and fruit teas of the German TM SOHO. Made without the addition of dyes, artificial flavors, preservatives',
    },
    {
      categoryId: catTeaId,
      language: 'ua',
      title: 'Листяний чай',
      description:
        "Натуральні чорні, зелені, трав'яні та фруктові чаї німецької торгівельної марки SOHO. Виготовлені без додавання барвників, штучних ароматизаторів, консервантів",
    },
  ]);

  // ── 3. Attributes (→ category) ──
  await db.insert(attribute).values([
    { id: attrWeightId, categoryId: catCoffeeId, slug: 'weight', sortOrder: 0 },
    { id: attrRoastId, categoryId: catCoffeeId, slug: 'roast-level', sortOrder: 1 },
    { id: attrOriginId, categoryId: catCoffeeId, slug: 'origin', sortOrder: 2 },
    { id: attrProcessingTypeId, categoryId: catCoffeeId, slug: 'processing-type', sortOrder: 3 },
    { id: attrScoreId, categoryId: catCoffeeId, slug: 'score', sortOrder: 4 },
    { id: attrMaterialId, categoryId: catEquipmentId, slug: 'material', sortOrder: 0 },
  ]);

  // ── 4. Attribute Translations (→ attribute) ──
  await db.insert(attributeTranslation).values([
    { attributeId: attrWeightId, language: 'en', name: 'Weight' },
    { attributeId: attrWeightId, language: 'ua', name: 'Вага' },
    { attributeId: attrRoastId, language: 'en', name: 'Roast Level' },
    { attributeId: attrRoastId, language: 'ua', name: 'Ступінь обсмаження' },
    { attributeId: attrMaterialId, language: 'en', name: 'Material' },
    { attributeId: attrMaterialId, language: 'ua', name: 'Матеріал' },
    { attributeId: attrOriginId, language: 'en', name: 'Origin' },
    { attributeId: attrOriginId, language: 'ua', name: 'Походження' },
    { attributeId: attrProcessingTypeId, language: 'en', name: 'Processing Type' },
    { attributeId: attrProcessingTypeId, language: 'ua', name: 'Тип обробки' },
    { attributeId: attrScoreId, language: 'en', name: 'Score' },
    { attributeId: attrScoreId, language: 'ua', name: 'Оцінка' },
  ]);

  // ── 5. Items (→ category) ──
  await db.insert(item).values([
    {
      id: itemHondurasId,
      slug: 'honduras-copan',
      brand: 'CoffeeDoor',
      isAvailable: true,
      sortOrder: 0,
      categoryId: catCoffeeId,
    },
    {
      id: itemEthiopiaId,
      slug: 'ethiopia-yirgacheffe',
      brand: 'CoffeeDoor',
      isAvailable: true,
      sortOrder: 1,
      categoryId: catCoffeeId,
    },
    {
      id: itemColombiaId,
      slug: 'colombia-supremo',
      brand: 'CoffeeDoor',
      isAvailable: true,
      sortOrder: 2,
      categoryId: catCoffeeId,
    },
    { id: itemV60Id, slug: 'hario-v60', brand: 'Hario', isAvailable: true, sortOrder: 0, categoryId: catEquipmentId },
  ]);

  // ── 6. Item Translations (→ item) ──
  await db.insert(itemTranslation).values([
    {
      itemId: itemEthiopiaId,
      language: 'en',
      title: 'Ethiopia Yirgacheffe',
      description: 'Fruity and floral',
      detailedDescription: 'Single origin from Yirgacheffe region with notes of blueberry and jasmine.',
    },
    {
      itemId: itemEthiopiaId,
      language: 'ua',
      title: 'Ефіопія Їргачеффе',
      description: 'Фруктовий та квітковий',
      detailedDescription: 'Моносорт з регіону Їргачеффе з нотами чорниці та жасмину.',
    },
    { itemId: itemColombiaId, language: 'en', title: 'Colombia Supremo', description: 'Rich and balanced' },
    { itemId: itemColombiaId, language: 'ua', title: 'Колумбія Супремо', description: 'Насичений та збалансований' },
    { itemId: itemHondurasId, language: 'en', title: 'Honduras Copan', description: 'Chocolatey and nutty' },
    { itemId: itemHondurasId, language: 'ua', title: 'Гондурас Копан', description: 'Шоколадний та горіховий' },
    { itemId: itemV60Id, language: 'en', title: 'Hario V60 Dripper', description: 'Pour-over coffee dripper' },
    { itemId: itemV60Id, language: 'ua', title: 'Hario V60 Дріпер', description: 'Дріпер для кави' },
  ]);

  // ── 7. Images (→ item) ──
  await db.insert(image).values([
    { url: '/images/ethiopia-1.jpg', alt: 'Ethiopia Yirgacheffe beans', sortOrder: 0, itemId: itemEthiopiaId },
    { url: '/images/ethiopia-2.jpg', alt: 'Ethiopia packaging', sortOrder: 1, itemId: itemEthiopiaId },
    { url: '/images/colombia-1.jpg', alt: 'Colombia Supremo beans', sortOrder: 0, itemId: itemColombiaId },
    { url: '/images/honduras-1.jpg', alt: 'Honduras Copan beans', sortOrder: 0, itemId: itemHondurasId },
    { url: '/images/honduras-2.jpg', alt: 'Honduras packaging', sortOrder: 1, itemId: itemHondurasId },
    { url: '/images/v60.jpg', alt: 'Hario V60', sortOrder: 0, itemId: itemV60Id },
  ]);

  // ── 8. Item Attributes (→ item + attribute) ──
  await db.insert(itemAttribute).values([
    { id: iaEthiopiaWeightId, itemId: itemEthiopiaId, attributeId: attrWeightId },
    { id: iaEthiopiaRoastId, itemId: itemEthiopiaId, attributeId: attrRoastId },
    { id: iaColombiaWeightIdLarge, itemId: itemColombiaId, attributeId: attrWeightId },
    { id: iaColombiaWeightIdMedium, itemId: itemColombiaId, attributeId: attrWeightId },
    { id: iaColombiaWeightIdSmall, itemId: itemColombiaId, attributeId: attrWeightId },
    { id: iaV60MaterialId, itemId: itemV60Id, attributeId: attrMaterialId },
  ]);

  // ── 9. Item Attribute Translations (→ itemAttribute) ──
  await db.insert(itemAttributeTranslation).values([
    { itemAttributeId: iaEthiopiaWeightId, language: 'en', value: '250g' },
    { itemAttributeId: iaEthiopiaWeightId, language: 'ua', value: '250г' },
    { itemAttributeId: iaEthiopiaRoastId, language: 'en', value: 'Medium' },
    { itemAttributeId: iaEthiopiaRoastId, language: 'ua', value: 'Середній' },
    { itemAttributeId: iaColombiaWeightIdLarge, language: 'en', value: '1kg' },
    { itemAttributeId: iaColombiaWeightIdLarge, language: 'ua', value: '1кг' },
    { itemAttributeId: iaColombiaWeightIdMedium, language: 'en', value: '500g' },
    { itemAttributeId: iaColombiaWeightIdMedium, language: 'ua', value: '500г' },
    { itemAttributeId: iaColombiaWeightIdSmall, language: 'en', value: '250g' },
    { itemAttributeId: iaColombiaWeightIdSmall, language: 'ua', value: '250г' },
    { itemAttributeId: iaV60MaterialId, language: 'en', value: 'Ceramic' },
    { itemAttributeId: iaV60MaterialId, language: 'ua', value: 'Кераміка' },
  ]);

  // ── 10. Item Prices (→ item + itemAttribute?) ──
  await db.insert(itemPrice).values([
    {
      itemId: itemEthiopiaId,
      itemAttributeId: iaEthiopiaWeightId,
      priceType: 'regular',
      value: '350.00',
      currency: 'UAH',
    },
    {
      itemId: itemEthiopiaId,
      itemAttributeId: iaEthiopiaWeightId,
      priceType: 'discount',
      value: '299.00',
      currency: 'UAH',
    },
    {
      itemId: itemColombiaId,
      itemAttributeId: iaColombiaWeightIdLarge,
      priceType: 'regular',
      value: '1420.00',
      currency: 'UAH',
    },
    {
      itemId: itemColombiaId,
      itemAttributeId: iaColombiaWeightIdLarge,
      priceType: 'discount',
      value: '1380.00',
      currency: 'UAH',
    },
    {
      itemId: itemColombiaId,
      itemAttributeId: iaColombiaWeightIdMedium,
      priceType: 'regular',
      value: '420.00',
      currency: 'UAH',
    },
    {
      itemId: itemColombiaId,
      itemAttributeId: iaColombiaWeightIdMedium,
      priceType: 'discount',
      value: '400.00',
      currency: 'UAH',
    },
    {
      itemId: itemColombiaId,
      itemAttributeId: iaColombiaWeightIdSmall,
      priceType: 'regular',
      value: '220.00',
      currency: 'UAH',
    },
    {
      itemId: itemColombiaId,
      itemAttributeId: iaColombiaWeightIdSmall,
      priceType: 'discount',
      value: '200.00',
      currency: 'UAH',
    },
    {
      itemId: itemHondurasId,
      priceType: 'regular',
      value: '400.00',
      currency: 'UAH',
    },
    {
      itemId: itemHondurasId,
      priceType: 'discount',
      value: '350.00',
      currency: 'UAH',
    },
    { itemId: itemV60Id, itemAttributeId: null, priceType: 'regular', value: '1200.00', currency: 'UAH' },
  ]);

  console.log('>>>> ✅ Seed complete! Check the database for seeded data. <<<<');
  await pool.end();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
