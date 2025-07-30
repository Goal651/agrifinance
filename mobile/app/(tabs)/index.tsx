import { useRouter } from 'expo-router';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function TabsHome() {
    const router = useRouter();
    return (
        <ScrollView className="flex-1 bg-white px-4 pt-8">
            <Text className="text-center text-gray-500 mb-1">Welcome to</Text>
            <Text className="text-center text-2xl font-bold text-green-700 mb-1">AgriFinance</Text>
            <Text className="text-center text-gray-500 mb-4">Choose a service to get started</Text>

            {/* Loan Services Card */}
            <View className="bg-white rounded-xl shadow pb-3 mb-5">
                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80' }}
                    className="w-full h-44 rounded-lg mb-3"
                    resizeMode="cover"
                />
                <Text className="font-bold text-lg mb-1 px-3">Loan Services</Text>
                <Text className="text-gray-500 mb-3 text-sm px-3">
                    Access agricultural loans with transparent terms and easy application process
                </Text>
                <View className="flex justify-center items-center w-full px-3">
                    <TouchableOpacity className="bg-green-700 rounded-lg py-2 px-3 mb-3 w-full" onPress={() => { router.push('/loan-services'); }}>
                        <Text className="text-white text-center font-semibold">Access Loans</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Project Services Card */}
            <View className="bg-white rounded-xl pb-3 mb-5">
                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80' }}
                    className="w-full h-48 rounded-lg mb-3"
                    resizeMode="cover"
                />
                <Text className="font-bold text-lg mb-1 px-3">Project Services</Text>
                <Text className="text-gray-500 mb-3 text-sm px-3">
                    Plan, track, and manage your farming projects with goals and activities
                </Text>
                <View className="flex justify-center items-center w-full px-3">
                    <TouchableOpacity className="bg-blue-600 rounded-lg py-2 w-full px-3" onPress={() => { router.push('/(tabs)/project-services'); }}>
                        <Text className="text-white text-center font-semibold">Manage Projects</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

export const screen = {
    options: {
        headerShown: false,
    },
};
