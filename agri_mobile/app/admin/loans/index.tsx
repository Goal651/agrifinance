import { View } from 'react-native';
import LoanList from './LoanList';

export default function LoansScreen() {
  return (
    <View className="flex-1 bg-white">
      <LoanList />
    </View>
  );
}
