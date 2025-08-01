import { ReactNode } from 'react';
import { Text, View } from 'react-native';

type AdminCardProps = {
  title?: string;
  children: ReactNode;
  className?: string;
};

export default function AdminCard({ title, children, className = '' }: AdminCardProps) {
  return (
    <View className={`bg-white rounded-xl p-4 mb-4 shadow-sm ${className}`}>
      {title && (
        <View className="border-b border-gray-100 pb-2 mb-3">
          <Text className="text-lg font-semibold text-gray-800">{title}</Text>
        </View>
      )}
      <View>{children}</View>
    </View>
  );
}
