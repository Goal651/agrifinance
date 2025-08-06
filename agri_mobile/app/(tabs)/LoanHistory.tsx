import { View, Text, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useLoan } from '@/contexts/LoanContext';



export default function LoanHistory() {
  const { loans } = useLoan();
  const totalLoans = loans.reduce((sum, item) => sum + item.amount, 0);

  return (
    <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={true}>
      <View className="px-3 pt-5">
        <Text className="text-xl font-bold mb-1">Welcome, Farmer</Text>
        <Text className="text-gray-500 mb-3">Access agricultural financing with ease</Text>
        <View className="bg-white rounded-xl shadow p-4 border border-gray-100">
          <Text className="font-bold text-base mb-4">Loan History</Text>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-500 font-semibold w-1/2">Type</Text>
            <Text className="text-gray-500 font-semibold w-1/4 text-center">Amount</Text>
            <Text className="text-gray-500 font-semibold w-1/4 text-center">Status</Text>
          </View>
          {loans.map((item, idx) => (
            <View key={idx} className="flex-row items-center mb-1 py-1 border-b border-gray-100 last:border-b-0">
              <Text className="text-base text-gray-800 w-1/2" numberOfLines={1} ellipsizeMode="tail">{item.details.name}</Text>
              <Text className="text-base text-gray-800 w-1/4 text-center">${item.amount.toLocaleString()}</Text>
              <View className="w-1/4 flex-row justify-center">
                {item.status === 'PAID' ? (
                  <View className="flex-row items-center">
                    <MaterialIcons name="check-circle" size={16} color="#22c55e" style={{ marginRight: 2 }} />
                    <Text className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">Completed</Text>
                  </View>
                ) : (
                  <View className="flex-row items-center">
                    <MaterialIcons name="sync" size={16} color="#2563eb" style={{ marginRight: 2 }} />
                    <Text className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">Active</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
          <View className="border-t border-gray-200 my-2" />
          <View className="flex-row items-center mt-2">
            <MaterialIcons name="account-balance" size={24} color="#15803d" />
            <View className="ml-2 flex-1">
              <Text className="font-semibold text-gray-700">Total Loans</Text>
              <Text className="text-xs text-gray-500">Lifetime borrowing history</Text>
            </View>
            <Text className="text-green-700 font-bold text-lg">${totalLoans.toLocaleString()}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
