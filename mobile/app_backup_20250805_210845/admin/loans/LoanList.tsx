import { View, Text, TouchableOpacity, ActivityIndicator, FlatList, ScrollView, RefreshControl } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState, useCallback, useEffect } from 'react';
import { adminService } from '@/api/admin';
import { Loan, LoanStatus } from '@/types/loan';

export default function LoanList() {
  const router = useRouter();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<LoanStatus | 'all'>('all');

  const statusOptions: { label: string; value: LoanStatus | 'all' }[] = [
    { label: 'All Loans', value: 'all' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Approved', value: 'APPROVED' },
    { label: 'Rejected', value: 'REJECTED' },
    { label: 'Paid', value: 'PAID' },
  ];

  const loadLoans = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminService.getLoans();
      // Handle different response formats
      const loansData = Array.isArray(response) ? response :
        (response?.data ? (Array.isArray(response.data) ? response.data : []) : []);
      setLoans(loansData);
      setError(null);
    } catch (err) {
      setError('Failed to load loans. Please try again.');
      console.error('Error loading loans:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadLoans();
  }, [loadLoans]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadLoans();
  };

  const filteredLoans = statusFilter === 'all'
    ? loans
    : loans.filter(loan => loan.status === statusFilter);

  const getStatusColor = (status: LoanStatus) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100';
      case 'REJECTED':
        return 'bg-red-100';
      case 'PENDING':
        return 'bg-yellow-100';
      case 'PAID':
        return 'bg-purple-100';
      default:
        return 'bg-gray-100';
    }
  };

  const getStatusTextColor = (status: LoanStatus) => {
    switch (status) {
      case 'APPROVED':
        return 'text-green-800';
      case 'REJECTED':
        return 'text-red-800';
      case 'PENDING':
        return 'text-yellow-800';
      case 'PAID':
        return 'text-purple-800';
      default:
        return 'text-gray-800';
    }
  };

  const formatCurrency = (amount: number = 0) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const renderItem = ({ item }: { item: Loan }) => (
    <TouchableOpacity
      className="bg-white p-4 rounded-lg mb-2 shadow-sm"
      onPress={() => router.push({
        pathname: '/admin/loans/[id]',
        params: { id: item.id }
      } as any)}
    >
      <View className="flex-row justify-between items-center mb-2">
        <Text className="font-medium">
          {item.user?.firstName} {item.user?.lastName}
        </Text>
        <View className={`px-2 py-1 rounded-full ${getStatusColor(item.status)}`}>
          <Text className={`text-xs font-medium ${getStatusTextColor(item.status)}`}>
            {item.status}
          </Text>
        </View>
      </View>

      <View className="mb-2">
        <Text className="text-gray-500 text-sm">
          {item.loanNumber || 'N/A'} • {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>

      <View className="flex-row justify-between items-center">
        <Text className="font-semibold text-gray-900">
          {formatCurrency(item.amount)}
        </Text>
        <View className="flex-row space-x-2">
          <Text className="text-sm text-gray-500">
            {item.term} months • {item.interestRate}%
          </Text>
          {item.monthlyPayment && (
            <Text className="text-sm font-medium text-gray-900">
              {formatCurrency(item.monthlyPayment)}/mo
            </Text>
          )}
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
      <View className="p-4 bg-white border-b border-gray-200">
        <Text className="text-xl font-bold text-gray-900">Loan Management</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-4"
          contentContainerStyle={{ paddingHorizontal: 4 }}
        >
          <View className="flex-row space-x-2">
            {statusOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                className={`px-3 py-1 rounded-full ${statusFilter === option.value ? 'bg-blue-100' : 'bg-gray-100'
                  }`}
                onPress={() => setStatusFilter(option.value)}
              >
                <Text
                  className={`text-sm ${statusFilter === option.value
                      ? 'text-blue-700 font-medium'
                      : 'text-gray-700'
                    }`}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <FlatList
        data={filteredLoans}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerClassName="p-4"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#3B82F6']}
            tintColor="#3B82F6"
          />
        }
        ListEmptyComponent={
          <View className="items-center justify-center p-8">
            <MaterialIcons name="receipt-long" size={48} color="#9CA3AF" />
            <Text className="text-gray-500 mt-4 text-center">
              {statusFilter !== 'all'
                ? `No ${statusFilter.toLowerCase()} loans found`
                : 'No loans found'}
            </Text>
            {statusFilter !== 'all' && (
              <TouchableOpacity
                className="mt-4 bg-blue-500 px-4 py-2 rounded-lg"
                onPress={() => setStatusFilter('all')}
              >
                <Text className="text-white">Show all loans</Text>
              </TouchableOpacity>
            )}
          </View>
        }
        ListHeaderComponent={
          <View className="pb-2">
            <Text className="text-sm text-gray-500">
              {filteredLoans.length} {filteredLoans.length === 1 ? 'loan' : 'loans'} found
              {statusFilter !== 'all' ? ` (${statusFilter.toLowerCase()})` : ''}
            </Text>
          </View>
        }
      />
    </View>
  );
}
