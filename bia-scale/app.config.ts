import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'bia-scale',
  slug: 'bia-scale',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'biascale',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  splash: {
    image: './assets/images/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.biascale.app',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    package: 'com.biascale.app',
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-updates',
      {
        username: 'biascale',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  updates: {
    url: 'https://u.expo.dev/bia-scale',
    enabled: true,
    checkAutomatically: 'ON_LOAD',
    fallbackToCacheTimeout: 0,
  },
  runtimeVersion: {
    policy: 'fingerprint',
  },
  extra: {
    eas: {
      projectId: 'bia-scale',
    },
  },
});
