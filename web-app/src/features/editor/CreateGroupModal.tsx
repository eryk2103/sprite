import { useState } from 'react';
import Modal from '../../shared/Modal';
import { createGroup } from '../../api/groups';
import { type Group } from '../../types/group';

interface CreateGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectId: number;
    onCreate: (group: Group) => void;
}

export default function CreateGroupModal({ isOpen, onClose, projectId, onCreate }: CreateGroupModalProps) {
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
            const group = await createGroup(trimmed, projectId);
            setName('');
            onCreate(group);
        } catch {
            setError('Failed to create group');
        } finally {
            setCreating(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Create Group">
            <form className="form" onSubmit={handleSubmit}>
                <div className="form__row">
                    <div className="form__field">
                        <input
                            id="new-group-name"
                            className="form__input"
                            placeholder="Group name"
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
