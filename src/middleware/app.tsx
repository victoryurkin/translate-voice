import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import Auth from './auth';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { resources } from '@translate-voice/i18n';
import { AuthProvider } from '@translate-voice/context';
import { registerPlugin } from '@capacitor/core';

import { initializeApp } from 'firebase/app';
import { getAuth, indexedDBLocalPersistence, initializeAuth } from 'firebase/auth';
import { firebaseConfig } from '../firebase-exports.ts';

const app = initializeApp(firebaseConfig);

const auth = Capacitor.isNativePlatform()
  ? initializeAuth(app, { persistence: indexedDBLocalPersistence })
  : getAuth(app);

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
      if (Capacitor.getPlatform() === 'ios') {
        await PermissionsIos.grantPermission({
          type: 'microphone',
        });
      }
    };
    checkPermissions();
  }, []);
  return (
    <AuthProvider auth={auth}>
      <Auth />
    </AuthProvider>
  );
};

export default App;
