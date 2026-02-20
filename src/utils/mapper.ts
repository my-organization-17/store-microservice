import { Currency, PriceType } from 'src/database/enums';
import type { LanguageEnum } from 'src/database/enums/language.enum';

// Mapping functions to convert between gRPC language enums and internal LanguageEnum
export function mapLanguageFromProto(language: number): LanguageEnum {
  switch (language) {
    case 1:
      return 'EN';
    case 2:
      return 'UA';
    case 3:
      return 'RU';
    case 4:
      return 'DE';
    case 5:
      return 'ES';
    case 6:
      return 'FR';
    default:
      return 'EN';
  }
}

// Mapping function to convert internal LanguageEnum to gRPC language enums
export function mapLanguageToProto(language: LanguageEnum): number {
  switch (language) {
    case 'EN':
      return 1;
    case 'UA':
      return 2;
    case 'RU':
      return 3;
    case 'DE':
      return 4;
    case 'ES':
      return 5;
    case 'FR':
      return 6;
    default:
      return 1;
  }
}

// Proto PriceType integer → DB PriceType string
// PRICE_TYPE_REGULAR = 1, PRICE_TYPE_DISCOUNT = 2, PRICE_TYPE_WHOLESALE = 3
export function mapPriceType(priceType: number): PriceType {
  switch (priceType) {
    case 1:
      return 'regular';
    case 2:
      return 'discount';
    case 3:
      return 'wholesale';
    default:
      throw new Error(`Unsupported price type: ${priceType}`);
  }
}

// Proto Currency integer → DB Currency string
// CURRENCY_USD = 1, CURRENCY_EUR = 2, CURRENCY_GBP = 3, CURRENCY_UAH = 4
export function mapCurrency(currency: number): Currency {
  switch (currency) {
    case 1:
      return 'USD';
    case 2:
      return 'EUR';
    case 3:
      return 'GBP';
    case 4:
      return 'UAH';
    default:
      throw new Error(`Unsupported currency: ${currency}`);
  }
}
