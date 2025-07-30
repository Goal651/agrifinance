import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  className = ''
}: ButtonProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-green-600';
      case 'secondary':
        return 'bg-gray-200';
      case 'outline':
        return 'bg-transparent border-2 border-green-600';
      case 'danger':
        return 'bg-red-600';
      default:
        return 'bg-green-600';
    }
  };

  const getTextClasses = () => {
    switch (variant) {
      case 'primary':
      case 'danger':
        return 'text-white';
      case 'secondary':
        return 'text-gray-700';
      case 'outline':
        return 'text-green-600';
      default:
        return 'text-white';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'py-3 px-6';
      case 'medium':
        return 'py-4 px-8';
      case 'large':
        return 'py-5 px-10';
      default:
        return 'py-4 px-8';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small':
        return 'text-sm';
      case 'medium':
        return 'text-base';
      case 'large':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`
        rounded-2xl shadow-lg
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${disabled ? 'opacity-50' : ''}
        ${className}
      `}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'outline' ? '#059669' : '#ffffff'} 
          size="small" 
        />
      ) : (
        <Text className={`font-bold text-center ${getTextClasses()} ${getTextSize()}`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
} 