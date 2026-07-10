import { useEffect, useState } from 'react';
import Modal from '../../shared/Modal';
import { type Project, type ProjectDetail } from './project';
import { type Group } from './group';

interface SaveSpriteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (groupId: number, name: string) => void;
}

export default function SaveSpriteModal({ isOpen, onClose, onSubmit }: SaveSpriteModalProps) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);
    const [projectId, setProjectId] = useState('');
    const [groupId, setGroupId] = useState('');
    const [name, setName] = useState('');

    const [loading, setLoading] = useState(false);
    const [loadingGroups, setLoadingGroups] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setProjects([]);
            setGroups([]);
            setProjectId('');
            setGroupId('');
            setName('');
            setError('');
            return;
        }

        setLoading(true);
        setError('');

        fetch(`${import.meta.env.VITE_API_URL}/api/projects`, {
            method: 'GET',
            credentials: 'include',
        })
            .then(res => {
                if (!res.ok) throw new Error('Failed to load projects');
                return res.json();
            })
            .then(setProjects)
            .catch(() => setError('Failed to load projects'))
            .finally(() => setLoading(false));
    }, [isOpen]);

    useEffect(() => {
        setGroupId('');
        setGroups([]);

        if (!projectId) return;

        setLoadingGroups(true);
        setError('');

        fetch(`${import.meta.env.VITE_API_URL}/api/projects/${projectId}`, {
            method: 'GET',
            credentials: 'include',
        })
            .then(res => {
                if (!res.ok) throw new Error('Failed to load groups');
                return res.json();
            })
            .then((detail: ProjectDetail) => setGroups(detail.groups))
            .catch(() => setError('Failed to load groups'))
            .finally(() => setLoadingGroups(false));
    }, [projectId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedName = name.trim();
        if (!groupId || !trimmedName) return;
        onSubmit(Number(groupId), trimmedName);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Save Sprite">
            {loading && <span className="placeholder">Loading…</span>}
            {!loading && (
                <form className="form" onSubmit={handleSubmit}>
                    <div className="form__field">
                        <label className="form__label" htmlFor="save-sprite-project">Project</label>
                        <select
                            id="save-sprite-project"
                            className="form__input"
                            value={projectId}
                            onChange={e => setProjectId(e.target.value)}
                        >
                            <option value="" disabled>Select a project</option>
                            {projects.map(project => (
                                <option key={project.id} value={project.id}>{project.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form__field">
                        <label className="form__label" htmlFor="save-sprite-group">Group</label>
                        <select
                            id="save-sprite-group"
                            className="form__input"
                            value={groupId}
                            onChange={e => setGroupId(e.target.value)}
                            disabled={!projectId || loadingGroups}
                        >
                            <option value="" disabled>{loadingGroups ? 'Loading…' : 'Select a group'}</option>
                            {groups.map(group => (
                                <option key={group.id} value={group.id}>{group.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form__field">
                        <label className="form__label" htmlFor="save-sprite-name">Sprite name</label>
                        <input
                            id="save-sprite-name"
                            className="form__input"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>

                    {error && <span className="form__error">{error}</span>}

                    <div className="form__footer">
                        <button type="button" className="btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn--primary" disabled={!groupId || !name.trim()}>
                            Save
                        </button>
                    </div>
                </form>
            )}
        </Modal>
    );
}
