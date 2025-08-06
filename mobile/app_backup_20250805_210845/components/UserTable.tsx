import { User } from '@/types';
import { MaterialIcons } from '@expo/vector-icons';
import { ScrollView, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';

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

type MaterialIconName = React.ComponentProps<typeof MaterialIcons>['name'];

const ROWS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

export default function UserTable({
    users,
    onView,
    onEdit,
    onDelete,
    page,
    rowsPerPage,
    setPage,
    setRowsPerPage
}: UserTableProps) {
    const { width } = useWindowDimensions();
    const isSmallScreen = width < 640;
    const totalPages = Math.ceil(users.length / rowsPerPage);
    const pagedUsers = users.slice((page - 1) * rowsPerPage, page * rowsPerPage);
    const startItem = (page - 1) * rowsPerPage + 1;
    const endItem = Math.min(page * rowsPerPage, users.length);


    const renderActionButton = (icon: MaterialIconName, color: string, onPress: () => void) => (
        <TouchableOpacity
            className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200"
            onPress={onPress}
        >
            <MaterialIcons name={icon} size={20} color={color} />
        </TouchableOpacity>
    );

    return (
        <View className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={true}
                contentContainerStyle={{ minWidth: isSmallScreen ? '100%' : 'auto' }}
                className="w-full"
            >
                <View className="min-w-full">
                    {/* Table Header */}
                    <View className="flex-row bg-gray-50 border-b border-gray-200">
                        {!isSmallScreen && (
                            <>
                                <HeaderCell width={160}>Name</HeaderCell>
                                <HeaderCell width={200}>Email</HeaderCell>
                                <HeaderCell width={140}>Status</HeaderCell>
                                <HeaderCell width={140}>Role</HeaderCell>
                            </>
                        )}
                        <HeaderCell width={isSmallScreen ? 120 : 100}>Actions</HeaderCell>
                    </View>

                    {/* Table Rows */}
                    {pagedUsers.length > 0 ? (
                        pagedUsers.map((user) => (
                            <View
                                key={user.id}
                                className="flex-row border-b border-gray-100 hover:bg-gray-50"
                            >
                                {!isSmallScreen && (
                                    <>
                                        <Cell width={160} text={`${user.firstName} ${user.lastName}`} />
                                        <Cell width={200} text={user.email} />
                                        <Cell width={140} text={user.status || 'N/A'} />
                                        <Cell width={140} text={user.role|| 'N/A'} />
                                    </>
                                )}
                                <View className={`py-2 flex-row items-center ${isSmallScreen ? 'px-4' : 'px-2'}`} style={{ width: isSmallScreen ? 120 : 140 }}>
                                    {renderActionButton('visibility', '#3b82f6', () => onView(user))}
                                    {renderActionButton('edit', '#f59e0b', () => onEdit(user))}
                                    {renderActionButton('delete', '#ef4444', () => onDelete(user))}
                                </View>
                            </View>
                        ))
                    ) : (
                        <View className="py-8 items-center justify-center">
                            <Text className="text-gray-500">No users found</Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Pagination */}
            <View className="flex-col md:flex-row items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
                <View className="flex-row items-center mb-2 md:mb-0">
                    <Text className="text-sm text-gray-600 mr-2">Rows per page:</Text>
                    <View className="flex-row border border-gray-300 rounded-md overflow-hidden">
                        {ROWS_PER_PAGE_OPTIONS.map((option) => (
                            <TouchableOpacity
                                key={option}
                                onPress={() => setRowsPerPage(option)}
                                className={`px-3 py-1 ${rowsPerPage === option ? 'bg-blue-50 border-b-2 border-blue-500' : 'bg-white'}`}
                            >
                                <Text className={`text-sm ${rowsPerPage === option ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
                                    {option}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View className="flex-row items-center space-x-4">
                    <Text className="text-sm text-gray-600">
                        {startItem}-{endItem} of {users.length}
                    </Text>
                    <View className="flex-row border border-gray-300 rounded-md overflow-hidden">
                        <PaginationButton
                            icon="chevron-left"
                            disabled={page === 1}
                            onPress={() => setPage(page - 1)}
                        />
                        <View className="border-l border-r border-gray-300">
                            <Text className="px-3 py-1 text-sm text-gray-700 bg-white">
                                {page}
                            </Text>
                        </View>
                        <PaginationButton
                            icon="chevron-right"
                            disabled={page === totalPages}
                            onPress={() => setPage(page + 1)}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
}

// Helper Components
const HeaderCell = ({ children, width }: { children: React.ReactNode; width?: number }) => (
    <View className="px-4 py-3" style={{ width }}>
        <Text className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            {children}
        </Text>
    </View>
);

const Cell = ({ text, width }: { text: string | number; width?: number }) => (
    <View className="px-4 py-3" style={{ width }}>
        <Text className="text-sm text-gray-900 truncate" numberOfLines={1}>
            {text}
        </Text>
    </View>
);

const PaginationButton = ({
    icon,
    onPress,
    disabled
}: {
    icon: MaterialIconName;
    onPress: () => void;
    disabled: boolean
}) => (
    <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        className={`px-3 py-1 ${disabled ? 'bg-gray-100' : 'bg-white hover:bg-gray-50'}`}
    >
        <MaterialIcons
            name={icon}
            size={20}
            color={disabled ? '#9ca3af' : '#4b5563'}
        />
    </TouchableOpacity>
);