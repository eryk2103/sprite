import { apiClient } from './client';
import type { Sprite, SpriteSummary } from '../types/sprite';

export function getSprite(id: number | string): Promise<Sprite> {
    return apiClient.get<Sprite>(`/api/sprites/${id}`);
}

export function createSprite(groupId: number, name: string, data: string): Promise<SpriteSummary> {
    return apiClient.post<SpriteSummary>('/api/sprites', { groupId, name, data });
}

export function saveSpriteData(id: number | string, data: string): Promise<SpriteSummary> {
    return apiClient.put<SpriteSummary>(`/api/sprites/${id}`, { data });
}

export function renameSprite(id: number | string, name: string): Promise<SpriteSummary> {
    return apiClient.put<SpriteSummary>(`/api/sprites/${id}/rename`, { name });
}

export function deleteSprite(id: number | string): Promise<void> {
    return apiClient.delete(`/api/sprites/${id}`);
}
