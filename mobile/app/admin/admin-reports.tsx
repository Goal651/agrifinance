import { View, Text, StyleSheet } from 'react-native';

export default function AdminReports() {
  return (
    <View style={styles.container}>
      <Text>Admin Reports</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
