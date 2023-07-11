import { Router } from '../pages/router';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { resources } from '@translate-voice/i18n';

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

const App = () => {
  return (
    <div className="h-full">
      <Router />
    </div>
  );
};

export default App;
