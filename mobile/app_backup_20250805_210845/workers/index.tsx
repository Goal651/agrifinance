import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useWorkers } from '@/contexts/WorkerContext';
import { Worker } from '@/types/worker';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const WorkerList = () => {
  const { workers, loading, error, deleteWorker } = useWorkers();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      const response = await deleteWorker(id);
      if (!response.success) {
        Alert.alert('Error', response.message || 'Failed to delete worker');
      }
    } catch (err) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setDeletingId(null);
    }
  };

  const confirmDelete = (worker: Worker) => {
    Alert.alert(
      'Delete Worker',
      `Are you sure you want to delete ${worker.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => handleDelete(worker.id) },
      ]
    );
  };

  const renderWorker = ({ item }: { item: Worker }) => (
    <View style={styles.workerCard}>
      <View style={styles.workerInfo}>
        <Text style={styles.workerName}>{item.name}</Text>
        <Text style={styles.workerEmail}>{item.email}</Text>
        <View style={styles.skillsContainer}>
          {item.skills.map((skill, index) => (
            <View key={index} style={styles.skillTag}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity 
          onPress={() => router.push(`/workers/edit/${item.id}`)}
          style={styles.actionButton}
        >
          <MaterialIcons name="edit" size={20} color="#3b82f6" />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => confirmDelete(item)}
          style={styles.actionButton}
          disabled={deletingId === item.id}
        >
          {deletingId === item.id ? (
            <ActivityIndicator size="small" color="#ef4444" />
          ) : (
            <MaterialIcons name="delete" size={20} color="#ef4444" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading && workers.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          onPress={() => router.replace('/workers')}
          style={styles.retryButton}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#f0fdf4', '#e0f2fe']}
        style={StyleSheet.absoluteFill}
      />
      
      <FlatList
        data={workers}
        renderItem={renderWorker}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No workers found</Text>
            <TouchableOpacity 
              onPress={() => router.push('/workers/new')}
              style={styles.addButton}
            >
              <Text style={styles.addButtonText}>Add Your First Worker</Text>
            </TouchableOpacity>
          </View>
        }
      />

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => router.push('/workers/new')}
      >
        <MaterialIcons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular',
  },
  retryButton: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontFamily: 'Poppins_500Medium',
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  workerCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  workerInfo: {
    flex: 1,
  },
  workerName: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#14532d',
    marginBottom: 4,
  },
  workerEmail: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#4b5563',
    marginBottom: 8,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  skillTag: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 6,
  },
  skillText: {
    fontSize: 12,
    fontFamily: 'Poppins_500Medium',
    color: '#15803d',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    color: '#6b7280',
    marginBottom: 16,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default WorkerList;
