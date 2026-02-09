const languageEnum = ['en', 'ua', 'ru', 'de'] as const;
type LanguageEnum = (typeof languageEnum)[number];

export { languageEnum };
export type { LanguageEnum };
