import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../auth/authStore';
import ProjectSelectModal from './ProjectSelectModal';
import CreateGroupModal from './CreateGroupModal';
import CreateSpriteModal from './CreateSpriteModal';
import './ProjectPanel.css';
import type { Project, ProjectDetail } from './project';
import type { Group } from './group';
import type { Sprite, SpriteSummary } from './sprite';

type Props = {
    project: ProjectDetail | null;
    onProjectChange: (project: ProjectDetail) => void;
    onSpriteSelect: (sprite: Sprite) => void;
    selectedSpriteId?: number | null;
}
export default function ProjectPanel({ project, onProjectChange, onSpriteSelect, selectedSpriteId = null }: Props) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [selectOpen, setSelectOpen] = useState(false);
    const [createGroupOpen, setCreateGroupOpen] = useState(false);
    const [loadError, setLoadError] = useState('');
    const [createSpriteGroupId, setCreateSpriteGroupId] = useState<number | null>(null);
    const [spriteError, setSpriteError] = useState('');
    const [openingSpriteId, setOpeningSpriteId] = useState<number | null>(null);

    const handleOpenProject = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setSelectOpen(true);
    };

    const handleGroupCreate = (group: Group) => {
        if (!project) return;
        onProjectChange({ ...project, groups: [...project.groups, group] });
        setCreateGroupOpen(false);
    };

    const handleSpriteCreate = (groupId: number, sprite: SpriteSummary) => {
        if (!project) return;
        onProjectChange({
            ...project,
            groups: project.groups.map(g =>
                g.id === groupId ? { ...g, sprites: [...g.sprites, sprite] } : g
            ),
        });
        setCreateSpriteGroupId(null);
        onSpriteSelect({ ...sprite, data: '{}' });
    };

    const handleSpriteClick = async (sprite: SpriteSummary) => {
        if (openingSpriteId !== null) return;

        setSpriteError('');
        setOpeningSpriteId(sprite.id);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/sprites/${sprite.id}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!res.ok) throw new Error('Failed to load sprite');

            const detail: Sprite = await res.json();
            onSpriteSelect(detail);
        } catch {
            setSpriteError('Failed to load sprite');
        } finally {
            setOpeningSpriteId(null);
        }
    };

    const handleSelect = async (selected: Project) => {
        setLoadError('');

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/projects/${selected.id}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!res.ok) throw new Error('Failed to load project');

            const detail: ProjectDetail = await res.json();
            onProjectChange(detail);
            setSelectOpen(false);
        } catch {
            setLoadError('Failed to load project');
        }
    };

    return (
        <div className="project-panel">
            <h4 className="label">Project</h4>
            {project === null ?
                <div className="project__empty">
                    <span className='placeholder'>
                        No project selected
                    </span>
                    <button className="btn btn--primary" onClick={handleOpenProject}>Open project</button>
                </div>
                :
                <>
                    <div>
                        <div className="project__name-row">
                            <span>{project.name}</span>
                        </div>
                        <div className='group-list__wrapper'>
                            <button className=" btn--link" onClick={() => setCreateGroupOpen(true)}>Add group</button>
                            {project.groups.length === 0 ?
                                <span className="placeholder">No groups</span>
                                :
                                <ul className="group-list">
                                    {project.groups.map(group => (
                                        <li key={group.id} className='group-list__item'>
                                            <div>{group.name}</div>
                                            <div className='group__items'>
                                                <button
                                                    className="btn--link"
                                                    onClick={() => setCreateSpriteGroupId(group.id)}
                                                >
                                                    Add sprite
                                                </button>
                                                {group.sprites.length > 0 && (
                                                    <ul className="sprite-list">
                                                        {group.sprites.map(sprite => (
                                                            <li key={sprite.id}>
                                                                <div
                                                                    className={`card sprite-list__item${sprite.id === selectedSpriteId ? ' card--selected' : ''}${sprite.id === openingSpriteId ? ' card--loading' : ''}`}
                                                                    onClick={() => handleSpriteClick(sprite)}
                                                                >
                                                                    {sprite.id === openingSpriteId ? 'Loading…' : sprite.name}
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            }
                        </div>
                    </div>
                    <button className="btn btn--primary project-panel__change-btn" onClick={handleOpenProject}>Change project</button>
                </>
            }

            {loadError && <span className="form__error">{loadError}</span>}
            {spriteError && <span className="form__error">{spriteError}</span>}

            <ProjectSelectModal
                isOpen={selectOpen}
                onClose={() => setSelectOpen(false)}
                onSelect={handleSelect}
            />

            {project && (
                <CreateGroupModal
                    isOpen={createGroupOpen}
                    onClose={() => setCreateGroupOpen(false)}
                    projectId={project.id}
                    onCreate={handleGroupCreate}
                />
            )}

            {createSpriteGroupId !== null && (
                <CreateSpriteModal
                    isOpen={createSpriteGroupId !== null}
                    onClose={() => setCreateSpriteGroupId(null)}
                    groupId={createSpriteGroupId}
                    onCreate={sprite => handleSpriteCreate(createSpriteGroupId, sprite)}
                />
            )}
        </div>
    )
}