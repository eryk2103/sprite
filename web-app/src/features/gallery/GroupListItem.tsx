import { useState } from 'react';
import { useNavigate } from 'react-router';
import ConfirmModal from '../../shared/ConfirmModal';
import styles from './MainPanel.module.css';
import { deleteGroup } from '../../api/groups';
import type { Group } from '../../types/group';
import type { SpriteSummary } from '../../types/sprite';

type Props = {
    group: Group;
    projectId: string;
    openingSpriteId: number | null;
    onSpriteClick: (sprite: SpriteSummary) => void;
    onDeleted: () => void;
}

export default function GroupListItem({ group, projectId, openingSpriteId, onSpriteClick, onDeleted }: Props) {
    const navigate = useNavigate();
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState('');

    const handleDelete = async () => {
        if (deleting) return;

        setDeleting(true);
        setDeleteError('');

        try {
            await deleteGroup(group.id);
            setConfirmDeleteOpen(false);
            onDeleted();
        } catch {
            setDeleteError('Failed to delete group');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <li className={styles['gallery-group-list__item']}>
            <div className={styles['gallery-group-list__name-row']}>
                <div className={styles['gallery-group-list__name']}>{group.name}</div>
                <div className={styles['gallery-group-list__actions']}>
                    <button
                        className="btn btn--ghost btn--secondary btn--sm"
                        onClick={() => navigate(`/gallery/${projectId}/groups/${group.id}/edit`)}
                    >
                        Edit
                    </button>
                    <button
                        className="btn btn--ghost btn--danger btn--sm"
                        onClick={() => setConfirmDeleteOpen(true)}
                    >
                        Delete
                    </button>
                </div>
            </div>
            {group.sprites.length === 0 ? (
                <span className="placeholder">No sprites</span>
            ) : (
                <ul className={styles['gallery-sprite-list']}>
                    {group.sprites.map(sprite => (
                        <li
                            key={sprite.id}
                            className={`card ${styles['gallery-sprite-list__item']}${sprite.id === openingSpriteId ? ' card--loading' : ''}`}
                            onClick={() => onSpriteClick(sprite)}
                        >
                            {sprite.id === openingSpriteId ? 'Loading…' : sprite.name}
                        </li>
                    ))}
                </ul>
            )}
            {deleteError && <span className="form__error">{deleteError}</span>}
            <ConfirmModal
                isOpen={confirmDeleteOpen}
                title="Delete Group"
                message={`Delete group "${group.name}"? This cannot be undone.`}
                confirmLabel="Delete"
                confirmingLabel="Deleting…"
                confirming={deleting}
                onConfirm={handleDelete}
                onCancel={() => setConfirmDeleteOpen(false)}
            />
        </li>
    );
}
