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
    MagnifyingGlassIcon,
    MapPinIcon,
    PhoneIcon,
    PhotoIcon,
    ShoppingBagIcon,
    TruckIcon,
    UserGroupIcon,
    UserIcon,
    WrenchScrewdriverIcon
} from 'react-native-heroicons/outline';

interface InputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  icon?: string;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'url';
  editable?: boolean;
  readOnly?: boolean;
  error?: string;
  required?: boolean;
  className?: string;
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
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
  'markunread-mailbox': BuildingOfficeIcon,
  'search': MagnifyingGlassIcon
};

export default function Input({
  label,
  placeholder,
  value,
  onChangeText,
  icon,
  multiline = false,
  numberOfLines = 1,
  keyboardType = 'default',
  editable = true,
  readOnly = false,
  error,
  required = false,
  className = '',
  secureTextEntry = false,
  autoCapitalize = 'sentences'
}: InputProps) {
  const IconComponent = icon ? iconMap[icon] : null;

  return (
    <View className={`mb-6 ${className}`}>
      <Text className="font-semibold text-gray-700 mb-3 text-base">
        {label} {required && <Text className="text-red-500">*</Text>}
      </Text>
      <View className={`flex-row items-start border border-gray-200 rounded-2xl px-5 py-4 ${
        readOnly ? 'bg-gray-50' : 'bg-white'
      } ${error ? 'border-red-300' : ''}`}>
        {IconComponent && (
          <IconComponent 
            size={24} 
            color={error ? "#DC2626" : "#059669"} 
            className={multiline ? "mt-1" : ""}
          />
        )}
        <TextInput
          className={`flex-1 text-base ${IconComponent ? 'ml-4' : ''}`}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          multiline={multiline}
          numberOfLines={numberOfLines}
          keyboardType={keyboardType}
          editable={editable}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
          style={multiline ? { textAlignVertical: 'top', minHeight: 80 } : { minHeight: 24 }}
          placeholderTextColor="#9CA3AF"
        />
      </View>
      {error && (
        <Text className="text-red-600 text-sm mt-2">{error}</Text>
      )}
    </View>
  );
} 