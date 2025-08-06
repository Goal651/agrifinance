import { MaterialIcons } from '@expo/vector-icons';
import { Text, TextInput, View } from 'react-native';

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
  'person': 'person',
  'mail': 'mail',
  'lock': 'lock',
  'badge': 'badge',
  'event': 'event',
  'location-on': 'location-on',
  'location-city': 'location-city',
  'public': 'public',
  'attach-money': 'attach-money',
  'account-balance-wallet': 'account-balance-wallet',
  'credit-card': 'credit-card',
  'schedule': 'schedule',
  'description': 'description',
  'phone': 'phone',
  'home': 'home',
  'truck': 'truck',
  'wrench': 'wrench',
  'cog': 'cog',
  'chart': 'chart',
  'school': 'school',
  'heart': 'heart',
  'shopping': 'shopping',
  'work': 'work',
  'group': 'group',
  'camera': 'camera',
  'document': 'document',
  'photo': 'photo',
  'check': 'check',
  'upload': 'upload',
  'account-balance': 'account-balance',
  'percent': 'percent',
  'payment': 'payment',
  'trending-up': 'trending-up',
  'agriculture': 'agriculture',
  'markunread-mailbox': 'markunread-mailbox',
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
  const IconComponent = iconMap[icon] || 'person';

  return (
    <View className="mb-6">
      <Text className="font-semibold text-gray-700 mb-3 text-base">{label}</Text>
      <View className={`flex-row items-start border border-gray-200 rounded-2xl px-5 py-4 ${
        readOnly ? 'bg-gray-50' : 'bg-white'
      }`}>
        <MaterialIcons 
          name={IconComponent} 
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