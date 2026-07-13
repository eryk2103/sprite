import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import styles from './MainPanel.module.css';
import { getProject, updateProject } from '../../api/projects';

export default function EditProjectPanel() {
    const navigate = useNavigate();
    const { projectId } = useParams();

    const [name, setName] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState('');

    useEffect(() => {
        if (!projectId) return;

        setLoading(true);
        setLoadError('');

        getProject(projectId)
            .then(project => setName(project.name))
            .catch(() => setLoadError('Failed to load project'))
            .finally(() => setLoading(false));
    }, [projectId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = name.trim();
        if (!trimmed || !projectId) return;

        setSaving(true);
        setSaveError('');

        try {
            await updateProject(projectId, trimmed);
            navigate(`/gallery/${projectId}`);
        } catch {
            setSaveError('Failed to update project');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className={styles['gallery-main-panel']}>
                <span className="placeholder">Loading…</span>
            </div>
        );
    }

    if (loadError) {
        return (
            <div className={styles['gallery-main-panel']}>
                <span className="form__error">{loadError}</span>
            </div>
        );
    }

    return (
        <div className={styles['gallery-main-panel']}>
            <h4 className="label">Edit project</h4>
            <form className="form" onSubmit={handleSubmit}>
                <div className="form__row">
                    <div className="form__field">
                        <input
                            id="edit-project-name"
                            className="form__input"
                            placeholder="Project name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <button type="submit" className="btn btn--primary" disabled={saving}>
                        {saving ? 'Saving…' : 'Save'}
                    </button>
                </div>
                {saveError && <span className="form__error">{saveError}</span>}
            </form>
        </div>
    );
}
