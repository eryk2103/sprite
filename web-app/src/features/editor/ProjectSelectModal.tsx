import { useEffect, useState } from 'react';
import Modal from '../../shared/Modal';
import styles from './ProjectSelectModal.module.css';
import { getProjects, createProject } from '../../api/projects';
import { type Project } from '../../types/project';

interface ProjectSelectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (project: Project) => void;
}

export default function ProjectSelectModal({ isOpen, onClose, onSelect }: ProjectSelectModalProps) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [newProjectName, setNewProjectName] = useState('');
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState('');

    useEffect(() => {
        if (!isOpen) return;

        setLoading(true);
        setError('');

        getProjects()
            .then(setProjects)
            .catch(() => setError('Failed to load projects'))
            .finally(() => setLoading(false));
    }, [isOpen]);

    const handleClose = () => {
        setNewProjectName('');
        setCreateError('');
        onClose();
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        const name = newProjectName.trim();
        if (!name) return;

        setCreating(true);
        setCreateError('');

        try {
            const project = await createProject(name);
            setNewProjectName('');
            onSelect(project);
        } catch {
            setCreateError('Failed to create project');
        } finally {
            setCreating(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Open Project">
            {loading && <span className="placeholder">Loading…</span>}
            {!loading && error && <span className="form__error">{error}</span>}
            {!loading && !error && projects.length === 0 && (
                <span className="placeholder">No projects found</span>
            )}
            {!loading && !error && projects.length > 0 && (
                <ul className={styles['project-list']}>
                    {projects.map(project => (
                        <li key={project.id} className={styles['project-list__row']}>
                            <button
                                type="button"
                                className={styles['project-list__item']}
                                onClick={() => onSelect(project)}
                            >
                                {project.name}
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <form className="form" onSubmit={handleCreate}>
                <div className="form__row">
                    <div className="form__field">
                        <input
                            id="new-project-name"
                            className="form__input"
                            placeholder="New project"
                            value={newProjectName}
                            onChange={e => setNewProjectName(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn--primary" disabled={creating}>
                        {creating ? 'Creating…' : 'Create'}
                    </button>
                </div>
                {createError && <span className="form__error">{createError}</span>}
            </form>
        </Modal>
    );
}
