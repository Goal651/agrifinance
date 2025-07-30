import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Header from '@/components/ui/Header';
import { useRouter } from 'expo-router';
import { Image, ScrollView, Text, View } from 'react-native';

export default function TabsHome() {
    const router = useRouter();
    
    return (
        <View className="flex-1 bg-gray-50">
            <Header
                title="AgriFinance"
                subtitle="Agricultural Loans & Project Management"
                showBack={false}
            />

            <ScrollView className="flex-1 px-8" showsVerticalScrollIndicator={false}>
                <Text className="text-center text-gray-500 mb-8 text-lg">Choose a service to get started</Text>

                {/* Loan Services Card */}
                <Card title="Loan Services" className="mb-8">
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80' }}
                        className="w-full h-48 rounded-2xl mb-6"
                        resizeMode="cover"
                    />
                    <Text className="text-gray-600 mb-6 text-base leading-6">
                        Access agricultural loans with transparent terms and easy application process. 
                        Get the financial support you need for your farming projects.
                    </Text>
                    <Button
                        title="Access Loans"
                        onPress={() => router.push('/loan-services')}
                        size="large"
                    />
                </Card>

                {/* Project Services Card */}
                <Card title="Project Services" className="mb-8">
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80' }}
                        className="w-full h-48 rounded-2xl mb-6"
                        resizeMode="cover"
                    />
                    <Text className="text-gray-600 mb-6 text-base leading-6">
                        Plan, track, and manage your farming projects with goals and activities. 
                        Stay organized and achieve your agricultural objectives.
                    </Text>
                    <Button
                        title="Manage Projects"
                        onPress={() => router.push('/(tabs)/project-services')}
                        variant="outline"
                        size="large"
                    />
                </Card>
            </ScrollView>
        </View>
    );
}

export const screen = {
    options: {
        headerShown: false,
    },
};
