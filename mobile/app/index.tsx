import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { EnvelopeIcon, EyeIcon, LockClosedIcon } from 'react-native-heroicons/outline';
import Toast from 'react-native-toast-message';

export default function LoginScreen() {
    const { login } = useAuth()
    const [showPassword, setShowPassword] = useState(false);
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
        await login({ email, password })
        setLoading(true);
        setLoading(false)

    };

    return (
        <View className="flex-1 justify-center items-center bg-gray-50 px-6">
            <Toast/>
            {/* Logo */}
            <View className="mb-6">


                <Text className="text-3xl font-bold text-green-700 text-center">AgriFinance</Text>
                <Text className="text-gray-500 text-center mt-1">Agricultural Loans & Project Management</Text>
            </View>

            {/* Email Input */}
            <View className="w-full mb-4">
                <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-1 bg-white">
                    <EnvelopeIcon size={20} color="#9CA3AF" className="mr-2" />
                    <TextInput
                        className="flex-1 text-base"
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>
            </View>

            {/* Password Input */}
            <View className="w-full mb-4">
                <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-1 bg-white">
                    <LockClosedIcon size={20} color="#9CA3AF" className="mr-2" />
                    <TextInput
                        className="flex-1 text-base"
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        placeholderTextColor="#9CA3AF"
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <EyeIcon size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>
            </View>
            {error ? <Text className="text-red-500 text-xs mb-2 text-center">{error}</Text> : null}
            {/* Login Button */}
            <TouchableOpacity
                className={`w-full bg-green-700 rounded-2xl py-3 mb-3 ${loading ? 'opacity-60' : ''}`}
                onPress={handleLogin}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text className="text-white text-center font-semibold text-base">Login</Text>
                )}
            </TouchableOpacity>


            {/* Forgot Password */}
            <TouchableOpacity className="mb-6" onPress={() => { }}>
                <Text className="text-green-700 text-center text-sm">Forgot Password?</Text>
            </TouchableOpacity>

            {/* Sign Up Link */}
            <Text className="text-gray-500 text-center text-sm">
                Don&apos;t have an account?{' '}
                <Text className="text-green-700 font-semibold">Sign Up</Text>
            </Text>
            <TouchableOpacity className="mt-20" onPress={() => router.push('/admin-login')}>
                <Text className="text-blue-700 text-center text-sm font-semibold">Login as Admin</Text>
            </TouchableOpacity>
        </View>
    );
}
