import { useProject } from '@/contexts/ProjectContext';
import { useProjectAction } from '@/hooks/useProjectAction';
import { Task, TaskCreateRequest } from '@/types';
import { MaterialIcons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

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

            >
              <Text className="text-gray-700 font-medium">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`px-4 py-2.5 bg-blue-600 rounded-lg opacity-70`}
              onPress={handleSubmit}

            >

              <Text className="text-white font-medium">Create Task</Text>

            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};



export default function GoalView() {
  const { createTask, finishTask } = useProjectAction();
  const [isCreateTaskModalVisible, setIsCreateTaskModalVisible] = useState(false);
  const { currentGoal, setCurrentGoal } = useProject();

  const handleCreateTask = async (taskData: { name: string; description: string }) => {
    if (!currentGoal) return;

    try {
      const newTask: TaskCreateRequest = {
        name: taskData.name,
        description: taskData.description,
        goal: currentGoal,
      }
      await createTask(newTask)
      setIsCreateTaskModalVisible(false);
      Alert.alert('Success', 'Task created successfully');
    } catch (error) {
      console.error('Error creating task:', error);
      Alert.alert('Error', 'Failed to create task');
    }
  };



  if (!currentGoal) {
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
          title: currentGoal?.name || 'Goal',
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
        {/* Goal Details */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <View className="flex-row items-center mb-3">
            <View className={`w-3 h-3 rounded-full ${statusColors[currentGoal.status] || 'bg-gray-400'} mr-2`} />
            <Text className="text-sm font-medium text-gray-700">
              {statusLabels[currentGoal.status] || currentGoal.status}
            </Text>
          </View>

          <Text className="text-gray-700 text-base leading-6">
            {currentGoal.description || 'No description provided'}
          </Text>
        </View>

        {/* Tasks Section */}
        <View className="bg-white rounded-xl p-4 shadow-sm">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-gray-900">Tasks</Text>
            <Text className="text-sm text-gray-500">
              {currentGoal.tasks?.length || 0} {currentGoal.tasks?.length === 1 ? 'task' : 'tasks'}
            </Text>
          </View>

          {/* Tasks List */}
          {currentGoal.tasks?.length > 0 ? (
            <View className="space-y-3">
              {currentGoal.tasks?.map((task: Task, taskIndex: number) => (
                <View key={taskIndex} className="flex-row justify-between items-center py-3 border-b border-gray-100">
                  <View className="flex-1 mr-3">
                    <Text className="text-gray-900 font-medium mb-1">{task.name}</Text>
                    {task.description && (
                      <Text className="text-gray-500 text-sm">{task.description}</Text>
                    )}
                    {task.worker && (
                      <View className="mt-2">
                        <Text className="text-gray-500 text-sm">Worker: {task.worker.names}</Text>
                      </View>
                    )}
                  </View>
                  <TouchableOpacity
                    className="p-1"
                    onPress={() => {
                      if (currentGoal && currentGoal.tasks) {
                        const updatedTasks = [...currentGoal.tasks];
                        updatedTasks[taskIndex] = {
                          ...task,
                          status: 'COMPLETED',
                        };
                        setCurrentGoal({
                          ...currentGoal,
                          tasks: updatedTasks,
                        });
                        finishTask(task.id);
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

      {currentGoal.tasks?.length > 0 && (
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
        goalId={(currentGoal?.id) as string}
        onCreate={handleCreateTask}
      />
    </View>
  );
}


