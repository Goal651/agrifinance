import { projectService } from '@/api/project';
import { Project, ProjectAnalytics, ProjectCreateRequest, ProjectUpdateRequest } from '@/types';
import { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';

export function useProject() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [currentProject, setCurrentProject] = useState<Project | null>(null);
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
            if (res.success) setCurrentProject(res.data);
            else Toast.show({ type: 'error', text1: 'Failed to load project', text2: res.message });
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
                loadProjects();
            } else {
                Toast.show({ type: 'error', text1: 'Failed to create project', text2: res.message });
            }
        } catch (e) {
            Toast.show({ type: 'error', text1: 'Error', text2: e?.message || 'Unknown error' });
        } finally {
            setLoading(false);
        }
    };

    const updateProject = async (id: string | number, data: ProjectUpdateRequest) => {
        setLoading(true);
        try {
            const res = await projectService.updateProject(id, data);
            if (res.success) {
                Toast.show({ type: 'success', text1: 'Project updated' });
                loadProjects();
            } else {
                Toast.show({ type: 'error', text1: 'Failed to update project', text2: res.message });
            }
        } catch (e) {
            Toast.show({ type: 'error', text1: 'Error', text2: e?.message || 'Unknown error' });
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

    useEffect(() => {
        loadProjects();
        loadAnalytics();
    }, []);

    return {
        projects,
        currentProject,
        analytics,
        loading,
        loadProjects,
        loadProjectById,
        createProject,
        updateProject,
        deleteProject,
        loadAnalytics,
    };
}
