import { useAdmin } from '@/hooks/useAdmin';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';




export default function AdminDashboard() {
    const router = useRouter()
    const { summary, loanStats, users, loans, projects } = useAdmin()
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
                            <Text className="font-bold text-xl">${loanStats.rejected.toLocaleString()}</Text>
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
                    {users.map((u, i) => (
                        <View key={u.email} className="flex-row justify-between items-center mb-2">
                            <View>
                                <Text className="font-semibold text-gray-700">{u.firstName} {u.lastName}</Text>
                                <Text className="text-xs text-gray-500">{u.email}</Text>
                            </View>
                            <Text className="text-xs text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</Text>
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
                    {loans.map((l, i) => (
                        <View key={i} className="flex-row justify-between items-center mb-2">
                            <View>
                                <Text className="font-semibold text-gray-700">{l.details.name}</Text>
                                <Text className="text-xs text-gray-500">{l.details.amount}</Text>
                            </View>
                            {l.status === 'APPROVED' && <Text className="text-xs font-semibold text-green-700">Approved</Text>}
                            {l.status === 'PENDING' && <Text className="text-xs font-semibold text-yellow-600">Pending</Text>}
                            {l.status === 'REJECTED' && <Text className="text-xs font-semibold text-red-600">Rejected</Text>}
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
                    {projects.map((p, i) => (
                        <View key={p.name} className="mb-2">
                            <Text className="font-semibold text-gray-700">{p.name}</Text>
                            <Text className="text-xs text-gray-500 mb-1">{p.user.firstName}</Text>
                            <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                {/* <View className={`h-2  rounded-full`} style={{ width: `${p.goals.}%` }} /> */}
                            </View>
                            {/* <Text className="text-xs text-gray-700 mt-1">{p.details.progress}%</Text> */}
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
