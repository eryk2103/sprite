import { apiClient } from './client';
import type { Group } from '../types/group';

export function createGroup(name: string, projectId: number): Promise<Group> {
    return apiClient.post<Group>('/api/groups', { name, projectId });
}

export function updateGroup(id: number | string, name: string): Promise<Group> {
    return apiClient.put<Group>(`/api/groups/${id}`, { name });
}

export function deleteGroup(id: number | string): Promise<void> {
    return apiClient.delete(`/api/groups/${id}`);
}
