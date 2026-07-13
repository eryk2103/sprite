import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import './MainPanel.css';
import DeleteProjectModal from './DeleteProjectModal';
import DeleteGroupModal from './DeleteGroupModal';
import type { ProjectDetail } from '../editor/project';
import type { Group } from '../editor/group';
import type { Sprite, SpriteSummary } from '../editor/sprite';

export default function MainPanel() {
    const navigate = useNavigate();
    const location = useLocation();
    const { projectId } = useParams();

    const [project, setProject] = useState<ProjectDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [openingSpriteId, setOpeningSpriteId] = useState<number | null>(null);
    const [spriteError, setSpriteError] = useState('');
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState('');
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [groupToDelete, setGroupToDelete] = useState<Group | null>(null);
    const [deletingGroup, setDeletingGroup] = useState(false);
    const [groupDeleteError, setGroupDeleteError] = useState('');
    const prevPathRef = useRef(location.pathname);

    const fetchProject = (id: string) => {
        setLoading(true);
        setError('');
        setSpriteError('');

        fetch(`${import.meta.env.VITE_API_URL}/api/projects/${id}`, {
            method: 'GET',
            credentials: 'include',
        })
            .then(res => {
                if (!res.ok) throw new Error('Failed to load project');
                return res.json();
            })
            .then(setProject)
            .catch(() => setError('Failed to load project'))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        setConfirmDeleteOpen(false);
        setGroupToDelete(null);

        if (!projectId) {
            setProject(null);
            return;
        }

        fetchProject(projectId);
    }, [projectId]);

    useEffect(() => {
        const base = projectId ? `/gallery/${projectId}` : null;
        const cameFromSubRoute = base !== null
            && prevPathRef.current.startsWith(`${base}/`)
            && location.pathname === base;
        prevPathRef.current = location.pathname;
        if (cameFromSubRoute && projectId) fetchProject(projectId);
    }, [location.pathname, projectId]);

    const handleSpriteClick = async (spriteSummary: SpriteSummary) => {
        if (openingSpriteId !== null || project === null) return;

        setSpriteError('');
        setOpeningSpriteId(spriteSummary.id);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/sprites/${spriteSummary.id}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!res.ok) throw new Error('Failed to load sprite');

            const sprite: Sprite = await res.json();
            navigate('/', { state: { project, sprite } });
        } catch {
            setSpriteError('Failed to load sprite');
            setOpeningSpriteId(null);
        }
    };

    const handleDelete = async () => {
        if (!projectId || deleting) return;

        setDeleting(true);
        setDeleteError('');

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/projects/${projectId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!res.ok) throw new Error('Failed to delete project');

            setConfirmDeleteOpen(false);
            navigate('/gallery');
        } catch {
            setDeleteError('Failed to delete project');
        } finally {
            setDeleting(false);
        }
    };

    const handleConfirmDeleteGroup = async () => {
        if (!groupToDelete || deletingGroup) return;

        setDeletingGroup(true);
        setGroupDeleteError('');

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/groups/${groupToDelete.id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!res.ok) throw new Error('Failed to delete group');

            setGroupToDelete(null);
            if (projectId) fetchProject(projectId);
        } catch {
            setGroupDeleteError('Failed to delete group');
        } finally {
            setDeletingGroup(false);
        }
    };

    if (!projectId) {
        return (
            <div className="gallery-main-panel">
                <span className="placeholder">No project selected</span>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="gallery-main-panel">
                <span className="placeholder">Loading…</span>
            </div>
        );
    }

    if (error || project === null) {
        return (
            <div className="gallery-main-panel">
                <span className="form__error">{error || 'Failed to load project'}</span>
            </div>
        );
    }

    return (
        <div className="gallery-main-panel">
            <h4 className="label">{project.name}</h4>
            <div className="gallery-main-panel__header">
                <button
                    className="btn btn--primary"
                    onClick={() => navigate(`/gallery/${projectId}/groups/new`)}
                >
                    Add group
                </button>
                <button
                    className="btn btn--primary"
                    onClick={() => navigate(`/gallery/${projectId}/edit`)}
                >
                    Edit
                </button>
                <button
                    className="btn"
                    onClick={() => setConfirmDeleteOpen(true)}
                >
                    Delete
                </button>
            </div>
            {deleteError && <span className="form__error">{deleteError}</span>}
            <DeleteProjectModal
                isOpen={confirmDeleteOpen}
                projectName={project.name}
                deleting={deleting}
                onConfirm={handleDelete}
                onCancel={() => setConfirmDeleteOpen(false)}
            />
            {project.groups.length === 0 ? (
                <span className="placeholder">No groups</span>
            ) : (
                <ul className="gallery-group-list">
                    {project.groups.map(group => (
                        <li key={group.id} className="gallery-group-list__item">
                            <div className="gallery-group-list__name-row">
                                <div className="gallery-group-list__name">{group.name}</div>
                                <div className="gallery-group-list__actions">
                                    <button
                                        className="btn--link"
                                        onClick={() => navigate(`/gallery/${projectId}/groups/${group.id}/edit`)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn--link"
                                        onClick={() => setGroupToDelete(group)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                            {group.sprites.length === 0 ? (
                                <span className="placeholder">No sprites</span>
                            ) : (
                                <ul className="gallery-sprite-list">
                                    {group.sprites.map(sprite => (
                                        <li
                                            key={sprite.id}
                                            className={`card gallery-sprite-list__item${sprite.id === openingSpriteId ? ' card--loading' : ''}`}
                                            onClick={() => handleSpriteClick(sprite)}
                                        >
                                            {sprite.id === openingSpriteId ? 'Loading…' : sprite.name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            )}
            {spriteError && <span className="form__error">{spriteError}</span>}
            {groupDeleteError && <span className="form__error">{groupDeleteError}</span>}
            <DeleteGroupModal
                isOpen={groupToDelete !== null}
                groupName={groupToDelete?.name ?? ''}
                deleting={deletingGroup}
                onConfirm={handleConfirmDeleteGroup}
                onCancel={() => setGroupToDelete(null)}
            />
        </div>
    );
}
