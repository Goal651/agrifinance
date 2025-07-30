import { MaterialIcons } from '@expo/vector-icons';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

type User = {
    name: string;
    email: string;
    phone: string;
    farmType: string;
    status: 'Active' | 'Inactive';
};

type UserTableProps = {
    users: User[];
    onView: (user: User) => void;
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
    page: number;
    rowsPerPage: number;
    setPage: (page: number) => void;
    setRowsPerPage: (rows: number) => void;
};

export default function UserTable({ users, onView, onEdit, onDelete, page, rowsPerPage, setPage, setRowsPerPage }: UserTableProps) {
    const totalPages = Math.ceil(users.length / rowsPerPage);
    const pagedUsers = users.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    return (
        <View>
            <ScrollView horizontal className="w-full" showsHorizontalScrollIndicator={true}>
                <View className="min-w-[800px]">
                    {/* Table Header */}
                    <View className="flex-row border-b border-gray-200 bg-gray-50">
                        <Text className="w-36 px-2 py-2 font-semibold text-xs text-gray-500">Name</Text>
                        <Text className="w-48 px-2 py-2 font-semibold text-xs text-gray-500">Email</Text>
                        <Text className="w-36 px-2 py-2 font-semibold text-xs text-gray-500">Phone</Text>
                        <Text className="w-36 px-2 py-2 font-semibold text-xs text-gray-500">Farm Type</Text>
                        <Text className="w-24 px-2 py-2 font-semibold text-xs text-gray-500">Status</Text>
                        <Text className="w-32 px-2 py-2 font-semibold text-xs text-gray-500">Actions</Text>
                    </View>
                    {/* Table Rows */}
                    {pagedUsers.map((user: User, idx: number) => (
                        <View key={user.email} className="flex-row border-b border-gray-100 items-center">
                            <Text className="w-36 px-2 py-2 text-gray-800" numberOfLines={1}>{user.name}</Text>
                            <Text className="w-48 px-2 py-2 text-gray-800" numberOfLines={1}>{user.email}</Text>
                            <Text className="w-36 px-2 py-2 text-gray-800" numberOfLines={1}>{user.phone}</Text>
                            <Text className="w-36 px-2 py-2 text-gray-800" numberOfLines={1}>{user.farmType}</Text>
                            <View className="w-24 px-2 py-2 flex-row justify-center">
                                {user.status === 'Active' ? (
                                    <Text className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">Active</Text>
                                ) : (
                                    <Text className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">Inactive</Text>
                                )}
                            </View>
                            <View className="w-32 px-2 py-2 flex-row justify-center space-x-2">
                                <TouchableOpacity onPress={() => onView(user)}>
                                    <MaterialIcons name="visibility" size={20} color="#2563eb" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => onEdit(user)}>
                                    <MaterialIcons name="edit" size={20} color="#fbbf24" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => onDelete(user)}>
                                    <MaterialIcons name="delete" size={20} color="#ef4444" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
            {/* Pagination Controls */}
            <View className="flex-row items-center justify-between mt-2 px-2">
                <View className="flex-row items-center">
                    <Text className="text-xs text-gray-500 mr-2">Rows per page</Text>
                    <TouchableOpacity className="border border-gray-300 rounded px-2 py-1" onPress={() => setRowsPerPage(5)}><Text>5</Text></TouchableOpacity>
                    <TouchableOpacity className="border border-gray-300 rounded px-2 py-1 ml-1" onPress={() => setRowsPerPage(10)}><Text>10</Text></TouchableOpacity>
                </View>
                <Text className="text-xs text-gray-500">{(page - 1) * rowsPerPage + 1}-{Math.min(page * rowsPerPage, users.length)} of {users.length}</Text>
                <View className="flex-row items-center">
                    <TouchableOpacity disabled={page === 1} onPress={() => setPage(page - 1)} className="p-1"><MaterialIcons name="chevron-left" size={20} color={page === 1 ? '#ccc' : '#222'} /></TouchableOpacity>
                    <TouchableOpacity disabled={page === totalPages} onPress={() => setPage(page + 1)} className="p-1"><MaterialIcons name="chevron-right" size={20} color={page === totalPages ? '#ccc' : '#222'} /></TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
