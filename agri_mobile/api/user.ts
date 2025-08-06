import { ApiResponse, User, UserUpdateRequest } from '@/types';
import { client } from './client';

class UserService {
    async getProfile(): Promise<ApiResponse<User>> {
        return await client.get<User>('/user/profile');
    }

    async updateProfile(data: UserUpdateRequest): Promise<ApiResponse<User>> {
        return await client.put<User>('/user/profile', data);
    }
}

export const userService = new UserService();