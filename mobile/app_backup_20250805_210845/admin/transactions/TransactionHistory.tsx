import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Transaction, TransactionType, TransactionStatus } from '@/types/transaction';
import { useToast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { Picker } from '@react-native-picker/picker';

const TransactionHistory = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    startDate: '',
    endDate: '',
  });
  const { toast } = useToast();

  const loadTransactions = async (pageNum = 1, reset = false) => {
    try {
      if (pageNum === 1) {
        setRefreshing(true);
      }

      // In a real app, you would call the API with filters
      // const response = await adminService.getTransactions({
      //   ...filters,
      //   page: pageNum,
      //   limit: 10,
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data - replace with actual API response
      const mockTransactions: Transaction[] = Array(10).fill(0).map((_, i) => ({
        id: `tx-${pageNum}-${i}`,
        type: Object.values(TransactionType)[i % Object.keys(TransactionType).length],
        status: Object.values(TransactionStatus)[i % Object.keys(TransactionStatus).length],
        amount: 1000 + (i * 100),
        currency: 'USD',
        reference: `REF-${Date.now()}-${i}`,
        description: `Transaction ${i + 1}`,
        metadata: {},
        createdAt: new Date(Date.now() - i * 1000 * 60 * 60 * 24).toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      if (reset) {
        setTransactions(mockTransactions);
      } else {
        setTransactions(prev => [...prev, ...mockTransactions]);
      }
      
      setHasMore(mockTransactions.length === 10);
      setPage(pageNum);
    } catch (error) {
      console.error('Error loading transactions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load transactions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadTransactions(1, true);
  }, [filters, loadTransactions]);

  const handleRefresh = () => {
    loadTransactions(1, true);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      loadTransactions(page + 1);
    }
  };

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <TouchableOpacity 
      onPress={() => router.push(`/admin/transactions/${item.id}`)}
    >
      <Card style={styles.transactionCard}>
        <View style={styles.transactionHeader}>
          <Text style={styles.transactionType}>{item.type.replace('_', ' ')}</Text>
          <Text 
            style={[
              styles.transactionAmount,
              item.type === TransactionType.LOAN_DISBURSEMENT ? styles.amountNegative : styles.amountPositive
            ]}
          >
            {item.type === TransactionType.LOAN_DISBURSEMENT ? '-' : ''}{formatCurrency(item.amount)}
          </Text>
        </View>
        
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionReference}>{item.reference}</Text>
          <Text 
            style={[
              styles.transactionStatus,
              item.status === TransactionStatus.COMPLETED ? styles.statusSuccess : 
              item.status === TransactionStatus.FAILED ? styles.statusError : styles.statusPending
            ]}
          >
            {item.status}
          </Text>
        </View>
        
        <Text style={styles.transactionDate}>
          {format(parseISO(item.createdAt), 'MMM d, yyyy h:mm a')}
        </Text>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <View style={styles.filterGroup}>
          <Text style={styles.filterLabel}>Type</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={filters.type}
              onValueChange={(value) => setFilters({...filters, type: value})}
              style={styles.picker}
            >
              <Picker.Item label="All Types" value="" />
              {Object.values(TransactionType).map(type => (
                <Picker.Item 
                  key={type} 
                  label={type.replace('_', ' ')} 
                  value={type} 
                />
              ))}
            </Picker>
          </View>
        </View>
        
        <View style={styles.filterGroup}>
          <Text style={styles.filterLabel}>Status</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={filters.status}
              onValueChange={(value) => setFilters({...filters, status: value})}
              style={styles.picker}
            >
              <Picker.Item label="All Statuses" value="" />
              {Object.values(TransactionStatus).map(status => (
                <Picker.Item 
                  key={status} 
                  label={status} 
                  value={status} 
                />
              ))}
            </Picker>
          </View>
        </View>
      </View>

      {loading && !refreshing ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={transactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text>No transactions found</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  filterContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterGroup: {
    marginBottom: 12,
  },
  filterLabel: {
    marginBottom: 4,
    fontWeight: '500',
    color: '#666',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
  listContent: {
    padding: 16,
  },
  transactionCard: {
    marginBottom: 12,
    padding: 16,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  amountPositive: {
    color: '#4CAF50',
  },
  amountNegative: {
    color: '#F44336',
  },
  transactionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  transactionReference: {
    color: '#666',
    fontSize: 14,
  },
  transactionStatus: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  statusSuccess: {
    color: '#4CAF50',
  },
  statusError: {
    color: '#F44336',
  },
  statusPending: {
    color: '#FFC107',
  },
  transactionDate: {
    color: '#999',
    fontSize: 12,
  },
});

export default TransactionHistory;
