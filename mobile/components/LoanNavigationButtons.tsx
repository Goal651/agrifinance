import { Text, TouchableOpacity, View } from 'react-native';

interface LoanNavigationButtonsProps {
  onBack: () => void;
  onNext: () => void;
  backText?: string;
  nextText?: string;
  showBack?: boolean;
  disabled?: boolean;
}

export default function LoanNavigationButtons({
  onBack,
  onNext,
  backText = "Back",
  nextText = "Continue",
  showBack = true,
  disabled = false
}: LoanNavigationButtonsProps) {
  return (
    <View className="flex-row justify-between mb-8 mt-4">
      {showBack && (
        <TouchableOpacity 
          className="bg-gray-200 rounded-3xl py-5 px-10 shadow-sm" 
          onPress={onBack}
        >
          <Text className="text-gray-700 text-center font-bold text-lg">{backText}</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity 
        className={`rounded-3xl py-5 px-10 shadow-lg flex-1 ${
          showBack ? 'ml-6' : ''
        } ${disabled ? 'bg-gray-400' : 'bg-green-600'}`}
        onPress={onNext}
        disabled={disabled}
      >
        <Text className={`text-center font-bold text-lg ${
          disabled ? 'text-gray-600' : 'text-white'
        }`}>
          {nextText}
        </Text>
      </TouchableOpacity>
    </View>
  );
} 