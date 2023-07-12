import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.whiteof.translatevoice',
  appName: 'translate-voice',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
