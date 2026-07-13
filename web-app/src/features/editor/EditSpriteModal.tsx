import { useEffect, useState } from 'react';
import Modal from '../../shared/Modal';
import { renameSprite } from '../../api/sprites';
import { type Sprite } from '../../types/sprite';

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
            await renameSprite(sprite.id, trimmed);
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
