import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { adminService } from '@/api/admin';
import { CreateUser, UpdateUserInput, User } from '@/types';

type UserFormProps = {
    isEdit?: boolean;
    initialData?: Partial<User>;
};

export default function UserForm({ isEdit = false, initialData }: UserFormProps) {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id?: string }>();

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<CreateUser>({
        firstName: '',
        lastName: '',
        email: '',
        role: 'USER',
        password: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});


    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!isEdit && !formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password && formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setSubmitting(true);
        setError(null);

        try {
            if (isEdit && id) {
                const updateData: UpdateUserInput = {
                    id,
                    ...formData,
                    // Don't update password if not changed
                    password: formData.password ,
                };

                const res = await adminService.updateUser(updateData);
                if (res.success) {
                    Alert.alert('Success', 'User updated successfully');
                    router.back();
                } else {
                    setError(res.message || 'Failed to update user');
                }
            } else {
                const res = await adminService.createUser(formData);
                if (res.success) {
                    Alert.alert('Success', 'User created successfully');
                    router.back();
                } else {
                    setError(res.message || 'Failed to create user');
                }
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (field: keyof CreateUser, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: '',
            }));
        }
    };


    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView className="flex-1 p-4">
                <View className="bg-white rounded-lg p-4 mb-4">
                    <Text className="text-lg font-semibold mb-4">
                        {isEdit ? 'Edit User' : 'Add New User'}
                    </Text>

                    {error && (
                        <View className="bg-red-50 p-3 rounded-md mb-4">
                            <Text className="text-red-700">{error}</Text>
                        </View>
                    )}

                    <View className="mb-4">
                        <Text className="text-sm font-medium text-gray-700 mb-1">
                            First Name <Text className="text-red-500">*</Text>
                        </Text>
                        <TextInput
                            className={`border rounded-lg px-3 py-2 ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                            value={formData.firstName}
                            onChangeText={(text) => handleChange('firstName', text)}
                            placeholder="Enter first name"
                        />
                        {errors.firstName && (
                            <Text className="text-red-500 text-xs mt-1">{errors.firstName}</Text>
                        )}
                    </View>

                    <View className="mb-4">
                        <Text className="text-sm font-medium text-gray-700 mb-1">
                            Last Name <Text className="text-red-500">*</Text>
                        </Text>
                        <TextInput
                            className={`border rounded-lg px-3 py-2 ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                            value={formData.lastName}
                            onChangeText={(text) => handleChange('lastName', text)}
                            placeholder="Enter last name"
                        />
                        {errors.lastName && (
                            <Text className="text-red-500 text-xs mt-1">{errors.lastName}</Text>
                        )}
                    </View>

                    <View className="mb-4">
                        <Text className="text-sm font-medium text-gray-700 mb-1">
                            Email <Text className="text-red-500">*</Text>
                        </Text>
                        <TextInput
                            className={`border rounded-lg px-3 py-2 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                            value={formData.email}
                            onChangeText={(text) => handleChange('email', text)}
                            placeholder="Enter email address"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            editable={!isEdit}
                        />
                        {errors.email && (
                            <Text className="text-red-500 text-xs mt-1">{errors.email}</Text>
                        )}
                    </View>

                    <View className="mb-4">
                        <Text className="text-sm font-medium text-gray-700 mb-1">
                            Role <Text className="text-red-500">*</Text>
                        </Text>
                        <View
                            className={`border rounded-lg px-3 py-2 ${errors.role ? 'border-red-500' : 'border-gray-300'
                                }`}
                        >
                            <Text className="text-gray-700">
                                {formData.role || 'Select a role'}
                            </Text>
                        </View>
                        {errors.role && (
                            <Text className="text-red-500 text-xs mt-1">{errors.role}</Text>
                        )}
                    </View>

                    {!isEdit && (
                        <View className="mb-4">
                            <Text className="text-sm font-medium text-gray-700 mb-1">
                                Password <Text className="text-red-500">*</Text>
                            </Text>
                            <TextInput
                                className={`border rounded-lg px-3 py-2 ${errors.password ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                value={formData.password}
                                onChangeText={(text) => handleChange('password', text)}
                                placeholder="Enter password"
                                secureTextEntry
                            />
                            {errors.password ? (
                                <Text className="text-red-500 text-xs mt-1">
                                    {errors.password}
                                </Text>
                            ) : (
                                <Text className="text-gray-500 text-xs mt-1">
                                    Minimum 8 characters
                                </Text>
                            )}
                        </View>
                    )}

                </View>
            </ScrollView>

            <View className="p-4 border-t border-gray-200 bg-white">
                <TouchableOpacity
                    className={`bg-blue-500 py-3 rounded-lg items-center ${submitting ? 'opacity-70' : ''
                        }`}
                    onPress={handleSubmit}
                    disabled={submitting}
                >
                    {submitting ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white font-medium">
                            {isEdit ? 'Update User' : 'Create User'}
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}
