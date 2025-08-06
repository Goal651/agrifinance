import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import '../global.css';
import { AuthProvider } from '../contexts/AuthContext';
import Toast from 'react-native-toast-message';
import { LoanProvider } from '@/contexts/LoanContext';
import { ProjectProvider } from '@/contexts/ProjectContext';
import { WorkerProvider } from '@/contexts/WorkerContext';
import GlobalNavigation from '@/components/GlobalNavigation';
import { View, StyleSheet } from 'react-native';

function RootLayoutNav() {
  return (
    <View style={styles.container}>
      
      {/* Main Content */}
      <View style={styles.content}>
        <Stack screenOptions={{ 
          headerShown: false,
          contentStyle: { 
            backgroundColor: 'transparent',
          } 
        }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="admin" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </View>
      
      {/* Navigation */}
      <View style={styles.navContainer}>
        <GlobalNavigation />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  content: {
    flex: 1,
    paddingBottom: 70, // Space for navigation
  },
  navContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(10px)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.8)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
});

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Poppins: require('../assets/fonts/Poppins-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <LoanProvider>
          <ProjectProvider>
            <WorkerProvider>
              <RootLayoutNav />
              <StatusBar style="auto" />
              <Toast />
            </WorkerProvider>
          </ProjectProvider>
        </LoanProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
