import { useProject } from '@/contexts/ProjectContext';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Picker } from '@react-native-picker/picker'
export default function NewTask() {
    const { workers } = useProject();
    const [taskName, setTaskName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedWorker, setSelectedWorker] = useState(workers.length > 0 ? workers[0].id : '');

    const handleAddTask = () => {
        // Logic to add a new task
        console.log('Task added:', { taskName, description, selectedWorker });
    };

    return (
        <View className="flex-1 bg-gradient-to-b from-gray-50 to-gray-100 px-4 py-6">
            <Text className="text-lg font-semibold text-blue-700 mb-4">Add New Task</Text>

            <View className="mb-4">
                <Text className="text-gray-700 mb-2">Task Name</Text>
                <TextInput
                    className="border border-gray-300 rounded px-3 py-2"
                    placeholder="Enter task name"
                    value={taskName}
                    onChangeText={setTaskName}
                />
            </View>

            <View className="mb-4">
                <Text className="text-gray-700 mb-2">Description</Text>
                <TextInput
                    className="border border-gray-300 rounded px-3 py-2"
                    placeholder="Enter task description"
                    value={description}
                    onChangeText={setDescription}
                />
            </View>

            <View className="mb-4">
                <Text className="text-gray-700 mb-2">Assign Worker</Text>
                <Picker
                    selectedValue={selectedWorker}
                    onValueChange={(itemValue) => setSelectedWorker(itemValue)}
                    className="border border-gray-300 rounded px-3 py-2"
                >
                    {workers.map((worker) => (
                        <Picker.Item key={worker.id} label={worker.names} value={worker.id} />
                    ))}
                </Picker>
            </View>

            <TouchableOpacity
                className="bg-blue-700 rounded px-6 py-3 flex-row items-center justify-center shadow-lg"
                onPress={handleAddTask}
            >
                <MaterialIcons name="add" size={22} color="white" />
                <Text className="text-white font-bold ml-2">Add Task</Text>
            </TouchableOpacity>
        </View>
    );
}
