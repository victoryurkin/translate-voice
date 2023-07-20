export { useTranslation } from 'react-i18next';
import i18n from 'i18next';

import en from './en/translations.json';

export const resources = {
  en: {
    translation: en,
  },
};

export const getDefaultLanguage = () => {
  return i18n.language;
};
