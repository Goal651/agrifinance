import { Text, TouchableOpacity, View } from 'react-native';
import {
    CheckCircleIcon,
    CloudArrowUpIcon,
    DocumentTextIcon,
    IdentificationIcon,
    PhotoIcon,
    UserGroupIcon
} from 'react-native-heroicons/outline';

interface DocumentUploadFieldProps {
  label: string;
  icon: string;
  onPress: () => void;
  value: string | null;
  placeholder: string;
  required?: boolean;
}

const iconMap: { [key: string]: any } = {
  'badge': IdentificationIcon,
  'receipt': DocumentTextIcon,
  'description': DocumentTextIcon,
  'group': UserGroupIcon,
  'photo-library': PhotoIcon,
  'check-circle': CheckCircleIcon,
  'upload-file': CloudArrowUpIcon
};

export default function DocumentUploadField({
  label,
  icon,
  onPress,
  value,
  placeholder,
  required = false
}: DocumentUploadFieldProps) {
  const IconComponent = iconMap[icon] || DocumentTextIcon;

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
          <IconComponent size={24} color="#059669" />
          <View className="flex-1 ml-4">
            {value ? (
              <View className="flex-row items-center">
                <CheckCircleIcon size={20} color="#059669" />
                <Text className="text-green-700 font-medium ml-3 text-base">Document uploaded</Text>
              </View>
            ) : (
              <Text className="text-gray-500 text-base">{placeholder}</Text>
            )}
          </View>
          <CloudArrowUpIcon size={24} color="#059669" />
        </View>
      </TouchableOpacity>
    </View>
  );
} 