import React from 'react';
import { ScrollView, Text, View } from 'react-native';

export default function OverviewTab({ projectDash }: { projectDash: { active: number; total: number; completed: number; activeProjects: { id: string; name: string; createdAt?: string; status: string }[] } }) {
  return (
    <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 80 }} showsVerticalScrollIndicator={true}>
      <View className="px-3 pt-5">
        <Text className="text-xl font-bold mb-1">Welcome, Farmer</Text>
        <Text className="text-gray-500 mb-3">Manage your agricultural projects</Text>
        {/* Project Summary */}
        <View className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 mb-4 border border-gray-100/50 flex-row justify-between items-center">
          <View className="items-center flex-1">
            <Text className="text-2xl font-bold text-blue-700">{projectDash?.active ?? 0}</Text>
            <Text className="text-xs text-gray-500">Active Projects</Text>
          </View>
          <View className="items-center flex-1">
            <Text className="text-2xl font-bold text-blue-700">{projectDash?.total ?? 0}</Text>
            <Text className="text-xs text-gray-500">Total Projects</Text>
          </View>
          <View className="items-center flex-1">
            <Text className="text-2xl font-bold text-blue-700">{projectDash?.completed ?? 0}</Text>
            <Text className="text-xs text-gray-500">Completed</Text>
          </View>
        </View>
        {/* Active Projects */}
        <Text className="font-bold text-lg mb-2">Active Projects</Text>
        {projectDash?.activeProjects.map((project, idx) => (
          <View key={project.id} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 mb-4 border border-gray-100/50">
            <View className="flex-row justify-between mb-1">
              <Text className="font-bold text-base">{project.name}</Text>
              <Text className="text-xs text-gray-500">Start: {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : ''}</Text>
            </View>
            <View className="flex-row items-center mb-2">
              <Text className="text-xs text-gray-500 mr-2">Status: {project.status}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
