import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Header from '@/components/ui/Header';

export default function AdminLoginScreen() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const isValidEmail = (email: string) => /.+@.+\..+/.test(email);

    const handleLogin = async () => {
        setError('');
        if (!email || !password) {
            setError('Please enter email and password');
            return;
        }
        if (!isValidEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }
        setLoading(true);
        try {
            await login({ email, password });
        } catch (error) {
            setError('Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-gray-50">
            <Toast/>
            
            <Header
                title="Admin Login"
                subtitle="Access admin dashboard"
                onBack={() => router.back()}
            />

            <View className="flex-1 px-8">
                <Card title="Admin Access">
                    <Input
                        label="Email Address"
                        placeholder="Enter admin email"
                        value={email}
                        onChangeText={setEmail}
                        icon="mail"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        required
                    />

                    <Input
                        label="Password"
                        placeholder="Enter admin password"
                        value={password}
                        onChangeText={setPassword}
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
                        title="Admin Sign In"
                        onPress={handleLogin}
                        loading={loading}
                        size="large"
                        className="mb-6"
                    />
                </Card>

                {/* Back to User Login */}
                <View className="text-center mb-8">
                    <Text className="text-gray-500 text-center text-base">
                        Not an admin?{' '}
                        <Text 
                            className="text-green-700 font-semibold"
                            onPress={() => router.back()}
                        >
                            User Login
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
