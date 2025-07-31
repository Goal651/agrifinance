import { View, Text, StyleSheet } from 'react-native';

export default function AdminHelp() {
  return (
    <View style={styles.container}>
      <Text>Admin Help</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
