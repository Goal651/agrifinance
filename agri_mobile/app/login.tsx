import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';

import React, { useState } from 'react';
import { Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function LoginScreen() {
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
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
            // If we get here, login was successful and navigation was handled
        } catch (error) {
            console.error('Login failed:', error);
            setError( 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-gray-50 px-8 py-10">
            <Toast/>
            
            {/* Header */}
            <View className="flex-1 justify-center">
                {/* Logo */}
                <View className="mb-12 text-center">
                    <Text className="text-4xl font-bold text-green-700 text-center mb-3">AgriFinance</Text>
                    <Text className="text-gray-500 text-center text-lg">Agricultural Loans & Project Management</Text>
                </View>

                {/* Login Form */}
                <Card title="Welcome Back">
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
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        required
                    />

                    {error ? (
                        <View className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                            <Text className="text-red-600 text-base">{error}</Text>
                        </View>
                    ) : null}

                    <Button
                        title="Sign In"
                        onPress={handleLogin}
                        loading={loading}
                        size="large"
                        className="mb-6"
                    />

                    {/* Forgot Password */}
                    <View className="text-center mb-8">
                        <Text className="text-green-700 text-center text-base font-semibold">
                            Forgot Password?
                        </Text>
                    </View>
                </Card>

               
            </View>
        </View>
    );
}
