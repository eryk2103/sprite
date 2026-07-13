import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import styles from './MainPanel.module.css';
import { getProject } from '../../api/projects';
import { updateGroup } from '../../api/groups';

export default function EditGroupPanel() {
    const navigate = useNavigate();
    const { projectId, groupId } = useParams();

    const [name, setName] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState('');

    useEffect(() => {
        if (!projectId || !groupId) return;

        setLoading(true);
        setLoadError('');

        getProject(projectId)
            .then(project => {
                const group = project.groups.find(g => g.id === Number(groupId));
                if (!group) throw new Error('Group not found');
                setName(group.name);
            })
            .catch(() => setLoadError('Failed to load group'))
            .finally(() => setLoading(false));
    }, [projectId, groupId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = name.trim();
        if (!trimmed || !groupId || !projectId) return;

        setSaving(true);
        setSaveError('');

        try {
            await updateGroup(groupId, trimmed);
            navigate(`/gallery/${projectId}`);
        } catch {
            setSaveError('Failed to update group');
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
            <h4 className="label">Edit group</h4>
            <form className="form" onSubmit={handleSubmit}>
                <div className="form__row">
                    <div className="form__field">
                        <input
                            id="edit-group-name"
                            className="form__input"
                            placeholder="Group name"
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
