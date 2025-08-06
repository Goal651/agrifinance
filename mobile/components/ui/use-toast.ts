import Toast from 'react-native-toast-message';

export interface ToastProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
}

export function useToast() {
  const toast = ({ title, description, variant = 'default' }: ToastProps) => {
    const type = variant === 'destructive' ? 'error' : variant === 'success' ? 'success' : 'info';
    
    Toast.show({
      type,
      text1: title || '',
      text2: description || '',
    });
  };

  return { toast };
} 