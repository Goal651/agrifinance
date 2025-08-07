import OverviewTab from '@/components/OverviewTab';
import ProjectsTab from '@/components/ProjectsTab';
import WorkersTab from '@/components/WorkersTab';
import { useProject } from '@/contexts/ProjectContext';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import ProjectAnalytics from './ProjectAnalytics';


export default function ProjectServices() {
  const { projects, projectDash, setCurrentProject, workers } = useProject();
  const [activeTab, setActiveTab] = useState('overview');
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


      {activeTab === 'overview' && projectDash && <OverviewTab projectDash={projectDash} />}

      {activeTab === 'projects' && (
        <>
          <ProjectsTab projects={projects} setCurrentProject={setCurrentProject} router={router} />
          <TouchableOpacity
            className="absolute bottom-6 right-6 bg-blue-700 rounded-full px-6 py-3 flex-row items-center shadow-lg"
            onPress={() => router.push('/(tabs)/NewProject')}
          >
            <MaterialIcons name="add" size={22} color="white" />
            <Text className="text-white font-bold ml-2">New Project</Text>
          </TouchableOpacity>
        </>
      )}

      {activeTab === 'workers' && (
        <>
          <WorkersTab workers={workers} />
          <TouchableOpacity
            className="absolute bottom-6 right-6 bg-blue-700 rounded-full px-6 py-3 flex-row items-center shadow-lg"
            onPress={() => router.push({ pathname: '/(tabs)/NewWorker' })}
          >
            <MaterialIcons name="add" size={22} color="white" />
            <Text className="text-white font-bold ml-2">Add Worker</Text>
          </TouchableOpacity>
        </>
      )}

      {activeTab === 'analytics' && <ProjectAnalytics />}
    </View>
  );
}
