import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../auth/authStore';
import Canvas, { type CanvasHandle } from './Canvas';
import EditSpriteModal from './EditSpriteModal';
import DeleteSpriteModal from './DeleteSpriteModal';
import './MainPanel.css';
import type { Sprite } from './sprite';

interface MainPanelProps {
    size: number;
    color: string;
    tool: string;
    sprite: Sprite | null;
    onSpriteRename: (sprite: Sprite) => void;
    onSpriteDelete: (spriteId: number) => void;
}

export interface MainPanelHandle {
    isDirty: () => boolean;
    save: () => Promise<boolean>;
}

const MainPanel = forwardRef<MainPanelHandle, MainPanelProps>(function MainPanel({ size, color, tool, sprite, onSpriteRename, onSpriteDelete }, ref) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const canvasRef = useRef<CanvasHandle>(null);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState('');
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState('');

    useEffect(() => {
        setEditOpen(false);
        setDeleteOpen(false);
        setDeleteError('');
    }, [sprite?.id]);

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

    const handleDownloadPng = async () => {
        const blob = await canvasRef.current?.toBlob();
        if (!blob) return;

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${sprite?.name ?? 'sprite'}.png`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleDelete = async () => {
        if (!sprite || deleting) return;

        setDeleting(true);
        setDeleteError('');

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/sprites/${sprite.id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!res.ok) throw new Error('Failed to delete sprite');

            setDeleteOpen(false);
            onSpriteDelete(sprite.id);
        } catch {
            setDeleteError('Failed to delete sprite');
        } finally {
            setDeleting(false);
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
                        <div className="sprite__actions">
                            <button className='btn btn--primary' onClick={() => save()} disabled={saving}>
                                {saving ? 'Saving…' : 'Save'}
                            </button>
                            <button className='btn' onClick={handleDownloadPng}>
                                Download PNG
                            </button>
                            <button className='btn' onClick={() => setEditOpen(true)}>
                                Edit
                            </button>
                            <button className='btn' onClick={() => setDeleteOpen(true)}>
                                Delete
                            </button>
                        </div>
                    </div>
                    {saveError && <span className="form__error">{saveError}</span>}
                    {deleteError && <span className="form__error">{deleteError}</span>}
                    <div className="sprite">
                        <Canvas key={sprite.id} ref={canvasRef} size={size} color={color} tool={tool} data={sprite.data} />
                    </div>
                    <EditSpriteModal
                        isOpen={editOpen}
                        onClose={() => setEditOpen(false)}
                        sprite={sprite}
                        onRename={renamed => {
                            onSpriteRename(renamed);
                            setEditOpen(false);
                        }}
                    />
                    <DeleteSpriteModal
                        isOpen={deleteOpen}
                        spriteName={sprite.name}
                        deleting={deleting}
                        onConfirm={handleDelete}
                        onCancel={() => setDeleteOpen(false)}
                    />
                </>
            ) : (
                <span className="placeholder">Select a sprite to start editing</span>
            )}
        </div>
    );
});

export default MainPanel;
