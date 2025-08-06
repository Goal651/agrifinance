import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useWorkers } from '@/contexts/WorkerContext';
import WorkerForm from '../WorkerForm';

export default function EditWorkerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { workers } = useWorkers();
  const router = useRouter();
  
  const worker = workers.find(w => w.id === id);

  const handleSuccess = () => {
    // Navigate back to worker detail after successful update
    router.replace(`/workers/${id}`);
  };

  if (!worker) {
    return null; // Or a loading spinner
  }

  return (
    <View style={styles.container}>
      <WorkerForm 
        initialData={worker} 
        onSuccess={handleSuccess}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
