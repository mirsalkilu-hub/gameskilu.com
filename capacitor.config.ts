import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.gameskilu.portal',
  appName: 'Gameskilu',
  webDir: 'www',
  server: {
    url: 'https://gameskilu.com',
    cleartext: false,
    allowNavigation: ['gameskilu.com', 'www.gameskilu.com'],
  },
};

export default config;