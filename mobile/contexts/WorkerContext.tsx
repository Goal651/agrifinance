import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Worker, CreateWorker } from '@/types/worker';
import { workerService } from '@/api/worker';
import { ApiResponse } from '@/types';

type WorkerContextType = {
  workers: Worker[];
  loading: boolean;
  error: string | null;
  fetchWorkers: () => Promise<void>;
  createWorker: (data: CreateWorker) => Promise<ApiResponse<Worker>>;
  updateWorker: (id: string, data: CreateWorker) => Promise<ApiResponse<Worker>>;
  deleteWorker: (id: string) => Promise<ApiResponse<void>>;
};

const WorkerContext = createContext<WorkerContextType | undefined>(undefined);

export const WorkerProvider = ({ children }: { children: ReactNode }) => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await workerService.getWorkers();
      if (response.success) {
        setWorkers(response.data);
      } else {
        setError(response.message || 'Failed to fetch workers');
      }
    } catch (err) {
      setError('Failed to fetch workers');
      console.error('Error fetching workers:', err);
    } finally {
      setLoading(false);
    }
  };

  const createWorker = async (data: CreateWorker): Promise<ApiResponse<Worker>> => {
    try {
      setLoading(true);
      const response = await workerService.createWorker(data);
      if (response.success) {
        await fetchWorkers(); // Refresh the list
      }
      return response;
    } catch (err) {
      console.error('Error creating worker:', err);
      return { 
        success: false, 
        message: 'Failed to create worker',
        data: {} as Worker // Type assertion to satisfy TypeScript
      };
    } finally {
      setLoading(false);
    }
  };

  const updateWorker = async (id: string, data: CreateWorker): Promise<ApiResponse<Worker>> => {
    try {
      setLoading(true);
      const response = await workerService.updateWorker(id, data);
      if (response.success) {
        await fetchWorkers(); // Refresh the list
      }
      return response;
    } catch (err) {
      console.error('Error updating worker:', err);
      return { 
        success: false, 
        message: 'Failed to update worker',
        data: {} as Worker // Type assertion to satisfy TypeScript
      };
    } finally {
      setLoading(false);
    }
  };

  const deleteWorker = async (id: string): Promise<ApiResponse<void>> => {
    try {
      setLoading(true);
      const response = await workerService.deleteWorker(id);
      if (response.success) {
        setWorkers(prev => prev.filter(worker => worker.id !== id));
      }
      return response;
    } catch (err) {
      console.error('Error deleting worker:', err);
      return { 
        success: false, 
        message: 'Failed to delete worker',
        data: undefined // Explicitly undefined for void return type
      };
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchWorkers();
  }, []);

  return (
    <WorkerContext.Provider
      value={{
        workers,
        loading,
        error,
        fetchWorkers,
        createWorker,
        updateWorker,
        deleteWorker,
      }}
    >
      {children}
    </WorkerContext.Provider>
  );
};

export const useWorkers = (): WorkerContextType => {
  const context = useContext(WorkerContext);
  if (context === undefined) {
    throw new Error('useWorkers must be used within a WorkerProvider');
  }
  return context;
};
