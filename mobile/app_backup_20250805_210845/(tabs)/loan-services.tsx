import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    Dimensions,
    GestureResponderEvent,
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import {
    BellIcon,
    CalculatorIcon,
    ClockIcon as ClockSolid,
    DocumentTextIcon,
    EllipsisHorizontalIcon,
    QuestionMarkCircleIcon
} from 'react-native-heroicons/outline';
import { BanknotesIcon, CurrencyDollarIcon } from 'react-native-heroicons/solid';

// Define route types that match your app's routing structure
type AppRoute = 
    | { pathname: '/loans/apply', params?: { product?: string } }
    | { pathname: '/loans/calculator' }
    | { pathname: '/loans/documents' }
    | { pathname: '/support' }
    | { pathname: '/notifications' };

// Define loan product type
interface LoanProduct {
    id: string;
    title: string;
    description: string;
    interestRate: string;
    amount: string;
    term: string;
    icon: React.ComponentType<{ size: number; color: string }>;
    color: string;
    bgColor: string;
}

// Define loan products data
const loanProducts: LoanProduct[] = [
    {
        id: 'personal',
        title: 'Personal Loan',
        description: 'Flexible personal loans for your needs',
        interestRate: '12.5%',
        amount: 'Up to $50,000',
        term: '1-5 years',
        icon: CurrencyDollarIcon,
        color: '#3B82F6',
        bgColor: '#DBEAFE'
    },
    {
        id: 'business',
        title: 'Business Loan',
        description: 'Grow your business with our financing',
        interestRate: '9.9%',
        amount: 'Up to $500,000',
        term: '1-10 years',
        icon: BanknotesIcon,
        color: '#10B981',
        bgColor: '#D1FAE5'
    },
    {
        id: 'emergency',
        title: 'Emergency Loan',
        description: 'Quick cash for unexpected expenses',
        interestRate: '15.5%',
        amount: 'Up to $10,000',
        term: '3-24 months',
        icon: ClockSolid,
        color: '#F59E0B',
        bgColor: '#FEF3C7'
    }
];

const LoanServicesScreen = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'overview' | 'myLoans' | 'calculator'>('overview');
    const [showMoreActions, setShowMoreActions] = useState(false);
    const [moreActionsPosition, setMoreActionsPosition] = useState({ x: 0, y: 0 });
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const moreActionsButtonRef = useRef<View>(null);

    useEffect(() => {
        // Initialize dimensions
        const { width, height } = Dimensions.get('window');
        setDimensions({ width, height });
    }, []);

    const handleMoreActions = (event: GestureResponderEvent) => {
        event.persist();
        const { pageX, pageY } = event.nativeEvent;
        setMoreActionsPosition({
            x: dimensions.width - pageX - 192, // 192 is the width of the menu
            y: pageY + 10
        });
        setShowMoreActions(true);
    };

    const handleRoute = (route: AppRoute) => {
        // Convert route to expo-router compatible format
        const path = route.pathname.startsWith('/') ? route.pathname.slice(1) : route.pathname;
        const routePath = `/(tabs)/${path}` as const;
        
        if (route.pathname === '/loans/apply' && route.params?.product) {
            router.push({
                pathname: routePath,
                params: { product: route.params.product }
            } as any);
        } else {
            router.push(routePath as any);
        }
        setShowMoreActions(false);
    };

    const handleActionSelect = (action: string) => {
        switch (action) {
            case 'calculator':
                handleRoute({ pathname: '/loans/calculator' });
                break;
            case 'documents':
                handleRoute({ pathname: '/loans/documents' });
                break;
            case 'support':
                handleRoute({ pathname: '/support' });
                break;
        }
    };

    const handleNotificationPress = () => {
        handleRoute({ pathname: '/notifications' });
    };

    const applyForLoan = (productId: string) => {
        handleRoute({
            pathname: '/loans/apply',
            params: { product: productId }
        });
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <View className="space-y-6">
                        <View className="flex-row justify-between items-center">
                            <Text className="text-2xl font-bold text-gray-900">Available Loans</Text>
                            <TouchableOpacity
                                onPress={() => setActiveTab('myLoans')}
                                className="px-4 py-2 bg-blue-50 rounded-lg"
                            >
                                <Text className="text-blue-600 font-medium">View My Loans</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView 
                            horizontal 
                            showsHorizontalScrollIndicator={false}
                            className="-mx-4 pb-4"
                            contentContainerClassName="px-4"
                        >
                            {loanProducts.map((product) => (
                                <View key={product.id} className="w-72 mr-4">
                                    <TouchableOpacity
                                        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full"
                                        onPress={() => applyForLoan(product.id)}
                                    >
                                        <View className="flex-row justify-between items-start mb-4">
                                            <View>
                                                <Text className="text-lg font-semibold text-gray-900">{product.title}</Text>
                                                <Text className="text-sm text-gray-500 mt-1">{product.description}</Text>
                                            </View>
                                            <View className="p-3 rounded-full" style={{ backgroundColor: product.bgColor }}>
                                                <product.icon size={20} color={product.color} />
                                            </View>
                                        </View>
                                        <View className="space-y-2">
                                            <View className="flex-row justify-between">
                                                <Text className="text-gray-500 text-sm">Interest Rate</Text>
                                                <Text className="text-sm font-medium text-gray-900">{product.interestRate}</Text>
                                            </View>
                                            <View className="flex-row justify-between">
                                                <Text className="text-gray-500 text-sm">Amount</Text>
                                                <Text className="text-sm font-medium text-gray-900">{product.amount}</Text>
                                            </View>
                                            <View className="flex-row justify-between">
                                                <Text className="text-gray-500 text-sm">Term</Text>
                                                <Text className="text-sm font-medium text-gray-900">{product.term}</Text>
                                            </View>
                                        </View>
                                        <TouchableOpacity
                                            className="mt-4 bg-blue-600 py-2.5 rounded-lg items-center"
                                            onPress={() => applyForLoan(product.id)}
                                        >
                                            <Text className="text-white font-medium">Apply Now</Text>
                                        </TouchableOpacity>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                );
            case 'myLoans':
                return (
                    <View className="space-y-6">
                        <View className="flex-row justify-between items-center">
                            <Text className="text-2xl font-bold text-gray-900">My Loans</Text>
                            <TouchableOpacity
                                onPress={() => setActiveTab('overview')}
                                className="px-4 py-2 bg-blue-50 rounded-lg"
                            >
                                <Text className="text-blue-600 font-medium">Back to Loans</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <Text className="text-center text-gray-500">No active loans found</Text>
                        </View>
                    </View>
                );
            case 'calculator':
                return (
                    <View className="space-y-6">
                        <View className="flex-row justify-between items-center">
                            <Text className="text-2xl font-bold text-gray-900">Loan Calculator</Text>
                        </View>
                        <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <Text className="text-center text-gray-500">Loan calculator coming soon</Text>
                        </View>
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-white px-6 pt-12 pb-4 shadow-sm">
                <View className="flex-row justify-between items-center mb-6">
                    <View>
                        <Text className="text-2xl font-bold text-gray-900">Loan Services</Text>
                        <Text className="text-gray-500">Find the right loan for your needs</Text>
                    </View>
                    <View className="flex-row space-x-3">
                        <TouchableOpacity 
                            onPress={handleNotificationPress}
                            className="p-2 rounded-full bg-gray-100"
                        >
                            <BellIcon size={20} />
                        </TouchableOpacity>
                        <TouchableOpacity 
                            ref={moreActionsButtonRef}
                            onPress={handleMoreActions}
                            className="p-2 rounded-full bg-gray-100"
                        >
                            <EllipsisHorizontalIcon size={20} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Tabs */}
                <View className="flex-row border-b border-gray-200">
                    <TouchableOpacity
                        onPress={() => setActiveTab('overview')}
                        className={`pb-3 px-4 ${activeTab === 'overview' ? 'border-b-2 border-blue-500' : ''}`}
                    >
                        <Text className={`font-medium ${activeTab === 'overview' ? 'text-blue-600' : 'text-gray-500'}`}>
                            Overview
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setActiveTab('myLoans')}
                        className={`pb-3 px-4 ${activeTab === 'myLoans' ? 'border-b-2 border-blue-500' : ''}`}
                    >
                        <Text className={`font-medium ${activeTab === 'myLoans' ? 'text-blue-600' : 'text-gray-500'}`}>
                            My Loans
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setActiveTab('calculator')}
                        className={`pb-3 px-4 ${activeTab === 'calculator' ? 'border-b-2 border-blue-500' : ''}`}
                    >
                        <Text className={`font-medium ${activeTab === 'calculator' ? 'text-blue-600' : 'text-gray-500'}`}>
                            Calculator
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Content */}
            <View className="flex-1 p-6">
                {renderTabContent()}
            </View>

            {/* More Actions Modal */}
            <Modal
                visible={showMoreActions}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowMoreActions(false)}
            >
                <TouchableWithoutFeedback onPress={() => setShowMoreActions(false)}>
                    <View className="flex-1 bg-black bg-opacity-50">
                        <View 
                            className="absolute bg-white rounded-lg shadow-lg p-2 w-48"
                            style={{
                                top: moreActionsPosition.y,
                                right: moreActionsPosition.x
                            }}
                        >
                            <TouchableOpacity
                                className="flex-row items-center px-4 py-3 rounded hover:bg-gray-100"
                                onPress={() => {
                                    setShowMoreActions(false);
                                    handleActionSelect('calculator');
                                }}
                            >
                                <CalculatorIcon size={18}  />
                                <Text className="text-gray-700">Calculator</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="flex-row items-center px-4 py-3 rounded hover:bg-gray-100"
                                onPress={() => {
                                    setShowMoreActions(false);
                                    handleActionSelect('documents');
                                }}
                            >
                                <DocumentTextIcon size={18} />
                                <Text className="text-gray-700">Documents</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="flex-row items-center px-4 py-3 rounded hover:bg-gray-100"
                                onPress={() => {
                                    setShowMoreActions(false);
                                    handleActionSelect('support');
                                }}
                            >
                                <QuestionMarkCircleIcon size={18} />
                                <Text className="text-gray-700">Support</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};

export default LoanServicesScreen;
