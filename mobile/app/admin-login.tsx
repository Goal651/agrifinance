import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const isValidEmail = (email: string) => /.+@.+\..+/.test(email);

    const handleLogin = () => {
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
        setTimeout(() => {
            setLoading(false);
            // Simulate successful admin login
            router.replace('/admin-dashboard');
        }, 1000);
    };

    return (
        <View className="flex-1 justify-center items-center bg-gray-50 px-4">
            <View className="bg-white rounded-xl shadow p-6 w-full max-w-md">
                <Text className="text-2xl font-bold text-green-700 text-center mb-1">Admin Portal</Text>
                <Text className="text-gray-500 text-center mb-4">Access the AgriFinance administration dashboard</Text>
                {/* Email */}
                <Text className="text-xs font-semibold text-gray-700 mb-1">Email</Text>
                <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2 bg-blue-50 mb-3">
                    <MaterialIcons name="mail" size={18} color="#2563eb" />
                    <TextInput
                        className="flex-1 text-base ml-2"
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>
                {/* Password */}
                <Text className="text-xs font-semibold text-gray-700 mb-1">Password</Text>
                <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-2 bg-blue-50 mb-3">
                    <MaterialIcons name="lock" size={18} color="#2563eb" />
                    <TextInput
                        className="flex-1 text-base ml-2"
                        placeholder="Password"
                        value={password}
                        onChangeText={t => { setPassword(t); if (error) setError(''); }}
                        secureTextEntry
                        autoCapitalize="none"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>
                {error ? <Text className="text-red-500 text-xs mb-2 text-center">{error}</Text> : null}
                <TouchableOpacity className="w-full bg-green-700 rounded-full py-3 mb-3" onPress={handleLogin} disabled={loading}>
                    <Text className="text-white text-center font-semibold text-base">Login as Administrator</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.replace('/')}>
                    <Text className="text-blue-700 text-center text-sm font-semibold">Return to User Login</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export const screen = {
    options: {
        headerShown: false,
    },
};
