import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locale/en.json';
import vi from './locale/vi.json';

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    fallbackLng: 'vi',
    lng: 'vi',
    resources: {
      en: { translation: en },
      vi: { translation: vi },
    },
    interpolation: {
      escapeValue: false,
    },
  });
}

export default i18n;
