import { View, Text, StyleSheet } from 'react-native';

export default function AdminPrivacy() {
  return (
    <View style={styles.container}>
      <Text>Admin Privacy</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
