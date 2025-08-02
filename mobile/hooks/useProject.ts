import { projectService } from '@/api/project';
import { GoalCreateRequest, Project, ProjectAnalytics, ProjectCreateRequest, ProjectGoal, TaskCreateRequest } from '@/types';
import { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';

export function useProject() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [analytics, setAnalytics] = useState<ProjectAnalytics | null>(null);
    const [loading, setLoading] = useState(false);

    const loadProjects = async () => {
        setLoading(true);
        try {
            const res = await projectService.getProjects();
            if (res.success) setProjects(res.data);
            else Toast.show({ type: 'error', text1: 'Failed to load projects', text2: res.message });
        } catch (e) {
            Toast.show({ type: 'error', text1: 'Error', text2: e?.message || 'Unknown error' });
        } finally {
            setLoading(false);
        }
    };

    const loadProjectById = async (id: string | number) => {
        setLoading(true);
        try {
            const res = await projectService.getProjectById(id);
            Toast.show({ type: 'error', text1: 'Failed to load project', text2: res.message });
        } catch (e) {
            Toast.show({ type: 'error', text1: 'Error', text2: e?.message || 'Unknown error' });
        } finally {
            setLoading(false);
        }
    };



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
                loadProjects();
            } else {
                Toast.show({ type: 'error', text1: 'Failed to delete project', text2: res.message });
            }
        } catch (e) {
            Toast.show({ type: 'error', text1: 'Error', text2: e?.message || 'Unknown error' });
        } finally {
            setLoading(false);
        }
    };

    const loadAnalytics = async () => {
        setLoading(true);
        try {
            const res = await projectService.getProjectAnalytics();
            console.log(res.data)
            if (res.success) setAnalytics(res.data);
            else Toast.show({ type: 'error', text1: 'Failed to load analytics', text2: res.message });
        } catch (e) {
            Toast.show({ type: 'error', text1: 'Error', text2: e?.message || 'Unknown error' });
        } finally {
            setLoading(false);
        }
    };

    const getProjectById = (id: string) => {
        const project = projects.find(p => p.id === id)
        return project || null
    }

    useEffect(() => {
        loadProjects();
        loadAnalytics();
    }, []);


    const activeProjects = projects.filter(p => p.status === 'IN_PROGRESS')
    return {
        projects,
        activeProjects,
        analytics,
        loading,
        loadProjects,
        getProjectById,
        createProject,
        deleteProject,
        loadAnalytics,
        createGoal,
        createTask,
     
    };
}
