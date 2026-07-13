import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
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

export interface MainPanelHandle {
    isDirty: () => boolean;
    save: () => Promise<boolean>;
}

const MainPanel = forwardRef<MainPanelHandle, MainPanelProps>(function MainPanel({ size, color, tool, sprite }, ref) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const canvasRef = useRef<CanvasHandle>(null);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState('');

    const save = async (): Promise<boolean> => {
        if (!user) {
            navigate('/login');
            return false;
        }

        if (!sprite) return false;

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
            return true;
        } catch {
            setSaveError('Failed to save sprite');
            return false;
        } finally {
            setSaving(false);
        }
    };

    useImperativeHandle(ref, () => ({
        isDirty: () => canvasRef.current?.isDirty() ?? false,
        save,
    }));

    return (
        <div className="main-panel">
            {sprite ? (
                <>
                    <div className='sprite__header'>
                        <span className="label sprite__name">{sprite.name}</span>
                        <button className='btn btn--primary' onClick={() => save()} disabled={saving}>
                            {saving ? 'Saving…' : 'Save'}
                        </button>
                    </div>
                    {saveError && <span className="form__error">{saveError}</span>}
                    <div className="sprite">
                        <Canvas key={sprite.id} ref={canvasRef} size={size} color={color} tool={tool} data={sprite.data} />
                    </div>
                </>
            ) : (
                <span className="placeholder">Select a sprite to start editing</span>
            )}
        </div>
    );
});

export default MainPanel;
