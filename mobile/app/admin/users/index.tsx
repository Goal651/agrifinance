import { View } from 'react-native';
import UserList from './UserList';

export default function UsersScreen() {
  return (
    <View className="flex-1 bg-white">
      <UserList />
    </View>
  );
}
