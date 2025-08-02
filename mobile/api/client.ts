import axios, { AxiosInstance, AxiosResponse, AxiosProgressEvent, CancelToken } from 'axios';
import { API_CONFIG, HTTP_STATUS } from './constants';
import { ApiResponse, ApiError } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ApiClient {
    private axiosInstance: AxiosInstance;
    private logoutListeners: (() => void)[] = [];

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: `${API_CONFIG.BASE_URL}/api`,
            timeout: API_CONFIG.TIMEOUT,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Request interceptor to add auth token
        this.axiosInstance.interceptors.request.use(
            async (config) => {
                try {
                    const token = await this.getAuthToken();
                    if (token) {
                        config.headers.Authorization = `Bearer ${token}`;
                    }
                    return config;
                } catch (error) {
                    console.error('Error in request interceptor:', error.message);
                    return Promise.reject(error);
                }
            },
            (error) => {
                console.error('Request interceptor error:', error.message);
                return Promise.reject(error);
            }
        );

        // Response interceptor to handle errors
        this.axiosInstance.interceptors.response.use(
            (response: AxiosResponse) => response,
            async (error) => {
                try {
                    if (error.response) {
                        const apiError: ApiError = {
                            status: error.status,
                            message: error?.message || 'An error occurred',
                            errors: error.errors,
                        };
                        if (apiError.status === HTTP_STATUS.UNAUTHORIZED || apiError.status === HTTP_STATUS.FORBIDDEN) {
                            console.warn('401 Unauthorized detected, attempting token refresh');
                            // Retry the original request after refresh
                        }
                        throw apiError;
                    }
                    if (error.code === 'ECONNABORTED') {
                        throw new Error('Request timeout');
                    }
                    throw new Error('Network error');
                } catch (err) {
                    console.error('Error in response interceptor:', err);
                    return Promise.reject(err);
                }
            }
        );
    }

    private async getAuthToken(): Promise<string | null> {
        try {
            console.log(AsyncStorage.getAllKeys())
            const token = await AsyncStorage.getItem('auth_token');
            return token
        } catch (error) {
            console.error('Error accessing localStorage:', error.message);
            this.logout();
            return null;
        }
    }

    public async logout() {
        try {

            this.logoutListeners.forEach((callback) => {
                try {
                    callback();
                } catch (error) {
                    console.error('Error in logout callback:', error.message);
                }
            });
        } catch (error) {
            console.error('Error during logout:', error.message);
        } finally {
            this.logoutListeners.forEach((callback) => {
                try {
                    callback();
                } catch (error) {
                    console.error('Error in final logout callback:', error.message);
                }
            });
        }
    }

    public onLogout(callback: () => void) {
        try {
            this.logoutListeners.push(callback);
        } catch (error) {
            console.error('Error adding logout listener:', error.message);
        }
    }

    public removeLogoutListener(callback: () => void) {
        try {
            this.logoutListeners = this.logoutListeners.filter(cb => cb !== callback);
        } catch (error) {
            console.error('Error removing logout listener:', error.message);
        }
    }

    async get<T>(endpoint: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> {
        try {
            const response = await this.axiosInstance.get<ApiResponse<T>>(endpoint, { params });
            return response.data;
        } catch (error) {
            console.error(`GET ${endpoint} failed:`, error.message);
            if (error.status === HTTP_STATUS.UNAUTHORIZED) {
                console.error(error)
            }
            throw error;
        }
    }

    async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
        try {
            const response = await this.axiosInstance.post<ApiResponse<T>>(endpoint, data);
            return response.data;
        } catch (error) {
            console.error(error.message, `POST ${endpoint} failed:`, error.request.header);
            if (error.status === HTTP_STATUS.UNAUTHORIZED) {
                console.error(error)
            }
            throw error;
        }
    }

    async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
        try {
            const response = await this.axiosInstance.put<ApiResponse<T>>(endpoint, data);
            return response.data;
        } catch (error) {
            console.error(`PUT ${endpoint} failed:`, error.message);
            if (error.status === HTTP_STATUS.UNAUTHORIZED) {

            }
            throw error;
        }
    }

    async patch<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
        try {
            const response = await this.axiosInstance.patch<ApiResponse<T>>(endpoint, data);
            return response.data;
        } catch (error) {
            console.error(`PATCH ${endpoint} failed:`, error.message);
            if (error.status === HTTP_STATUS.UNAUTHORIZED) {

            }
            throw error;
        }
    }

    async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
        try {
            const response = await this.axiosInstance.delete<ApiResponse<T>>(endpoint);
            return response.data;
        } catch (error) {
            console.error(`DELETE ${endpoint} failed:`, error.message);
            if (error.status === HTTP_STATUS.UNAUTHORIZED) {
                // Retry
            }
            throw error;
        }
    }

    async uploadFile<T>(
        endpoint: string,
        file: File,
        onUploadProgress?: (event: AxiosProgressEvent) => void,
        cancelToken?: CancelToken,
        timeout?: number
    ): Promise<ApiResponse<T>> {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await this.axiosInstance.post<ApiResponse<T>>(endpoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress,
                cancelToken,
                timeout: timeout ?? API_CONFIG.TIMEOUT,
            });
            return response.data;
        } catch (error) {
            console.error(`UPLOAD ${endpoint} failed:`, error.message);
            if (error.status === HTTP_STATUS.UNAUTHORIZED) {
            }
            throw error;
        }
    }
}

export const client = new ApiClient();
