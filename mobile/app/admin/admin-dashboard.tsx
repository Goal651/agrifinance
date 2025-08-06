import { useAdmin } from '@/hooks/useAdmin';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View, ActivityIndicator, StyleSheet } from 'react-native';

// Reusable Summary Card Component
const SummaryCard = ({
    title,
    count,
    icon,
    color,
    onPress
}: {
    title: string;
    count: number;
    icon: string;
    color: string;
    onPress: () => void;
}) => (
    <TouchableOpacity
        onPress={onPress}
        style={styles.summaryCard}
    >
        <View style={styles.summaryCardInner}>
            <View style={[styles.summaryIconContainer, { backgroundColor: `${color}1A` }]}>
                <MaterialIcons name={icon as any} size={24} color={color} />
            </View>
            <View style={styles.summaryTextContainer}>
                <Text style={styles.summaryCount}>{count}</Text>
                <Text style={styles.summaryTitle}>{title}</Text>
            </View>
        </View>
    </TouchableOpacity>
);

// Reusable List Item Component
const ListItem = ({
    title,
    subtitle,
    value,
    onPress
}: {
    title: string;
    subtitle: string;
    value?: string | number;
    onPress: () => void;
}) => (
    <TouchableOpacity
        onPress={onPress}
        style={styles.listItem}
    >
        <View style={styles.listItemContent}>
            <View>
                <Text style={styles.listItemTitle}>{title}</Text>
                <Text style={styles.listItemSubtitle}>{subtitle}</Text>
            </View>
            {value && <Text style={styles.listItemValue}>{value}</Text>}
        </View>
    </TouchableOpacity>
);

// Quick Action Button Component
const QuickActionButton = ({
    icon,
    label,
    color,
    onPress
}: {
    icon: string;
    label: string;
    color: string;
    onPress: () => void;
}) => (
    <TouchableOpacity
        onPress={onPress}
        style={[styles.quickAction, { width: '48%' }]}
    >
        <View style={[styles.quickActionIcon, { backgroundColor: `${color}1A` }]}>
            <MaterialIcons name={icon as any} size={24} color={color} />
        </View>
        <Text style={styles.quickActionText}>{label}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 120,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(248, 250, 252, 0.8)',
    },
    header: {
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 28,
        fontFamily: 'Poppins_600SemiBold',
        color: '#14532d',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 16,
        fontFamily: 'Poppins_400Regular',
        color: 'rgba(20, 83, 45, 0.8)',
    },
    summaryCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 20,
        padding: 16,
        margin: 4,
        flex: 1,
        minWidth: '45%',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    summaryCardInner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    summaryIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    summaryTextContainer: {
        alignItems: 'flex-end',
    },
    summaryCount: {
        fontSize: 24,
        fontFamily: 'Poppins_600SemiBold',
        color: '#14532d',
    },
    summaryTitle: {
        fontSize: 12,
        fontFamily: 'Poppins_400Regular',
        color: 'rgba(20, 83, 45, 0.8)',
    },
    listItem: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.7)',
    },
    listItemContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    listItemTitle: {
        fontSize: 16,
        fontFamily: 'Poppins_500Medium',
        color: '#14532d',
        marginBottom: 4,
    },
    listItemSubtitle: {
        fontSize: 12,
        fontFamily: 'Poppins_400Regular',
        color: 'rgba(20, 83, 45, 0.7)',
    },
    listItemValue: {
        fontSize: 16,
        fontFamily: 'Poppins_600SemiBold',
        color: '#22c55e',
    },
    quickAction: {
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.7)',
        marginBottom: 16,
    },
    quickActionIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    quickActionText: {
        fontSize: 14,
        fontFamily: 'Poppins_500Medium',
        color: '#14532d',
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: 20,
        fontFamily: 'Poppins_600SemiBold',
        color: '#14532d',
        marginTop: 24,
        marginBottom: 16,
    },
    sectionContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    viewAllButton: {
        alignSelf: 'flex-end',
        padding: 8,
        marginTop: 8,
    },
    viewAllText: {
        color: '#22c55e',
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
    },
});

export default function AdminDashboard() {
    const router = useRouter();
    const { loans, users, projects, loading } = useAdmin();

    // Get counts for summary cards
    const pendingLoans = loans.filter(loan => loan.status === 'PENDING').length;
    const activeLoans = loans.filter(loan => loan.status === 'APPROVED').length;
    const activeUsers = users.filter(user => user.status === 'ACTIVE').length;
    const activeProjects = projects.filter(project => project.status === 'IN_PROGRESS').length;

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#22c55e" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Admin Dashboard</Text>
                    <Text style={styles.headerSubtitle}>Welcome back! Here&apos;s what&apos;s happening.</Text>
                </View>

                {/* Summary Cards */}
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -4, marginBottom: 24 }}>
                    <SummaryCard
                        title="Pending Loans"
                        count={pendingLoans}
                        icon="pending-actions"
                        color="#F59E0B"
                        onPress={() => router.push('/admin/loan-approvals')}
                    />
                    <SummaryCard
                        title="Active Users"
                        count={activeUsers}
                        icon="people"
                        color="#3B82F6"
                        onPress={() => router.push('/admin/users')}
                    />
                    <SummaryCard
                        title="Active Projects"
                        count={activeProjects}
                        icon="folder"
                        color="#10B981"
                        onPress={() => router.push('/admin/admin-project')}
                    />
                </View>

                {/* Recent Activity */}
                <View style={styles.sectionContainer}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <Text style={styles.sectionTitle}>Recent Activity</Text>
                        <TouchableOpacity style={styles.viewAllButton} onPress={() => { }}>
                            <Text style={styles.viewAllText}>View All</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ gap: 12 }}>
                        <ListItem
                            title="Pending Loan Approvals"
                            subtitle={`${pendingLoans} loans awaiting review`}
                            value={pendingLoans > 0 ? 'Action Required' : 'All clear'}
                            onPress={() => router.push('/admin/loan-approvals')}
                        />
                        <ListItem
                            title="Active Loans"
                            subtitle={`${activeLoans} currently active`}
                            value={`${loans.length} total`}
                            onPress={() => router.push('/admin/loans')}
                        />
                        <ListItem
                            title="Recent Users"
                            subtitle={`${Math.min(users.length, 5)} new this week`}
                            value={`${users.length} total`}
                            onPress={() => router.push('/admin/users')}
                        />
                    </View>
                </View>

                {/* Quick Actions */}
                <View style={{ marginBottom: 24 }}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                        <QuickActionButton
                            icon="check-circle"
                            label="Review Loans"
                            color="#10B981"
                            onPress={() => router.push('/admin/loan-approvals')}
                        />
                        <QuickActionButton
                            icon="person-add"
                            label="Add User"
                            color="#3B82F6"
                            onPress={() => router.push('/admin/users/new')}
                        />
                        <QuickActionButton
                            icon="add-task"
                            label="New Project"
                            color="#8B5CF6"
                            onPress={() => router.push('/admin/admin-project')}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
