import { useAdmin } from '@/hooks/useAdmin';
import { Loan } from '@/types';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';


type LoanSummaryProps = {
    totalLoans: number;
    totalAmount: number;
    approvedAmount: number;
    statusCounts: { [key: string]: number };
};

// Loan summary and status bar component
function LoanSummary({ totalLoans, totalAmount, approvedAmount, statusCounts }: LoanSummaryProps) {

    return (
        <View className="bg-[#faf9fd] border border-gray-200 rounded-2xl shadow-sm p-5 mb-4">
            <View className="flex-row justify-between mb-2">
                <View className="items-center flex-1">
                    <Text className="text-2xl font-bold">{totalLoans}</Text>
                    <Text className="text-xs text-gray-500 mt-1">Total Loans</Text>
                </View>
                <View className="items-center flex-1">
                    <Text className="text-2xl font-bold">${totalAmount.toLocaleString()}</Text>
                    <Text className="text-xs text-gray-500 mt-1">Total Amount</Text>
                </View>
                <View className="items-center flex-1">
                    <Text className="text-2xl font-bold">${approvedAmount.toLocaleString()}</Text>
                    <Text className="text-xs text-gray-500 mt-1">Approved Amount</Text>
                </View>
            </View>
            <View className="h-px bg-gray-200 my-3" />
            <View className="space-y-2">
                <View className="flex-col items-start">
                    <Text className="text-xs text-gray-700 mr-2 w-28">Approved: {statusCounts.Approved}</Text>
                    <View className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <View className="h-2 bg-green-500 rounded-full" style={{ width: `${statusCounts.Approved / (statusCounts.Approved + statusCounts.Pending + statusCounts['Under Review'] + statusCounts.Rejected) * 100 || 0}%` }} />
                    </View>
                </View>
                <View className="flex-col items-start">
                    <Text className="text-xs text-gray-700 mr-2 w-28">Pending/Review: {statusCounts.Pending + statusCounts['Under Review']}</Text>
                    <View className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <View className="h-2 bg-yellow-400 rounded-full" style={{ width: `${(statusCounts.Pending + statusCounts['Under Review']) / (statusCounts.Approved + statusCounts.Pending + statusCounts['Under Review'] + statusCounts.Rejected) * 100 || 0}%` }} />
                    </View>
                </View>
                <View className="flex-col items-start">
                    <Text className="text-xs text-gray-700 mr-2 w-28">Rejected: {statusCounts.Rejected}</Text>
                    <View className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <View className="h-2 bg-red-500 rounded-full" style={{ width: `${statusCounts.Rejected / (statusCounts.Approved + statusCounts.Pending + statusCounts['Under Review'] + statusCounts.Rejected) * 100 || 0}%` }} />
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
    console.log('loans \n',loans)
    const totalPages = Math.ceil(loans.length / rowsPerPage);
    const pagedLoans = loans.slice((page - 1) * rowsPerPage, page * rowsPerPage);
    return (
        <View>
            <ScrollView horizontal showsHorizontalScrollIndicator className="w-full">
                <View className="min-w-[900px]">
                    <View className="flex-row border-b border-gray-200 bg-gray-50">
                        <Text className="w-40 px-2 py-2 font-semibold text-xs text-gray-500">Applicant</Text>
                        <Text className="w-48 px-2 py-2 font-semibold text-xs text-gray-500">Loan Type</Text>
                        <Text className="w-32 px-2 py-2 font-semibold text-xs text-gray-500">Amount</Text>
                        <Text className="w-24 px-2 py-2 font-semibold text-xs text-gray-500">Term (months)</Text>
                        <Text className="w-32 px-2 py-2 font-semibold text-xs text-gray-500">Status</Text>
                        <Text className="w-32 px-2 py-2 font-semibold text-xs text-gray-500">Application Date</Text>
                        <Text className="w-32 px-2 py-2 font-semibold text-xs text-gray-500">Actions</Text>
                    </View>
                    {pagedLoans.map((loan: Loan, idx: number) => (
                        <View key={loan.id} className="flex-row border-b border-gray-100 items-center">
                            <Text className="w-40 px-2 py-2 text-gray-800" numberOfLines={1}>{loan.details.name}</Text>
                            <Text className="w-48 px-2 py-2 text-gray-800" numberOfLines={1}>{loan.details.description}</Text>
                            <Text className="w-32 px-2 py-2 text-gray-800">${loan.details.amount.toLocaleString()}</Text>
                            <Text className="w-24 px-2 py-2 text-gray-800">{loan.details.term}</Text>
                            <View className="w-32 px-2 py-2 flex-row items-center">
                                {loan.status === 'APPROVED' && <Text className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">Approved</Text>}
                                {loan.status === 'PENDING' && <Text className="bg-yellow-400 text-white px-3 py-1 rounded-full text-xs font-semibold">Pending</Text>}
                                {loan.status === 'REJECTED' && <Text className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">Rejected</Text>}
                            </View>
                            <Text className="w-32 px-2 py-2 text-gray-800">{new Date(loan.createdAt).toLocaleDateString()}</Text>
                            <View className="w-32 px-2 py-2 flex-row justify-center space-x-2">
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
            <View className="flex-row items-center justify-between mt-2 px-2">
                <View className="flex-row items-center">
                    <Text className="text-xs text-gray-500 mr-2">Rows per page</Text>
                    <TouchableOpacity className="border border-gray-300 rounded px-2 py-1" onPress={() => setRowsPerPage(5)}><Text>5</Text></TouchableOpacity>
                    <TouchableOpacity className="border border-gray-300 rounded px-2 py-1 ml-1" onPress={() => setRowsPerPage(10)}><Text>10</Text></TouchableOpacity>
                </View>
                <Text className="text-xs text-gray-500">{(page - 1) * rowsPerPage + 1}-{Math.min(page * rowsPerPage, loans.length)} of {loans.length}</Text>
                <View className="flex-row items-center">
                    <TouchableOpacity disabled={page === 1} onPress={() => setPage(page - 1)} className="p-1"><MaterialIcons name="chevron-left" size={20} color={page === 1 ? '#ccc' : '#222'} /></TouchableOpacity>
                    <TouchableOpacity disabled={page === totalPages} onPress={() => setPage(page + 1)} className="p-1"><MaterialIcons name="chevron-right" size={20} color={page === totalPages ? '#ccc' : '#222'} /></TouchableOpacity>
                </View>
            </View>
        </View>
    );
}


export default function AdminLoans() {
    const { loans } = useAdmin()
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
                    loans={loans}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    setPage={setPage}
                    setRowsPerPage={setRowsPerPage}
                />
            </View>
        </View>
    );
}
