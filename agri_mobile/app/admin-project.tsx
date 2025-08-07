import { useAdmin } from '@/contexts/AdminContext';
import { AdminProject } from '@/types';
import { ProjectStatus } from '@/types/project';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

const statusColors = {
    'IN_PROGRESS': 'bg-blue-500 text-white',
    'COMPLETED': 'bg-green-500 text-white',
    'NOT_STARTED': 'bg-yellow-400 text-white',
};
const filters = ['All', 'IN_PROGRESS', 'COMPLETED', 'NOT_STARTED'];
const statusOptions = ['IN_PROGRESS', 'COMPLETED', 'NOT_STARTED'];

export default function AdminProjectScreen() {
    const { projects } = useAdmin();
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const router = useRouter();
    const [modalVisible, setModalVisible] = useState(false);
    const [editProject, setEditProject] = useState<AdminProject | null>(null);
    const [editValues, setEditValues] = useState<Partial<AdminProject>>({});
    const [statusDropdown, setStatusDropdown] = useState(false);
    const [editErrors, setEditErrors] = useState<{ [k: string]: string }>({});

    // Summary calculation
    const summary = useMemo(() => {
        const total = projects.length;
        const completed = projects.filter(p => p.status === 'COMPLETED').length;
        const goals = projects.reduce((sum, p) => sum + (p.goals?.length || 0), 0);
        const progress = total ? Math.round(projects.reduce((sum, p) => sum + (p.progress || 0), 0) / total) : 0;
        return [
            { label: 'Projects', value: total, sub: `${completed} Completed`, icon: <MaterialIcons name="check-circle" size={16} color="#22c55e" /> },
            { label: 'Goals', value: goals, sub: '', icon: <MaterialIcons name="flag" size={16} color="#22c55e" /> },
            { label: 'Progress', value: `${progress}%`, sub: '', icon: <MaterialIcons name="trending-up" size={16} color="#2563eb" /> },
        ];
    }, [projects]);

    // Filtering
    const filteredProjects = useMemo(() => {
        return projects.filter(p => {
            const ownerName = p.user ? `${p.user.firstName} ${p.user.lastName}` : '';
            const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || ownerName.toLowerCase().includes(search.toLowerCase());
            const matchesFilter = filter === 'All' ? true : p.status === filter;
            return matchesSearch && matchesFilter;
        });
    }, [projects, search, filter]);
    const totalPages = Math.ceil(filteredProjects.length / rowsPerPage);
    const pagedProjects = filteredProjects.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    // Validation
    const validateEdit = () => {
        const errs: { [k: string]: string } = {};
        if (!editValues.name) errs.name = 'Project name is required';
        if (!editValues.user || !editValues.user.firstName || !editValues.user.lastName) errs.owner = 'Owner is required';
        if (!editValues.createdAt) errs.start = 'Start date is required';
        if (!editValues.status) errs.status = 'Status is required';
        setEditErrors(errs);
        return Object.keys(errs).length === 0;
    };

    // Save handler (should call context update in real app)
    const handleSave = () => {
        if (!editProject) return;
        if (!validateEdit()) return;
        setEditProject(null);
        setEditValues({});
        setEditErrors({});
        setModalVisible(false);
    };

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="flex-row items-center px-4 pt-8 pb-2">
                <TouchableOpacity onPress={() => router.back()} className="mr-2">
                    <MaterialIcons name="chevron-left" size={28} color="#444" />
                </TouchableOpacity>
                <Text className="text-xl font-bold flex-1 text-center">Project Management</Text>
                <MaterialIcons name="more-vert" size={24} color="#444" />
            </View>
            {/* Summary Cards */}
            <View className="flex-row justify-between px-4 mb-2">
                {summary.map((s, i) => (
                    <View key={s.label} className="flex-1 mx-1 rounded-xl p-4 bg-[#faf9fd] border border-gray-200 shadow items-center">
                        <View className="flex-row items-center mb-1">
                            {s.icon}
                            <Text className="text-2xl font-bold ml-2 text-green-700">{s.value}</Text>
                        </View>
                        <Text className="text-xs text-gray-500 mb-1">{s.sub}</Text>
                        <Text className="font-semibold text-gray-700 mb-2">{s.label}</Text>
                    </View>
                ))}
            </View>
            {/* Search and Filters */}
            <View className="px-4">
                <View className="flex-row items-center bg-purple-50 rounded-lg px-3 py-2 mb-2">
                    <MaterialIcons name="search" size={20} color="#888" />
                    <TextInput
                        className="flex-1 ml-2 text-base"
                        placeholder="Search projects..."
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>
                <View className="flex-row space-x-2 mb-2">
                    {filters.map(tab => (
                        <TouchableOpacity
                            key={tab}
                            className={`px-4 py-1 rounded-full ${filter === tab ? 'bg-purple-200' : 'bg-gray-100'}`}
                            onPress={() => setFilter(tab)}
                        >
                            <Text className={`font-semibold ${filter === tab ? 'text-purple-900' : 'text-gray-700'}`}>{tab}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
            {/* Table */}
            <View className="flex-1 px-2">
                <ScrollView horizontal showsHorizontalScrollIndicator={true} className="w-full">
                    <View className="min-w-[900px]">
                        {/* Table Header */}
                        <View className="flex-row border-b border-gray-200 bg-gray-50 py-2">
                            <Text className="w-40 px-2 font-semibold text-xs text-gray-500">Project Name</Text>
                            <Text className="w-32 px-2 font-semibold text-xs text-gray-500">Owner</Text>
                            <Text className="w-28 px-2 font-semibold text-xs text-gray-500">Start Date</Text>
                            <Text className="w-28 px-2 font-semibold text-xs text-gray-500">End Date</Text>
                            <Text className="w-24 px-2 font-semibold text-xs text-gray-500">Status</Text>
                            <Text className="w-32 px-2 font-semibold text-xs text-gray-500">Progress</Text>
                            <Text className="w-24 px-2 font-semibold text-xs text-gray-500">Actions</Text>
                        </View>
                        {/* Table Rows */}
                        {pagedProjects.length === 0 ? (
                            <View className="items-center justify-center py-16">
                                <MaterialIcons name="info-outline" size={48} color="#a78bfa" />
                                <Text className="mt-4 text-lg font-semibold text-gray-500">No projects found</Text>
                                <Text className="text-sm text-gray-400">There are currently no project records to display.</Text>
                            </View>
                        ) : (
                            pagedProjects.map((p) => (
                                <View key={p.id} className="flex-row border-b border-gray-100 items-center py-2">
                                    <Text className="w-40 px-2 text-gray-800" numberOfLines={1}>{p.name}</Text>
                                    <Text className="w-32 px-2 text-gray-800" numberOfLines={1}>{p.user ? `${p.user.firstName} ${p.user.lastName}` : ''}</Text>
                                    <Text className="w-28 px-2 text-gray-800 text-xs">{p.createdAt?.slice(0,10)}</Text>
                                    <Text className="w-28 px-2 text-gray-800 text-xs">{p.targetDate?.slice(0,10) || ''}</Text>
                                    <View className="w-24 px-2">
                                        <Text className={`px-2 py-0.5 rounded-full text-xs font-semibold text-center ${statusColors[p.status]}`}>{p.status}</Text>
                                    </View>
                                    <View className="w-32 px-2 flex-row items-center">
                                        <View className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                                            <View className="h-2 bg-blue-600 rounded-full" style={{ width: `${p.progress}%` }} />
                                        </View>
                                        <Text className="text-xs font-semibold text-gray-700">{p.progress}%</Text>
                                    </View>
                                    <View className="w-24 px-2 flex-row space-x-2">
                                        <TouchableOpacity onPress={() => { setEditProject(p); setEditValues(p); setModalVisible(true); }}>
                                            <MaterialIcons name="visibility" size={18} color="#444" />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => { setEditProject(p); setEditValues(p); setModalVisible(true); }}>
                                            <MaterialIcons name="edit" size={18} color="#444" />
                                        </TouchableOpacity>
                                        <TouchableOpacity>
                                            <MaterialIcons name="more-vert" size={18} color="#444" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))
                        )}
                    </View>
                </ScrollView>
            </View>
            {/* Pagination */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 10, borderTopWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#fff' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity disabled={page === 1} onPress={() => setPage(page - 1)}>
                        <MaterialIcons name="chevron-left" size={24} color={page === 1 ? '#ccc' : '#444'} />
                    </TouchableOpacity>
                    <Text style={{ marginHorizontal: 8, fontSize: 13, color: '#3b0764', fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' }}>{page} / {totalPages || 1}</Text>
                    <TouchableOpacity disabled={page === totalPages || totalPages === 0} onPress={() => setPage(page + 1)}>
                        <MaterialIcons name="chevron-right" size={24} color={page === totalPages || totalPages === 0 ? '#ccc' : '#444'} />
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 13, color: '#3b0764', marginRight: 8, fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' }}>Rows per page</Text>
                    <TouchableOpacity style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }} onPress={() => setRowsPerPage(rowsPerPage === 5 ? 10 : 5)}>
                        <Text style={{ fontSize: 13, color: '#3b0764', fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' }}>{rowsPerPage}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {/* Edit Modal */}
            <Modal visible={modalVisible} animationType="fade" transparent>
                <TouchableWithoutFeedback onPress={() => { setStatusDropdown(false); }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(24,24,27,0.38)' }}>
                        <TouchableWithoutFeedback>
                            <View style={{ backgroundColor: '#fff', borderRadius: 24, padding: 28, width: '92%', maxWidth: 480, shadowColor: '#a78bfa', shadowOpacity: 0.18, shadowRadius: 12 }}>
                                <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center', color: '#3b0764', fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' }}>Edit Project</Text>
                                <View style={{ marginBottom: 14 }}>
                                    <Text style={{ fontSize: 13, color: '#a1a1aa', marginBottom: 4, fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' }}>Project Name</Text>
                                    <TextInput
                                        style={{ borderWidth: 1, borderColor: editErrors.name ? '#ef4444' : '#e5e7eb', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 15, fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' }}
                                        value={editValues.name || ''}
                                        onChangeText={v => setEditValues(ev => ({ ...ev, name: v }))}
                                    />
                                    {editErrors.name && <Text style={{ color: '#ef4444', fontSize: 12, marginTop: 2, fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' }}>{editErrors.name}</Text>}
                                </View>
                                <View style={{ marginBottom: 14 }}>
                                    <Text style={{ fontSize: 13, color: '#a1a1aa', marginBottom: 4, fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' }}>Owner</Text>
                                    <TextInput
                                        style={{ borderWidth: 1, borderColor: editErrors.owner ? '#ef4444' : '#e5e7eb', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 15, fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' }}
                                        value={editValues.user ? `${editValues.user.firstName} ${editValues.user.lastName}` : ''}
                                        onChangeText={v => {
                                            const [firstName, ...rest] = v.split(' ');
                                            setEditValues(ev => ({
                                                ...ev,
                                                user: {
                                                    id: ev.user?.id || '',
                                                    firstName,
                                                    lastName: rest.join(' '),
                                                    email: ev.user?.email || '',
                                                    role: ev.user?.role || 'USER',
                                                    status: ev.user?.status || 'ACTIVE',
                                                    createdAt: ev.user?.createdAt || '',
                                                    workers: ev.user?.workers || [],
                                                }
                                            }));
                                        }}
                                    />
                                    {editErrors.owner && <Text style={{ color: '#ef4444', fontSize: 12, marginTop: 2, fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' }}>{editErrors.owner}</Text>}
                                </View>
                                <View style={{ flexDirection: 'row', marginBottom: 14 }}>
                                    <View style={{ flex: 1, marginRight: 8 }}>
                                        <Text style={{ fontSize: 13, color: '#a1a1aa', marginBottom: 4, fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' }}>Start Date</Text>
                                        <TextInput
                                            style={{ borderWidth: 1, borderColor: editErrors.start ? '#ef4444' : '#e5e7eb', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 15, fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' }}
                                            value={editValues.createdAt?.slice(0,10) || ''}
                                            onChangeText={v => setEditValues(ev => ({ ...ev, createdAt: v }))}
                                        />
                                        {editErrors.start && <Text style={{ color: '#ef4444', fontSize: 12, marginTop: 2, fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' }}>{editErrors.start}</Text>}
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 13, color: '#a1a1aa', marginBottom: 4, fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' }}>End Date</Text>
                                        <TextInput
                                            style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 15, fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' }}
                                            value={editValues.targetDate?.slice(0,10) || ''}
                                            onChangeText={v => setEditValues(ev => ({ ...ev, targetDate: v }))}
                                        />
                                    </View>
                                </View>
                                <View style={{ marginBottom: 14 }}>
                                    <Text style={{ fontSize: 13, color: '#a1a1aa', marginBottom: 4, fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' }}>Status</Text>
                                    <TouchableOpacity
                                        style={{ borderWidth: 1, borderColor: editErrors.status ? '#ef4444' : '#e5e7eb', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                                        onPress={() => setStatusDropdown(!statusDropdown)}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={{ fontSize: 15, color: '#3b0764', fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' }}>{editValues.status || 'Select status'}</Text>
                                        <MaterialIcons name={statusDropdown ? 'expand-less' : 'expand-more'} size={20} color="#888" />
                                    </TouchableOpacity>
                                    {statusDropdown && (
                                        <View style={{ position: 'absolute', zIndex: 10, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, shadowColor: '#a78bfa', shadowOpacity: 0.10, shadowRadius: 8, marginTop: 4, width: '80%', left: '10%' }}>
                                            {statusOptions.map(opt => (
                                                <TouchableOpacity
                                                    key={opt}
                                                    style={{ paddingHorizontal: 16, paddingVertical: 10 }}
                                                    onPress={() => {
                                                        setEditValues(ev => ({
                                                            ...ev,
                                                            status: opt as ProjectStatus
                                                        }));
                                                        setStatusDropdown(false);
                                                    }}
                                                >
                                                    <Text style={{ fontSize: 15, color: '#3b0764', fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' }}>{opt}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    )}
                                    {editErrors.status && <Text style={{ color: '#ef4444', fontSize: 12, marginTop: 2, fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' }}>{editErrors.status}</Text>}
                                </View>
                                <View style={{ marginBottom: 18 }}>
                                    <Text style={{ fontSize: 13, color: '#a1a1aa', marginBottom: 4, fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' }}>Progress (%)</Text>
                                    <TextInput
                                        style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 15, fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' }}
                                        value={String(editValues.progress ?? '')}
                                        keyboardType="numeric"
                                        onChangeText={v => setEditValues(ev => ({ ...ev, progress: Number(v) }))}
                                    />
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                    <TouchableOpacity onPress={() => { setModalVisible(false); setEditProject(null); setStatusDropdown(false); setEditErrors({}); }} style={{ paddingHorizontal: 24, paddingVertical: 10, backgroundColor: '#e5e7eb', borderRadius: 999, marginRight: 8 }}>
                                        <Text style={{ color: '#3b0764', fontWeight: 'bold', fontSize: 15, fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' }}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={handleSave} style={{ paddingHorizontal: 24, paddingVertical: 10, backgroundColor: '#2563eb', borderRadius: 999 }}>
                                        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15, fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' }}>Save</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
}
