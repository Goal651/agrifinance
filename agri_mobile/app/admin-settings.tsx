import { View, Text, StyleSheet } from 'react-native';

export default function AdminSettings() {
  return (
    <View style={styles.container}>
      <Text>Admin Settings</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
