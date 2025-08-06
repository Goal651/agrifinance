import { View, Text, StyleSheet } from 'react-native';

export default function AdminAbout() {
  return (
    <View style={styles.container}>
      <Text>Admin About</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
