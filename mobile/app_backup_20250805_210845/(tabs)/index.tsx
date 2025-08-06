import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View, Platform } from 'react-native';
import Button from '@/components/ui/Button';
import { ArrowRightIcon, ArrowRightOnRectangleIcon } from 'react-native-heroicons/outline';

interface ServiceCard {
  title: string;
  description: string;
  image: string;
  action: string;
  route: string;
  variant: 'primary' | 'outline';
  icon: string;
}

export default function TabsHome() {
  const router = useRouter();
  
  const services: ServiceCard[] = [
    {
      title: 'Loan Services',
      description: 'Access agricultural loans with transparent terms and an easy application process. Get the financial support you need for your farming projects.',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
      action: 'Access Loans',
      route: '/(tabs)/loan-services',
      variant: 'primary',
      icon: '💰'
    },
    {
      title: 'Project Services',
      description: 'Plan, track, and manage your farming projects with goals and activities. Stay organized and achieve your agricultural objectives.',
      image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
      action: 'Manage Projects',
      route: '/(tabs)/project-services',
      variant: 'outline',
      icon: '🌱'
    }
  ];

  const cardShadow = Platform.select({
    ios: 'shadow-lg shadow-black/10',
    android: 'elevation-5',
  });

  const iconShadow = Platform.select({
    ios: 'shadow-sm shadow-black/10',
    android: 'elevation-3',
  });

  return (
    <View className="flex-1 bg-emerald-50">
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
        <View className="px-6 pt-6 pb-4">
          <Text className="text-3xl font-semibold text-emerald-900 mb-1">
            Welcome Back! 👋
          </Text>
          <Text className="text-base text-emerald-800/80">
            Manage your agricultural projects and finances
          </Text>
        </View>

        <View className="px-4 mb-6">
          {services.map((service, index) => (
            <TouchableOpacity 
              key={index}
              onPress={() => router.push(service.route as any)}
              activeOpacity={0.9}
              className={`mb-5 mx-1 rounded-2xl overflow-hidden ${cardShadow}`}
            >
              <View className="bg-white/30 rounded-2xl border border-white/50 overflow-hidden">
                <View className="relative">
                  <Image
                    source={{ uri: service.image }}
                    className="w-full h-48"
                    resizeMode="cover"
                  />
                  <View className={`absolute top-4 right-4 bg-white/90 w-12 h-12 rounded-xl items-center justify-center ${iconShadow}`}>
                    <Text className="text-2xl">{service.icon}</Text>
                  </View>
                </View>
                
                <View className="p-5">
                  <Text className="text-xl font-semibold text-emerald-900 mb-2">
                    {service.title}
                  </Text>
                  <Text className="text-sm text-emerald-900/80 mb-5 leading-5">
                    {service.description}
                  </Text>
                  
                  <View className="flex-row items-center justify-between">
                    <Button
                      title={service.action}
                      onPress={() => router.push(service.route as any)}
                      variant={service.variant}
                      size="medium"
                      className={service.variant === 'primary' ? 'flex-1' : 'flex-1 bg-white/70 border-emerald-200'}
                    />
                    <View className={`w-10 h-10 rounded-xl items-center justify-center ml-3 ${
                      service.variant === 'primary' 
                        ? 'bg-emerald-500/15' 
                        : 'bg-white/70 border border-emerald-200'
                    }`}>
                      <ArrowRightIcon
                        size={18} 
                      />
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View className="px-6 mb-10 mt-2">
          <TouchableOpacity 
            onPress={() => router.push('/login')}
            className="flex-row items-center justify-between bg-white/70 p-4 rounded-xl border border-red-100"
            activeOpacity={0.8}
          >
            <View className="flex-row items-center">
              <View className="bg-red-50 p-2.5 rounded-lg">
                <ArrowRightOnRectangleIcon size={20} />
              </View>
              <Text className="text-red-700 ml-3 font-semibold">Sign Out</Text>
            </View>
            <View className="bg-red-50 p-1.5 rounded-lg">
              <ArrowRightIcon size={16} />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

export const screen = {
  options: {
    headerShown: false,
  },
};