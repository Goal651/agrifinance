import { useProject } from '@/contexts/ProjectContext';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import ProjectAnalytics from './ProjectAnalytics';


export default function ProjectServices() {
  const { projects, projectDash, setCurrentProject, workers } = useProject();
  const [activeTab, setActiveTab] = useState('overview');
  const [goalFilter, setGoalFilter] = useState('all');
  const router = useRouter();


  return (
    <View className="flex-1 bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header Bar */}
      <View className=" bg-blue-700  pt-10 pb-3 px-4 flex-row items-center justify-between shadow-lg">
        <Text className="text-lg font-semibold text-white">Project Services</Text>
        <View className="flex-row space-x-4">
          <TouchableOpacity>
            <MaterialIcons name="notifications-none" size={22} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.replace('/login')}>
            <MaterialIcons name="logout" size={22} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View className="flex-row bg-white/80 backdrop-blur-sm rounded-t-2xl shadow-lg mx-0 mt-0 overflow-hidden">
        <TouchableOpacity className="flex-1 items-center py-3 flex-col" style={activeTab === 'overview' ? { borderBottomWidth: 2, borderBottomColor: '#2563eb' } : {}} onPress={() => setActiveTab('overview')}>
          <MaterialIcons name="home" size={28} color={activeTab === 'overview' ? '#2563eb' : '#6b7280'} />
          <Text className={activeTab === 'overview' ? 'text-blue-700 font-semibold text-sm mt-1' : 'text-gray-500 text-sm mt-1'}>Overview</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 items-center py-3 flex-col" style={activeTab === 'projects' ? { borderBottomWidth: 2, borderBottomColor: '#2563eb' } : {}} onPress={() => setActiveTab('projects')}>
          <MaterialIcons name="folder-open" size={28} color={activeTab === 'projects' ? '#2563eb' : '#6b7280'} />
          <Text className={activeTab === 'projects' ? 'text-blue-700 font-semibold text-sm mt-1' : 'text-gray-500 text-sm mt-1'}>Projects</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 items-center py-3 flex-col" style={activeTab === 'workers' ? { borderBottomWidth: 2, borderBottomColor: '#2563eb' } : {}} onPress={() => setActiveTab('workers')}>
          <MaterialIcons name="group" size={28} color={activeTab === 'workers' ? '#2563eb' : '#6b7280'} />
          <Text className={activeTab === 'workers' ? 'text-blue-700 font-semibold text-sm mt-1' : 'text-gray-500 text-sm mt-1'}>Workers</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 items-center py-3 flex-col" style={activeTab === 'analytics' ? { borderBottomWidth: 2, borderBottomColor: '#2563eb' } : {}} onPress={() => setActiveTab('analytics')}>
          <MaterialIcons name="bar-chart" size={28} color={activeTab === 'analytics' ? '#2563eb' : '#6b7280'} />
          <Text className={activeTab === 'analytics' ? 'text-blue-700 font-semibold text-sm mt-1' : 'text-gray-500 text-sm mt-1'}>Analytics</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'projects' && (
        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 80 }} showsVerticalScrollIndicator={true}>
          <View className="px-3 pt-5">
            <Text className="text-xl font-bold mb-1">Your Projects</Text>
            <View className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 mb-4 border border-gray-100/50">
              <Text className="text-gray-500 mb-3">Manage and track your agricultural projects</Text>
              <View className="space-y-4">
                {projects?.map((project) => (
                  <TouchableOpacity
                    onPress={() => {
                      setCurrentProject(project)
                      router.push(`/(tabs)/ProjectView`)
                    }}
                    key={project.id} className="bg-white rounded-xl shadow-lg p-4 flex-row items-center">
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
      )}

      {activeTab === 'overview' && (
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
                {/* Goals */}
                {project.goals?.slice(0, 3).map((goal, i) => (
                  <View key={goal.id || goal.name} className="flex-row items-center mb-1">
                    {goal.status === 'COMPLETED' ? (
                      <MaterialIcons name="check-circle" size={16} color="#22c55e" className="mr-1" />
                    ) : (
                      <MaterialIcons name="radio-button-unchecked" size={16} color="#f59e42" className="mr-1" />
                    )}
                    <Text className={goal.status === 'COMPLETED' ? 'text-green-700 ml-1' : 'text-yellow-700 ml-1'}>{goal.name}</Text>
                  </View>
                ))}
                {project.goals && project.goals.length > 3 && (
                  <Text className="text-green-700 text-xs ml-6 mb-2">+{project.goals.length - 3} more goals</Text>
                )}
                <View className="flex-row justify-between mt-2">
                  <TouchableOpacity className="flex-1 items-center justify-center bg-white/80 backdrop-blur-sm border border-blue-700 rounded-full py-2 mr-2"
                    onPress={() => {
                      setCurrentProject(project)
                      router.push({ pathname: `/(tabs)/ProjectView` })
                    }
                    }
                    style={{ minWidth: 110 }}>
                    <Text className="text-blue-700 font-semibold">View Details</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-1 items-center justify-center bg-blue-700/90 rounded-full py-2 ml-2" style={{ minWidth: 110 }}>
                    <Text className="text-white font-semibold">Update Progress</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {activeTab === 'workers' && (
        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 80 }} showsVerticalScrollIndicator={true}>
          <View className="px-3 pt-5">
            <Text className="text-xl font-bold mb-1">Manage your agricultural projects</Text>
            {/* Workers Table */}
            <View className="bg-white rounded-xl shadow p-2 mb-4 border border-gray-100">
              <View className="flex-row px-2 py-2 border-b border-gray-200">
                <Text className="w-2/6 text-xs font-semibold text-gray-500">Worker</Text>
                <Text className="w-2/6 text-xs font-semibold text-gray-500">Role</Text>
                <Text className="w-1/6 text-xs font-semibold text-gray-500">Status</Text>
              </View>
              {workers.map((worker, idx) => (
                <View key={worker.id || idx} className="flex-row items-center px-2 py-2 border-b border-gray-100 last:border-b-0">
                  <Text className="w-2/6 text-gray-800" numberOfLines={1}>{worker.names}</Text>
                  <Text className="w-2/6 text-gray-800" numberOfLines={1}>{worker.email}</Text>
                  <Text className="w-1/6 text-gray-800 text-xs">{worker.phoneNumber}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      )}

      {activeTab === 'analytics' && <ProjectAnalytics />}

      {/* Floating New Project Button */}
      <TouchableOpacity className="absolute bottom-6 right-6 bg-blue-700 rounded-full px-6 py-3 flex-row items-center shadow-lg" onPress={() => router.push('/(tabs)/NewProject')}>
        <MaterialIcons name="add" size={22} color="white" />
        <Text className="text-white font-bold ml-2">New Project</Text>
      </TouchableOpacity>
    </View>
  );
}
