import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

const projectTypes = [
    { label: 'Crop Farming', icon: <FontAwesome5 name="seedling" size={16} color="#2563eb" /> },
    { label: 'Livestock', icon: <FontAwesome5 name="horse-head" size={16} color="#2563eb" /> },
    { label: 'Agroforestry', icon: <MaterialIcons name="park" size={16} color="#2563eb" /> },
    { label: 'Aquaculture', icon: <MaterialIcons name="waves" size={16} color="#2563eb" /> },
];

export default function NewProject({ navigation }) {
    const [name, setName] = useState('');
    const [type, setType] = useState(projectTypes[0].label);
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [location, setLocation] = useState('');
    const [budget, setBudget] = useState('');
    const [team, setTeam] = useState('');
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [showTypeDropdown, setShowTypeDropdown] = useState(false);

    const validate = () => {
        const errs = {};
        if (!name) errs.name = 'Project name is required';
        if (!description) errs.description = 'Project description is required';
        if (!startDate) errs.startDate = 'Start date is required';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;
        setSuccess(true);
        setTimeout(() => {
            setSuccess(false);
            // Optionally navigate back or clear form
            if (navigation && navigation.goBack) navigation.goBack();
        }, 1500);
    };
    const router = useRouter();
    return (
        <ScrollView className="flex-1 bg-white px-4 pt-6 pb-10">

            <View className='flex flex-row items-center py-6'>
              <TouchableOpacity onPress={() => {
                  router.back();
        }}
      ><Text><MaterialIcons name='arrow-back' size={18} color="#9CA3AF" /></Text></TouchableOpacity>
         <Text className="flex-1 text-xl font-bold text-blue-700 text-center mb-2">New Project</Text>
      </View>
            <View className="bg-blue-100 rounded-lg px-3 py-6 mb-4">
                <Text className="text-xs text-blue-900">Create a new agricultural project to track your farming activities, set goals, and monitor progress.</Text>
            </View>
            {/* Basic Information */}
            <Text className="font-bold text-gray-700 mb-2">Basic Information</Text>
            <View className={`flex-row items-center border rounded-md px-3 py-2 mb-3 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}>
                <MaterialIcons name="label" size={18} color="#9CA3AF" />
                <TextInput
                    className="flex-1 text-base ml-2"
                    placeholder="Project Name"
                    value={name}
                    onChangeText={setName}
                />
            </View>
            {errors.name && <Text className="text-red-500 text-xs mb-2">{errors.name}</Text>}
            <Text className="font-semibold mb-1">Project Type</Text>
            <TouchableOpacity className="flex-row items-center border border-gray-300 rounded-md px-3 py-4 bg-white mb-3" onPress={() => setShowTypeDropdown(!showTypeDropdown)}>
                {projectTypes.find(t => t.label === type)?.icon}
                <Text className="flex-1 text-base ml-2">{type}</Text>
                <MaterialIcons name={showTypeDropdown ? 'expand-less' : 'expand-more'} size={18} color="#9CA3AF" />
            </TouchableOpacity>
            {showTypeDropdown && (
                <View className="mb-3 bg-white border border-gray-300 rounded-md">
                    {projectTypes.map(t => (
                        <TouchableOpacity key={t.label} className="flex-row items-center px-3 py-2" onPress={() => { setType(t.label); setShowTypeDropdown(false); }}>
                            {t.icon}
                            <Text className="ml-2 text-base">{t.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
            <View className={`border rounded-md px-3 py-2 mb-1 ${errors.description ? 'border-red-500' : 'border-gray-300'} bg-white flex-row items-center`}>
                <MaterialIcons name="description" size={18} color="#9CA3AF" />
                <TextInput
                    className="flex-1 text-base ml-2"
                    placeholder="Description"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                />
            </View>
            {errors.description && <Text className="text-red-500 text-xs mb-2">{errors.description}</Text>}
            {/* Dates & Location */}
            <Text className="font-bold text-gray-700 mb-2 mt-4">Dates & Location</Text>
            <View className={`flex-row items-center border rounded-md px-3 py-2 mb-3 ${errors.startDate ? 'border-red-500' : 'border-gray-300'}`}>
                <MaterialIcons name="event" size={18} color="#9CA3AF" />
                <TextInput
                    className="flex-1 text-base ml-2"
                    placeholder="Start Date"
                    value={startDate}
                    onChangeText={setStartDate}
                />
            </View>
            {errors.startDate && <Text className="text-red-500 text-xs mb-2">{errors.startDate}</Text>}
            <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2 mb-3">
                <MaterialIcons name="event-available" size={18} color="#9CA3AF" />
                <TextInput
                    className="flex-1 text-base ml-2"
                    placeholder="Expected End Date (Optional)"
                    value={endDate}
                    onChangeText={setEndDate}
                />
            </View>
            <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2 mb-3">
                <MaterialIcons name="location-on" size={18} color="#9CA3AF" />
                <TextInput
                    className="flex-1 text-base ml-2"
                    placeholder="Location"
                    value={location}
                    onChangeText={setLocation}
                />
            </View>
            {/* Budget & Team */}
            <Text className="font-bold text-gray-700 mb-2 mt-4">Budget & Team</Text>
            <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2 mb-3">
                <MaterialIcons name="attach-money" size={18} color="#9CA3AF" />
                <TextInput
                    className="flex-1 text-base ml-2"
                    placeholder="Budget (Optional)"
                    value={budget}
                    onChangeText={setBudget}
                />
            </View>
            <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2 mb-6">
                <FontAwesome5 name="users" size={16} color="#9CA3AF" />
                <TextInput
                    className="flex-1 text-base ml-2"
                    placeholder="Team Members (Optional)"
                    value={team}
                    onChangeText={setTeam}
                />
            </View>
            <TouchableOpacity className="w-full bg-blue-700 rounded-full py-3 mb-6" onPress={handleSubmit}>
                <Text className="text-white text-center font-semibold text-base">Create Project</Text>
            </TouchableOpacity>
            {success && (
                <View className="bg-green-100 rounded-lg p-3 mb-4">
                    <Text className="text-green-700 text-center font-semibold">Project created successfully!</Text>
                </View>
            )}
            <View className='py-5'><Text></Text></View>
        </ScrollView>
    );
}
