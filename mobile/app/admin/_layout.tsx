import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Platform, View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Header = ({ title }: { title: string }) => {
  const router = useRouter();
  
  return (
    <View className="bg-white border-b border-gray-200">
      <View className="flex-row items-center justify-between p-4">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <MaterialIcons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900">{title}</Text>
        </View>
      </View>
    </View>
  );
};

export default function AdminLayout() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <StatusBar style={Platform.OS === 'ios' ? 'dark' : 'auto'} />
      <Stack
        screenOptions={{
          header: ({ options }) => (
            <Header title={options.title || 'Admin Dashboard'} />
          ),
          contentStyle: { backgroundColor: '#F9FAFB' },
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{
            title: 'Admin Dashboard',
            headerShown: true,
          }}
        />
        <Stack.Screen 
          name="loan-approvals" 
          options={{
            title: 'Loan Approvals',
            headerShown: true,
          }}
        />
        <Stack.Screen 
          name="users" 
          options={{
            title: 'Users',
            headerShown: true,
          }}
        />
        <Stack.Screen 
          name="projects" 
          options={{
            title: 'Projects',
            headerShown: true,
          }}
        />
      </Stack>
    </SafeAreaView>
  );
}
