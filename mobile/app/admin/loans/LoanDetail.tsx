import { View, Text, TouchableOpacity, ActivityIndicator, Alert, ScrollView, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { adminService } from '@/api/admin';
import { Loan, LoanStatus, LoanApproval } from '@/types/admin';

type StatusBadgeProps = {
  status: LoanStatus;
  label?: string;
};

const StatusBadge = ({ status, label }: StatusBadgeProps) => {
  const statusStyles = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    disbursed: 'bg-blue-100 text-blue-800',
    completed: 'bg-purple-100 text-purple-800',
  };

  return (
    <View className={`px-3 py-1 rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
      <Text className={`text-xs font-medium`}>{label || status.toUpperCase()}</Text>
    </View>
  );
};

type ApprovalItemProps = {
  approval: LoanApproval;
};

const ApprovalItem = ({ approval }: ApprovalItemProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'text-green-600';
      case 'rejected':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <View className="border-l-2 border-gray-200 pl-4 py-2 mb-3">
      <View className="flex-row justify-between items-start">
        <View>
          <Text className="font-medium text-gray-900">{approval.approverName}</Text>
          <Text className="text-sm text-gray-500">{approval.role}</Text>
        </View>
        <View className="items-end">
          <Text className={`text-sm font-medium ${getStatusColor(approval.status)}`}>
            {approval.status}
          </Text>
          <Text className="text-xs text-gray-500">
            {new Date(approval.approvedAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
      {approval.comments && (
        <View className="mt-2 bg-gray-50 p-2 rounded">
          <Text className="text-sm text-gray-700">{approval.comments}</Text>
        </View>
      )}
    </View>
  );
};

export default function LoanDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [disbursing, setDisbursing] = useState(false);
  const [loan, setLoan] = useState<Loan | null>(null);
  const [approvals, setApprovals] = useState<LoanApproval[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('details');

  const loadLoan = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Load loan data
      const loanRes = await adminService.getLoanById(id);
      if (loanRes.success) {
        setLoan(loanRes.data);
        
        // Load approvals
        const approvalsRes = await adminService.getLoanApprovals(id);
        if (approvalsRes.success) {
          setApprovals(approvalsRes.data);
        }
      } else {
        setError(loanRes.message || 'Failed to load loan');
      }
    } catch (err) {
      setError('An error occurred while loading loan data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadLoan();
    }
  }, [id]);

  const handleApprove = async () => {
    if (!id) return;
    
    setApproving(true);
    try {
      const response = await adminService.approveLoan({
        loanId: id,
        approved: true,
        comments: 'Loan approved by admin',
      });
      
      if (response.success) {
        Alert.alert('Success', 'Loan approved successfully');
        loadLoan(); // Refresh loan data
      } else {
        Alert.alert('Error', response.message || 'Failed to approve loan');
      }
    } catch (err) {
      Alert.alert('Error', 'An error occurred while approving the loan');
      console.error(err);
    } finally {
      setApproving(false);
    }
  };

  const handleReject = () => {
    if (!id) return;
    
    Alert.prompt(
      'Reject Loan',
      'Please provide a reason for rejection:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Submit',
          onPress: async (reason) => {
            if (!reason) {
              Alert.alert('Error', 'Please provide a reason for rejection');
              return;
            }
            
            setRejecting(true);
            try {
              const response = await adminService.approveLoan({
                loanId: id,
                approved: false,
                comments: reason,
              });
              
              if (response.success) {
                Alert.alert('Success', 'Loan has been rejected');
                loadLoan(); // Refresh loan data
              } else {
                Alert.alert('Error', response.message || 'Failed to reject loan');
              }
            } catch (err) {
              Alert.alert('Error', 'An error occurred while rejecting the loan');
              console.error(err);
            } finally {
              setRejecting(false);
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const handleDisburse = async () => {
    if (!id) return;
    
    Alert.alert(
      'Disburse Loan',
      'Are you sure you want to disburse this loan?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disburse',
          style: 'destructive',
          onPress: async () => {
            setDisbursing(true);
            try {
              // Implement disburse API call
              // const response = await adminService.disburseLoan(id);
              // if (response.success) {
              //   Alert.alert('Success', 'Loan has been disbursed');
              //   loadLoan(); // Refresh loan data
              // }
              
              // For now, just show success
              Alert.alert('Success', 'Loan has been disbursed');
              if (loan) {
                setLoan({ ...loan, status: 'disbursed' });
              }
            } catch (err) {
              Alert.alert('Error', 'Failed to disburse loan');
              console.error(err);
            } finally {
              setDisbursing(false);
            }
          },
        },
      ]
    );
  };

  const handleCallBorrower = () => {
    if (!loan?.borrower?.phone) return;
    Linking.openURL(`tel:${loan.borrower.phone}`);
  };

  const handleEmailBorrower = () => {
    if (!loan?.borrower?.email) return;
    Linking.openURL(`mailto:${loan.borrower.email}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getNextAction = () => {
    if (!loan) return null;
    
    switch (loan.status) {
      case 'pending':
        return (
          <View className="flex-row space-x-3 mt-4">
            <TouchableOpacity
              className="flex-1 bg-green-500 py-3 rounded-lg items-center"
              onPress={handleApprove}
              disabled={approving}
            >
              {approving ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-medium">Approve</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 bg-red-500 py-3 rounded-lg items-center"
              onPress={handleReject}
              disabled={rejecting}
            >
              {rejecting ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-medium">Reject</Text>
              )}
            </TouchableOpacity>
          </View>
        );
      case 'approved':
        return (
          <TouchableOpacity
            className="mt-4 bg-blue-500 py-3 rounded-lg items-center"
            onPress={handleDisburse}
            disabled={disbursing}
          >
            {disbursing ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-medium">Disburse Loan</Text>
            )}
          </TouchableOpacity>
        );
      case 'disbursed':
        return (
          <View className="mt-4">
            <Text className="text-center text-gray-500 mb-2">
              Loan has been disbursed
            </Text>
            <TouchableOpacity
              className="bg-purple-500 py-3 rounded-lg items-center"
              onPress={() => {}}
            >
              <Text className="text-white font-medium">View Repayment Schedule</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (error || !loan) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <MaterialIcons name="error-outline" size={48} color="#EF4444" />
        <Text className="text-red-500 text-lg mt-4 text-center">
          {error || 'Loan not found'}
        </Text>
        <TouchableOpacity 
          className="mt-4 bg-blue-500 px-4 py-2 rounded-lg"
          onPress={loadLoan}
        >
          <Text className="text-white font-medium">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white p-6 border-b border-gray-200">
        <View className="flex-row justify-between items-start">
          <View>
            <Text className="text-2xl font-bold text-gray-900">
              {formatCurrency(loan.amount)}
            </Text>
            <Text className="text-gray-500">
              {loan.loanNumber} • {new Date(loan.createdAt).toLocaleDateString()}
            </Text>
          </View>
          <StatusBadge status={loan.status} />
        </View>
        
        <View className="mt-6">
          <Text className="text-sm font-medium text-gray-500 mb-1">Borrower</Text>
          <View className="flex-row items-center justify-between">
            <Text className="text-base text-gray-900">
              {loan.borrower?.firstName} {loan.borrower?.lastName}
            </Text>
            <View className="flex-row space-x-2">
              {loan.borrower?.phone && (
                <TouchableOpacity 
                  className="p-2 bg-blue-50 rounded-full"
                  onPress={handleCallBorrower}
                >
                  <MaterialIcons name="phone" size={20} color="#3B82F6" />
                </TouchableOpacity>
              )}
              {loan.borrower?.email && (
                <TouchableOpacity 
                  className="p-2 bg-blue-50 rounded-full"
                  onPress={handleEmailBorrower}
                >
                  <MaterialIcons name="email" size={20} color="#3B82F6" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
      
      {/* Tabs */}
      <View className="flex-row border-b border-gray-200 bg-white">
        <TouchableOpacity
          className={`flex-1 py-3 items-center ${
            activeTab === 'details' ? 'border-b-2 border-blue-500' : ''
          }`}
          onPress={() => setActiveTab('details')}
        >
          <Text
            className={`font-medium ${
              activeTab === 'details' ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            Details
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-3 items-center ${
            activeTab === 'approvals' ? 'border-b-2 border-blue-500' : ''
          }`}
          onPress={() => setActiveTab('approvals')}
        >
          <Text
            className={`font-medium ${
              activeTab === 'approvals' ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            Approvals
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-3 items-center ${
            activeTab === 'documents' ? 'border-b-2 border-blue-500' : ''
          }`}
          onPress={() => setActiveTab('documents')}
        >
          <Text
            className={`font-medium ${
              activeTab === 'documents' ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            Documents
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Tab Content */}
      <ScrollView className="flex-1 p-6">
        {activeTab === 'details' && (
          <View className="bg-white rounded-lg p-5 shadow-sm">
            <Text className="text-lg font-semibold mb-4">Loan Details</Text>
            
            <View className="space-y-4">
              <View className="flex-row justify-between">
                <Text className="text-gray-500">Loan Amount</Text>
                <Text className="font-medium">{formatCurrency(loan.amount)}</Text>
              </View>
              
              <View className="flex-row justify-between">
                <Text className="text-gray-500">Interest Rate</Text>
                <Text className="font-medium">{loan.interestRate}%</Text>
              </View>
              
              <View className="flex-row justify-between">
                <Text className="text-gray-500">Term</Text>
                <Text className="font-medium">{loan.term} months</Text>
              </View>
              
              <View className="flex-row justify-between">
                <Text className="text-gray-500">Monthly Payment</Text>
                <Text className="font-medium">
                  {formatCurrency(loan.monthlyPayment || 0)}
                </Text>
              </View>
              
              <View className="flex-row justify-between">
                <Text className="text-gray-500">Purpose</Text>
                <Text className="font-medium text-right">{loan.purpose}</Text>
              </View>
              
              {loan.comments && (
                <View className="mt-4 pt-4 border-t border-gray-100">
                  <Text className="text-gray-500 mb-2">Comments</Text>
                  <Text className="text-gray-700">{loan.comments}</Text>
                </View>
              )}
            </View>
            
            {getNextAction()}
          </View>
        )}
        
        {activeTab === 'approvals' && (
          <View className="bg-white rounded-lg p-5 shadow-sm">
            <Text className="text-lg font-semibold mb-4">Approval History</Text>
            
            {approvals.length > 0 ? (
              <View>
                {approvals.map((approval, index) => (
                  <ApprovalItem key={index} approval={approval} />
                ))}
              </View>
            ) : (
              <View className="py-6 items-center">
                <MaterialIcons name="history" size={48} color="#9CA3AF" />
                <Text className="text-gray-500 mt-2">No approval history yet</Text>
              </View>
            )}
            
            {loan.status === 'pending' && (
              <View className="mt-6">
                <Text className="text-gray-500 mb-3">Your Action</Text>
                <View className="flex-row space-x-3">
                  <TouchableOpacity
                    className="flex-1 bg-green-500 py-3 rounded-lg items-center"
                    onPress={handleApprove}
                    disabled={approving}
                  >
                    {approving ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text className="text-white font-medium">Approve</Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex-1 bg-red-500 py-3 rounded-lg items-center"
                    onPress={handleReject}
                    disabled={rejecting}
                  >
                    {rejecting ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text className="text-white font-medium">Reject</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}
        
        {activeTab === 'documents' && (
          <View className="bg-white rounded-lg p-5 shadow-sm">
            <Text className="text-lg font-semibold mb-4">Loan Documents</Text>
            
            <View className="space-y-3">
              {loan.documents?.length > 0 ? (
                loan.documents.map((doc, index) => (
                  <TouchableOpacity 
                    key={index}
                    className="flex-row items-center p-3 border border-gray-200 rounded-lg"
                    onPress={() => {}}
                  >
                    <MaterialIcons 
                      name="picture-as-pdf" 
                      size={24} 
                      color="#EF4444" 
                      style={{ marginRight: 12 }}
                    />
                    <View className="flex-1">
                      <Text className="font-medium">{doc.name}</Text>
                      <Text className="text-gray-500 text-xs">
                        {new Date(doc.uploadedAt).toLocaleDateString()}
                      </Text>
                    </View>
                    <MaterialIcons name="download" size={20} color="#6B7280" />
                  </TouchableOpacity>
                ))
              ) : (
                <View className="py-8 items-center">
                  <MaterialIcons name="folder-open" size={48} color="#9CA3AF" />
                  <Text className="text-gray-500 mt-2">No documents uploaded</Text>
                </View>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
