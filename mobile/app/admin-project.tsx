import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

const summary = [
    { label: 'Projects', value: 5, sub: '1 Completed', color: 'bg-white', text: 'text-green-700', icon: <MaterialIcons name="check-circle" size={16} color="#22c55e" /> },
    { label: 'Goals', value: 21, sub: '', color: 'bg-white', text: 'text-green-700', icon: <MaterialIcons name="flag" size={16} color="#22c55e" /> },
    { label: 'Progress', value: '48%', sub: '', color: 'bg-white', text: 'text-blue-700', icon: <MaterialIcons name="trending-up" size={16} color="#2563eb" /> },
];

const initialProjects = [
    { name: 'Dairy Processing Unit', owner: 'Michael Wilson', start: '2023-06-15', end: '2023-11-30', status: 'On Hold', progress: 15 },
    { name: 'Poultry Expansion', owner: 'Jane Smith', start: '2023-05-10', end: '2023-12-31', status: 'Active', progress: 30 },
    { name: 'Fruit Orchard', owner: 'Emily Davis', start: '2023-04-01', end: '2025-12-31', status: 'Active', progress: 20 },
    { name: 'Maize Farm 2023', owner: 'John Doe', start: '2023-03-15', end: '2023-09-15', status: 'Active', progress: 75 },
    { name: 'Irrigation System', owner: 'Robert Johnson', start: '2023-02-01', end: '2023-04-30', status: 'Completed', progress: 100 },
];

const statusColors = {
    'Active': { bg: 'bg-blue-500', text: 'text-white' },
    'Completed': { bg: 'bg-green-500', text: 'text-white' },
    'On Hold': { bg: 'bg-yellow-400', text: 'text-white' },
};

const filters = ['All', 'Active', 'Completed', 'On Hold'];

const statusOptions = ['Active', 'Completed', 'On Hold'];

type Project = typeof initialProjects[number];

export default function AdminProject() {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const router = useRouter();
    const [modalVisible, setModalVisible] = useState(false);
    const [editProject, setEditProject] = useState<Project | null>(null);
    const [editValues, setEditValues] = useState<Partial<Project>>({});
    const [statusDropdown, setStatusDropdown] = useState(false);
    const [editErrors, setEditErrors] = useState<{ [k: string]: string }>({});

    const filteredProjects = initialProjects.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.owner.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'All' ? true : p.status === filter;
        return matchesSearch && matchesFilter;
    });
    const totalPages = Math.ceil(filteredProjects.length / rowsPerPage);
    const pagedProjects = filteredProjects.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    const validateEdit = () => {
        const errs: { [k: string]: string } = {};
        if (!editValues.name) errs.name = 'Project name is required';
        if (!editValues.owner) errs.owner = 'Owner is required';
        if (!editValues.start) errs.start = 'Start date is required';
        if (!editValues.status) errs.status = 'Status is required';
        setEditErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSave = () => {
        if (!editProject) return;
        if (!validateEdit()) return;
        const idx = initialProjects.findIndex(p => p.name === editProject.name);
        if (idx !== -1) {
            initialProjects[idx] = { ...editProject, ...editValues } as Project;
        }
        setEditProject(null);
        setEditValues({});
        setEditErrors({});
        setModalVisible(false);
    };

    return (
        <View className="flex-1 bg-white">
            {/* Header with back button */}
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
                            <Text className={`text-2xl font-bold ml-2 ${s.text}`}>{s.value}</Text>
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
                        {pagedProjects.map((p, idx) => (
                            <View key={p.name} className="flex-row border-b border-gray-100 items-center py-2">
                                <Text className="w-40 px-2 text-gray-800" numberOfLines={1}>{p.name}</Text>
                                <Text className="w-32 px-2 text-gray-800" numberOfLines={1}>{p.owner}</Text>
                                <Text className="w-28 px-2 text-gray-800 text-xs">{p.start}</Text>
                                <Text className="w-28 px-2 text-gray-800 text-xs">{p.end}</Text>
                                <View className="w-24 px-2">
                                    <Text className={`px-2 py-0.5 rounded-full text-xs font-semibold text-center ${statusColors[p.status as 'Active' | 'Completed' | 'On Hold'].bg} ${statusColors[p.status as 'Active' | 'Completed' | 'On Hold'].text}`}>{p.status}</Text>
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
                        ))}
                    </View>
                </ScrollView>
            </View>
            {/* Pagination */}
            <View className="flex-row items-center justify-between px-4 py-2 border-t border-gray-100 bg-white">
                <View className="flex-row items-center">
                    <TouchableOpacity disabled={page === 1} onPress={() => setPage(page - 1)}>
                        <MaterialIcons name="chevron-left" size={24} color={page === 1 ? '#ccc' : '#444'} />
                    </TouchableOpacity>
                    <Text className="mx-2 text-xs text-gray-700">{page} / {totalPages || 1}</Text>
                    <TouchableOpacity disabled={page === totalPages || totalPages === 0} onPress={() => setPage(page + 1)}>
                        <MaterialIcons name="chevron-right" size={24} color={page === totalPages || totalPages === 0 ? '#ccc' : '#444'} />
                    </TouchableOpacity>
                </View>
                <View className="flex-row items-center">
                    <Text className="text-xs text-gray-700 mr-1">Rows per page</Text>
                    <TouchableOpacity className="border border-gray-300 rounded px-2 py-1" onPress={() => setRowsPerPage(rowsPerPage === 5 ? 10 : 5)}>
                        <Text className="text-xs text-gray-700">{rowsPerPage}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {/* Edit Modal */}
            <Modal visible={modalVisible} animationType="fade" transparent>
                <TouchableWithoutFeedback onPress={() => { setStatusDropdown(false); }}>
                    <View className="flex-1 justify-center items-center bg-black bg-opacity-30">
                        <TouchableWithoutFeedback>
                            <View className="bg-white rounded-2xl p-6 w-11/12 max-w-lg shadow-lg">
                                <Text className="text-lg font-bold mb-4 text-center">Edit Project</Text>
                                <View className="mb-3">
                                    <Text className="text-xs text-gray-500 mb-1">Project Name</Text>
                                    <TextInput
                                        className={`border ${editErrors.name ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
                                        value={editValues.name || ''}
                                        onChangeText={v => setEditValues(ev => ({ ...ev, name: v }))}
                                    />
                                    {editErrors.name && <Text className="text-red-500 text-xs mt-1">{editErrors.name}</Text>}
                                </View>
                                <View className="mb-3">
                                    <Text className="text-xs text-gray-500 mb-1">Owner</Text>
                                    <TextInput
                                        className={`border ${editErrors.owner ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
                                        value={editValues.owner || ''}
                                        onChangeText={v => setEditValues(ev => ({ ...ev, owner: v }))}
                                    />
                                    {editErrors.owner && <Text className="text-red-500 text-xs mt-1">{editErrors.owner}</Text>}
                                </View>
                                <View className="mb-3 flex-row space-x-2">
                                    <View className="flex-1">
                                        <Text className="text-xs text-gray-500 mb-1">Start Date</Text>
                                        <TextInput
                                            className={`border ${editErrors.start ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2`}
                                            value={editValues.start || ''}
                                            onChangeText={v => setEditValues(ev => ({ ...ev, start: v }))}
                                        />
                                        {editErrors.start && <Text className="text-red-500 text-xs mt-1">{editErrors.start}</Text>}
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-xs text-gray-500 mb-1">End Date</Text>
                                        <TextInput
                                            className="border border-gray-300 rounded px-3 py-2"
                                            value={editValues.end || ''}
                                            onChangeText={v => setEditValues(ev => ({ ...ev, end: v }))}
                                        />
                                    </View>
                                </View>
                                <View className="mb-3">
                                    <Text className="text-xs text-gray-500 mb-1">Status</Text>
                                    <TouchableOpacity
                                        className={`border ${editErrors.status ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-2 flex-row items-center justify-between`}
                                        onPress={() => setStatusDropdown(!statusDropdown)}
                                        activeOpacity={0.8}
                                    >
                                        <Text className="text-base text-gray-700">{editValues.status || 'Select status'}</Text>
                                        <MaterialIcons name={statusDropdown ? 'expand-less' : 'expand-more'} size={20} color="#888" />
                                    </TouchableOpacity>
                                    {statusDropdown && (
                                        <View className="absolute z-10 bg-white border border-gray-200 rounded shadow mt-1 w-10/12 self-center left-0 right-0">
                                            {statusOptions.map(opt => (
                                                <TouchableOpacity
                                                    key={opt}
                                                    className="px-4 py-2 hover:bg-gray-100"
                                                    onPress={() => {
                                                        setEditValues(ev => ({ ...ev, status: opt }));
                                                        setStatusDropdown(false);
                                                    }}
                                                >
                                                    <Text className="text-gray-700">{opt}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    )}
                                    {editErrors.status && <Text className="text-red-500 text-xs mt-1">{editErrors.status}</Text>}
                                </View>
                                <View className="mb-6">
                                    <Text className="text-xs text-gray-500 mb-1">Progress (%)</Text>
                                    <TextInput
                                        className="border border-gray-300 rounded px-3 py-2"
                                        value={String(editValues.progress ?? '')}
                                        keyboardType="numeric"
                                        onChangeText={v => setEditValues(ev => ({ ...ev, progress: Number(v) }))}
                                    />
                                </View>
                                <View className="flex-row justify-end space-x-2">
                                    <TouchableOpacity onPress={() => { setModalVisible(false); setEditProject(null); setStatusDropdown(false); setEditErrors({}); }} className="px-5 py-2 bg-gray-100 rounded-full">
                                        <Text className="text-gray-700 font-semibold">Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={handleSave} className="px-5 py-2 bg-blue-700 rounded-full">
                                        <Text className="text-white font-semibold">Save</Text>
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
