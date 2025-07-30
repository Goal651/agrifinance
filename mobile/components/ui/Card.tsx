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
        return 'bg-white rounded-3xl shadow-xl p-8';
      case 'outlined':
        return 'bg-white rounded-3xl border-2 border-gray-200 p-8';
      default:
        return 'bg-white rounded-3xl shadow-lg p-8';
    }
  };

  return (
    <View className={`${getVariantClasses()} mb-8 ${className}`}>
      {title && (
        <Text className="text-xl font-bold text-gray-800 mb-8 text-center">{title}</Text>
      )}
      {children}
    </View>
  );
} 