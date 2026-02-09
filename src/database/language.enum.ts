const languageEnum = ['en', 'ua', 'ru', 'de', 'es', 'fr'] as const;
type LanguageEnum = (typeof languageEnum)[number];

export { languageEnum };
export type { LanguageEnum };
