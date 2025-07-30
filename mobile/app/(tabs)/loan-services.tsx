import { LoanProduct } from '@/types';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import LoanAnalytics from './LoanAnalytics';
import LoanHistory from './LoanHistory';
import LoanPayments from './LoanPayments';

const loanProducts: LoanProduct[] = [
    {
        name: 'Farming Equipment Loan',
        description: 'Finance essential farming equipment with competitive rates',
        minAmount: 10000,
        interest: 3.5,
        termMonths: 36,
    },
    {
        name: 'Seasonal Crop Financing',
        description: 'Short-term financing for seasonal planting needs',
        minAmount: 5000,
        interest: 4.0,
        termMonths: 12,
    },
];
export default function LoanServicesScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header Bar */}
            <View className="bg-green-700 pt-10 pb-3 px-4 flex-row items-center justify-between shadow">
                <Text className="text-lg font-semibold text-white">Loan Services</Text>
                <View className="flex-row space-x-4">
                    <TouchableOpacity>
                        <Ionicons name="notifications-outline" size={22} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Ionicons name="ellipsis-vertical" size={22} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Tabs */}
            <View className="flex-row bg-white rounded-t-2xl shadow mx-0 mt-0 overflow-hidden">
                <TouchableOpacity
                    className="flex-1 items-center py-3 flex-col"
                    style={activeTab === 'overview' ? { borderBottomWidth: 2, borderBottomColor: '#15803d' } : {}}
                    onPress={() => setActiveTab('overview')}
                >
                    <Ionicons name="home" size={28} color={activeTab === 'overview' ? '#15803d' : '#6b7280'} />
                    <Text className={activeTab === 'overview' ? 'text-green-700 font-semibold text-sm mt-1' : 'text-gray-500 text-sm mt-1'}>Overview</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="flex-1 items-center py-3 flex-col"
                    style={activeTab === 'payments' ? { borderBottomWidth: 2, borderBottomColor: '#15803d' } : {}}
                    onPress={() => setActiveTab('payments')}
                >
                    <MaterialIcons name="event-note" size={28} color={activeTab === 'payments' ? '#15803d' : '#6b7280'} />
                    <Text className={activeTab === 'payments' ? 'text-green-700 font-semibold text-sm mt-1' : 'text-gray-500 text-sm mt-1'}>Payments</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="flex-1 items-center py-3 flex-col"
                    style={activeTab === 'history' ? { borderBottomWidth: 2, borderBottomColor: '#15803d' } : {}}
                    onPress={() => setActiveTab('history')}
                >
                    <MaterialIcons name="history" size={28} color={activeTab === 'history' ? '#15803d' : '#6b7280'} />
                    <Text className={activeTab === 'history' ? 'text-green-700 font-semibold text-sm mt-1' : 'text-gray-500 text-sm mt-1'}>History</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="flex-1 items-center py-3 flex-col"
                    style={activeTab === 'analytics' ? { borderBottomWidth: 2, borderBottomColor: '#15803d' } : {}}
                    onPress={() => setActiveTab('analytics')}
                >
                    <MaterialIcons name="show-chart" size={28} color={activeTab === 'analytics' ? '#15803d' : '#6b7280'} />
                    <Text className={activeTab === 'analytics' ? 'text-green-700 font-semibold text-sm mt-1' : 'text-gray-500 text-sm mt-1'}>Analytics</Text>
                </TouchableOpacity>
            </View>

            {activeTab === 'overview' && (
                <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={true}>
                    {/* Welcome and Loan Status */}
                    <View className="px-3 pt-5">
                        <Text className="text-2xl font-bold mb-1">Welcome, Farmer</Text>
                        <Text className="text-gray-400 mb-4">Access agricultural financing with ease</Text>
                        <View className="bg-white rounded-xl shadow p-6 mb-4 border border-gray-100">
                            <View className="flex-row items-center justify-between mb-4">
                                <Text className="font-semibold text-base">Loan Status</Text>
                                <Text className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Active</Text>
                            </View>
                            <View className='h-1 w-full border border-gray-200 mb-3'></View>
                            <View className="flex-row justify-between mb-2">
                                <View>
                                    <Text className="text-xs text-gray-400">Current Balance</Text>
                                    <Text className="font-bold text-lg">$5,000</Text>
                                </View>

                                <View>
                                    <Text className="text-xs text-gray-400">Next Payment</Text>
                                    <Text className="font-bold text-lg">$250</Text>
                                </View>
                                <View>
                                    <Text className="text-xs text-gray-400">Due Date</Text>
                                    <Text className="font-bold text-lg">Aug 15</Text>
                                </View>
                            </View>
                            <View className='h-1 w-full border border-gray-200 mb-6 mt-4'></View>
                            <View className="mb-4">
                                <Text className="text-xs text-gray-400 mb-1">Repayment Progress</Text>
                                <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-1">
                                    <View className="h-2 bg-green-600 rounded-full" style={{ width: '45%' }} />
                                </View>
                                <Text className="text-xs text-green-700 font-semibold">45%</Text>
                            </View>
                            <View className="flex-row space-x-5 justify-between mt-2">
                                <TouchableOpacity className="flex-1 flex-row items-center justify-center bg-transparent rounded-2xl py-2 px-0 border mr-1">
                                    <MaterialIcons name="receipt-long" size={18} color="#15803d" style={{ marginRight: 6 }} />
                                    <Text className="text-green-700 font-semibold">Payment S...</Text>
                                </TouchableOpacity>
                                <TouchableOpacity className="flex-1 flex-row items-center justify-center bg-green-700 rounded-lg py-2 mr-1">
                                    <MaterialIcons name="payments" size={18} color="white" style={{ marginRight: 6 }} />
                                    <Text className="text-white font-semibold">Make Pay...</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* Apply for a New Loan */}
                    <View className="bg-white rounded-xl shadow py-4 mx-3 mb-4 border border-gray-100">
                        <View className='p-4'>
                            <Text className="font-bold text-base mb-1">Apply for a New Loan</Text>
                            <Text className="text-gray-500 mb-3 text-sm">Quick and transparent agricultural loan{"\n"}application process</Text>
                        </View>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80' }}
                            className="w-full h-48 rounded-lg mb-3"
                            resizeMode="cover"
                        />
                        <View className="flex-row justify-center items-end w-full">

                            <TouchableOpacity className="flex-row items-center justify-end bg-green-700 rounded-full px-6 py-2" style={{ minWidth: 140 }} onPress={() => { router.push('/(tabs)/LoanApplication'); }}>
                                <Ionicons name="add-circle-outline" size={20} color="white" style={{ marginRight: 6 }} />
                                <Text className="text-white font-bold text-base">Apply Now</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Available Loan Products */}
                    <Text className="font-bold text-lg px-5 mb-3">Available Loan Products</Text>
                    {loanProducts.map((product, idx) => (
                        <View key={product.name} className="bg-white rounded-xl shadow p-4 mb-4 mx-3 border border-gray-100">
                            <Text className="font-bold text-base mb-1">{product.name}</Text>
                            <Text className="text-gray-500 mb-3 text-sm">{product.description}</Text>
                            <View className="flex-col items-start mb-3 space-y-2">
                                <View className="flex-row items-center space-x-1">
                                    <MaterialIcons name="attach-money" size={18} color="#15803d" />
                                    <Text className="text-gray-700 text-sm">{product.minAmount}</Text>
                                </View>
                                <View className="flex-row items-center space-x-1">
                                    <MaterialIcons name="percent" size={18} color="#15803d" />
                                    <Text className="text-gray-700 text-sm">{product.interest}</Text>
                                </View>
                                <View className="flex-row items-center space-x-1">
                                    <MaterialIcons name="event" size={18} color="#15803d" />
                                    <Text className="text-gray-700 text-sm">{product.termMonths} months</Text>
                                </View>
                            </View>
                            <View className="flex-row justify-between mt-2">
                                <TouchableOpacity className="flex-1 items-center justify-center bg-white border border-green-700 rounded-full py-2 mr-2" style={{ minWidth: 110 }}>
                                    <Text className="text-green-700 font-semibold">View Details</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className="flex-1 items-center justify-center bg-green-700 rounded-full py-2 ml-2"
                                    style={{ minWidth: 90 }}
                                    onPress={() => {
                                        router.push({
                                            pathname: '/(tabs)/LoanApplication',
                                            params: { product: JSON.stringify(product) }
                                        });
                                    }}>
                                    <Text className="text-white font-semibold">Apply</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            )}

            {activeTab === 'payments' && <LoanPayments />}
            {activeTab === 'history' && <LoanHistory />}
            {activeTab === 'analytics' && <LoanAnalytics />}
        </View>
    );
}
