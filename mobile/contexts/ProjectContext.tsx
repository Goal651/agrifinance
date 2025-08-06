import { projectService } from '@/api/project';
import { Goal, Project, ProjectDash, Task } from '@/types';
import React, { createContext, useContext, useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';

// Define the auth context type based on what useAuth returns
interface ProjectContextType {
    projects: Project[]
    projectDash: ProjectDash | null
    currentProject: Project | null
    loading: boolean;
    currentGoal:Goal|null
    currentTask:Task|null
    setCurrentProject: (project: Project) => void
    setCurrentGoal: (goal: Goal) => void
    setCurrentTask: (task: Task) => void
}

const AuthContext = createContext<ProjectContextType | null>(null);

function useProject(): ProjectContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

function ProjectProvider({ children }: { children: React.ReactNode }) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [projectDash, setProjectDash] = useState<ProjectDash | null>(null)
    const [loading, setLoading] = useState(false);
    const [currentProject, setCurrentProject] = useState<Project | null>(null)
    const [currentGoal, setCurrentGoal] = useState<Goal | null>(null)
    const [currentTask, setCurrentTask] = useState<Task | null>(null)


    // Load auth state from storage
    useEffect(() => {
        async function loadDashboardData() {
            setLoading(true)
            try {
                const res = await projectService.getProjectDash();
                if (res.success) setProjectDash(res.data);
                else Toast.show({ type: 'error', text1: 'Failed to load analytics', text2: res.message });
            } catch (e) {

                Toast.show({ type: 'error', text1: 'Error', text2: e?.message || 'Unknown error' });
            } finally {
                setLoading(false);
            }
        }

        async function loadProjects() {
            setLoading(true)
            try {
                const res = await projectService.getProjects();
                if (res.success) setProjects(res.data);
                else Toast.show({ type: 'error', text1: 'Failed to load analytics', text2: res.message });
            } catch (e) {

                Toast.show({ type: 'error', text1: 'Error', text2: e?.message || 'Unknown error' });
            } finally {
                setLoading(false);
            }
        }
        loadProjects()
        loadDashboardData()
    }, [])



    return (
        <AuthContext.Provider value={{
            loading,
            projectDash,
            projects,
            currentProject,
            currentGoal,
            currentTask,
            setCurrentGoal,
            setCurrentTask,
            setCurrentProject,
            
        }}>

            {children}
        </AuthContext.Provider>
    );
};

export { useProject, ProjectProvider }