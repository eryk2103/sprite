import { apiClient } from './client';
import type { Project, ProjectDetail } from '../types/project';

export function getProjects(): Promise<Project[]> {
    return apiClient.get<Project[]>('/api/projects');
}

export function getProject(id: number | string): Promise<ProjectDetail> {
    return apiClient.get<ProjectDetail>(`/api/projects/${id}`);
}

export function createProject(name: string): Promise<Project> {
    return apiClient.post<Project>('/api/projects', { name });
}

export function updateProject(id: number | string, name: string): Promise<Project> {
    return apiClient.put<Project>(`/api/projects/${id}`, { name });
}

export function deleteProject(id: number | string): Promise<void> {
    return apiClient.delete(`/api/projects/${id}`);
}
