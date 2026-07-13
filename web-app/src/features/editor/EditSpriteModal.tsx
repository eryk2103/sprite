import { useEffect, useState } from 'react';
import Modal from '../../shared/Modal';
import { type Sprite } from './sprite';

interface EditSpriteModalProps {
    isOpen: boolean;
    onClose: () => void;
    sprite: Sprite;
    onRename: (sprite: Sprite) => void;
}

export default function EditSpriteModal({ isOpen, onClose, sprite, onRename }: EditSpriteModalProps) {
    const [name, setName] = useState(sprite.name);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setName(sprite.name);
            setError('');
        }
    }, [isOpen, sprite.name]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = name.trim();
        if (!trimmed) return;

        setSaving(true);
        setError('');

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/sprites/${sprite.id}/rename`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ name: trimmed }),
            });

            if (!res.ok) throw new Error('Failed to rename sprite');

            onRename({ ...sprite, name: trimmed });
        } catch {
            setError('Failed to rename sprite');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Sprite">
            <form className="form" onSubmit={handleSubmit}>
                <div className="form__row">
                    <div className="form__field">
                        <input
                            id="edit-sprite-name"
                            className="form__input"
                            placeholder="Sprite name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <button type="submit" className="btn btn--primary" disabled={saving}>
                        {saving ? 'Saving…' : 'Save'}
                    </button>
                </div>
                {error && <span className="form__error">{error}</span>}
            </form>
        </Modal>
    );
}
