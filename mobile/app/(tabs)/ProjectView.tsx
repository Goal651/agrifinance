import { useGlobalSearchParams, Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Modal,
    TextInput,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { useProject } from '@/hooks/useProject';
import { MaterialIcons } from '@expo/vector-icons';
import { Project, ProjectGoal, GoalStatus, TaskStatus, GoalCreateRequest } from '@/types/project';

type StatusType = GoalStatus | TaskStatus;

const statusColors: Record<StatusType, string> = {
    NOT_STARTED: '#f97316', // orange-500
    IN_PROGRESS: '#3b82f6', // blue-500
    COMPLETED: '#10b981', // emerald-500
};

const statusLabels: Record<StatusType, string> = {
    NOT_STARTED: 'Not Started',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed',
};



interface CreateGoalModalProps {
    visible: boolean;
    onClose: () => void;
    project: Project;
    onCreate: (data: GoalCreateRequest) => void;
}

const CreateGoalModal: React.FC<CreateGoalModalProps> = ({
    visible,
    onClose,
    project,
    onCreate
}) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (!name.trim()) {
            setError('Goal name is required');
            return;
        }

        // setLoading(true);
        setError('');

        try {
            onCreate({
                name: name.trim(),
                description: description.trim(),
                project
            });

            // Reset form
            setName('');
            setDescription('');
            onClose();
        } catch (err) {
            setError('Failed to create goal. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
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
                className="flex-1"
            >
                <TouchableOpacity
                    className="flex-1 bg-black bg-opacity-50 justify-end"
                    activeOpacity={1}
                    onPress={onClose}
                >
                    <View className="bg-white rounded-t-2xl p-6 max-h-[90%]" onStartShouldSetResponder={() => true}>
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-xl font-semibold text-gray-900">Create New Goal</Text>
                            <TouchableOpacity onPress={onClose} className="p-2 -mr-2">
                                <MaterialIcons name="close" size={24} color="#6b7280" />
                            </TouchableOpacity>
                        </View>

                        <View className="mb-5">
                            <Text className="text-sm font-medium text-gray-700 mb-2">
                                Goal Name <Text className="text-red-500">*</Text>
                            </Text>
                            <TextInput
                                className="border border-gray-300 rounded-lg px-4 py-3 text-base"
                                placeholder="Enter goal name"
                                value={name}
                                onChangeText={setName}
                                autoFocus
                                maxLength={100}
                            />
                        </View>

                        <View className="mb-6">
                            <Text className="text-sm font-medium text-gray-700 mb-2">
                                Description (Optional)
                            </Text>
                            <TextInput
                                className="border border-gray-300 rounded-lg px-4 py-3 text-base min-h-[100px] text-align-top"
                                placeholder="Enter a brief description"
                                value={description}
                                onChangeText={setDescription}
                                multiline
                                numberOfLines={4}
                                maxLength={500}
                            />
                        </View>

                        {error ? (
                            <Text className="text-red-500 text-sm mb-4">{error}</Text>
                        ) : null}

                        <View className="flex-row justify-end space-x-3">
                            <TouchableOpacity
                                className="px-5 py-2.5 rounded-lg bg-gray-100"
                                onPress={onClose}
                                disabled={loading}
                            >
                                <Text className="text-gray-700 font-medium">Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className={`px-5 py-2.5 rounded-lg ${!name.trim() || loading
                                    ? 'bg-blue-400'
                                    : 'bg-blue-500'
                                    }`}
                                onPress={handleSubmit}
                                disabled={!name.trim() || loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text className="text-white font-medium">Create Goal</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </Modal>
    );
};

export default function ProjectView() {
    const router = useRouter();
    const params = useGlobalSearchParams()
    const id = params.id as string
    const { getProjectById, createGoal } = useProject();
    const [project, setProject] = useState<Project | null>(null)
    const [isCreateGoalModalVisible, setIsCreateGoalModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setLoading(true)
        setProject(getProjectById(id))
        setLoading(false)
    }, [id, getProjectById])



    const handleCreateGoal = async (goalData: GoalCreateRequest) => {
        await createGoal(goalData)
    };

    const navigateToGoal = (goalId: string) => {
        // Navigate to the goal view with the goal ID
        router.push({
            pathname: '/(tabs)/GoalView',
            params: { goalId, projectId: id }
        });
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="#3b82f6" />
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 justify-center items-center p-4 bg-white">
                <Text className="text-red-500 text-lg mb-4 text-center">{error}</Text>
                <TouchableOpacity
                    className="bg-blue-500 px-6 py-2 rounded-lg"
                >
                    <Text className="text-white font-semibold">Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (!project) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <TouchableOpacity
                    onPress={() => router.back()}>
                    <Text>Return back</Text>
                </TouchableOpacity>
                <Text className="text-red-500 text-lg">Project not found</Text>
            </View>
        );
    }

    const getProgressPercentage = (tasks: ProjectGoal['tasks'] = []) => {
        if (!tasks || tasks.length === 0) return 0;
        const completed = tasks.filter(t => t.status === 'COMPLETED').length;
        return Math.round((completed / tasks.length) * 100);
    };

    return (
        <View className="flex-1 bg-white">
            <Stack.Screen
                options={{
                    title: 'Project Details',
                }}
            />
            <ScrollView className="p-4">
                {/* Project Header */}
                <View className="flex-row justify-between items-center mb-6">
                    <Text className="text-2xl font-bold flex-1">{project.name}</Text>
                    <View
                        className="px-3 py-1 rounded-full"
                        style={{ backgroundColor: statusColors[project.status as keyof typeof statusColors] }}
                    >
                        <Text className="text-white text-sm font-medium">
                            {statusLabels[project.status as keyof typeof statusLabels]}
                        </Text>
                    </View>
                </View>

                {/* Project Description */}
                <View className="mb-6">
                    <Text className="text-lg font-semibold mb-2 text-gray-800">Description</Text>
                    <Text className="text-gray-600">{project.description || 'No description'}</Text>
                </View>

                {/* Project Details */}
                <View className="mb-6">
                    <Text className="text-lg font-semibold mb-3 text-gray-800">Details</Text>
                    <View className="flex-row items-center mb-2">
                        <MaterialIcons name="person" size={18} color="#6b7280" />
                        <Text className="text-gray-600 ml-2">
                            {project.user?.firstName || 'Unknown'}
                        </Text>
                    </View>
                    {project.targetDate && (
                        <View className="flex-row items-center">
                            <MaterialIcons name="date-range" size={18} color="#6b7280" />
                            <Text className="text-gray-600 ml-2">
                                {new Date(project.targetDate).toLocaleDateString()}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Goals Section */}
                <View className="mb-6">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-lg font-semibold text-gray-800">Goals</Text>
                        <TouchableOpacity
                            className="flex-row items-center bg-blue-500 px-3 py-2 rounded-full"
                            onPress={() => setIsCreateGoalModalVisible(true)}
                        >
                            <MaterialIcons name="add" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    {!project.goals || project.goals.length === 0 ? (
                        <View className="items-center justify-center p-8 bg-gray-50 rounded-lg">
                            <MaterialIcons name="flag" size={48} color="#d1d5db" />
                            <Text className="mt-4 text-lg font-medium text-gray-700">No goals yet</Text>
                            <Text className="mb-6 text-gray-500">Add your first goal to get started</Text>
                            <TouchableOpacity
                                className="bg-blue-500 px-6 py-2 rounded-lg"
                                onPress={() => setIsCreateGoalModalVisible(true)}
                            >
                                <Text className="text-white font-medium">Create Goal</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View className="space-y-4">
                            {project.goals.map((goal) => {
                                const completedTasks = goal.tasks ? goal.tasks.filter(t => t.status === 'COMPLETED').length : 0;
                                const totalTasks = goal.tasks?.length || 0;
                                const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

                                return (
                                    <TouchableOpacity
                                        key={goal.id}
                                        className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
                                        onPress={() => navigateToGoal(goal.id)}
                                    >
                                        <View className="flex-row justify-between items-start mb-2">
                                            <Text className="text-lg font-medium text-gray-800 flex-1 mr-2">
                                                {goal.name}
                                            </Text>
                                            <View
                                                className="px-2 py-1 rounded-full"
                                                style={{ backgroundColor: statusColors[goal.status as keyof typeof statusColors] }}
                                            >
                                                <Text className="text-white text-xs font-medium">
                                                    {statusLabels[goal.status as keyof typeof statusLabels]}
                                                </Text>
                                            </View>
                                        </View>

                                        {goal.description && (
                                            <Text className="text-gray-600 text-sm mb-3" numberOfLines={2}>
                                                {goal.description}
                                            </Text>
                                        )}

                                        {totalTasks > 0 && (
                                            <View className="mt-2">
                                                <View className="h-2 bg-gray-100 rounded-full overflow-hidden mb-1">
                                                    <View
                                                        className="h-full rounded-full"
                                                        style={{
                                                            width: `${progressPercentage}%`,
                                                            backgroundColor: statusColors[goal.status as keyof typeof statusColors] || '#3b82f6'
                                                        }}
                                                    />
                                                </View>
                                                <Text className="text-xs text-gray-500 text-right">
                                                    {completedTasks} of {totalTasks} tasks completed
                                                </Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Create Goal Modal */}
            <CreateGoalModal
                visible={isCreateGoalModalVisible}
                onClose={() => setIsCreateGoalModalVisible(false)}
                project={project}
                onCreate={handleCreateGoal}
            />
        </View>
    );
}