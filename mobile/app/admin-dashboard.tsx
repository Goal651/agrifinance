import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

const summary = [
    { label: 'Users', value: 128, sub: '98 active', color: 'bg-green-50', text: 'text-green-700' },
    { label: 'Loans', value: 75, sub: '12 pending', color: 'bg-blue-50', text: 'text-blue-700' },
    { label: 'Projects', value: 92, sub: '67 active', color: 'bg-yellow-50', text: 'text-yellow-700' },
];

const loanStats = {
    total: 450000,
    disbursed: 320000,
    status: [
        { label: 'Pending', value: 20, color: 'bg-yellow-400' },
        { label: 'Approved', value: 60, color: 'bg-green-500' },
        { label: 'Rejected', value: 10, color: 'bg-red-500' },
    ],
};

const recentUsers = [
    { name: 'John Doe', email: 'john@example.com', date: '2023-07-15' },
    { name: 'Jane Smith', email: 'jane@example.com', date: '2023-07-14' },
    { name: 'Robert Johnson', email: 'robert@example.com', date: '2023-07-13' },
];

const recentLoans = [
    { name: 'John Doe', amount: '$15,000', status: 'Approved' },
    { name: 'Jane Smith', amount: '$25,000', status: 'Pending' },
    { name: 'Robert Johnson', amount: '$10,000', status: 'Rejected' },
];

const recentProjects = [
    { name: 'Maize Farm 2023', user: 'John Doe', progress: 75, color: 'bg-blue-500' },
    { name: 'Poultry Expansion', user: 'Jane Smith', progress: 30, color: 'bg-blue-300' },
    { name: 'Irrigation System', user: 'Robert Johnson', progress: 100, color: 'bg-green-500' },
];
const router = useRouter();
export default function AdminDashboard() {
    const totalStatus = loanStats.status.reduce((a, b) => a + b.value, 0);
    return (
        <ScrollView className="flex-1 bg-gray-50" contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={true}>
            <View className="px-3 pt-5">
                <Text className="text-2xl font-bold mb-4">Admin Dashboard</Text>
                {/* Summary Cards */}
                <View className="flex-row mb-4">
                    {summary.map((s, i) => (
                        <View key={s.label} className={`flex-1 mx-1 rounded-xl p-4 ${s.color} shadow items-center`}>
                            <Text className={`text-2xl font-bold ${s.text}`}>{s.value}</Text>
                            <Text className="text-xs text-gray-500 mb-1">{s.sub}</Text>
                            <Text className="font-semibold text-gray-700 mb-2">{s.label}</Text>
                            <TouchableOpacity>
                                <Text className="text-green-700 text-xs font-semibold">View All</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
                {/* Loan Statistics */}
                <View className="bg-white rounded-xl shadow p-4 mb-4 border border-gray-100">
                    <View className="flex-row justify-between mb-2">
                        <View>
                            <Text className="text-xs text-gray-500">Total Amount</Text>
                            <Text className="font-bold text-xl">${loanStats.total.toLocaleString()}</Text>
                        </View>
                        <View>
                            <Text className="text-xs text-gray-500">Disbursed</Text>
                            <Text className="font-bold text-xl">${loanStats.disbursed.toLocaleString()}</Text>
                        </View>
                    </View>
                    <Text className="text-xs text-gray-500 mb-1 mt-2">Loan Status Distribution</Text>
                    <View className="flex-row items-center mb-2">
                        {loanStats.status.map((s, i) => (
                            <View key={s.label} className="flex-row items-center mr-4">
                                <View className={`w-3 h-3 rounded-full ${s.color} mr-1`} />
                                <Text className="text-xs text-gray-700 mr-1">{s.label}</Text>
                            </View>
                        ))}
                    </View>
                    <View className="flex-row h-4 w-full rounded-full overflow-hidden bg-gray-200">
                        {loanStats.status.map((s, i) => (
                            <View key={s.label} style={{ width: `${(s.value / totalStatus) * 100}%` }} className={`${s.color} h-full`} />
                        ))}
                    </View>
                </View>
                {/* Recent Users */}
                <View className="bg-gray-50 rounded-xl shadow p-4 mb-4 border border-gray-100">
                    <View className="flex-row justify-between items-center mb-2">
                        <Text className="font-bold text-base">Recent Users</Text>
                        <MaterialIcons name="groups" size={20} color="#2563eb" />
                    </View>
                    {recentUsers.map((u, i) => (
                        <View key={u.email} className="flex-row justify-between items-center mb-2">
                            <View>
                                <Text className="font-semibold text-gray-700">{u.name}</Text>
                                <Text className="text-xs text-gray-500">{u.email}</Text>
                            </View>
                            <Text className="text-xs text-gray-500">{u.date}</Text>
                        </View>
                    ))}
                    <TouchableOpacity className="mt-2 border border-green-700 rounded-full py-2 items-center" onPress={() => router.push('/admin-users')}>
                        <Text className="text-green-700 font-semibold">View All Users</Text>
                    </TouchableOpacity>
                </View>
                {/* Recent Loans */}
                <View className="bg-gray-50 rounded-xl shadow p-4 mb-4 border border-gray-100">
                    <View className="flex-row justify-between items-center mb-2">
                        <Text className="font-bold text-base">Recent Loans</Text>
                        <MaterialIcons name="credit-card" size={20} color="#2563eb" />
                    </View>
                    {recentLoans.map((l, i) => (
                        <View key={l.name} className="flex-row justify-between items-center mb-2">
                            <View>
                                <Text className="font-semibold text-gray-700">{l.name}</Text>
                                <Text className="text-xs text-gray-500">{l.amount}</Text>
                            </View>
                            {l.status === 'Approved' && <Text className="text-xs font-semibold text-green-700">Approved</Text>}
                            {l.status === 'Pending' && <Text className="text-xs font-semibold text-yellow-600">Pending</Text>}
                            {l.status === 'Rejected' && <Text className="text-xs font-semibold text-red-600">Rejected</Text>}
                        </View>
                    ))}
                    <TouchableOpacity className="mt-2 border border-green-700 rounded-full py-2 items-center" onPress={() => router.push('./admin-loans')}>
                        <Text className="text-green-700 font-semibold">View All Loans</Text>
                    </TouchableOpacity>
                </View>
                {/* Recent Projects */}
                <View className="bg-gray-50 rounded-xl shadow p-4 mb-4 border border-gray-100">
                    <View className="flex-row justify-between items-center mb-2">
                        <Text className="font-bold text-base">Recent Projects</Text>
                        <MaterialIcons name="engineering" size={20} color="#2563eb" />
                    </View>
                    {recentProjects.map((p, i) => (
                        <View key={p.name} className="mb-2">
                            <Text className="font-semibold text-gray-700">{p.name}</Text>
                            <Text className="text-xs text-gray-500 mb-1">{p.user}</Text>
                            <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                <View className={`h-2 ${p.color} rounded-full`} style={{ width: `${p.progress}%` }} />
                            </View>
                            <Text className="text-xs text-gray-700 mt-1">{p.progress}%</Text>
                        </View>
                    ))}
                    <TouchableOpacity className="mt-2 border border-green-700 rounded-full py-2 items-center" onPress={() => router.push('/admin-project')}>
                        <Text className="text-green-700 font-semibold">View All Projects</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

export const screen = {
    options: {
        headerShown: false,
    },
};
