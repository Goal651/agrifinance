import { useLoan } from '@/hooks/useLoan';
import { MaterialIcons } from '@expo/vector-icons';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function LoanPayments() {
  const { currentLoan } = useLoan();

  // Calculate paid and remaining amounts from payments
  const paidAmount = currentLoan?.payments
    ? currentLoan.payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0)
    : 0;
  const totalLoanAmount = currentLoan?.details.amount || 0;
  const remaining = totalLoanAmount - paidAmount;

  return (
    <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={true}>
      <View className="px-3 pt-5">
        <Text className="text-xl font-bold mb-2">Welcome, Farmer</Text>
        <Text className="text-gray-500 mb-6">Access agricultural financing with ease</Text>
        <View className="bg-white rounded-xl shadow p-4 border border-gray-100">
          <Text className="font-bold text-base mb-4">Payment Schedule</Text>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-500 font-semibold">Date</Text>
            <Text className="text-gray-500 font-semibold">Amount</Text>
            <Text className="text-gray-500 font-semibold">Status</Text>
          </View>
          {currentLoan?.payments?.map((item, idx) => (
            <View key={idx} className="flex-row justify-between items-center mb-2">
              <Text className="text-base text-gray-800" style={{ minWidth: 90 }}>{new Date(item.dueDate).toLocaleDateString()}</Text>
              <Text className="text-base text-gray-800">${item.amount.toLocaleString()}</Text>
              {item.status === 'Paid' ? (
                <Text className="text-xs bg-green-400 text-white px-2 py-1 rounded-full font-semibold">Paid</Text>
              ) : item.status === 'Upcoming' ? (
                <Text className="text-xs bg-orange-400 text-white px-2 py-1 rounded-full font-semibold">Upcoming</Text>
              ) : (
                <Text className="text-xs bg-gray-300 text-gray-700 px-2 py-1 rounded-full font-semibold">Scheduled</Text>
              )}
            </View>
          ))}
          <View className="flex-row justify-between mt-4 mb-2">
            <View className="items-center">
              <Text className="text-xs text-gray-500">Total Loan Amount</Text>
              <Text className="text-green-700 font-bold text-lg">${totalLoanAmount.toLocaleString()}</Text>
            </View>
            <View className="items-center">
              <Text className="text-xs text-gray-500">Paid Amount</Text>
              <Text className="text-green-700 font-bold text-lg">${paidAmount.toLocaleString()}</Text>
            </View>
            <View className="items-center">
              <Text className="text-xs text-gray-500">Remaining</Text>
              <Text className="text-green-700 font-bold text-lg">${remaining.toLocaleString()}</Text>
            </View>
          </View>
          <View className="flex-row justify-center mt-2">
            <TouchableOpacity className="flex-row items-center justify-center bg-green-700 rounded-full px-6 py-2" style={{ minWidth: 160 }}>
              <MaterialIcons name="payments" size={20} color="white" style={{ marginRight: 6 }} />
              <Text className="text-white font-bold text-base">Make Payment</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
