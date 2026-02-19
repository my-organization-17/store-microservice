const languageEnum = ['en', 'ua', 'ru', 'de', 'es', 'fr'] as const;
type LanguageEnum = (typeof languageEnum)[number];

const DEFAULT_LANGUAGE = 'en' as const satisfies LanguageEnum;

export { languageEnum, DEFAULT_LANGUAGE };
export type { LanguageEnum };
