import { useAdmin } from '@/contexts/AdminContext';
import { Loan } from '@/types';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';


type LoanSummaryProps = {
    totalLoans: number;
    totalAmount: number;
    approvedAmount: number;
    statusCounts: { [key: string]: number };
};

// Loan summary and status bar component
function LoanSummary({ totalLoans, totalAmount, approvedAmount, statusCounts }: LoanSummaryProps) {
    return (
        <View style={{ backgroundColor: 'rgba(250,249,253,0.85)', borderRadius: 24, borderWidth: 1, borderColor: '#e9d5ff', shadowColor: '#a78bfa', shadowOpacity: 0.13, shadowRadius: 16, shadowOffset: { width: 0, height: 4 }, padding: 22, marginBottom: 18 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <View style={{ alignItems: 'center', flex: 1 }}>
                    <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#7c3aed', fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' }}>{totalLoans}</Text>
                    <Text style={{ fontSize: 12, color: '#a1a1aa', marginTop: 2, fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' }}>Total Loans</Text>
                </View>
                <View style={{ alignItems: 'center', flex: 1 }}>
                    <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#7c3aed', fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' }}>${totalAmount.toLocaleString()}</Text>
                    <Text style={{ fontSize: 12, color: '#a1a1aa', marginTop: 2, fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' }}>Total Amount</Text>
                </View>
                <View style={{ alignItems: 'center', flex: 1 }}>
                    <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#7c3aed', fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' }}>${approvedAmount.toLocaleString()}</Text>
                    <Text style={{ fontSize: 12, color: '#a1a1aa', marginTop: 2, fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' }}>Approved Amount</Text>
                </View>
            </View>
            <View style={{ height: 1, backgroundColor: '#e9d5ff', marginVertical: 10 }} />
            <View>
                <View style={{ marginBottom: 6 }}>
                    <Text style={{ fontSize: 12, color: '#22c55e', fontWeight: 'bold', fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' }}>Approved: {statusCounts.Approved}</Text>
                    <View style={{ height: 8, backgroundColor: '#e5e7eb', borderRadius: 8, overflow: 'hidden', marginTop: 2 }}>
                        <View style={{ height: 8, backgroundColor: '#22c55e', borderRadius: 8, width: `${statusCounts.Approved / (statusCounts.Approved + statusCounts.Pending + (statusCounts['Under Review'] || 0) + statusCounts.Rejected) * 100 || 0}%` }} />
                    </View>
                </View>
                <View style={{ marginBottom: 6 }}>
                    <Text style={{ fontSize: 12, color: '#eab308', fontWeight: 'bold', fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' }}>Pending/Review: {statusCounts.Pending + (statusCounts['Under Review'] || 0)}</Text>
                    <View style={{ height: 8, backgroundColor: '#e5e7eb', borderRadius: 8, overflow: 'hidden', marginTop: 2 }}>
                        <View style={{ height: 8, backgroundColor: '#eab308', borderRadius: 8, width: `${(statusCounts.Pending + (statusCounts['Under Review'] || 0)) / (statusCounts.Approved + statusCounts.Pending + (statusCounts['Under Review'] || 0) + statusCounts.Rejected) * 100 || 0}%` }} />
                    </View>
                </View>
                <View>
                    <Text style={{ fontSize: 12, color: '#ef4444', fontWeight: 'bold', fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' }}>Rejected: {statusCounts.Rejected}</Text>
                    <View style={{ height: 8, backgroundColor: '#e5e7eb', borderRadius: 8, overflow: 'hidden', marginTop: 2 }}>
                        <View style={{ height: 8, backgroundColor: '#ef4444', borderRadius: 8, width: `${statusCounts.Rejected / (statusCounts.Approved + statusCounts.Pending + (statusCounts['Under Review'] || 0) + statusCounts.Rejected) * 100 || 0}%` }} />
                    </View>
                </View>
            </View>
        </View>
    );
}

type LoanTableProps = {
    loans: Loan[];
    page: number;
    rowsPerPage: number;
    setPage: (page: number) => void;
    setRowsPerPage: (rows: number) => void;
};

// Loan table component
function LoanTable({ loans, page, rowsPerPage, setPage, setRowsPerPage }: LoanTableProps) {
    const totalPages = Math.ceil(loans.length / rowsPerPage);
    const pagedLoans = loans.slice((page - 1) * rowsPerPage, page * rowsPerPage);
    if (loans.length === 0) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 64 }}>
                <MaterialIcons name="info-outline" size={54} color="#a78bfa" />
                <Text style={{ marginTop: 18, fontSize: 20, fontWeight: 'bold', color: '#a1a1aa', fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' }}>No loans found</Text>
                <Text style={{ fontSize: 15, color: '#c4b5fd', fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' }}>There are currently no loan records to display.</Text>
            </View>
        );
    }
    return (
        <View style={{ borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.85)', borderWidth: 1, borderColor: '#e9d5ff', shadowColor: '#a78bfa', shadowOpacity: 0.10, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, paddingBottom: 8 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator style={{ width: '100%' }}>
                <View style={{ minWidth: 900 }}>
                    <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#f3f4f6', borderTopLeftRadius: 24, borderTopRightRadius: 24 }}>
                        <Text style={{ width: 160, paddingHorizontal: 8, paddingVertical: 8, fontWeight: 'bold', fontSize: 13, color: '#a1a1aa', fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' }}>Applicant</Text>
                        <Text style={{ width: 192, paddingHorizontal: 8, paddingVertical: 8, fontWeight: 'bold', fontSize: 13, color: '#a1a1aa', fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' }}>Loan Type</Text>
                        <Text style={{ width: 128, paddingHorizontal: 8, paddingVertical: 8, fontWeight: 'bold', fontSize: 13, color: '#a1a1aa', fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' }}>Amount</Text>
                        <Text style={{ width: 96, paddingHorizontal: 8, paddingVertical: 8, fontWeight: 'bold', fontSize: 13, color: '#a1a1aa', fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' }}>Term (months)</Text>
                        <Text style={{ width: 128, paddingHorizontal: 8, paddingVertical: 8, fontWeight: 'bold', fontSize: 13, color: '#a1a1aa', fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' }}>Status</Text>
                        <Text style={{ width: 128, paddingHorizontal: 8, paddingVertical: 8, fontWeight: 'bold', fontSize: 13, color: '#a1a1aa', fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' }}>Application Date</Text>
                        <Text style={{ width: 128, paddingHorizontal: 8, paddingVertical: 8, fontWeight: 'bold', fontSize: 13, color: '#a1a1aa', fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' }}>Actions</Text>
                    </View>
                    {pagedLoans.map((loan: Loan) => (
                        <View key={loan.id} style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: '#f3f4f6', alignItems: 'center' }}>
                            <Text style={{ width: 160, paddingHorizontal: 8, paddingVertical: 8, color: '#3b0764', fontSize: 15, fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' }} numberOfLines={1}>{loan.details.name}</Text>
                            <Text style={{ width: 192, paddingHorizontal: 8, paddingVertical: 8, color: '#3b0764', fontSize: 15, fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' }} numberOfLines={1}>{loan.details.description}</Text>
                            <Text style={{ width: 128, paddingHorizontal: 8, paddingVertical: 8, color: '#3b0764', fontSize: 15, fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' }}>${loan.details.amount.toLocaleString()}</Text>
                            <Text style={{ width: 96, paddingHorizontal: 8, paddingVertical: 8, color: '#3b0764', fontSize: 15, fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' }}>{loan.details.term}</Text>
                            <View style={{ width: 128, paddingHorizontal: 8, paddingVertical: 8, flexDirection: 'row', alignItems: 'center' }}>
                                {loan.status === 'APPROVED' && <Text style={{ backgroundColor: '#22c55e', color: 'white', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999, fontSize: 13, fontWeight: 'bold', fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' }}>Approved</Text>}
                                {loan.status === 'PENDING' && <Text style={{ backgroundColor: '#eab308', color: 'white', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999, fontSize: 13, fontWeight: 'bold', fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' }}>Pending</Text>}
                                {loan.status === 'REJECTED' && <Text style={{ backgroundColor: '#ef4444', color: 'white', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999, fontSize: 13, fontWeight: 'bold', fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' }}>Rejected</Text>}
                            </View>
                            <Text style={{ width: 128, paddingHorizontal: 8, paddingVertical: 8, color: '#3b0764', fontSize: 15, fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' }}>{new Date(loan.createdAt).toLocaleDateString()}</Text>
                            <View style={{ width: 128, paddingHorizontal: 8, paddingVertical: 8, flexDirection: 'row', justifyContent: 'center' }}>
                                <TouchableOpacity>
                                    <MaterialIcons name="visibility" size={20} color="#2563eb" />
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <MaterialIcons name="edit" size={20} color="#fbbf24" />
                                </TouchableOpacity>
                                <TouchableOpacity>
                                    <MaterialIcons name="delete" size={20} color="#ef4444" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
            {/* Pagination Controls */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, paddingHorizontal: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 12, color: '#a1a1aa', marginRight: 8, fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' }}>Rows per page</Text>
                    <TouchableOpacity style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 }} onPress={() => setRowsPerPage(5)}><Text style={{ fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' }}>5</Text></TouchableOpacity>
                    <TouchableOpacity style={{ borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, marginLeft: 4 }} onPress={() => setRowsPerPage(10)}><Text style={{ fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' }}>10</Text></TouchableOpacity>
                </View>
                <Text style={{ fontSize: 12, color: '#a1a1aa', fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' }}>{(page - 1) * rowsPerPage + 1}-{Math.min(page * rowsPerPage, loans.length)} of {loans.length}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity disabled={page === 1} onPress={() => setPage(page - 1)} style={{ padding: 4 }}><MaterialIcons name="chevron-left" size={20} color={page === 1 ? '#ccc' : '#222'} /></TouchableOpacity>
                    <TouchableOpacity disabled={page === totalPages} onPress={() => setPage(page + 1)} style={{ padding: 4 }}><MaterialIcons name="chevron-right" size={20} color={page === totalPages ? '#ccc' : '#222'} /></TouchableOpacity>
                </View>
            </View>
        </View>
    );
}


export default function AdminLoans() {
    const { loans } = useAdmin();
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const router = useRouter();

    // Calculate summary
    const totalLoans = loans.length;
    const totalAmount = loans.reduce((sum, l) => sum + l.details.amount, 0);
    const approvedAmount = loans.filter(l => l.status === 'APPROVED').reduce((sum, l) => sum + l.details.amount, 0);
    const statusCounts = {
        Approved: loans.filter(l => l.status === 'APPROVED').length,
        Pending: loans.filter(l => l.status === 'PENDING').length,
        Rejected: loans.filter(l => l.status === 'REJECTED').length,
    };

    // Filter and search logic
    const filteredLoans = loans.filter(l => {
        const matchesSearch =
            l.details.name.toLowerCase().includes(search.toLowerCase()) ||
            l.details.description.toLowerCase().includes(search.toLowerCase());
        const matchesStatus =
            filter === 'All' ? true :
            filter === 'Pending' ? l.status === 'PENDING' :
            filter === 'Approved' ? l.status === 'APPROVED' :
            filter === 'Rejected' ? l.status === 'REJECTED' : true;
        return matchesSearch && matchesStatus;
    });

    return (
        <View className="flex-1 bg-gray-50">
            <View className="px-4 pt-8 pb-2 flex-row items-center justify-between">
                <TouchableOpacity onPress={() => router.back()} className="mr-2">
                    <MaterialIcons name="chevron-left" size={28} color="#444" />
                </TouchableOpacity>
                <Text className="text-xl font-bold flex-1 text-center">Loan Management</Text>
                <TouchableOpacity>
                    <MaterialIcons name="filter-list" size={24} color="#444" />
                </TouchableOpacity>
            </View>
            <View className="px-4">
                <LoanSummary totalLoans={totalLoans} totalAmount={totalAmount} approvedAmount={approvedAmount} statusCounts={statusCounts} />
                <View className="flex-row items-center bg-purple-50 rounded-lg px-3 py-2 mb-2">
                    <MaterialIcons name="search" size={20} color="#888" />
                    <TextInput
                        className="flex-1 ml-2 text-base"
                        placeholder="Search loans..."
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>
                <View className="flex-row space-x-2 mb-2">
                    {['All', 'Pending', 'Approved', 'Rejected'].map(tab => (
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
            <View className="flex-1 px-2">
                <LoanTable
                    loans={filteredLoans}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    setPage={setPage}
                    setRowsPerPage={setRowsPerPage}
                />
            </View>
        </View>
    );
}
