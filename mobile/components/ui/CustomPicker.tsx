import { Picker as RNPicker, type PickerProps as RNPickerProps } from '@react-native-picker/picker';
import React from 'react';
import { Platform, View } from 'react-native';
import { cn } from '../../lib/utils';

type PickerItem = {
  label: string;
  value: string;
};

type CustomPickerProps = Omit<RNPickerProps, 'onValueChange' | 'selectedValue' | 'children'> & {
  items: PickerItem[];
  selectedValue?: string;
  onValueChange?: (itemValue: string, itemIndex: number) => void;
  className?: string;
  pickerClassName?: string;
};

const CustomPicker: React.FC<CustomPickerProps> = ({
  items,
  selectedValue,
  onValueChange,
  className = '',
  pickerClassName = '',
  ...props
}) => {
  return (
    <View className={cn('h-12 justify-center bg-white', className)}>
      <RNPicker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        className={cn('flex-1', Platform.OS === 'android' && 'text-black', pickerClassName)}
        {...props}
      >
        {items.map((item) => (
          <RNPicker.Item
            key={item.value}
            label={item.label}
            value={item.value}
          />
        ))}
      </RNPicker>
    </View>
  );
};

export default CustomPicker;
