import { Text, TextInput, View } from 'react-native';
import {
    AcademicCapIcon,
    BanknotesIcon,
    BriefcaseIcon,
    BuildingOfficeIcon,
    CalendarIcon,
    CameraIcon,
    ChartBarIcon,
    CheckCircleIcon,
    ClockIcon,
    CloudArrowUpIcon,
    CogIcon,
    CreditCardIcon,
    CurrencyDollarIcon,
    DocumentIcon,
    DocumentTextIcon,
    EnvelopeIcon,
    GlobeAltIcon,
    HeartIcon,
    HomeIcon,
    IdentificationIcon,
    LockClosedIcon,
    MapPinIcon,
    PhoneIcon,
    PhotoIcon,
    ShoppingBagIcon,
    TruckIcon,
    UserGroupIcon,
    UserIcon,
    WrenchScrewdriverIcon
} from 'react-native-heroicons/outline';

interface LoanInputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  icon: string;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  editable?: boolean;
  readOnly?: boolean;
}

const iconMap: { [key: string]: any } = {
  'person': UserIcon,
  'mail': EnvelopeIcon,
  'lock': LockClosedIcon,
  'badge': IdentificationIcon,
  'event': CalendarIcon,
  'location-on': MapPinIcon,
  'location-city': BuildingOfficeIcon,
  'public': GlobeAltIcon,
  'attach-money': CurrencyDollarIcon,
  'account-balance-wallet': BanknotesIcon,
  'credit-card': CreditCardIcon,
  'schedule': ClockIcon,
  'description': DocumentTextIcon,
  'phone': PhoneIcon,
  'home': HomeIcon,
  'truck': TruckIcon,
  'wrench': WrenchScrewdriverIcon,
  'cog': CogIcon,
  'chart': ChartBarIcon,
  'school': AcademicCapIcon,
  'heart': HeartIcon,
  'shopping': ShoppingBagIcon,
  'work': BriefcaseIcon,
  'group': UserGroupIcon,
  'camera': CameraIcon,
  'document': DocumentIcon,
  'photo': PhotoIcon,
  'check': CheckCircleIcon,
  'upload': CloudArrowUpIcon,
  'account-balance': BanknotesIcon,
  'percent': ChartBarIcon,
  'payment': CurrencyDollarIcon,
  'trending-up': ChartBarIcon,
  'agriculture': WrenchScrewdriverIcon,
  'markunread-mailbox': BuildingOfficeIcon
};

export default function LoanInputField({
  label,
  placeholder,
  value,
  onChangeText,
  icon,
  multiline = false,
  numberOfLines = 1,
  keyboardType = 'default',
  editable = true,
  readOnly = false
}: LoanInputFieldProps) {
  const IconComponent = iconMap[icon] || UserIcon;

  return (
    <View className="mb-6">
      <Text className="font-semibold text-gray-700 mb-3 text-base">{label}</Text>
      <View className={`flex-row items-start border border-gray-200 rounded-2xl px-5 py-4 ${
        readOnly ? 'bg-gray-50' : 'bg-white'
      }`}>
        <IconComponent 
          size={24} 
          color="#059669" 
          className={multiline ? "mt-1" : ""}
        />
        <TextInput
          className="flex-1 text-base ml-4"
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          multiline={multiline}
          numberOfLines={numberOfLines}
          keyboardType={keyboardType}
          editable={editable}
          style={multiline ? { textAlignVertical: 'top', minHeight: 80 } : { minHeight: 24 }}
          placeholderTextColor="#9CA3AF"
        />
      </View>
    </View>
  );
} 