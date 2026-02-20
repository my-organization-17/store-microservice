const languageEnum = ['EN', 'UA', 'RU', 'DE', 'ES', 'FR'] as const;
type LanguageEnum = (typeof languageEnum)[number];

const DEFAULT_LANGUAGE = 'EN' as const satisfies LanguageEnum;

export { languageEnum, DEFAULT_LANGUAGE };
export type { LanguageEnum };
