import { projectService } from '@/api/project';
import { GoalCreateRequest,  ProjectCreateRequest,TaskCreateRequest } from '@/types';
import { useState } from 'react';
import Toast from 'react-native-toast-message';

export function useProjectAction() {
    const [loading, setLoading] = useState(false)

    const createProject = async (data: ProjectCreateRequest) => {
        setLoading(true);
        try {
            const res = await projectService.createProject(data);
            if (res.success) {
                Toast.show({ type: 'success', text1: 'Project created' });
            } else {
                Toast.show({ type: 'error', text1: 'Failed to create project', text2: res.message });
            }
        } catch (e) {
            Toast.show({ type: 'error', text1: 'Error', text2: e?.message || 'Unknown error' });
        } finally {
            setLoading(false);
        }
    };

    const createGoal = async (goalData: GoalCreateRequest) => {
        setLoading(true);
        try {
            const res = await projectService.createGoal(goalData);
            if (res.success) {
                Toast.show({ type: 'success', text1: 'Goal created' });
                return { success: true, data: res.data };
            } else {
                Toast.show({ type: 'error', text1: 'Failed to create goal', text2: res.message });
                return { success: false, message: res.message };
            }
        } catch (e: any) {
            Toast.show({ type: 'error', text1: 'Error', text2: e?.message || 'Unknown error' });
            return { success: false, message: e?.message || 'Unknown error' };
        } finally {
            setLoading(false);
        }
    };

    const createTask = async (taskRequest: TaskCreateRequest) => {
        setLoading(true);
        try {
            const res = await projectService.createTask(taskRequest);
            if (res.success) {
                Toast.show({ type: 'success', text1: 'Goal created' });
                return { success: true, data: res.data };
            } else {
                Toast.show({ type: 'error', text1: 'Failed to create goal', text2: res.message });
                return { success: false, message: res.message };
            }
        } catch (e: any) {
            Toast.show({ type: 'error', text1: 'Error', text2: e?.message || 'Unknown error' });
            return { success: false, message: e?.message || 'Unknown error' };
        } finally {
            setLoading(false);
        }
    };


    const deleteProject = async (id: string | number) => {
        setLoading(true);
        try {
            const res = await projectService.deleteProject(id);
            if (res.success) {
                Toast.show({ type: 'success', text1: 'Project deleted' });
            } else {
                Toast.show({ type: 'error', text1: 'Failed to delete project', text2: res.message });
            }
        } catch (e) {
            Toast.show({ type: 'error', text1: 'Error', text2: e?.message || 'Unknown error' });
        } finally {
            setLoading(false);
        }
    };


    const finishTask = async (taskId: string) => {
        setLoading(true);
        try {
            const res = await projectService.finishTask(taskId);
            if (res.success) {
                Toast.show({ type: 'success', text1: 'Task finished' });
            } else {
                Toast.show({ type: 'error', text1: 'Failed to finish task', text2: res.message });
            }
        } catch (e) {
            Toast.show({ type: 'error', text1: 'Error', text2:'Unknown error' });
        } finally {
            setLoading(false);
        }
    }





    return {
        loading,
        createProject,
        deleteProject,
        createGoal,
        createTask,
        finishTask
    };
}
