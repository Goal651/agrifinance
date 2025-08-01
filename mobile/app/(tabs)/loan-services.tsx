import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Header from '@/components/ui/Header';
import { LoanProduct } from '@/types';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import {
    ArrowRightIcon,
    CalendarIcon,
    ChartBarIcon,
    ClockIcon,
    CurrencyDollarIcon,
    DocumentTextIcon,
    HomeIcon
} from 'react-native-heroicons/outline';
import LoanAnalytics from './LoanAnalytics';
import LoanHistory from './LoanHistory';
import LoanPayments from './LoanPayments';
import { useLoan } from '@/hooks/useLoan';



export default function LoanServicesScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('overview');
    const { loanProducts } = useLoan();

    const tabs = [
        { id: 'overview', title: 'Overview', icon: HomeIcon },
        { id: 'payments', title: 'Payments', icon: ClockIcon },
        { id: 'history', title: 'History', icon: DocumentTextIcon },
        { id: 'analytics', title: 'Analytics', icon: ChartBarIcon },
    ];

    return (
        <View className="flex-1 bg-gray-50">
            <Header
                title="Loan Services"
                subtitle="Manage your agricultural loans"
                showBack={false}
            />

            {/* Tabs */}
            <View className="flex-row bg-white rounded-t-3xl shadow-lg mx-4 mb-4 overflow-hidden">
                {tabs.map((tab) => {
                    const IconComponent = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <TouchableOpacity
                            key={tab.id}
                            className="flex-1 items-center py-4"
                            style={isActive ? { borderBottomWidth: 3, borderBottomColor: '#059669' } : {}}
                            onPress={() => setActiveTab(tab.id)}
                        >
                            <IconComponent
                                size={24}
                                color={isActive ? '#059669' : '#6b7280'}
                            />
                            <Text className={`text-sm mt-1 font-medium ${isActive ? 'text-green-700' : 'text-gray-500'
                                }`}>
                                {tab.title}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {activeTab === 'overview' && (
                <ScrollView className="flex-1 px-8" showsVerticalScrollIndicator={false}>
                    {/* Welcome Section */}
                    <Card title="Welcome, Farmer" variant="elevated">
                        <Text className="text-gray-600 mb-6 text-base">
                            Access agricultural financing with ease and transparency
                        </Text>

                        <View className="bg-green-50 rounded-2xl p-6 mb-6">
                            <View className="flex-row items-center justify-between mb-4">
                                <Text className="font-bold text-lg text-green-800">Loan Status</Text>
                                <View className="bg-green-100 px-3 py-1 rounded-full">
                                    <Text className="text-green-700 font-semibold text-sm">Active</Text>
                                </View>
                            </View>
                            <View className="h-2 w-full bg-gray-200 rounded-full mb-4">
                                <View className="h-2 bg-green-600 rounded-full" style={{ width: '75%' }} />
                            </View>
                            <View className="flex-row justify-between">
                                <View>
                                    <Text className="text-gray-500 text-sm">Current Balance</Text>
                                    <Text className="font-bold text-xl text-green-700">$5,000</Text>
                                </View>
                                <View>
                                    <Text className="text-gray-500 text-sm">Next Payment</Text>
                                    <Text className="font-bold text-xl text-green-700">$250</Text>
                                </View>
                            </View>
                        </View>
                    </Card>

                    {/* Available Loans */}
                    <Card title="Available Loan Products">
                        {loanProducts.map((product, index) => (
                            <View key={index} className="mb-6 last:mb-0">
                                <View className="bg-gray-50 rounded-2xl p-6">
                                    <View className="flex-row items-center justify-between mb-4">
                                        <Text className="font-bold text-lg text-gray-800">{product.name}</Text>
                                        <CurrencyDollarIcon size={24} color="#059669" />
                                    </View>
                                    <Text className="text-gray-600 mb-4 text-base">{product.description}</Text>
                                    <View className="flex-row justify-between items-center mb-4">
                                        <View>
                                            <Text className="text-gray-500 text-sm">Min Amount</Text>
                                            <Text className="font-bold text-lg">${product.amount.toLocaleString()}</Text>
                                        </View>
                                        <View>
                                            <Text className="text-gray-500 text-sm">Interest Rate</Text>
                                            <Text className="font-bold text-lg">{product.interest}%</Text>
                                        </View>
                                        <View>
                                            <Text className="text-gray-500 text-sm">Term</Text>
                                            <Text className="font-bold text-lg">{product.termType==='YEARS'?product.term/12:product.term} {product.termType.toLocaleLowerCase()}</Text>
                                        </View>
                                    </View>
                                    <Button
                                        title="Apply Now"
                                        onPress={() => router.push({
                                            pathname: '/LoanApplication',
                                            params: { product: JSON.stringify(product) }
                                        })}
                                        size="medium"
                                    />
                                </View>
                            </View>
                        ))}
                    </Card>

                    {/* Quick Actions */}
                    <Card title="Quick Actions">
                        <View className="space-y-4">
                            <TouchableOpacity
                                className="flex-row items-center justify-between bg-gray-50 rounded-2xl p-4"
                                onPress={() => router.push('/LoanApplication')}
                            >
                                <View className="flex-row items-center">
                                    <View className="bg-green-100 p-3 rounded-full mr-4">
                                        <CurrencyDollarIcon size={24} color="#059669" />
                                    </View>
                                    <View>
                                        <Text className="font-bold text-lg">Apply for Loan</Text>
                                        <Text className="text-gray-500">Start your loan application</Text>
                                    </View>
                                </View>
                                <ArrowRightIcon size={20} color="#6b7280" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="flex-row items-center justify-between bg-gray-50 rounded-2xl p-4"
                                onPress={() => setActiveTab('payments')}
                            >
                                <View className="flex-row items-center">
                                    <View className="bg-blue-100 p-3 rounded-full mr-4">
                                        <CalendarIcon size={24} color="#2563eb" />
                                    </View>
                                    <View>
                                        <Text className="font-bold text-lg">Make Payment</Text>
                                        <Text className="text-gray-500">Pay your loan installments</Text>
                                    </View>
                                </View>
                                <ArrowRightIcon size={20} color="#6b7280" />
                            </TouchableOpacity>
                        </View>
                    </Card>
                </ScrollView>
            )}

            {activeTab === 'payments' && <LoanPayments />}
            {activeTab === 'history' && <LoanHistory />}
            {activeTab === 'analytics' && <LoanAnalytics />}
        </View>
    );
}
