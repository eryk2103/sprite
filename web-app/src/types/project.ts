import type { Group } from './group';

export type Project = {
    id: number;
    name: string;
}

export type ProjectDetail = {
    id: number;
    name: string;
    groups: Group[];
}
