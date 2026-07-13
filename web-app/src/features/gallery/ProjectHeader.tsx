import { useState } from 'react';
import { useNavigate } from 'react-router';
import ConfirmModal from '../../shared/ConfirmModal';
import styles from './MainPanel.module.css';
import { deleteProject } from '../../api/projects';
import type { ProjectDetail } from '../../types/project';

type Props = {
    project: ProjectDetail;
    onDeleted: () => void;
}

export default function ProjectHeader({ project, onDeleted }: Props) {
    const navigate = useNavigate();
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState('');

    const handleDelete = async () => {
        if (deleting) return;

        setDeleting(true);
        setDeleteError('');

        try {
            await deleteProject(project.id);
            setConfirmDeleteOpen(false);
            onDeleted();
        } catch {
            setDeleteError('Failed to delete project');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <>
            <h2 className="label">{project.name}</h2>
            <div className={styles['gallery-main-panel__header']}>
                <button
                    className="btn btn--primary"
                    onClick={() => navigate(`/gallery/${project.id}/groups/new`)}
                >
                    Add group
                </button>
                <button
                    className="btn btn--secondary"
                    onClick={() => navigate(`/gallery/${project.id}/edit`)}
                >
                    Edit
                </button>
                <button
                    className="btn btn--danger"
                    onClick={() => setConfirmDeleteOpen(true)}
                >
                    Delete
                </button>
            </div>
            {deleteError && <span className="form__error">{deleteError}</span>}
            <ConfirmModal
                isOpen={confirmDeleteOpen}
                title="Delete Project"
                message={`Delete project "${project.name}"? This cannot be undone.`}
                confirmLabel="Delete"
                confirmingLabel="Deleting…"
                confirming={deleting}
                onConfirm={handleDelete}
                onCancel={() => setConfirmDeleteOpen(false)}
            />
        </>
    );
}
