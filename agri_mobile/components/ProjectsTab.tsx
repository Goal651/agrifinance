import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function ProjectsTab({ projects, setCurrentProject, router }: { projects: { id: string; name: string; description?: string; status: string; goals?: any[]; tasks?: any[] }[]; setCurrentProject: (project: any) => void; router: any }) {
  return (
    <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 80 }} showsVerticalScrollIndicator={true}>
      <View className="px-3 pt-5">
        <Text className="text-xl font-bold mb-1">Your Projects</Text>
        <View className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 mb-4 border border-gray-100/50">
          <Text className="text-gray-500 mb-3">Manage and track your agricultural projects</Text>
          <View className="space-y-4">
            {projects?.map((project) => (
              <TouchableOpacity
                onPress={() => {
                  setCurrentProject(project);
                  router.push(`/(tabs)/ProjectView`);
                }}
                key={project.id}
                className="bg-white rounded-xl shadow-lg p-4 flex-row items-center"
              >
                <MaterialIcons
                  name={project.status === 'COMPLETED' ? 'check-circle' : 'radio-button-unchecked'}
                  size={24}
                  color={project.status === 'COMPLETED' ? '#10b981' : '#9ca3af'}
                  className="mr-3"
                />
                <View className="flex-1">
                  <Text className="text-lg font-bold mb-1">{project.name}</Text>
                  <Text className="text-gray-600 mb-2">{project.description || 'No description'}</Text>
                  <View className="space-y-1">
                    <Text className="text-gray-500 text-sm">Number of Goals: {project.goals?.length || 0}</Text>
                    <Text className="text-gray-500 text-sm">Number of Tasks: {project.tasks?.length || 0}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
