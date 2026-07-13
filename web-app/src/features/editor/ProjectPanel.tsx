import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../auth/AuthContext';
import ProjectSelectModal from './ProjectSelectModal';
import CreateGroupModal from './CreateGroupModal';
import CreateSpriteModal from './CreateSpriteModal';
import GroupList from './GroupList';
import { addGroupToProject, addSpriteToGroup } from './projectUpdates';
import styles from './ProjectPanel.module.css';
import { getProject } from '../../api/projects';
import { getSprite } from '../../api/sprites';
import type { Project, ProjectDetail } from '../../types/project';
import type { Group } from '../../types/group';
import type { Sprite, SpriteSummary } from '../../types/sprite';

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
        onProjectChange(addGroupToProject(project, group));
        setCreateGroupOpen(false);
    };

    const handleSpriteCreate = (groupId: number, sprite: SpriteSummary) => {
        if (!project) return;
        onProjectChange(addSpriteToGroup(project, groupId, sprite));
        setCreateSpriteGroupId(null);
        onSpriteSelect({ ...sprite, data: '{}' });
    };

    const handleSpriteClick = async (sprite: SpriteSummary) => {
        if (openingSpriteId !== null) return;

        setSpriteError('');
        setOpeningSpriteId(sprite.id);

        try {
            const detail = await getSprite(sprite.id);
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
            const detail = await getProject(selected.id);
            onProjectChange(detail);
            setSelectOpen(false);
        } catch {
            setLoadError('Failed to load project');
        }
    };

    return (
        <div className={styles['project-panel']}>
            <h3 className={`label ${styles['project-panel__title']}`}>Project Overview</h3>
            {project === null ?
                <div className={styles['project__empty']}>
                    <span className='placeholder'>
                        No project selected
                    </span>
                    <button className="btn btn--primary" onClick={handleOpenProject}>Open project</button>
                </div>
                :
                <>
                    <div className={styles['project-panel__body']}>
                        <div className={styles['project__name-row']}>
                            <span>{project.name}</span>
                        </div>
                        <div className={styles['group-list__wrapper']}>
                            <button className="btn btn--ghost btn--primary btn--sm" onClick={() => setCreateGroupOpen(true)}>Add group</button>
                            <GroupList
                                groups={project.groups}
                                selectedSpriteId={selectedSpriteId}
                                openingSpriteId={openingSpriteId}
                                onAddSprite={setCreateSpriteGroupId}
                                onSpriteClick={handleSpriteClick}
                            />
                        </div>
                    </div>
                    <button className={`btn btn--primary ${styles['project-panel__change-btn']}`} onClick={handleOpenProject}>Change project</button>
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
