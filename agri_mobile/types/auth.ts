import { UserRole } from "./user";

export interface AuthRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    role: UserRole;
    userId: string;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    token: string;
    password: string;
    confirmPassword: string;
}

// Alias for AuthRequest to maintain backward compatibility
export type LoginRequest = AuthRequest;

export interface SignupRequest {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
    role?: UserRole;
}
