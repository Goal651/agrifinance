import { Text, View } from 'react-native';

interface LoanCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function LoanCard({ title, children, className = "" }: LoanCardProps) {
  return (
    <View className={`bg-white rounded-3xl shadow-lg p-8 mb-8 ${className}`}>
      <Text className="text-xl font-bold text-gray-800 mb-8 text-center">{title}</Text>
      {children}
    </View>
  );
} 