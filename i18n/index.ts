import { en } from '@/i18n/en';
import { fr } from '@/i18n/fr';
import { useAppContext } from '@/context/AppContext';

const dictionaries = {
  fr,
  en,
} as const;

type Dictionaries = typeof dictionaries;
export type SupportedLanguage = keyof Dictionaries;

type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string)]: ObjectType[Key] extends object
    ? `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : Key;
}[keyof ObjectType & string];

export type TranslationKey = NestedKeyOf<(typeof dictionaries)['fr']>;

function getDictionary(lang: SupportedLanguage) {
  return dictionaries[lang] ?? dictionaries.fr;
}

export function translate(lang: SupportedLanguage, key: TranslationKey): string {
  const dict = getDictionary(lang);
  const segments = key.split('.');

  let current: any = dict;
  for (const segment of segments) {
    if (current && typeof current === 'object' && segment in current) {
      current = current[segment];
    } else {
      return key;
    }
  }

  if (typeof current === 'string') {
    return current;
  }

  return key;
}

export function useTranslation() {
  const { language } = useAppContext();

  return {
    t: (key: TranslationKey) => translate(language, key),
    language,
  };
}

