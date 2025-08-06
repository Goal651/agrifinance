import { ApiResponse } from '@/types';
import { Worker, CreateWorker } from '@/types/worker';
import { client } from './client';
import { API_ENDPOINTS } from './constants';

class WorkerService {
    // Create a new worker
    async createWorker(data: CreateWorker): Promise<ApiResponse<Worker>> {
        return await client.post<Worker>(API_ENDPOINTS.WORKERS.CREATE, data);
    }

    // Get all workers for current user
    async getWorkers(): Promise<ApiResponse<Worker[]>> {
        return await client.get<Worker[]>(API_ENDPOINTS.WORKERS.ALL);
    }

    // Get a specific worker by ID
    async getWorkerById(id: string): Promise<ApiResponse<Worker>> {
        return await client.get<Worker>(API_ENDPOINTS.WORKERS.BY_ID(id));
    }

    // Update a worker
    async updateWorker(id: string, data: CreateWorker): Promise<ApiResponse<Worker>> {
        return await client.put<Worker>(API_ENDPOINTS.WORKERS.UPDATE(id), data);
    }

    // Delete a worker
    async deleteWorker(id: string): Promise<ApiResponse<void>> {
        return await client.delete(API_ENDPOINTS.WORKERS.DELETE(id));
    }
}

export const workerService = new WorkerService();
