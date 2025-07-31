import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import '../global.css';
import { AuthProvider } from '../contexts/AuthContext';

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <AuthProvider >
      <Stack screenOptions={{ headerShown: false }}>

        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="admin-dashboard"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="admin-loans"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="admin-project"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="admin-users"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="admin-settings"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="admin-finance"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="admin-reports"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="admin-notifications"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="admin-profile"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="admin-support"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="admin-logout"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="admin-help"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="admin-terms"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="admin-privacy"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="admin-about"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </AuthProvider>
  );
}
