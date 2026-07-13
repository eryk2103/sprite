import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import styles from './MainPanel.module.css';
import ProjectHeader from './ProjectHeader';
import GroupList from './GroupList';
import { useProject } from './useProject';
import { getSprite } from '../../api/sprites';
import type { SpriteSummary } from '../../types/sprite';

export default function MainPanel() {
    const navigate = useNavigate();
    const { projectId } = useParams();
    const { project, loading, error, refetch } = useProject(projectId);
    const [openingSpriteId, setOpeningSpriteId] = useState<number | null>(null);
    const [spriteError, setSpriteError] = useState('');

    const handleSpriteClick = async (spriteSummary: SpriteSummary) => {
        if (openingSpriteId !== null || project === null) return;

        setSpriteError('');
        setOpeningSpriteId(spriteSummary.id);

        try {
            const sprite = await getSprite(spriteSummary.id);
            navigate('/', { state: { project, sprite } });
        } catch {
            setSpriteError('Failed to load sprite');
            setOpeningSpriteId(null);
        }
    };

    if (!projectId) {
        return (
            <div className={styles['gallery-main-panel']}>
                <span className="placeholder">No project selected</span>
            </div>
        );
    }

    if (loading) {
        return (
            <div className={styles['gallery-main-panel']}>
                <span className="placeholder">Loading…</span>
            </div>
        );
    }

    if (error || project === null) {
        return (
            <div className={styles['gallery-main-panel']}>
                <span className="form__error">{error || 'Failed to load project'}</span>
            </div>
        );
    }

    return (
        <div className={styles['gallery-main-panel']}>
            <ProjectHeader key={`header-${project.id}`} project={project} onDeleted={() => navigate('/gallery')} />
            <GroupList
                key={`groups-${project.id}`}
                groups={project.groups}
                projectId={projectId}
                openingSpriteId={openingSpriteId}
                onSpriteClick={handleSpriteClick}
                onGroupDeleted={refetch}
            />
            {spriteError && <span className="form__error">{spriteError}</span>}
        </div>
    );
}
