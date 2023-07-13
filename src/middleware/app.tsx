import { useEffect } from 'react';
import Auth from './auth';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { resources } from '@translate-voice/i18n';
import { AuthProvider } from '@translate-voice/context';
import { registerPlugin } from '@capacitor/core';

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

// iOS Capacitor Plugin - Request permissions
export interface PermissionsIosPlugin {
  grantPermission(options: { type: string }): Promise<{ response: string }>;
}
const PermissionsIos = registerPlugin<PermissionsIosPlugin>('PermissionsIos');

const App = () => {
  useEffect(() => {
    const checkPermissions = async () => {
      await PermissionsIos.grantPermission({
        type: 'microphone',
      });
    };
    checkPermissions();
  }, []);
  return (
    <AuthProvider>
      <Auth />
    </AuthProvider>
  );
};

export default App;
