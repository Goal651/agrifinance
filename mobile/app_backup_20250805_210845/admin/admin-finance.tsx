import { View, Text, StyleSheet } from 'react-native';

export default function AdminFinance() {
  return (
    <View style={styles.container}>
      <Text>Admin Finance</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
