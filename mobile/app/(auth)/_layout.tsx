import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function AuthLayout() {
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const token = await AsyncStorage.getItem('auth_token');
            if (token) {
                router.replace({ pathname: '/(tabs)' })
            }
        };

        checkAuth();
    }, [router]);

    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="signup"
                options={{
                    headerShown: false,
                }}
            />
        </Stack>
    );
}
