import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.annoncestg.app',
  appName: 'Annonces TG',
  webDir: '.output/public',
  server: {
    androidScheme: 'https'
  }
};

export default config;
