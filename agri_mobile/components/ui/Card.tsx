import { BlurView } from 'expo-blur';
import { Text, View } from 'react-native';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined';
}

export default function Card({ 
  title, 
  children, 
  className = "",
  variant = 'default'
}: CardProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'elevated':
        return 'rounded-3xl shadow-xl p-6 bg-white/40';
      case 'outlined':
        return 'rounded-3xl border border-white/20 p-6 bg-white/30';
      default:
        return 'rounded-3xl shadow-lg p-6 bg-white/50';
    }
  };

  return (
    <View className={`${getVariantClasses()} mb-8 ${className} overflow-hidden`}>
      <BlurView intensity={20} tint="light" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }} />
      {title && (
        <Text className="text-xl font-bold text-gray-800 dark:text-white mb-6 text-center">{title}</Text>
      )}
      {children}
    </View>
  );
} 