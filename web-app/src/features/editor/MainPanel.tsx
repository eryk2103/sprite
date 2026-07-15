import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../auth/AuthContext';
import Canvas, { type CanvasHandle } from './Canvas';
import EditSpriteModal from './EditSpriteModal';
import ConfirmModal from '../../shared/ConfirmModal';
import SpriteActions from './SpriteActions';
import styles from './MainPanel.module.css';
import { saveSpriteData, deleteSprite } from '../../api/sprites';
import type { Sprite } from '../../types/sprite';

interface MainPanelProps {
    size: number;
    color: string;
    tool: string;
    sprite: Sprite | null;
    onSpriteRename: (sprite: Sprite) => void;
    onSpriteDelete: (spriteId: number) => void;
    onColorPick?: (color: string) => void;
    onColorUse?: (color: string) => void;
}

export interface MainPanelHandle {
    isDirty: () => boolean;
    save: () => Promise<boolean>;
}

const MainPanel = forwardRef<MainPanelHandle, MainPanelProps>(function MainPanel({ size, color, tool, sprite, onSpriteRename, onSpriteDelete, onColorPick, onColorUse }, ref) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const canvasRef = useRef<CanvasHandle>(null);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState('');
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState('');
    const [dirty, setDirty] = useState(false);

    useEffect(() => {
        setEditOpen(false);
        setDeleteOpen(false);
        setDeleteError('');
        setDirty(false);
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
            await saveSpriteData(sprite.id, data);
            canvasRef.current?.markSaved();
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
            await deleteSprite(sprite.id);
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
        <div className={styles['main-panel']}>
            {sprite ? (
                <>
                    <div className={styles['sprite__header']}>
                        <span className={`label ${styles['sprite__name']}`}>{sprite.name}</span>
                        <SpriteActions
                            dirty={dirty}
                            saving={saving}
                            onSave={() => save()}
                            onDownload={handleDownloadPng}
                            onEdit={() => setEditOpen(true)}
                            onDelete={() => setDeleteOpen(true)}
                        />
                    </div>
                    {saveError && <span className="form__error">{saveError}</span>}
                    {deleteError && <span className="form__error">{deleteError}</span>}
                    <div className={styles.sprite}>
                        <Canvas key={sprite.id} ref={canvasRef} size={size} color={color} tool={tool} data={sprite.data} onDirtyChange={setDirty} onColorPick={onColorPick} onColorUse={onColorUse} />
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
                    <ConfirmModal
                        isOpen={deleteOpen}
                        title="Delete Sprite"
                        message={`Delete sprite "${sprite.name}"? This cannot be undone.`}
                        confirmLabel="Delete"
                        confirmingLabel="Deleting…"
                        confirming={deleting}
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
