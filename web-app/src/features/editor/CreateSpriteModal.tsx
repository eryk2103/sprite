import { useState } from 'react';
import Modal from '../../shared/Modal';
import { createSprite } from '../../api/sprites';
import { type SpriteSummary } from '../../types/sprite';

interface CreateSpriteModalProps {
    isOpen: boolean;
    onClose: () => void;
    groupId: number;
    onCreate: (sprite: SpriteSummary) => void;
}

export default function CreateSpriteModal({ isOpen, onClose, groupId, onCreate }: CreateSpriteModalProps) {
    const [name, setName] = useState('');
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');

    const handleClose = () => {
        setName('');
        setError('');
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = name.trim();
        if (!trimmed) return;

        setCreating(true);
        setError('');

        try {
            const sprite = await createSprite(groupId, trimmed, '{}');
            setName('');
            onCreate(sprite);
        } catch {
            setError('Failed to create sprite');
        } finally {
            setCreating(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Create Sprite">
            <form className="form" onSubmit={handleSubmit}>
                <div className="form__row">
                    <div className="form__field">
                        <input
                            id="new-sprite-name"
                            className="form__input"
                            placeholder="Sprite name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn--primary" disabled={creating}>
                        {creating ? 'Creating…' : 'Create'}
                    </button>
                </div>
                {error && <span className="form__error">{error}</span>}
            </form>
        </Modal>
    );
}
