import { MaterialIcons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';

interface LoanStepHeaderProps {
  step: number;
  totalSteps: number;
  title: string;
  subtitle: string;
  onBack: () => void;
  showBackButton?: boolean;
}

export default function LoanStepHeader({
  step,
  totalSteps,
  title,
  subtitle,
  onBack,
  showBackButton = true
}: LoanStepHeaderProps) {
  const progressPercentage = (step / totalSteps) * 100;

  return (
    <>
      {/* Header Section */}
      <View className='flex flex-row items-center py-10'>
        {showBackButton && (
          <TouchableOpacity 
            onPress={onBack}
            className="p-3 rounded-full bg-white shadow-sm"
          >
            <MaterialIcons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
        )}
        <Text className="text-2xl font-bold text-green-700 text-center flex-1 mx-6">Loan Application</Text>
      </View>

      {/* Progress Bar */}
      <View className="w-full h-4 bg-gray-200 rounded-full mb-10 shadow-sm">
        <View 
          className="h-4 bg-green-600 rounded-full shadow-sm" 
          style={{ width: `${progressPercentage}%` }} 
        />
      </View>
      
      {/* Step Indicator */}
      <View className="items-center mb-10">
        <Text className="text-center text-base text-gray-500 mb-2">Step {step} of {totalSteps}</Text>
        <Text className="text-green-700 font-bold text-xl mb-3">{title}</Text>
        <Text className="text-gray-600 text-center text-base">{subtitle}</Text>
      </View>
    </>
  );
}