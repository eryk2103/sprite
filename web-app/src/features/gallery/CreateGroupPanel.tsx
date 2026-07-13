import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import './MainPanel.css';

export default function CreateGroupPanel() {
    const navigate = useNavigate();
    const { projectId } = useParams();
    const [name, setName] = useState('');
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = name.trim();
        if (!trimmed || !projectId) return;

        setCreating(true);
        setError('');

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/groups`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ name: trimmed, projectId: Number(projectId) }),
            });

            if (!res.ok) throw new Error('Failed to create group');

            navigate(`/gallery/${projectId}`);
        } catch {
            setError('Failed to create group');
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="gallery-main-panel">
            <h4 className="label">New group</h4>
            <form className="form" onSubmit={handleSubmit}>
                <div className="form__row">
                    <div className="form__field">
                        <input
                            id="new-group-name"
                            className="form__input"
                            placeholder="Group name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <button type="submit" className="btn btn--primary" disabled={creating}>
                        {creating ? 'Creating…' : 'Create'}
                    </button>
                </div>
                {error && <span className="form__error">{error}</span>}
            </form>
        </div>
    );
}
