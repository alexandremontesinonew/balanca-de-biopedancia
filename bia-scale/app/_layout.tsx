import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as Updates from 'expo-updates';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { initDatabase } from '@/src/lib/database';

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

async function checkForOTAUpdate() {
  try {
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    }
  } catch {
    // OTA check failed silently (dev mode or no network)
  }
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      checkForOTAUpdate();
      // Inicializa DB e seed data
      initDatabase().catch(console.error);
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      <Stack.Screen name="details" options={{ headerShown: false }} />
      <Stack.Screen name="history" options={{ headerShown: false }} />
      <Stack.Screen name="water" options={{ headerShown: false }} />
      <Stack.Screen name="ble-scan" options={{ headerShown: false }} />
      <Stack.Screen name="device" options={{ headerShown: false }} />
      <Stack.Screen name="device-info" options={{ headerShown: false }} />
      <Stack.Screen name="family" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
    </Stack>
  );
}
