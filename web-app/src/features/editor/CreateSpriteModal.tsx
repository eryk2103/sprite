import { useEffect, useState } from 'react';
import Modal from '../../shared/Modal';
import { type SpriteSummary } from './sprite';

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

    useEffect(() => {
        if (!isOpen) {
            setName('');
            setError('');
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = name.trim();
        if (!trimmed) return;

        setCreating(true);
        setError('');

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/sprites`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ groupId, name: trimmed, data: '{}' }),
            });

            if (!res.ok) throw new Error('Failed to create sprite');

            const sprite: SpriteSummary = await res.json();
            onCreate(sprite);
        } catch {
            setError('Failed to create sprite');
        } finally {
            setCreating(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create Sprite">
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
