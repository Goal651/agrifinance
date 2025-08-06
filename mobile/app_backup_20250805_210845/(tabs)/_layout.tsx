import { LoanProvider } from '@/contexts/LoanContext';
import { ProjectProvider } from '@/contexts/ProjectContext';
import { Stack } from 'expo-router';

export default function TabsLayout() {
    return (
        <LoanProvider>
            <ProjectProvider>
                <Stack screenOptions={{
                    headerShown: false,
                }}>
                    <Stack.Screen name="index" />
                    <Stack.Screen name="loan-services" />
                    <Stack.Screen name="project-services" />
                    <Stack.Screen name="analytics" />
                </Stack>
            </ProjectProvider>
        </LoanProvider>
    );
}
