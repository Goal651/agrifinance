import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAdmin } from '@/hooks/useAdmin';
import { useRouter } from 'expo-router';
import { format } from 'date-fns';
import Toast from 'react-native-toast-message';

export default function LoanApprovals() {
    const router = useRouter();
    const { loans, loading } = useAdmin();
    
    // Filter pending loans
    const pendingLoans = loans.filter(loan => loan.status === 'PENDING');

    const handleApprove = async (loanId: string) => {
        try {
            // Implementation will be added after updating the admin service
            Toast.show({
                type: 'success',
                text1: 'Loan Approved',
                text2: 'The loan has been approved successfully.'
            });
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to approve loan. Please try again.'
            });
        }
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 bg-gray-50 p-4">
            <View className="mb-6">
                <Text className="text-2xl font-bold mb-4">Pending Loan Approvals</Text>
                
                {pendingLoans.length === 0 ? (
                    <View className="bg-white p-4 rounded-lg shadow">
                        <Text className="text-gray-500">No pending loans to approve</Text>
                    </View>
                ) : (
                    pendingLoans.map((loan) => (
                        <View key={loan.id} className="bg-white p-4 rounded-lg shadow mb-4">
                            <View className="flex-row justify-between items-start mb-2">
                                <Text className="font-semibold text-lg">{loan.user?.firstName || 'N/A'}</Text>
                                <Text className="text-orange-500 font-medium">
                                    {loan.amount?.toLocaleString('en-US', {
                                        style: 'currency',
                                        currency: 'USD',
                                    })}
                                </Text>
                            </View>
                            
                            <Text className="text-gray-600 mb-2">{loan.purpose}</Text>
                            
                            <View className="flex-row justify-between items-center mt-3">
                                <Text className="text-sm text-gray-500">
                                    {format(new Date(loan.createdAt), 'MMM d, yyyy')}
                                </Text>
                                <View className="flex-row space-x-2">
                                    <TouchableOpacity 
                                        className="bg-red-100 px-3 py-1 rounded-full"
                                        onPress={() => router.push(`/admin/loans/LoanDetail`)}
                                    >
                                        <Text className="text-red-600 font-medium">View</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        className="bg-green-100 px-3 py-1 rounded-full"
                                        onPress={() => handleApprove(loan.id)}
                                    >
                                        <Text className="text-green-600 font-medium">Approve</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    ))
                )}
            </View>
        </ScrollView>
    );
}
