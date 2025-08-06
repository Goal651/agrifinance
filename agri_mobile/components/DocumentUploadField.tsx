import { MaterialIcons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';

interface DocumentUploadFieldProps {
  label: string;
  icon: string;
  onPress: () => void;
  value: string | null;
  placeholder: string;
  required?: boolean;
}

const iconMap: { [key: string]: any } = {
  'badge': 'badge',
  'receipt': 'receipt',
  'description': 'description',
  'group': 'group',
  'photo-library': 'photo-library',
  'check-circle': 'check-circle',
  'upload-file': 'cloud-upload',
};

export default function DocumentUploadField({
  label,
  icon,
  onPress,
  value,
  placeholder,
  required = false
}: DocumentUploadFieldProps) {
  const IconComponent = iconMap[icon] || 'description';

  return (
    <View className="mb-6">
      <Text className="font-semibold text-gray-700 mb-3 text-base">
        {label} {required && <Text className="text-red-500">*</Text>}
      </Text>
      <TouchableOpacity
        onPress={onPress}
        className={`border border-gray-200 rounded-2xl px-5 py-4 ${
          value ? 'bg-green-50 border-green-200' : 'bg-white'
        }`}
      >
        <View className="flex-row items-center">
          <MaterialIcons name={IconComponent} size={24} color="#059669" />
          <View className="flex-1 ml-4">
            {value ? (
              <View className="flex-row items-center">
                <MaterialIcons name="check-circle" size={20} color="#059669" />
                <Text className="text-green-700 font-medium ml-3 text-base">Document uploaded</Text>
              </View>
            ) : (
              <Text className="text-gray-500 text-base">{placeholder}</Text>
            )}
          </View>
          <MaterialIcons name="cloud-upload" size={24} color="#059669" />
        </View>
      </TouchableOpacity>
    </View>
  );
}