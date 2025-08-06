import { projectService } from '@/api/project';
import { workerService } from '@/api/worker';
import { Goal, Project, ProjectDash, Task } from '@/types';
import { Worker } from '@/types/worker';
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
    workers: Worker[]
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
    const [workers,setWorkers] = useState<Worker[]>([])

    


    // Load auth state from storage
    useEffect(() => {
        async function loadDashboardData() {
            setLoading(true)
            try {
                const res = await projectService.getProjectDash();
                if (res.success) setProjectDash(res.data);
                else Toast.show({ type: 'error', text1: 'Failed to load analytics', text2: res.message });
            } catch (e) {

                Toast.show({ type: 'error', text1: 'Error', text2: 'Unknown error' });
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

                Toast.show({ type: 'error', text1: 'Error', text2: 'Unknown error' });
            } finally {
                setLoading(false);
            }
        }

        async function loadWorkers() {
            setLoading(true)
            try {
                const res = await workerService.getWorkers();
                if (res.success) setWorkers(res.data);
                else Toast.show({ type: 'error', text1: 'Failed to load workers', text2: res.message });
            } catch (e) {

                Toast.show({ type: 'error', text1: 'Error', text2: 'Unknown error' });
            } finally {
                setLoading(false);
            }
        }
        loadWorkers()
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
            workers
            
        }}>

            {children}
        </AuthContext.Provider>
    );
};

export { useProject, ProjectProvider }