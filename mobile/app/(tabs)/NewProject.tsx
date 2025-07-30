import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Header from '@/components/ui/Header';
import Input from '@/components/ui/Input';
import { useProject } from '@/hooks/useProject';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function NewProjectScreen() {
    const { createProject, loading } = useProject();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
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

        if (!startDate.trim()) {
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
                startDate: startDate.trim(),
            });
            Toast.show({ type: 'success', text1: 'Project created successfully' });
            router.back();
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Failed to create project' });
        }
    };

    return (
        <View className="flex-1 bg-gray-50">
            <Toast/>
            
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

                    <Input
                        label="Start Date"
                        placeholder="YYYY-MM-DD"
                        value={startDate}
                        onChangeText={setStartDate}
                        icon="event"
                        required
                        error={errors.startDate}
                    />

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
