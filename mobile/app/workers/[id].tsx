import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useWorkers } from '@/contexts/WorkerContext';
import { LinearGradient } from 'expo-linear-gradient';

export default function WorkerDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { workers, deleteWorker, loading } = useWorkers();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const worker = workers.find(w => w.id === id);

  useEffect(() => {
    if (!worker && !loading) {
      // If worker not found and not loading, go back
      router.back();
    }
  }, [worker, loading]);

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      setIsDeleting(true);
      const response = await deleteWorker(id);
      if (response.success) {
        router.replace('/workers');
      } else {
        Alert.alert('Error', response.message || 'Failed to delete worker');
      }
    } catch (error) {
      console.error('Error deleting worker:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      'Delete Worker',
      `Are you sure you want to delete ${worker?.name}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: handleDelete },
      ]
    );
  };

  if (!worker) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#f0fdf4', '#e0f2fe']}
        style={StyleSheet.absoluteFill}
      />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {worker.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </Text>
          </View>
          <Text style={styles.name}>{worker.name}</Text>
          <Text style={styles.email}>{worker.email}</Text>
          <Text style={styles.phone}>{worker.phoneNumber}</Text>
          
          <View style={styles.statusContainer}>
            <View 
              style={[
                styles.statusBadge, 
                worker.active ? styles.activeBadge : styles.inactiveBadge
              ]}
            >
              <Text style={[
                styles.statusText,
                worker.active ? styles.activeText : styles.inactiveText
              ]}>
                {worker.active ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.skillsContainer}>
            {worker.skills.length > 0 ? (
              worker.skills.map((skill, index) => (
                <View key={index} style={styles.skillTag}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noSkillsText}>No skills added</Text>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          <View style={styles.detailRow}>
            <MaterialIcons name="event" size={20} color="#6b7280" />
            <Text style={styles.detailText}>
              Joined on {new Date(worker.createdAt).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialIcons name="update" size={20} color="#6b7280" />
            <Text style={styles.detailText}>
              Last updated {new Date(worker.updatedAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.footerButton, styles.editButton]}
          onPress={() => router.push(`/workers/edit/${worker.id}`)}
          disabled={isDeleting}
        >
          <MaterialIcons name="edit" size={20} color="white" />
          <Text style={styles.footerButtonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.footerButton, styles.deleteButton]}
          onPress={confirmDelete}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <>
              <MaterialIcons name="delete" size={20} color="white" />
              <Text style={styles.footerButtonText}>Delete</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    paddingBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 36,
    fontFamily: 'Poppins_600SemiBold',
    color: 'white',
  },
  name: {
    fontSize: 24,
    fontFamily: 'Poppins_600SemiBold',
    color: '#14532d',
    marginBottom: 4,
    textAlign: 'center',
  },
  email: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: '#4b5563',
    marginBottom: 4,
  },
  phone: {
    fontSize: 16,
    fontFamily: 'Poppins_500Medium',
    color: '#1f2937',
    marginBottom: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#dcfce7',
  },
  activeBadge: {
    backgroundColor: '#dcfce7',
  },
  inactiveBadge: {
    backgroundColor: '#f3f4f6',
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
  },
  activeText: {
    color: '#15803d',
  },
  inactiveText: {
    color: '#6b7280',
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)', 
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
    color: '#14532d',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  skillTag: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  skillText: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    color: '#15803d',
  },
  noSkillsText: {
    fontStyle: 'italic',
    color: '#9ca3af',
    fontFamily: 'Poppins_400Regular',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 15,
    fontFamily: 'Poppins_400Regular',
    color: '#4b5563',
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 8,
  },
  editButton: {
    backgroundColor: '#3b82f6',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
  },
  footerButtonText: {
    color: 'white',
    fontFamily: 'Poppins_600SemiBold',
    marginLeft: 8,
  },
});
