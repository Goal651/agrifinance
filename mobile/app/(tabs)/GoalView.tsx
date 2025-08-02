import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Modal, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useProject } from '@/hooks/useProject';
import { MaterialIcons } from '@expo/vector-icons';
import { ProjectGoal, GoalTask, Project } from '@/types';

const statusColors = {
  NOT_STARTED: 'bg-orange-500',
  IN_PROGRESS: 'bg-blue-500',
  COMPLETED: 'bg-emerald-500',
};

const statusLabels = {
  NOT_STARTED: 'Not Started',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
};

const CreateTaskModal = ({ visible, onClose, goalId, onCreate }: {
  visible: boolean;
  onClose: () => void;
  goalId: string;
  onCreate: (data: { name: string; description: string }) => void;
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Task name is required');
      return;
    }

    onCreate({ name, description });
    setName('');
    setDescription('');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-end bg-black/50"
      >
        <View className="bg-white rounded-t-3xl max-h-[90%]">
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <Text className="text-lg font-semibold text-gray-900">Create New Task</Text>
            <TouchableOpacity onPress={onClose} className="p-2">
              <MaterialIcons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <ScrollView className="p-4">
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Task Name *</Text>
              <TextInput
                className="bg-gray-50 border border-gray-300 rounded-lg p-3 text-gray-900"
                value={name}
                onChangeText={setName}
                placeholder="Enter task name"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Description</Text>
              <TextInput
                className="bg-gray-50 border border-gray-300 rounded-lg p-3 text-gray-900 min-h-[100px] text-align-top"
                value={description}
                onChangeText={setDescription}
                placeholder="Enter task description"
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={3}
              />
            </View>
          </ScrollView>

          <View className="flex-row justify-end p-4 border-t border-gray-200">
            <TouchableOpacity
              className="px-4 py-2.5 bg-gray-100 rounded-lg mr-3"
              onPress={onClose}
              disabled={isSubmitting}
            >
              <Text className="text-gray-700 font-medium">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`px-4 py-2.5 bg-blue-600 rounded-lg ${isSubmitting ? 'opacity-70' : ''}`}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-medium">Create Task</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default function GoalView() {
  const { goalId, projectId } = useLocalSearchParams();
  const router = useRouter();
  const { getProjectById, createTask } = useProject();
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isCreateTaskModalVisible, setIsCreateTaskModalVisible] = useState(false);
  const [goal, setGoal] = useState<ProjectGoal | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setCurrentProject(getProjectById(projectId as string))
    console.log(currentProject)
    if (currentProject && goalId) {
      const foundGoal = currentProject.goals.find(g => g.id === goalId);
      console.log(foundGoal)
      setGoal(foundGoal || null);
      setLoading(false);
    }
    setLoading(false)
  }, [goalId, projectId]);

  const handleCreateTask = async (taskData: { name: string; description: string }) => {
    if (!goal) return;

    setIsSubmitting(true);
    try {
      const newTask = {
        name: taskData.name,
        description: taskData.description,
        goal,
      }
      await createTask(newTask)
      setIsCreateTaskModalVisible(false);
      Alert.alert('Success', 'Task created successfully');
    } catch (error) {
      console.error('Error creating task:', error);
      Alert.alert('Error', 'Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (!goal) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text>Goal not found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <Stack.Screen
        options={{
          title: goal?.name || 'Goal',
          headerRight: () => (
            <TouchableOpacity
              className="w-9 h-9 bg-blue-600 rounded-full justify-center items-center mr-2"
              onPress={() => setIsCreateTaskModalVisible(true)}
            >
              <MaterialIcons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          )
        }}
      />

      <ScrollView className="flex-1 p-4">
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <View className="flex-row items-center mb-3">
            <View className={`w-3 h-3 rounded-full ${statusColors[goal.status] || 'bg-gray-400'} mr-2`} />
            <Text className="text-sm font-medium text-gray-700">
              {statusLabels[goal.status] || goal.status}
            </Text>
          </View>

          <Text className="text-gray-700 text-base leading-6">
            {goal.description || 'No description provided'}
          </Text>
        </View>

        <View className="bg-white rounded-xl p-4 shadow-sm">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-gray-900">Tasks</Text>
            <Text className="text-sm text-gray-500">
              {goal.tasks?.length || 0} {goal.tasks?.length === 1 ? 'task' : 'tasks'}
            </Text>
          </View>

          {goal.tasks?.length > 0 ? (
            <View className="space-y-3">
              {goal.tasks?.map((task: GoalTask, taskIndex: number) => (
                <View key={taskIndex} className="flex-row justify-between items-center py-3 border-b border-gray-100">
                  <View className="flex-1 mr-3">
                    <Text className="text-gray-900 font-medium mb-1">{task.name}</Text>
                    {task.description && (
                      <Text className="text-gray-500 text-sm">{task.description}</Text>
                    )}
                  </View>
                  <TouchableOpacity
                    className="p-1"
                    onPress={() => {
                      if (goal && goal.tasks) {
                        const updatedTasks = [...goal.tasks];
                        updatedTasks[taskIndex] = {
                          ...task,
                          status: task.status === 'COMPLETED' ? 'NOT_STARTED' : 'COMPLETED'
                        };
                        setGoal({
                          ...goal,
                          tasks: updatedTasks
                        });
                      }
                    }}
                  >
                    <MaterialIcons
                      name={task.status === 'COMPLETED' ? 'check-box' : 'check-box-outline-blank'}
                      size={24}
                      color={task.status === 'COMPLETED' ? '#10b981' : '#9ca3af'}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <View className="items-center py-8 px-4">
              <MaterialIcons name="assignment" size={48} color="#d1d5db" />
              <Text className="text-gray-500 font-medium mt-3">No tasks yet</Text>
              <Text className="text-gray-400 text-sm mb-4">Add your first task to get started</Text>
              <TouchableOpacity
                className="bg-blue-600 px-5 py-2.5 rounded-lg"
                onPress={() => setIsCreateTaskModalVisible(true)}
              >
                <Text className="text-white font-medium">Add First Task</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {goal.tasks?.length > 0 && (
        <TouchableOpacity
          className="absolute right-6 bottom-6 w-14 h-14 bg-blue-600 rounded-full justify-center items-center shadow-lg"
          onPress={() => setIsCreateTaskModalVisible(true)}
        >
          <MaterialIcons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      )}

      <CreateTaskModal
        visible={isCreateTaskModalVisible}
        onClose={() => setIsCreateTaskModalVisible(false)}
        goalId={(goal?.id || (goal as any)?._id) as string}
        onCreate={handleCreateTask}
      />
    </View>
  );
}


