import React from 'react';
import { ScrollView, Text, View } from 'react-native';

export default function WorkersTab({ workers }: { workers: { id: string; names: string; email: string; phoneNumber: string }[] }) {
  return (
    <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 80 }} showsVerticalScrollIndicator={true}>
      <View className="px-3 pt-5">
        <Text className="text-xl font-bold mb-1">Manage your agricultural projects</Text>
        {/* Workers Table */}
        <View className="bg-white rounded-xl shadow p-2 mb-4 border border-gray-100">
          <View className="flex-row px-2 py-2 border-b border-gray-200">
            <Text className="w-2/6 text-xs font-semibold text-gray-500">Worker</Text>
            <Text className="w-2/6 text-xs font-semibold text-gray-500">Email</Text>
            <Text className="w-1/6 text-xs font-semibold text-gray-500">Phone</Text>
          </View>
          {workers.map((worker, idx) => (
            <View key={worker.id || idx} className="flex-row items-center px-2 py-2 border-b border-gray-100 last:border-b-0">
              <Text className="w-2/6 text-gray-800" numberOfLines={1}>{worker.names}</Text>
              <Text className="w-2/6 text-gray-800" numberOfLines={1}>{worker.email}</Text>
              <Text className="w-1/6 text-gray-800 text-xs">{worker.phoneNumber}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
