import { useAdmin } from '@/contexts/AdminContext';
import { User } from '@/types';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useEffect, useState } from 'react';
import { FlatList, Modal, Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function AdminUsers() {
    const { users } = useAdmin();
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [modalUser, setModalUser] = useState<User | null>(null);

    useEffect(() => { }, [search, filter]);

    const filteredUsers = users.filter(u => {
        const matchesSearch =
            u.firstName.toLowerCase().includes(search.toLowerCase()) ||
            u.lastName.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase());
        const matchesStatus =
            filter === 'all' ? true :
                filter === 'active' ? u.status === 'ACTIVE' :
                    filter === 'inactive' ? u.status === 'INACTIVE' : true;
        return matchesSearch && matchesStatus;
    });

    return (
        <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 40, paddingBottom: 10 }}>
                <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#3b0764', letterSpacing: 1 }}>User Management</Text>
            </View>
            <View style={{ paddingHorizontal: 20, marginBottom: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 10, shadowColor: '#a78bfa', shadowOpacity: 0.15, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }}>
                    <MaterialIcons name="search" size={20} color="#8b5cf6" />
                    <TextInput
                        style={{ flex: 1, marginLeft: 10, fontSize: 16, color: '#3b0764' }}
                        placeholder="Search users..."
                        placeholderTextColor="#a1a1aa"
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>
                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999, backgroundColor: filter === 'all' ? 'rgba(16,185,129,0.15)' : '#f3f4f6', marginRight: 8 }} onPress={() => setFilter('all')}>
                        <MaterialIcons name="groups" size={16} color="#10b981" />
                        <Text style={{ marginLeft: 4, fontSize: 13, fontWeight: '600', color: '#047857' }}>Total: {users.length}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999, backgroundColor: filter === 'active' ? 'rgba(34,197,94,0.15)' : '#f3f4f6', marginRight: 8 }} onPress={() => setFilter('active')}>
                        <MaterialIcons name="check-circle" size={16} color="#22c55e" />
                        <Text style={{ marginLeft: 4, fontSize: 13, fontWeight: '600', color: '#166534' }}>Active: {users.filter(u => u.status === 'ACTIVE').length}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999, backgroundColor: filter === 'inactive' ? 'rgba(239,68,68,0.15)' : '#f3f4f6' }} onPress={() => setFilter('inactive')}>
                        <MaterialIcons name="remove-circle" size={16} color="#ef4444" />
                        <Text style={{ marginLeft: 4, fontSize: 13, fontWeight: '600', color: '#991b1b' }}>Inactive: {users.filter(u => u.status === 'INACTIVE').length}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <FlatList
                data={filteredUsers}
                keyExtractor={item => item.email}
                contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
                renderItem={({ item }) => (
                    <Pressable onPress={() => setModalUser(item)} style={{ marginBottom: 18 }}>
                        <BlurView intensity={70} tint="light" style={{
                            borderRadius: 24,
                            padding: 22,
                            backgroundColor: 'rgba(255,255,255,0.35)',
                            borderWidth: 1,
                            borderColor: 'rgba(168,139,250,0.18)',
                            shadowColor: '#a78bfa',
                            shadowOpacity: 0.18,
                            shadowRadius: 16,
                            shadowOffset: { width: 0, height: 6 },
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            <MaterialIcons name="person" size={28} color="#7c3aed" style={{ marginRight: 16 }} />
                            <View>
                                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#3b0764', letterSpacing: 0.5 }}>{item.firstName} {item.lastName}</Text>
                            </View>
                        </BlurView>
                    </Pressable>
                )}
            />
            {/* User Details Modal */}
            <Modal visible={!!modalUser} transparent animationType="fade">
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(24,24,27,0.35)' }}>
                    <BlurView intensity={90} tint="light" style={{ borderRadius: 32, padding: 28, width: '90%', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.45)', borderWidth: 1, borderColor: 'rgba(168,139,250,0.18)' }}>
                        <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#3b0764', marginBottom: 8 }}>User Details</Text>
                        <Text style={{ fontSize: 16, color: '#6d28d9', marginBottom: 2 }}><Text style={{ fontWeight: 'bold' }}>First Name:</Text> {modalUser?.firstName}</Text>
                        <Text style={{ fontSize: 16, color: '#6d28d9', marginBottom: 2 }}><Text style={{ fontWeight: 'bold' }}>Last Name:</Text> {modalUser?.lastName}</Text>
                        <Text style={{ fontSize: 16, color: '#6d28d9', marginBottom: 2 }}><Text style={{ fontWeight: 'bold' }}>Email:</Text> {modalUser?.email}</Text>
                        <Text style={{ fontSize: 16, color: '#6d28d9', marginBottom: 2 }}><Text style={{ fontWeight: 'bold' }}>Status:</Text> {modalUser?.status}</Text>
                        <TouchableOpacity style={{ marginTop: 24, backgroundColor: '#7c3aed', borderRadius: 999, paddingHorizontal: 32, paddingVertical: 12, shadowColor: '#a78bfa', shadowOpacity: 0.18, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } }} onPress={() => setModalUser(null)}>
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Close</Text>
                        </TouchableOpacity>
                    </BlurView>
                </View>
            </Modal>
        </View>
    );
}
