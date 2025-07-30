import { ApiResponse, UpdateUserRequest, UserResponse } from '@/types';
import { client } from './client';

class UserService {
    async getProfile(): Promise<ApiResponse<UserResponse>> {
        return await client.get<UserResponse>('/user/profile');
    }

    async updateProfile(data: UpdateUserRequest): Promise<ApiResponse<UserResponse>> {
        return await client.put<UserResponse>('/user/profile', data);
    }
}

export const userService = new UserService();