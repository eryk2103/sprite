import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import './MainPanel.css';
import type { ProjectDetail } from '../editor/project';

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

        fetch(`${import.meta.env.VITE_API_URL}/api/projects/${projectId}`, {
            method: 'GET',
            credentials: 'include',
        })
            .then(res => {
                if (!res.ok) throw new Error('Failed to load group');
                return res.json();
            })
            .then((project: ProjectDetail) => {
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
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/groups/${groupId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ name: trimmed }),
            });

            if (!res.ok) throw new Error('Failed to update group');

            navigate(`/gallery/${projectId}`);
        } catch {
            setSaveError('Failed to update group');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="gallery-main-panel">
                <span className="placeholder">Loading…</span>
            </div>
        );
    }

    if (loadError) {
        return (
            <div className="gallery-main-panel">
                <span className="form__error">{loadError}</span>
            </div>
        );
    }

    return (
        <div className="gallery-main-panel">
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
