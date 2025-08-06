import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import WorkerForm from './WorkerForm';
import { LinearGradient } from 'expo-linear-gradient';

export default function NewWorkerScreen() {
  const router = useRouter();

  const handleSuccess = () => {
    // Navigate back to worker list after successful creation
    router.replace('/workers');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#f0fdf4', '#e0f2fe']}
        style={StyleSheet.absoluteFill}
      />
      <WorkerForm onSuccess={handleSuccess} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
