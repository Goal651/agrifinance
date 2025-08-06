import { View, Text, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { adminService } from '@/api/admin';
import { User } from '@/types';

export default function UserList() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadUsers = async () => {
    try {
      setError(null);
      const response = await adminService.getUsers();
      if (response.success) {
        setUsers(response.data);
      } else {
        setError(response.message || 'Failed to load users');
      }
    } catch (err) {
      setError('An error occurred while loading users');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadUsers();
  };

  const renderUserItem = ({ item }: { item: User }) => (
    <TouchableOpacity 
      className="bg-white p-4 border-b border-gray-100"
      onPress={() => router.push(`/admin/users/${item.id}`)}
    >
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="font-medium text-gray-900">
            {item.firstName} {item.lastName}
          </Text>
          <Text className="text-gray-500 text-sm mt-1">{item.email}</Text>
        </View>
        <View className="flex-row items-center">
          <View 
            className={`px-2 py-1 rounded-full ${
              item.status === 'ACTIVE'
                ? 'bg-green-100' 
                : item.status === 'SUSPENDED' 
                ? 'bg-yellow-100' 
                : 'bg-gray-100'
            }`}
          >
            <Text 
              className={`text-xs font-medium ${
                item.status === 'ACTIVE' 
                  ? 'text-green-800' 
                  : item.status === 'SUSPENDED' 
                  ? 'text-yellow-800' 
                  : 'text-gray-800'
              }`}
            >
              {item.status?.toUpperCase()}
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
        </View>
      </View>
      <View className="mt-2 flex-row items-center">
        <Text className="text-sm text-gray-500">
          Role: <Text className="text-gray-700">{item.role}</Text>
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <MaterialIcons name="error-outline" size={48} color="#EF4444" />
        <Text className="text-red-500 text-lg mt-4 text-center">{error}</Text>
        <TouchableOpacity 
          className="mt-4 bg-blue-500 px-4 py-2 rounded-lg"
          onPress={loadUsers}
        >
          <Text className="text-white font-medium">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <Text className="text-lg font-semibold">Users</Text>
      </View>
      
      <FlatList
        data={users}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center p-8">
            <MaterialIcons name="people-outline" size={48} color="#9CA3AF" />
            <Text className="text-gray-500 mt-4 text-center">
              No users found. Add a new user to get started.
            </Text>
          </View>
        }
      />
      
      <TouchableOpacity 
        className="absolute bottom-6 right-6 bg-blue-500 w-14 h-14 rounded-full justify-center items-center shadow-lg"
        onPress={() => router.push('/admin/users/new')}
      >
        <MaterialIcons name="add" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}
