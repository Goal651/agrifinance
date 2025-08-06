import { View, Text, StyleSheet } from 'react-native';

export default function AdminNotifications() {
  return (
    <View style={styles.container}>
      <Text>Admin Notifications</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
