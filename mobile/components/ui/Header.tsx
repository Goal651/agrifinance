import { Text, TouchableOpacity, View } from 'react-native';
import { ArrowLeftIcon, Bars3Icon } from 'react-native-heroicons/outline';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  onMenu?: () => void;
  showBack?: boolean;
  showMenu?: boolean;
  className?: string;
}

export default function Header({
  title,
  subtitle,
  onBack,
  onMenu,
  showBack = true,
  showMenu = false,
  className = ""
}: HeaderProps) {
  return (
    <View className={`flex-row items-center py-10 ${className}`}>
      {showBack && onBack && (
        <TouchableOpacity 
          onPress={onBack}
          className="p-3 rounded-full bg-white shadow-sm"
        >
          <ArrowLeftIcon size={24} color="#374151" />
        </TouchableOpacity>
      )}
      
      <View className="flex-1 mx-6">
        <Text className="text-2xl font-bold text-green-700 text-center">{title}</Text>
        {subtitle && (
          <Text className="text-gray-500 text-center text-base mt-1">{subtitle}</Text>
        )}
      </View>

      {showMenu && onMenu && (
        <TouchableOpacity 
          onPress={onMenu}
          className="p-3 rounded-full bg-white shadow-sm"
        >
          <Bars3Icon size={24} color="#374151" />
        </TouchableOpacity>
      )}
    </View>
  );
} 