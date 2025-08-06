import { Feather, FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Text, TextInput, View } from 'react-native';

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

const iconMap: { [key: string]: { set: any; name: string } } = {
  person: { set: MaterialIcons, name: 'person' },
  mail: { set: MaterialIcons, name: 'mail' },
  lock: { set: MaterialIcons, name: 'lock' },
  badge: { set: MaterialIcons, name: 'badge' },
  event: { set: MaterialIcons, name: 'event' },
  'location-on': { set: MaterialIcons, name: 'location-on' },
  'location-city': { set: MaterialIcons, name: 'location-city' },
  public: { set: MaterialIcons, name: 'public' },
  'attach-money': { set: MaterialIcons, name: 'attach-money' },
  'account-balance-wallet': { set: MaterialIcons, name: 'account-balance-wallet' },
  'credit-card': { set: MaterialIcons, name: 'credit-card' },
  schedule: { set: MaterialIcons, name: 'schedule' },
  description: { set: MaterialIcons, name: 'description' },
  phone: { set: MaterialIcons, name: 'phone' },
  home: { set: MaterialIcons, name: 'home' },
  truck: { set: FontAwesome, name: 'truck' },
  wrench: { set: FontAwesome, name: 'wrench' },
  cog: { set: FontAwesome, name: 'cog' },
  chart: { set: MaterialIcons, name: 'bar-chart' },
  school: { set: MaterialIcons, name: 'school' },
  heart: { set: MaterialIcons, name: 'favorite' },
  shopping: { set: MaterialIcons, name: 'shopping-cart' },
  work: { set: MaterialIcons, name: 'work' },
  group: { set: MaterialIcons, name: 'group' },
  camera: { set: MaterialIcons, name: 'photo-camera' },
  document: { set: Ionicons, name: 'document-text-outline' },
  photo: { set: MaterialIcons, name: 'photo' },
  check: { set: MaterialIcons, name: 'check-circle' },
  upload: { set: MaterialIcons, name: 'cloud-upload' },
  'account-balance': { set: MaterialIcons, name: 'account-balance' },
  percent: { set: Feather, name: 'percent' },
  payment: { set: MaterialIcons, name: 'payment' },
  'trending-up': { set: MaterialIcons, name: 'trending-up' },
  agriculture: { set: MaterialIcons, name: 'agriculture' },
  'markunread-mailbox': { set: MaterialIcons, name: 'markunread-mailbox' },
  search: { set: Feather, name: 'search' },
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
  let IconComponent = null;
  let iconName = '';
  if (icon && iconMap[icon]) {
    IconComponent = iconMap[icon].set;
    iconName = iconMap[icon].name;
  }

  return (
    <View className={`mb-3 px-5 ${className}`}>
      <Text className="font-semibold text-gray-700 mb-1 text-base">
        {label} {required && <Text className="text-red-500">*</Text>}
      </Text>
      <View className={`flex-row items-center border border-gray-200 rounded-xl px-2 py-2 ${
        readOnly ? 'bg-gray-50' : 'bg-white'
      } ${error ? 'border-red-300' : ''}`}>
        {IconComponent && (
          <IconComponent
            name={iconName}
            size={20}
            color={error ? "#DC2626" : "#059669"}
            style={multiline ? { marginTop: 2 } : {}}
          />
        )}
        <TextInput
          className={`flex-1 text-base ${IconComponent ? 'ml-2' : ''}`}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          multiline={multiline}
          numberOfLines={numberOfLines}
          keyboardType={keyboardType}
          editable={editable}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
          style={multiline ? { textAlignVertical: 'top', minHeight: 60 } : { minHeight: 20 }}
          placeholderTextColor="#9CA3AF"
        />
      </View>
      {error && (
        <Text className="text-red-600 text-sm mt-1">{error}</Text>
      )}
    </View>
  );
}