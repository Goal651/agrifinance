import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useWorkers } from '@/contexts/WorkerContext';
import { Worker, CreateWorkerInput } from '@/types/worker';

type WorkerFormProps = {
    initialData?: Partial<Worker>;
    onSuccess?: () => void;
};

const WorkerForm: React.FC<WorkerFormProps> = ({ initialData, onSuccess }) => {
    const isEdit = !!initialData?.id;
    const router = useRouter();
    const { createWorker, updateWorker, loading } = useWorkers();

    const [formData, setFormData] = useState<CreateWorkerInput>({
        name: '',
        email: '',
        phoneNumber: '',
        skills: [],
    });

    const [currentSkill, setCurrentSkill] = useState('');
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                email: initialData.email || '',
                phoneNumber: initialData.phoneNumber || '',
                skills: initialData.skills || [],
            });
        }
    }, [initialData]);

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        if (!formData.name.trim()) {
            errors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email is invalid';
        }

        if (!formData.phoneNumber.trim()) {
            errors.phoneNumber = 'Phone number is required';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleAddSkill = () => {
        if (currentSkill.trim() && !formData.skills.includes(currentSkill.trim())) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, currentSkill.trim()],
            }));
            setCurrentSkill('');
        }
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill !== skillToRemove),
        }));
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            let response;

            if (isEdit && initialData?.id) {
                response = await updateWorker(initialData.id, formData);
            } else {
                response = await createWorker(formData);
            }

            if (response.success) {
                if (onSuccess) {
                    onSuccess();
                } else {
                    router.back();
                }
            } else {
                Alert.alert('Error', response.message || 'An error occurred');
            }
        } catch (error) {
            console.error('Error saving worker:', error);
            Alert.alert('Error', 'An unexpected error occurred');
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Full Name</Text>
                    <TextInput
                        style={[styles.input, formErrors.name && styles.inputError]}
                        value={formData.name}
                        onChangeText={(text) => setFormData({ ...formData, name: text })}
                        placeholder="Enter full name"
                        placeholderTextColor="#9ca3af"
                    />
                    {formErrors.name && <Text style={styles.errorText}>{formErrors.name}</Text>}
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={[styles.input, formErrors.email && styles.inputError]}
                        value={formData.email}
                        onChangeText={(text) => setFormData({ ...formData, email: text })}
                        placeholder="Enter email address"
                        placeholderTextColor="#9ca3af"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    {formErrors.email && <Text style={styles.errorText}>{formErrors.email}</Text>}
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Phone Number</Text>
                    <TextInput
                        style={[styles.input, formErrors.phoneNumber && styles.inputError]}
                        value={formData.phoneNumber}
                        onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
                        placeholder="Enter phone number"
                        placeholderTextColor="#9ca3af"
                        keyboardType="phone-pad"
                    />
                    {formErrors.phoneNumber && (
                        <Text style={styles.errorText}>{formErrors.phoneNumber}</Text>
                    )}
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Skills</Text>
                    <View style={styles.skillInputContainer}>
                        <TextInput
                            style={[styles.input, styles.skillInput]}
                            value={currentSkill}
                            onChangeText={setCurrentSkill}
                            placeholder="Add a skill"
                            placeholderTextColor="#9ca3af"
                            onSubmitEditing={handleAddSkill}
                            returnKeyType="done"
                        />
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={handleAddSkill}
                            disabled={!currentSkill.trim()}
                        >
                            <MaterialIcons name="add" size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.skillsContainer}>
                        {formData.skills.map((skill, index) => (
                            <View key={index} style={styles.skillTag}>
                                <Text style={styles.skillText}>{skill}</Text>
                                <TouchableOpacity
                                    onPress={() => handleRemoveSkill(skill)}
                                    style={styles.removeSkillButton}
                                >
                                    <MaterialIcons name="close" size={16} color="#15803d" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={() => router.back()}
                    disabled={loading}
                >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.submitButton, loading && styles.buttonDisabled]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.submitButtonText}>
                            {isEdit ? 'Update Worker' : 'Add Worker'}
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 100,
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontFamily: 'Poppins_500Medium',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
        fontFamily: 'Poppins_400Regular',
        color: '#1f2937',
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    inputError: {
        borderColor: '#ef4444',
    },
    errorText: {
        color: '#ef4444',
        fontSize: 12,
        marginTop: 4,
        fontFamily: 'Poppins_400Regular',
    },
    skillInputContainer: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    skillInput: {
        flex: 1,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        marginRight: 0,
    },
    addButton: {
        backgroundColor: '#22c55e',
        width: 48,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    skillTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 8,
        marginBottom: 8,
    },
    skillText: {
        fontSize: 14,
        fontFamily: 'Poppins_500Medium',
        color: '#15803d',
        marginRight: 4,
    },
    removeSkillButton: {
        marginLeft: 4,
    },
    footer: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    button: {
        flex: 1,
        padding: 16,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#f3f4f6',
        marginRight: 12,
    },
    submitButton: {
        backgroundColor: '#22c55e',
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    cancelButtonText: {
        color: '#4b5563',
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
    },
    submitButtonText: {
        color: 'white',
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
    },
});

export default WorkerForm;
