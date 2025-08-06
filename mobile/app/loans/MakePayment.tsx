import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useLoan } from '@/contexts/LoanContext';
import { useLoanAction } from '@/hooks/useLoanAction';

export default function MakePayment() {
    const router = useRouter();
    const { currentLoan } = useLoan();
    const { repayLoan } = useLoanAction()

    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('mpesa');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');

    const handlePayment = async () => {
        if (!amount || isNaN(Number(amount))) {
            Alert.alert('Error', 'Please enter a valid amount');
            return;
        }

        if (paymentMethod === 'mpesa' && !phoneNumber) {
            Alert.alert('Error', 'Please enter your M-Pesa phone number');
            return;
        }

        try {
            setIsSubmitting(true);


            const result = await repayLoan(Number(amount));

            if (result) {
                Alert.alert(
                    'Success',
                    'Payment initiated successfully!',
                    [
                        {
                            text: 'OK',
                            onPress: () => router.back()
                        }
                    ]
                );
            } else {
                throw new Error('Payment failed');
            }
        } catch (error) {
            Alert.alert('Error', error.message || 'An error occurred while processing your payment');
        } finally {
            setIsSubmitting(false);
        }
    };

    const remainingAmount = currentLoan?.details?.amount -
        (currentLoan?.payments?.filter(p => p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0) || 0);

    return (
        <ScrollView className="flex-1 bg-gray-50 p-4">
            <View className="mb-6">
                <Text className="text-2xl font-bold mb-2">Make a Payment</Text>
                <Text className="text-gray-600">Complete your loan payment securely</Text>
            </View>

            <View className="bg-white rounded-lg p-4 shadow-sm mb-6">
                <View className="flex-row justify-between mb-4">
                    <Text className="text-gray-600">Loan Amount:</Text>
                    <Text className="font-semibold">KSh {currentLoan?.details.amount?.toLocaleString() || '0'}</Text>
                </View>
                <View className="flex-row justify-between mb-4">
                    <Text className="text-gray-600">Amount Paid:</Text>
                    <Text className="text-green-600 font-semibold">
                        KSh {currentLoan?.payments
                            ?.filter(p => p.status === 'PAID')
                            .reduce((sum, p) => sum + p.amount, 0)
                            ?.toLocaleString() || '0'}
                    </Text>
                </View>
                <View className="flex-row justify-between mb-2">
                    <Text className="text-gray-600 font-semibold">Remaining:</Text>
                    <Text className="text-red-600 font-bold">KSh {remainingAmount?.toLocaleString() || '0'}</Text>
                </View>
            </View>

            <View className="bg-white rounded-lg p-4 shadow-sm mb-6">
                <Text className="font-medium mb-3">Payment Amount (KSh)</Text>
                <View className="flex-row items-center border border-gray-300 rounded-lg px-3 py-2 mb-4">
                    <Text className="text-gray-500 mr-2">KSh</Text>
                    <TextInput
                        className="flex-1 text-lg"
                        keyboardType="numeric"
                        placeholder="0.00"
                        value={amount}
                        onChangeText={setAmount}
                    />
                    <TouchableOpacity
                        onPress={() => setAmount(remainingAmount?.toString() || '')}
                        className="bg-blue-50 px-3 py-1 rounded-md"
                    >
                        <Text className="text-blue-600 text-sm">Pay Full</Text>
                    </TouchableOpacity>
                </View>

                <Text className="font-medium mb-3">Payment Method</Text>
                <View className="mb-4">
                    <TouchableOpacity
                        className={`flex-row items-center p-3 border rounded-lg mb-2 ${paymentMethod === 'mpesa' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                        onPress={() => setPaymentMethod('mpesa')}
                    >
                        <View className={`w-5 h-5 rounded-full border-2 ${paymentMethod === 'mpesa' ? 'border-blue-500 bg-blue-500' : 'border-gray-400'} mr-3 flex items-center justify-center`}>
                            {paymentMethod === 'mpesa' && <View className="w-2 h-2 bg-white rounded-full"></View>}
                        </View>
                        <MaterialIcons name="phone-iphone" size={24} color="#15803d" />
                        <Text className="ml-2">M-Pesa</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className={`flex-row items-center p-3 border rounded-lg ${paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                        onPress={() => setPaymentMethod('card')}
                    >
                        <View className={`w-5 h-5 rounded-full border-2 ${paymentMethod === 'card' ? 'border-blue-500 bg-blue-500' : 'border-gray-400'} mr-3 flex items-center justify-center`}>
                            {paymentMethod === 'card' && <View className="w-2 h-2 bg-white rounded-full"></View>}
                        </View>
                        <MaterialIcons name="credit-card" size={24} color="#3b82f6" />
                        <Text className="ml-2">Credit/Debit Card</Text>
                    </TouchableOpacity>
                </View>

                {paymentMethod === 'mpesa' && (
                    <View className="mb-4">
                        <Text className="text-sm text-gray-600 mb-1">M-Pesa Phone Number</Text>
                        <TextInput
                            className="border border-gray-300 rounded-lg px-3 py-2"
                            placeholder="e.g., 0712345678"
                            keyboardType="phone-pad"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                        />
                    </View>
                )}
            </View>

            <TouchableOpacity
                className="bg-green-600 py-4 rounded-lg items-center justify-center mb-4"
                onPress={handlePayment}
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <Text className="text-white font-semibold">Processing...</Text>
                ) : (
                    <Text className="text-white font-semibold">Confirm Payment of KSh {parseFloat(amount).toLocaleString() || '0'}</Text>
                )}
            </TouchableOpacity>

            <Text className="text-xs text-center text-gray-500 px-4">
                By proceeding, you agree to our Terms of Service and Privacy Policy.
            </Text>
        </ScrollView>
    );
}
