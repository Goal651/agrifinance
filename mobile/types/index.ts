export * from './api'
export * from './auth'
export * from './loan'
export * from './project'
export * from './user'

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  // Add other user fields as needed
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  // Add other updatable fields as needed
}

export interface PaymentRequest {
  amount: number;
  method: string; // e.g., 'card', 'bank', etc.
  // Add other fields as needed
}

export interface PaymentResponse {
  id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  // Add other fields as needed
}