import type { ProjectDetail } from '../../types/project';
import type { Group } from '../../types/group';
import type { SpriteSummary } from '../../types/sprite';

export function addGroupToProject(project: ProjectDetail, group: Group): ProjectDetail {
    return { ...project, groups: [...project.groups, group] };
}

export function addSpriteToGroup(project: ProjectDetail, groupId: number, sprite: SpriteSummary): ProjectDetail {
    return {
        ...project,
        groups: project.groups.map(g =>
            g.id === groupId ? { ...g, sprites: [...g.sprites, sprite] } : g
        ),
    };
}

export function renameSpriteInProject(project: ProjectDetail, sprite: SpriteSummary): ProjectDetail {
    return {
        ...project,
        groups: project.groups.map(g => ({
            ...g,
            sprites: g.sprites.map(s => s.id === sprite.id ? { ...s, name: sprite.name } : s),
        })),
    };
}

export function removeSpriteFromProject(project: ProjectDetail, spriteId: number): ProjectDetail {
    return {
        ...project,
        groups: project.groups.map(g => ({
            ...g,
            sprites: g.sprites.filter(s => s.id !== spriteId),
        })),
    };
}
