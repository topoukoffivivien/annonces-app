import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.annoncestg.app',
  appName: 'Annonces TG',
  webDir: '.output/public',
  server: {
    url: 'https://ton-domaine-de-production.com',
    cleartext: false
  }
};

export default config;
