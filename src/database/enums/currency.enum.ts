const currencyEnum = ['USD', 'EUR', 'GBP', 'UAH'] as const;

export type Currency = (typeof currencyEnum)[number];

export { currencyEnum };
