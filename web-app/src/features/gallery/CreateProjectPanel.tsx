import { useState } from 'react';
import { useNavigate } from 'react-router';
import './MainPanel.css';
import type { Project } from '../editor/project';

export default function CreateProjectPanel() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = name.trim();
        if (!trimmed) return;

        setCreating(true);
        setError('');

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/projects`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ name: trimmed }),
            });

            if (!res.ok) throw new Error('Failed to create project');

            const project: Project = await res.json();
            navigate(`/gallery/${project.id}`);
        } catch {
            setError('Failed to create project');
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="gallery-main-panel">
            <h4 className="label">New project</h4>
            <form className="form" onSubmit={handleSubmit}>
                <div className="form__row">
                    <div className="form__field">
                        <input
                            id="new-project-name"
                            className="form__input"
                            placeholder="Project name"
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
