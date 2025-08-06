import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Header from '@/components/ui/Header';
import Input from '@/components/ui/Input';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useProject } from '@/contexts/ProjectContext';
import { useProjectAction } from '@/hooks/useProjectAction';


export default function NewProjectScreen() {
    const { loading } = useProject();
    const { createProject } = useProjectAction();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [showDobPicker, setShowDobPicker] = useState(false)
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [errors, setErrors] = useState<{ name?: string; description?: string; startDate?: string; }>({});

    const router = useRouter();

    const validateForm = () => {
        const newErrors: { name?: string; description?: string; startDate?: string; } = {};

        if (!name.trim()) {
            newErrors.name = 'Project name is required';
        }

        if (!description.trim()) {
            newErrors.description = 'Project description is required';
        }

        if (!endDate) {
            newErrors.startDate = 'Start date is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            await createProject({
                name: name.trim(),
                description: description.trim(),
                targetDate: endDate,
            });
            Toast.show({ type: 'success', text1: 'Project created successfully' });
            router.back();
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Failed to create project' });
        }
    };

    return (
        <View className="flex-1 bg-gray-50">
            <Toast />

            <Header
                title="Create New Project"
                subtitle="Start a new farming project"
                onBack={() => router.back()}
            />

            <View className="flex-1 px-8">
                <Card title="Project Information">
                    <Input
                        label="Project Name"
                        placeholder="Enter project name"
                        value={name}
                        onChangeText={setName}
                        icon="work"
                        required
                        error={errors.name}
                    />

                    <Input
                        label="Description"
                        placeholder="Describe your project"
                        value={description}
                        onChangeText={setDescription}
                        icon="description"
                        multiline
                        numberOfLines={4}
                        required
                        error={errors.description}
                    />

                    {/* Date of Birth */}
                    <View className="mb-4">
                        <Text className="text-gray-700 mb-2 font-medium">Date of Birth</Text>
                        <TouchableOpacity
                            className="border border-gray-300 rounded-md p-4"
                            onPress={() => setShowDobPicker(true)}
                        >
                            <Text className={endDate ? 'text-black' : 'text-gray-400'}>
                                {endDate.toLocaleDateString() || 'Tap to choose'}
                            </Text>
                        </TouchableOpacity>
                    </View>


                    {showDobPicker && <DateTimePicker
                        value={endDate}
                        onChange={(event: DateTimePickerEvent, date?: Date) => {
                            setShowDobPicker(false);
                            if (date) setEndDate(date);

                        }}
                        mode="date"
                        display="default"
                        minimumDate={new Date()}
                        maximumDate={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
                    />}

                    <Button
                        title="Create Project"
                        onPress={handleSubmit}
                        loading={loading}
                        size="large"
                        className="mb-6"
                    />
                </Card>
            </View>
        </View>
    );
}
