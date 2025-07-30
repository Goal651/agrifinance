import { useProject } from '@/hooks/useProject';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import ProjectAnalytics from './ProjectAnalytics';

export default function ProjectServices() {
  const { projects, analytics } = useProject();
  const [activeTab, setActiveTab] = useState('overview');
  const [goalFilter, setGoalFilter] = useState('all');
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header Bar */}
      <View className="bg-blue-700 pt-10 pb-3 px-4 flex-row items-center justify-between shadow">
        <Text className="text-lg font-semibold text-white">Project Services</Text>
        <View className="flex-row space-x-4">
          <TouchableOpacity>
            <MaterialIcons name="notifications-none" size={22} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <MaterialIcons name="more-vert" size={22} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View className="flex-row bg-white rounded-t-2xl shadow mx-0 mt-0 overflow-hidden">
        <TouchableOpacity className="flex-1 items-center py-3 flex-col" style={activeTab === 'overview' ? { borderBottomWidth: 2, borderBottomColor: '#2563eb' } : {}} onPress={() => setActiveTab('overview')}>
          <MaterialIcons name="home" size={28} color={activeTab === 'overview' ? '#2563eb' : '#6b7280'} />
          <Text className={activeTab === 'overview' ? 'text-blue-700 font-semibold text-sm mt-1' : 'text-gray-500 text-sm mt-1'}>Overview</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 items-center py-3 flex-col" style={activeTab === 'projects' ? { borderBottomWidth: 2, borderBottomColor: '#2563eb' } : {}} onPress={() => setActiveTab('projects')}>
          <MaterialIcons name="folder-open" size={28} color={activeTab === 'projects' ? '#2563eb' : '#6b7280'} />
          <Text className={activeTab === 'projects' ? 'text-blue-700 font-semibold text-sm mt-1' : 'text-gray-500 text-sm mt-1'}>Projects</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 items-center py-3 flex-col" style={activeTab === 'goals' ? { borderBottomWidth: 2, borderBottomColor: '#2563eb' } : {}} onPress={() => setActiveTab('goals')}>
          <MaterialIcons name="flag" size={28} color={activeTab === 'goals' ? '#2563eb' : '#6b7280'} />
          <Text className={activeTab === 'goals' ? 'text-blue-700 font-semibold text-sm mt-1' : 'text-gray-500 text-sm mt-1'}>Goals</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 items-center py-3 flex-col" style={activeTab === 'analytics' ? { borderBottomWidth: 2, borderBottomColor: '#2563eb' } : {}} onPress={() => setActiveTab('analytics')}>
          <MaterialIcons name="bar-chart" size={28} color={activeTab === 'analytics' ? '#2563eb' : '#6b7280'} />
          <Text className={activeTab === 'analytics' ? 'text-blue-700 font-semibold text-sm mt-1' : 'text-gray-500 text-sm mt-1'}>Analytics</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'overview' && (
        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 80 }} showsVerticalScrollIndicator={true}>
          <View className="px-3 pt-5">
            <Text className="text-xl font-bold mb-1">Welcome, Farmer</Text>
            <Text className="text-gray-500 mb-3">Manage your agricultural projects</Text>
            {/* Project Summary */}
            <View className="bg-white rounded-xl shadow p-4 mb-4 border border-gray-100 flex-row justify-between items-center">
              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-blue-700">{analytics?.activeProjects ?? 0}</Text>
                <Text className="text-xs text-gray-500">Active Projects</Text>
              </View>
              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-blue-700">{analytics?.totalProjects ?? 0}</Text>
                <Text className="text-xs text-gray-500">Total Projects</Text>
              </View>
              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-blue-700">{analytics?.completedProjects ?? 0}</Text>
                <Text className="text-xs text-gray-500">Completed</Text>
              </View>
            </View>
            {/* Active Projects */}
            <Text className="font-bold text-lg mb-2">Active Projects</Text>
            {projects.map((project, idx) => (
              <View key={project.id} className="bg-white rounded-xl shadow p-4 mb-4 border border-gray-100">
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
                    {goal.status === 'done' ? (
                      <MaterialIcons name="check-circle" size={16} color="#22c55e" className="mr-1" />
                    ) : (
                      <MaterialIcons name="radio-button-unchecked" size={16} color="#f59e42" className="mr-1" />
                    )}
                    <Text className={goal.status === 'done' ? 'text-green-700 ml-1' : 'text-yellow-700 ml-1'}>{goal.name}</Text>
                  </View>
                ))}
                {project.goals && project.goals.length > 3 && (
                  <Text className="text-green-700 text-xs ml-6 mb-2">+{project.goals.length - 3} more goals</Text>
                )}
                <View className="flex-row justify-between mt-2">
                  <TouchableOpacity className="flex-1 items-center justify-center bg-white border border-blue-700 rounded-full py-2 mr-2" style={{ minWidth: 110 }}>
                    <Text className="text-blue-700 font-semibold">View Details</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-1 items-center justify-center bg-blue-700 rounded-full py-2 ml-2" style={{ minWidth: 110 }}>
                    <Text className="text-white font-semibold">Update Progress</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      {activeTab === 'goals' && (
        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 80 }} showsVerticalScrollIndicator={true}>
          <View className="px-3 pt-5">
            <Text className="text-xl font-bold mb-1">Manage your agricultural projects</Text>
            {/* Filter Buttons */}
            <View className="flex-row bg-purple-50 rounded-xl p-2 mb-3">
              <TouchableOpacity
                className={`flex-1 items-center py-2 rounded-lg mr-2 ${goalFilter === 'all' ? 'bg-purple-200' : ''}`}
                onPress={() => setGoalFilter('all')}
              >
                <Text className={`font-semibold ${goalFilter === 'all' ? 'text-purple-900' : 'text-gray-700'}`}>All Goals</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 items-center py-2 rounded-lg mr-2 ${goalFilter === 'done' ? 'bg-purple-200' : ''}`}
                onPress={() => setGoalFilter('done')}
              >
                <Text className={`font-semibold ${goalFilter === 'done' ? 'text-purple-900' : 'text-gray-700'}`}>Completed</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 items-center py-2 rounded-lg ${goalFilter === 'active' ? 'bg-purple-200' : ''}`}
                onPress={() => setGoalFilter('active')}
              >
                <Text className={`font-semibold ${goalFilter === 'active' ? 'text-purple-900' : 'text-gray-700'}`}>In Progress</Text>
              </TouchableOpacity>
            </View>
            {/* Goals Table */}
            <View className="bg-white rounded-xl shadow p-2 mb-4 border border-gray-100">
              <View className="flex-row px-2 py-2 border-b border-gray-200">
                <Text className="w-2/6 text-xs font-semibold text-gray-500">Goal</Text>
                <Text className="w-2/6 text-xs font-semibold text-gray-500">Project</Text>
                <Text className="w-1/6 text-xs font-semibold text-gray-500">Status</Text>
              </View>
              {projects.flatMap(project =>
                (project.goals || [])
                  .filter(g =>
                    goalFilter === 'all' ? true :
                    goalFilter === 'done' ? g.status === 'done' :
                    goalFilter === 'active' ? g.status === 'active' : true
                  )
                  .map((g, idx) => (
                    <View key={g.id || g.name + project.id} className="flex-row items-center px-2 py-2 border-b border-gray-100 last:border-b-0">
                      <Text className="w-2/6 text-gray-800" numberOfLines={1}>{g.name}</Text>
                      <Text className="w-2/6 text-gray-800" numberOfLines={1}>{project.name}</Text>
                      <Text className="w-1/6 text-gray-800 text-xs">{g.status}</Text>
                    </View>
                  ))
              )}
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
