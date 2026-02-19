const priceTypeEnum = ['regular', 'discount', 'wholesale'] as const;

export type PriceType = (typeof priceTypeEnum)[number];

export { priceTypeEnum };
