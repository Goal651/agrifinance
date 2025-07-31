import { View, Text, StyleSheet } from 'react-native';

export default function AdminSupport() {
  return (
    <View style={styles.container}>
      <Text>Admin Support</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
