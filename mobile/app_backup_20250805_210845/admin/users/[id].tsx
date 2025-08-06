import { adminService } from '@/api/admin';
import { User } from '@/types';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function UserDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [suspending, setSuspending] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadUser = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const res = await adminService.getUserById(id);
      if (res.success) {
        setUser(res.data);
      } else {
        setError(res.message || 'Failed to load user');
      }
    } catch (err) {
      setError('An error occurred while loading user data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      loadUser();
    }
  }, [id, loadUser]);

  const handleSuspendUser = async () => {
    if (!id || !user) return;

    const action = user.status === 'SUSPENDED' ? 'reactivate' : 'suspend';

    Alert.alert(
      `${action === 'suspend' ? 'Suspend' : 'Reactivate'} User`,
      `Are you sure you want to ${action} this user?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: action === 'suspend' ? 'Suspend' : 'Reactivate',
          style: action === 'suspend' ? 'destructive' : 'default',
          onPress: async () => {
            setSuspending(true);
            try {
              // Implement suspend/reactivate API call
              // const response = await adminService.updateUser({
              //   id,
              //   status: action === 'suspend' ? 'SUSPENDED' : 'ACTIVE'
              // });
              // if (response.success) {
              //   loadUser();
              //   Alert.alert('Success', `User ${action}d successfully`);
              // }

              // For now, just update the local state
              setUser(prev => prev ? { ...prev, status: action === 'suspend' ? 'SUSPENDED' : 'ACTIVE' } : null);
              Alert.alert('Success', `User ${action}d successfully`);
            } catch (err) {
              Alert.alert('Error', `Failed to ${action} user`);
              console.error(err);
            } finally {
              setSuspending(false);
            }
          },
        },
      ]
    );
  };

  const handleDeleteUser = () => {
    if (!id) return;

    Alert.alert(
      'Delete User',
      'Are you sure you want to delete this user? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            try {
              // Implement delete API call
              // const response = await adminService.deleteUser(id);
              // if (response.success) {
              //   Alert.alert('Success', 'User deleted successfully');
              //   router.back();
              // }

              // For now, just navigate back
              Alert.alert('Success', 'User deleted successfully');
              router.back();
            } catch (err) {
              Alert.alert('Error', 'Failed to delete user');
              console.error(err);
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };


  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (error || !user) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <MaterialIcons name="error-outline" size={48} color="#EF4444" />
        <Text className="text-red-500 text-lg mt-4 text-center">
          {error || 'User not found'}
        </Text>
        <TouchableOpacity
          className="mt-4 bg-blue-500 px-4 py-2 rounded-lg"
          onPress={loadUser}
        >
          <Text className="text-white font-medium">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header with user info */}
        <View className="bg-white p-6 items-center border-b border-gray-200">
          <View className="w-24 h-24 bg-blue-100 rounded-full items-center justify-center mb-3">
            <Text className="text-3xl font-bold text-blue-600">
              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
            </Text>
          </View>

          <Text className="text-2xl font-bold text-gray-900">
            {user.firstName} {user.lastName}
          </Text>

          <View className="flex-row items-center mt-1">
            <View
              className={`px-2 py-1 rounded-full ${
                user.status === 'ACTIVE'
                  ? 'bg-green-100 dark:bg-green-900/30'
                  : user.status === 'SUSPENDED'
                  ? 'bg-yellow-100 dark:bg-yellow-900/30'
                  : 'bg-gray-100 dark:bg-gray-800'}`}
            >
              <Text
                className={`text-xs font-medium ${
                  user.status === 'ACTIVE'
                    ? 'text-green-800 dark:text-green-400'
                    : user.status === 'SUSPENDED'
                    ? 'text-yellow-800 dark:text-yellow-400'
                    : 'text-gray-800 dark:text-gray-400'}`}
              >
                {user.status?.toUpperCase()}
              </Text>
            </View>

            <Text className="text-gray-500 text-sm ml-2">
              {user.role}
            </Text>
          </View>
        </View>

        {/* User details */}
        <View className="bg-white p-6 mb-4">
          <Text className="text-lg font-semibold mb-4">Contact Information</Text>

          <View className="mb-4">
            <Text className="text-sm text-gray-500">Email</Text>
            <Text className="text-base text-gray-900">{user.email}</Text>
          </View>

          

          <View>
            <Text className="text-sm text-gray-500">Member Since</Text>
            <Text className="text-base text-gray-900">
              {new Date(user.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View className="bg-white p-6 mb-4">
          <Text className="text-lg font-semibold mb-4">Actions</Text>

          <TouchableOpacity className="flex-row items-center py-3 border-b border-gray-100" >
            <MaterialIcons name="edit" size={20} color="#4B5563" />
            <Text className="text-gray-700 ml-3">Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center py-3 border-b border-gray-100" >
            <MaterialIcons name="lock-reset" size={20} color="#4B5563" />
            <Text className="text-gray-700 ml-3">Reset Password</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center py-3 border-b border-gray-100"
            onPress={handleSuspendUser}
            disabled={suspending}
          >
            {suspending ? (
              <ActivityIndicator size="small" color="#9CA3AF" />
            ) : (
              <MaterialIcons
                name={user.status === 'SUSPENDED' ? 'play-arrow' : 'pause'}
                size={20}
                color={user.status === 'SUSPENDED' ? '#10B981' : '#F59E0B'}
                style={{
                  marginRight: 8,
                  color: user.status === 'SUSPENDED' ? '#10B981' : '#F59E0B'
                }}
              />
            )}
            <Text className="ml-3" style={{
              color: user.status === 'SUSPENDED' ? '#10B981' : '#F59E0B'
            }}>
              {user.status === 'SUSPENDED' ? 'Reactivate User' : 'Suspend User'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center py-3"
            onPress={handleDeleteUser}
            disabled={deleting}
          >
            {deleting ? (
              <ActivityIndicator size="small" color="#9CA3AF" />
            ) : (
              <MaterialIcons name="delete-outline" size={20} color="#EF4444" />
            )}
            <Text className="text-red-500 ml-3">
              {deleting ? 'Deleting...' : 'Delete User'}
            </Text>
          </TouchableOpacity>
        </View>


        {/* User Activity / Stats */}
        <View className="bg-white p-6 mb-4">
          <Text className="text-lg font-semibold mb-4">Activity</Text>

          <View className="flex-row justify-between mb-4">
            <View className="items-center">
              <Text className="text-2xl font-bold text-gray-900">12</Text>
              <Text className="text-sm text-gray-500">Projects</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-gray-900">5</Text>
              <Text className="text-sm text-gray-500">Active Loans</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-gray-900">$24,500</Text>
              <Text className="text-sm text-gray-500">Total Borrowed</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View >
  );
}
