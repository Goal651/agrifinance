import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Header from '@/components/ui/Header';

export default function SignupScreen() {
    const { signup, loading } = useAuth();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const isValidEmail = (email: string) => /.+@.+\..+/.test(email);
    const isValidPassword = (password: string) => password.length >= 6;

    const validateForm = () => {
        if (!firstName.trim() || !lastName.trim() || !email.trim() || !password || !confirmPassword) {
            setError('Please fill in all fields');
            return false;
        }
        if (!isValidEmail(email)) {
            setError('Please enter a valid email address');
            return false;
        }
        if (!isValidPassword(password)) {
            setError('Password must be at least 6 characters long');
            return false;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        setError('');
        return true;
    };

    const handleSignup = async () => {
        if (!validateForm()) return;
        
        try {
            await signup({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim(),
                password: password
            });
        } catch (error) {
            setError('Signup failed. Please try again.');
        }
    };

    return (
        <View className="flex-1 bg-gray-50">
            <Toast/>
            
            <Header
                title="Create Account"
                subtitle="Join AgriFinance today"
                onBack={() => router.back()}
            />

            <View className="flex-1 px-8">
                <Card title="Personal Information">
                    <Input
                        label="First Name"
                        placeholder="Enter your first name"
                        value={firstName}
                        onChangeText={setFirstName}
                        icon="person"
                        required
                    />

                    <Input
                        label="Last Name"
                        placeholder="Enter your last name"
                        value={lastName}
                        onChangeText={setLastName}
                        icon="person"
                        required
                    />

                    <Input
                        label="Email Address"
                        placeholder="Enter your email"
                        value={email}
                        onChangeText={setEmail}
                        icon="mail"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        required
                    />

                    <Input
                        label="Password"
                        placeholder="Enter your password"
                        value={password}
                        onChangeText={setPassword}
                        icon="lock"
                        secureTextEntry
                        autoCapitalize="none"
                        required
                    />

                    <Input
                        label="Confirm Password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        icon="lock"
                        secureTextEntry
                        autoCapitalize="none"
                        required
                    />

                    {error ? (
                        <View className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                            <Text className="text-red-600 text-base">{error}</Text>
                        </View>
                    ) : null}

                    <Button
                        title="Create Account"
                        onPress={handleSignup}
                        loading={loading}
                        size="large"
                        className="mb-6"
                    />
                </Card>

                {/* Login Link */}
                <View className="text-center mb-8">
                    <Text className="text-gray-500 text-center text-base">
                        Already have an account?{' '}
                        <Text 
                            className="text-green-700 font-semibold"
                            onPress={() => router.back()}
                        >
                            Sign In
                        </Text>
                    </Text>
                </View>
            </View>
        </View>
    );
}

export const screen = {
    options: {
        headerShown: false,
    },
}; 