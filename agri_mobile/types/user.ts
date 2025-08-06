import { Worker } from "./worker";

export type UserRole = 'ADMIN' | 'USER';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED';

/**
 * User data transfer object (DTO) - matches backend schema
 * Represents a user in the system as returned by the API
 */
export interface User {
  id: string; // UUID
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string; // ISO date
  workers: Worker[]
}



/**
 * Request payload for creating a new user
 */
export interface UserCreationRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: UserRole;
}

/**
 * Request payload for updating an existing user
 */
export interface UserUpdateRequest extends UserCreationRequest {
  id: string;
  workers?: Worker[]
  status?: UserStatus
}
