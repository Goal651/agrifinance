import { ActivityIndicator, Platform, StyleProp, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  className = '',
  style,
  textStyle
}: ButtonProps) {
  const getVariantStyles = (): any => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: '#22c55e',
          ...Platform.select({
            ios: {
              shadowColor: '#22c55e',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
            },
            android: {
              elevation: 4,
            },
          }),
        };
      case 'secondary':
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          borderWidth: 1,
          borderColor: 'rgba(0, 0, 0, 0.1)',
        };
      case 'outline':
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          borderWidth: 1,
          borderColor: 'rgba(34, 197, 94, 0.5)',
        };
      case 'danger':
        return {
          backgroundColor: '#ef4444',
        };
      default:
        return {
          backgroundColor: '#22c55e',
        };
    }
  };

  const getTextClasses = () => {
    switch (variant) {
      case 'primary':
      case 'danger':
        return { color: '#ffffff' };
      case 'secondary':
        return { color: '#374151' };
      case 'outline':
        return { color: '#22c55e' };
      default:
        return { color: '#ffffff' };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: 10, paddingHorizontal: 16 };
      case 'medium':
        return { paddingVertical: 12, paddingHorizontal: 20 };
      case 'large':
        return { paddingVertical: 16, paddingHorizontal: 24 };
      default:
        return { paddingVertical: 12, paddingHorizontal: 20 };
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small':
        return { fontSize: 14 };
      case 'medium':
        return { fontSize: 16 };
      case 'large':
        return { fontSize: 18 };
      default:
        return { fontSize: 16 };
    }
  };

  // Get base styles
  const baseStyle = {
    borderRadius: 12,
    overflow: 'hidden',
    opacity: disabled ? 0.5 : 1,
  };

  // Get variant styles
  const variantStyle = getVariantStyles();
  const sizeStyle = getSizeStyles();
  const textClasses = getTextClasses();
  const textSize = getTextSize();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        baseStyle,
        variantStyle,
        sizeStyle,
        style,
      ]}
      className={className}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'outline' ? '#22c55e' : '#ffffff'} 
          size="small" 
        />
      ) : (
        <Text 
          style={[
            {
              fontFamily: 'Poppins_600SemiBold',
              textAlign: 'center',
            },
            textClasses,
            textSize,
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
} 