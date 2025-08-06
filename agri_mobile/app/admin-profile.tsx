import { View, Text, StyleSheet } from 'react-native';

export default function AdminProfile() {
  return (
    <View style={styles.container}>
      <Text>Admin Profile</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
