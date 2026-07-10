import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../auth/authStore';
import ProjectSelectModal from './ProjectSelectModal';
import CreateGroupModal from './CreateGroupModal';
import './ProjectPanel.css';
import type { Project, ProjectDetail } from './project';
import type { Group } from './group';
import type { Sprite, SpriteSummary } from './sprite';

type Props = {
    project: ProjectDetail|null;
    onProjectChange: (project: ProjectDetail) => void;
    onSpriteSelect: (sprite: Sprite) => void;
}
export default function ProjectPanel({project, onProjectChange, onSpriteSelect}: Props) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [selectOpen, setSelectOpen] = useState(false);
    const [createGroupOpen, setCreateGroupOpen] = useState(false);
    const [loadError, setLoadError] = useState('');
    const [creatingSpriteGroupId, setCreatingSpriteGroupId] = useState<number | null>(null);
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

    const handleAddSprite = async (group: Group) => {
        if (!project) return;

        setSpriteError('');
        setCreatingSpriteGroupId(group.id);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/sprites`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ groupId: group.id, name: 'sprite_01', data: '{}' }),
            });

            if (!res.ok) throw new Error('Failed to create sprite');

            const sprite: SpriteSummary = await res.json();
            onProjectChange({
                ...project,
                groups: project.groups.map(g =>
                    g.id === group.id ? { ...g, sprites: [...g.sprites, sprite] } : g
                ),
            });
        } catch {
            setSpriteError('Failed to create sprite');
        } finally {
            setCreatingSpriteGroupId(null);
        }
    };

    const handleSpriteClick = async (sprite: SpriteSummary) => {
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

    return(
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
                        <h3>{project.name}</h3>
                        <button className="btn btn--icon" onClick={() => setCreateGroupOpen(true)}>+</button>
                    </div>
                    {project.groups.length === 0 ?
                    <span className="placeholder">No groups</span>
                    :
                    <ul className="project-list">
                        {project.groups.map(group => (
                            <li key={group.id}>
                                <div className="group-item">
                                    <span>{group.name}</span>
                                    <button
                                        className="btn"
                                        onClick={() => handleAddSprite(group)}
                                        disabled={creatingSpriteGroupId === group.id}
                                    >
                                        {creatingSpriteGroupId === group.id ? 'Adding…' : 'Add sprite'}
                                    </button>
                                </div>
                                {group.sprites.length > 0 && (
                                    <ul className="sprite-list">
                                        {group.sprites.map(sprite => (
                                            <li key={sprite.id}>
                                                <button
                                                    type="button"
                                                    className="btn sprite-list__item"
                                                    onClick={() => handleSpriteClick(sprite)}
                                                    disabled={openingSpriteId === sprite.id}
                                                >
                                                    {sprite.name}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                    }
                </div>
                <button className="btn btn--primary" onClick={handleOpenProject}>Change project</button>
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
        </div>
    )
}