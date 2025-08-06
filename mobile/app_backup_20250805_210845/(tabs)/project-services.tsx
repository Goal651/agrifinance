import Card from '@/components/ui/Card';
import { useProject } from '@/contexts/ProjectContext';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  GestureResponderEvent,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import {
  BellIcon,
  ChartBarIcon,
  DocumentTextIcon,
  EllipsisHorizontalIcon,
  FlagIcon,
  FolderOpenIcon,
  HomeIcon,
  PlusIcon,
  QuestionMarkCircleIcon
} from 'react-native-heroicons/outline';

// Define route types that match your app's routing structure
type AppRoute = 
  | { pathname: '/projects/ProjectView', params?: { id?: string } }
  | { pathname: '/projects/NewProject' }
  | { pathname: '/projects/analytics' };


export default function ProjectServices() {
  const { projects = [], projectDash = { active: 0, total: 0, completed: 0 }, setCurrentProject } = useProject();
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'goals' | 'analytics'>('overview');
  const [goalFilter, setGoalFilter] = useState<'all' | 'done' | 'active'>('all');
  const [showMoreActions, setShowMoreActions] = useState(false);
  const [moreActionsPosition, setMoreActionsPosition] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const moreActionsButtonRef = useRef<View>(null);
  const router = useRouter();

  useEffect(() => {
    // Initialize dimensions
    const { width, height } = Dimensions.get('window');
    setDimensions({ width, height });
  }, []);

  const handleMoreActions = (event: GestureResponderEvent) => {
    event.persist();
    const { pageX, pageY } = event.nativeEvent;
    setMoreActionsPosition({
      x: dimensions.width - pageX - 192, // 192 is the width of the menu
      y: pageY + 10
    });
    setShowMoreActions(true);
  };

  const handleRoute = (route: AppRoute) => {
    // Close any open modals
    setShowMoreActions(false);
    
    // Add /(tabs) prefix for tab navigation
    const path = `/(tabs)${route.pathname}`;
    router.push(path as any);
  };

  const tabs = [
    { id: 'overview' as const, title: 'Overview', icon: HomeIcon },
    { id: 'projects' as const, title: 'Projects', icon: FolderOpenIcon },
    { id: 'goals' as const, title: 'Goals', icon: FlagIcon },
    { id: 'analytics' as const, title: 'Analytics', icon: ChartBarIcon },
  ];

  const renderOverviewTab = () => (
    <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
      <Card title="Welcome, Farmer" variant="elevated">
        <Text className="text-gray-600 mb-6 text-base">
          Manage your agricultural projects and track your progress
        </Text>

        {/* Project Summary */}
        <View className="bg-purple-50 rounded-2xl p-6 mb-6">
          <View className="flex-row justify-between mb-4">
            <Text className="font-bold text-lg text-purple-900">Project Summary</Text>
          </View>
          <View className="flex-row justify-between">
            <View className="items-center flex-1">
              <Text className="text-2xl font-bold text-purple-700">{projectDash?.active ?? 0}</Text>
              <Text className="text-sm text-purple-600">Active</Text>
            </View>
            <View className="items-center flex-1">
              <Text className="text-2xl font-bold text-purple-700">{projectDash?.total ?? 0}</Text>
              <Text className="text-sm text-purple-600">Total</Text>
            </View>
            <View className="items-center flex-1">
              <Text className="text-2xl font-bold text-purple-700">{projectDash?.completed ?? 0}</Text>
              <Text className="text-sm text-purple-600">Completed</Text>
            </View>
          </View>
        </View>

        {/* Active Projects */}
        <Text className="font-bold text-lg mb-3">Active Projects</Text>
        
        {projectDash?.active && projectDash.active > 0 ? (
          <View className="space-y-4">
            {projects.map((project) => (
              <View key={project.id} className="bg-white rounded-xl p-4 border border-gray-100">
                <View className="flex-row justify-between mb-2">
                  <Text className="font-bold text-base">{project.name}</Text>
                  <Text className="text-xs text-gray-500">
                    Started: {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'N/A'}
                  </Text>
                </View>
                
                <View className="flex-row items-center mb-3">
                  <View className="bg-purple-100 px-2 py-0.5 rounded-full">
                    <Text className="text-xs text-purple-700 font-medium">
                      {project.status}
                    </Text>
                  </View>
                </View>
                
                {/* Goals Preview */}
                {project.goals?.slice(0, 3).map((goal) => (
                  <View key={goal.id || goal.name} className="flex-row items-center mb-1">
                    {goal.status === 'COMPLETED' ? (
                      <MaterialIcons name="check-circle" size={16} color="#22c55e" className="mr-2" />
                    ) : (
                      <MaterialIcons name="radio-button-unchecked" size={16} color="#f59e42" className="mr-2" />
                    )}
                    <Text className="text-sm">
                      {goal.name}
                    </Text>
                  </View>
                ))}
                
                {project.goals && project.goals.length > 3 && (
                  <Text className="text-purple-600 text-xs mt-1 ml-6">
                    +{project.goals.length - 3} more goals
                  </Text>
                )}
                
                <View className="flex-row justify-between mt-3">
                  <TouchableOpacity
                    className="flex-1 mr-2 items-center justify-center py-2 border border-purple-200 rounded-lg"
                    onPress={() => handleRoute({ pathname: '/projects/ProjectView', params: { id: project.id } })}
                  >
                    <Text className="text-purple-700 font-medium">View Details</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex-1 ml-2 items-center justify-center py-2 bg-purple-600 rounded-lg"
                    onPress={() => {
                      setCurrentProject(project);
                      handleRoute({ pathname: '/projects/ProjectView', params: { id: project.id } });
                    }}
                  >
                    <Text className="text-white font-medium">Update Progress</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className="bg-white rounded-xl p-6 items-center justify-center border border-gray-100">
            <Text className="text-gray-500 text-center mb-4">
              You don&apos;t have any active projects yet.
            </Text>
            <TouchableOpacity
              className="w-full py-3 bg-purple-600 rounded-lg items-center"
              onPress={() => handleRoute({ pathname: '/projects/NewProject' })}
            >
              <Text className="text-white font-medium">Create New Project</Text>
            </TouchableOpacity>
          </View>
        )}
      </Card>
    </ScrollView>
  );

  const renderProjectsTab = () => (
    <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
      <Card title="Your Projects" variant="elevated">
        <Text className="text-gray-600 mb-4 text-base">
          Manage and track your agricultural projects
        </Text>
        
        <View className="space-y-4">
          {projects?.map((project) => (
            <View key={project.id} className="bg-white rounded-xl p-4 border border-gray-100">
              <View className="flex-row justify-between items-start">
                <View className="flex-1 mr-4">
                  <Text className="text-lg font-bold mb-2">
                    {project.name}
                  </Text>
                  <Text className="text-gray-600 mb-3">
                    {project.description || 'No description'}
                  </Text>
                  
                  <View className="space-y-2">
                    <View className="flex-row items-center">
                      <Text className="text-gray-500 text-sm">Status: </Text>
                      <Text className="text-sm font-medium text-purple-700 ml-1">
                        {project.status}
                      </Text>
                    </View>
                    <Text className="text-gray-500 text-sm">
                      Start Date: {project.createdAt ? 
                        new Date(project.createdAt).toLocaleDateString() : 'N/A'
                      }
                    </Text>

                    {/* Goals Section */}
                    <View className="mt-3">
                      <Text className="text-sm font-semibold text-gray-700 mb-2">
                        Goals ({project.goals?.length || 0})
                      </Text>
                      
                      {project.goals?.slice(0, 3).map((goal) => (
                        <View key={goal.id} className="mt-1">
                          <View className="flex-row items-center">
                            {goal.status === 'COMPLETED' ? (
                              <MaterialIcons 
                                name="check-circle" 
                                size={16} 
                                color="#22c55e" 
                                className="mr-2" 
                              />
                            ) : (
                              <MaterialIcons 
                                name="radio-button-unchecked" 
                                size={16} 
                                color="#f59e42" 
                                className="mr-2" 
                              />
                            )}
                            <Text className="text-sm font-medium text-gray-800">
                              {goal.name}
                            </Text>
                          </View>
                        </View>
                      ))}
                      {project.goals && project.goals.length > 3 && (
                        <Text className="text-purple-600 text-xs mt-1 ml-6">
                          +{project.goals.length - 3} more goals
                        </Text>
                      )}
                    </View>
                  </View>
                </View>

                <View className="flex-col space-y-2">
                  <TouchableOpacity
                    className="min-w-[100px] py-2 px-3 bg-purple-600 rounded-lg items-center"
                    onPress={() => {
                      setCurrentProject(project);
                      handleRoute({ pathname: '/projects/ProjectView', params: { id: project.id } });
                    }}
                  >
                    <Text className="text-white font-medium">View Details</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    className="min-w-[100px] py-2 px-3 border border-purple-200 rounded-lg items-center"
                    onPress={() => {
                      setCurrentProject(project);
                      handleRoute({ pathname: '/projects/ProjectView', params: { id: project.id } });
                    }}
                  >
                    <Text className="text-purple-700 font-medium">Edit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
          
          {(!projects || projects.length === 0) && (
            <View className="bg-white rounded-xl p-6 items-center justify-center border border-gray-100">
              <Text className="text-gray-500 text-center mb-4">
                You don&apos;t have any projects yet.
              </Text>
              <TouchableOpacity
                className="w-full py-3 bg-purple-600 rounded-lg items-center"
                onPress={() => handleRoute({ pathname: '/projects/NewProject' })}
              >
                <Text className="text-white font-medium">Create New Project</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Card>
    </ScrollView>
  );

  const renderGoalsTab = () => (
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
                  goalFilter === 'done' ? g.status === 'COMPLETED' :
                    goalFilter === 'active' ? g.status === 'IN_PROGRESS' : true
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
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 pt-14 pb-4 border-b border-gray-100">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-2xl font-bold text-gray-900">Project Services</Text>
            <Text className="text-gray-500">Manage your agricultural projects</Text>
          </View>
          <View className="flex-row space-x-3">
            <TouchableOpacity
              // onPress={() => handleRoute({ pathname: '/notifications' })}
              className="p-2"
            >
              <BellIcon size={24} />
            </TouchableOpacity>
            <TouchableOpacity
              ref={moreActionsButtonRef}
              onPress={handleMoreActions}
              className="p-2"
            >
              <EllipsisHorizontalIcon size={24} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <View className="flex-row mt-6 border-b border-gray-200">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                className={`flex-1 items-center justify-center pb-3 ${isActive ? 'border-b-2 border-purple-600' : ''}`}
                onPress={() => setActiveTab(tab.id)}
              >
                <View className="flex-row items-center">
                  <IconComponent
                    size={20}
                   
                  />
                  <Text className={`text-sm font-medium ${isActive ? 'text-purple-700' : 'text-gray-500'}`}>
                    {tab.title}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Tab Content */}
      <View className="flex-1">
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'projects' && renderProjectsTab()}
        {activeTab === 'goals' && renderGoalsTab()}
        {activeTab === 'analytics' && (
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-500">Analytics coming soon</Text>
          </View>
        )}
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity 
        className="absolute bottom-6 right-6 bg-purple-600 rounded-full p-4 shadow-lg"
        onPress={() => handleRoute({ pathname: '/projects/NewProject' })}
      >
        <PlusIcon size={24} />
      </TouchableOpacity>

      {/* More Actions Modal */}
      <Modal
        visible={showMoreActions}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMoreActions(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowMoreActions(false)}>
          <View className="flex-1 bg-black bg-opacity-50">
            <View 
              className="absolute bg-white rounded-lg shadow-lg p-2 w-48"
              style={{
                top: moreActionsPosition.y,
                right: moreActionsPosition.x,
              }}
            >
              <TouchableOpacity
                className="flex-row items-center px-4 py-3 rounded-md hover:bg-gray-100"
                onPress={() => {
                  setShowMoreActions(false);
                  // handleRoute({ pathname: '/support' });
                }}
              >
                <QuestionMarkCircleIcon size={20} />
                <Text className="text-gray-700">Help & Support</Text>
              </TouchableOpacity>
              <View className="h-px bg-gray-200 my-1" />
              <TouchableOpacity
                className="flex-row items-center px-4 py-3 rounded-md hover:bg-gray-100"
                onPress={() => {
                  setShowMoreActions(false);
                  handleRoute({ pathname: '/projects/analytics' });
                }}
              >
                <ChartBarIcon size={20} />
                <Text className="text-gray-700">Advanced Analytics</Text>
              </TouchableOpacity>
              <View className="h-px bg-gray-200 my-1" />
              <TouchableOpacity
                className="flex-row items-center px-4 py-3 rounded-md hover:bg-gray-100"
                onPress={() => {
                  setShowMoreActions(false);
                  // Handle documentation link
                }}
              >
                <DocumentTextIcon size={20} />
                <Text className="text-gray-700">Documentation</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
