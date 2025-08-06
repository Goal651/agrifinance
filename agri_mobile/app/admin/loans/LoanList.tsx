import { View, Text, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { adminService } from '@/api/admin';
import { Loan, LoanStatus } from '@/types';

export default function LoanList() {
  const router = useRouter();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<LoanStatus | 'all'>('all');

  const statusOptions: { label: string; value: LoanStatus | 'all' }[] = [
    { label: 'All Loans', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' },
    { label: 'Disbursed', value: 'disbursed' },
    { label: 'Completed', value: 'completed' },
  ];

  const loadLoans = async () => {
    try {
      setError(null);
      const filters = statusFilter !== 'all' ? { status: statusFilter } : {};
      const response = await adminService.getLoans(filters);
      if (response.success) {
        setLoans(response.data.data);
      } else {
        setError(response.message || 'Failed to load loans');
      }
    } catch (err) {
      setError('An error occurred while loading loans');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadLoans();
  }, [statusFilter]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadLoans();
  };

  const getStatusColor = (status: LoanStatus) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'disbursed':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const renderLoanItem = ({ item }: { item: Loan }) => (
    <TouchableOpacity 
      className="bg-white p-4 border-b border-gray-100"
      onPress={() => router.push(`/admin/loans/${item.id}`)}
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="font-medium text-gray-900">
            {item.borrower?.firstName} {item.borrower?.lastName}
          </Text>
          <Text className="text-gray-500 text-sm mt-1">
            {item.loanNumber} • {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
        
        <View className="items-end">
          <Text className="font-semibold text-gray-900">
            {formatCurrency(item.amount)}
          </Text>
          <View className={`px-2 py-1 rounded-full mt-1 ${getStatusColor(item.status)}`}>
            <Text className="text-xs font-medium">
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>
      
      <View className="mt-3 pt-3 border-t border-gray-100">
        <View className="flex-row justify-between">
          <View>
            <Text className="text-xs text-gray-500">Term</Text>
            <Text className="text-sm text-gray-900">{item.term} months</Text>
          </View>
          <View className="items-end">
            <Text className="text-xs text-gray-500">Interest Rate</Text>
            <Text className="text-sm text-gray-900">{item.interestRate}%</Text>
          </View>
          <View className="items-end">
            <Text className="text-xs text-gray-500">Monthly</Text>
            <Text className="text-sm text-gray-900">
              {formatCurrency(item.monthlyPayment || 0)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <MaterialIcons name="error-outline" size={48} color="#EF4444" />
        <Text className="text-red-500 text-lg mt-4 text-center">{error}</Text>
        <TouchableOpacity 
          className="mt-4 bg-blue-500 px-4 py-2 rounded-lg"
          onPress={loadLoans}
        >
          <Text className="text-white font-medium">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Status Filter Tabs */}
      <View className="bg-white px-4 py-2 border-b border-gray-200">
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="py-2"
        >
          {statusOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              className={`px-4 py-2 rounded-full mr-2 ${
                statusFilter === option.value
                  ? 'bg-blue-100'
                  : 'bg-gray-100'
              }`}
              onPress={() => setStatusFilter(option.value)}
            >
              <Text
                className={`text-sm font-medium ${
                  statusFilter === option.value
                    ? 'text-blue-700'
                    : 'text-gray-700'
                }`}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      {/* Loan List */}
      <FlatList
        data={loans}
        renderItem={renderLoanItem}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListHeaderComponent={
          <View className="px-4 py-3 bg-gray-50">
            <Text className="text-sm text-gray-500">
              {loans.length} {loans.length === 1 ? 'loan' : 'loans'} found
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center p-8">
            <MaterialIcons name="receipt-long" size={48} color="#9CA3AF" />
            <Text className="text-gray-500 mt-4 text-center">
              No loans found. {statusFilter !== 'all' ? 'Try changing the filter' : ''}
            </Text>
          </View>
        }
      />
    </View>
  );
}
