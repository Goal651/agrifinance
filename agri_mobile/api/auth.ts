import { client } from './client';
import { ApiResponse, AuthResponse, LoginRequest, SignupRequest } from "@/types";

export class AuthService {
    async login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
        return await client.post<AuthResponse>('/auth/login', data);
    }

    async signup(data: SignupRequest): Promise<ApiResponse<AuthResponse>> {
        return await client.post<AuthResponse>('/auth/signup', data)
    }
}

export const authService = new AuthService()