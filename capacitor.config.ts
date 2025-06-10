
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.0fb867c60b354acaa623764c4d9ad0d7',
  appName: 'reformer-flow-ai-planner',
  webDir: 'dist',
  server: {
    url: 'https://0fb867c6-0b35-4aca-a623-764c4d9ad0d7.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#8B9A7A',
      showSpinner: false,
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'small',
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: 'light',
      backgroundColor: '#8B9A7A'
    }
  }
};

export default config;
