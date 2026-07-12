import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../auth/authStore';
import Canvas, { type CanvasHandle } from './Canvas';
import './MainPanel.css';
import type { Sprite } from './sprite';

interface MainPanelProps {
    size: number;
    color: string;
    tool: string;
    sprite: Sprite | null;
}

export default function MainPanel({ size, color, tool, sprite }: MainPanelProps) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const canvasRef = useRef<CanvasHandle>(null);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState('');

    const handleSave = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (!sprite) return;

        setSaving(true);
        setSaveError('');

        try {
            const data = canvasRef.current?.getData() ?? '';

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/sprites/${sprite.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ data }),
            });

            if (!res.ok) throw new Error('Failed to save sprite');
        } catch {
            setSaveError('Failed to save sprite');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="main-panel">
            {sprite ? (
                <>
                    <div className='sprite__header'>
                        <span className="label sprite__name">{sprite.name}</span>
                        <button className='btn btn--primary' onClick={handleSave} disabled={saving}>
                            {saving ? 'Saving…' : 'Save'}
                        </button>
                    </div>
                    {saveError && <span className="form__error">{saveError}</span>}
                    <div className="sprite">
                        <Canvas ref={canvasRef} size={size} color={color} tool={tool} data={sprite.data} />
                    </div>
                </>
            ) : (
                <span className="placeholder">Select a sprite to start editing</span>
            )}
        </div>
    );
}
