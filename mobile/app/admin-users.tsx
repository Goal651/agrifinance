import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import UserTable from './components/UserTable';

type User = {
    name: string;
    email: string;
    phone: string;
    farmType: string;
    status: 'Active' | 'Inactive';
};

const initialUsers: User[] = [
    { name: 'Emily Davis', email: 'emily@example.com', phone: '+1555666777', farmType: 'Poultry', status: 'Active' },
    { name: 'Jane Smith', email: 'jane@example.com', phone: '+1987654321', farmType: 'Livestock', status: 'Active' },
    { name: 'John Doe', email: 'john@example.com', phone: '+1234567890', farmType: 'Crop Farming', status: 'Active' },
    { name: 'Michael Wilson', email: 'michael@example.com', phone: '+1777888999', farmType: 'Dairy Farming', status: 'Active' },
    { name: 'Robert Johnson', email: 'robert@example.com', phone: '+1122334455', farmType: 'Mixed Farming', status: 'Inactive' },
];
const router = useRouter();
export default function AdminUsers() {
    const [users, setUsers] = useState(initialUsers);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [modalUser, setModalUser] = useState<User | null>(null);
    const [modalMode, setModalMode] = useState<'view' | 'edit' | null>(null);
    const [deleteUser, setDeleteUser] = useState<User | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [addName, setAddName] = useState('');
    const [addEmail, setAddEmail] = useState('');
    const [addPhone, setAddPhone] = useState('');
    const [addAddress, setAddAddress] = useState('');
    const [addFarmType, setAddFarmType] = useState('');
    const [addError, setAddError] = useState('');

    useEffect(() => {
        setPage(1);
    }, [search, filter]);

    const filteredUsers = users.filter(u => {
        const matchesSearch =
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase()) ||
            u.phone.includes(search);
        const matchesStatus =
            filter === 'all' ? true :
                filter === 'active' ? u.status === 'Active' :
                    filter === 'inactive' ? u.status === 'Inactive' : true;
        return matchesSearch && matchesStatus;
    });

    // Modal actions
    const handleView = (user: User) => {
        setModalUser(user);
        setModalMode('view');
    };
    const handleEdit = (user: User) => {
        setModalUser(user);
        setModalMode('edit');
    };
    const handleDelete = (user: User) => {
        setDeleteUser(user);
    };
    const handleDeleteConfirm = () => {
        if (deleteUser) {
            setUsers(users.filter(u => u.email !== deleteUser.email));
            setDeleteUser(null);
        }
    };
    const handleEditSave = (updated: User) => {
        setUsers(users.map(u => u.email === updated.email ? updated : u));
        setModalUser(null);
        setModalMode(null);
    };
    const handleActivateToggle = (user: User) => {
        setUsers(users.map(u => u.email === user.email ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u));
    };

    const handleAddUser = () => {
        if (!addName || !addEmail || !addPhone || !addFarmType) {
            setAddError('Please fill all required fields');
            return;
        }
        setUsers([
            ...users,
            {
                name: addName,
                email: addEmail,
                phone: addPhone,
                farmType: addFarmType,
                status: 'Active',
            },
        ]);
        setShowAddModal(false);
        setAddName(''); setAddEmail(''); setAddPhone(''); setAddAddress(''); setAddFarmType(''); setAddError('');
    };

    // Edit modal state
    const [editName, setEditName] = useState('');
    const [editPhone, setEditPhone] = useState('');
    const [editFarmType, setEditFarmType] = useState('');
    useEffect(() => {
        if (modalMode === 'edit' && modalUser) {
            setEditName(modalUser.name);
            setEditPhone(modalUser.phone);
            setEditFarmType(modalUser.farmType);
        }
    }, [modalMode, modalUser]);

    return (
        <View className="flex-1 bg-white">
            <View className="flex-row items-center justify-between px-4 pt-8 pb-2">
                <Text className="text-xl font-bold">User Management</Text>
                <View className="flex-row space-x-2">
                    <TouchableOpacity>
                        <MaterialIcons name="filter-list" size={24} color="#444" />
                    </TouchableOpacity>
                </View>
            </View>
            <View className="px-4 mb-2">
                <View className="flex-row items-center bg-purple-50 rounded-lg px-3 py-2 mb-2">
                    <MaterialIcons name="search" size={20} color="#888" />
                    <TextInput
                        className="flex-1 ml-2 text-base"
                        placeholder="Search users..."
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>
                <View className="flex-row space-x-2 mb-2">
                    <TouchableOpacity className={`flex-row items-center px-3 py-1 rounded-full ${filter === 'all' ? 'bg-green-100' : 'bg-gray-100'}`} onPress={() => setFilter('all')}>
                        <MaterialIcons name="groups" size={16} color="#15803d" />
                        <Text className="ml-1 text-xs font-semibold">Total: {users.length}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className={`flex-row items-center px-3 py-1 rounded-full ${filter === 'active' ? 'bg-green-100' : 'bg-gray-100'}`} onPress={() => setFilter('active')}>
                        <MaterialIcons name="check-circle" size={16} color="#22c55e" />
                        <Text className="ml-1 text-xs font-semibold">Active: {users.filter(u => u.status === 'Active').length}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className={`flex-row items-center px-3 py-1 rounded-full ${filter === 'inactive' ? 'bg-red-100' : 'bg-gray-100'}`} onPress={() => setFilter('inactive')}>
                        <MaterialIcons name="remove-circle" size={16} color="#ef4444" />
                        <Text className="ml-1 text-xs font-semibold">Inactive: {users.filter(u => u.status === 'Inactive').length}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View className="flex-1 px-2">
                <UserTable
                    users={filteredUsers}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    setPage={setPage}
                    setRowsPerPage={setRowsPerPage}
                />
            </View>
            <TouchableOpacity className="absolute bottom-6 right-6 bg-green-700 rounded-full px-6 py-3 flex-row items-center shadow-lg" onPress={() => setShowAddModal(true)}>
                <MaterialIcons name="add" size={22} color="white" />
                <Text className="text-white font-bold ml-2">Add User</Text>
            </TouchableOpacity>

            {/* Add User Modal */}
            <Modal visible={showAddModal} transparent animationType="fade">
                <View className="flex-1 justify-center items-center bg-black/40">
                    <View className="bg-white rounded-2xl p-6 w-11/12 max-w-md items-center">
                        <Text className="text-lg font-bold mb-4 text-center">Add New User</Text>
                        <TextInput className="border rounded-md px-3 py-2 mb-3 w-full" placeholder="Name" value={addName} onChangeText={setAddName} />
                        <TextInput className="border rounded-md px-3 py-2 mb-3 w-full" placeholder="Email" value={addEmail} onChangeText={setAddEmail} keyboardType="email-address" autoCapitalize="none" />
                        <TextInput className="border rounded-md px-3 py-2 mb-3 w-full" placeholder="Phone Number" value={addPhone} onChangeText={setAddPhone} keyboardType="phone-pad" />
                        <TextInput className="border rounded-md px-3 py-2 mb-3 w-full" placeholder="Address" value={addAddress} onChangeText={setAddAddress} />
                        <TextInput className="border rounded-md px-3 py-2 mb-3 w-full" placeholder="Farm Type" value={addFarmType} onChangeText={setAddFarmType} />
                        {addError ? <Text className="text-red-500 text-xs mb-2 text-center">{addError}</Text> : null}
                        <View className="flex-row justify-between mt-2 w-full">
                            <TouchableOpacity className="flex-1 py-3 mr-2 rounded-full" onPress={() => { setShowAddModal(false); setAddError(''); }}>
                                <Text className="text-green-700 text-center font-semibold text-base">Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="flex-1 py-3 ml-2 rounded-full" onPress={handleAddUser}>
                                <Text className="text-green-700 text-center font-semibold text-base">Create User</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* View/Edit Modal */}
            <Modal visible={!!modalUser} transparent animationType="fade">
                <View className="flex-1 justify-center items-center bg-black/40">
                    <View className="bg-white rounded-xl p-6 w-11/12 max-w-md items-center">
                        <Text className="text-lg font-bold mb-2 text-center">{modalMode === 'edit' ? 'Edit User' : 'User Details'}</Text>
                        <Text className="text-xs text-gray-500 mb-2 text-center">Email: {modalUser?.email}</Text>
                        <Text className="text-xs text-gray-500 mb-2 text-center">Status: {modalUser?.status}</Text>
                        {modalMode === 'edit' ? (
                            <>
                                <Text className="font-semibold mb-1">Name</Text>
                                <TextInput className="border rounded-md px-3 py-2 mb-2 w-full" value={editName} onChangeText={setEditName} />
                                <Text className="font-semibold mb-1">Phone</Text>
                                <TextInput className="border rounded-md px-3 py-2 mb-2 w-full" value={editPhone} onChangeText={setEditPhone} />
                                <Text className="font-semibold mb-1">Farm Type</Text>
                                <TextInput className="border rounded-md px-3 py-2 mb-2 w-full" value={editFarmType} onChangeText={setEditFarmType} />
                                <View className="flex-row justify-between mt-4 w-full">
                                    <TouchableOpacity className="flex-1 bg-gray-200 rounded-full py-3 mr-2" onPress={() => { setModalUser(null); setModalMode(null); }}>
                                        <Text className="text-gray-700 text-center font-semibold text-base">Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity className="flex-1 bg-green-700 rounded-full py-3 ml-2" onPress={() => handleEditSave({ ...modalUser!, name: editName, phone: editPhone, farmType: editFarmType })}>
                                        <Text className="text-white text-center font-semibold text-base">Save</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        ) : (
                            <>
                                <Text className="font-semibold mb-1">Name</Text>
                                <Text className="mb-2 text-center">{modalUser?.name}</Text>
                                <Text className="font-semibold mb-1">Phone</Text>
                                <Text className="mb-2 text-center">{modalUser?.phone}</Text>
                                <Text className="font-semibold mb-1">Farm Type</Text>
                                <Text className="mb-2 text-center">{modalUser?.farmType}</Text>
                                <View className="flex-row justify-between mt-4 w-full">
                                    <TouchableOpacity className="flex-1 bg-gray-200 rounded-full py-3 mr-2" onPress={() => setModalUser(null)}>
                                        <Text className="text-gray-700 text-center font-semibold text-base">Close</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity className="flex-1 bg-blue-700 rounded-full py-3 ml-2" onPress={() => { setModalMode('edit'); }}>
                                        <Text className="text-white text-center font-semibold text-base">Edit</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity className="flex-1 bg-yellow-500 rounded-full py-3 ml-2" onPress={() => { handleActivateToggle(modalUser!); setModalUser(null); }}>
                                        <Text className="text-white text-center font-semibold text-base">{modalUser?.status === 'Active' ? 'Deactivate' : 'Activate'}</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
            {/* Delete Modal */}
            <Modal visible={!!deleteUser} transparent animationType="fade">
                <View className="flex-1 justify-center items-center bg-black/40">
                    <View className="bg-white rounded-xl p-6 w-11/12 max-w-md items-center">
                        <Text className="text-lg font-bold mb-2 text-red-700 text-center">Delete User</Text>
                        <Text className="mb-4 text-center">Are you sure you want to delete <Text className="font-bold">{deleteUser?.name}</Text>?</Text>
                        <View className="flex-row justify-between mt-4 w-full">
                            <TouchableOpacity className="flex-1 bg-gray-200 rounded-full py-3 mr-2" onPress={() => setDeleteUser(null)}>
                                <Text className="text-gray-700 text-center font-semibold text-base">Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="flex-1 bg-red-700 rounded-full py-3 ml-2" onPress={handleDeleteConfirm}>
                                <Text className="text-white text-center font-semibold text-base">Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
