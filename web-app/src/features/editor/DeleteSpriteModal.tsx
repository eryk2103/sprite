import Modal from '../../shared/Modal';

interface DeleteSpriteModalProps {
    isOpen: boolean;
    spriteName: string;
    deleting: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function DeleteSpriteModal({ isOpen, spriteName, deleting, onConfirm, onCancel }: DeleteSpriteModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onCancel} title="Delete Sprite">
            <p>Delete sprite "{spriteName}"? This cannot be undone.</p>
            <div className="form__footer">
                <button type="button" className="btn" onClick={onCancel} disabled={deleting}>
                    Cancel
                </button>
                <button type="button" className="btn btn--primary" onClick={onConfirm} disabled={deleting}>
                    {deleting ? 'Deleting…' : 'Delete'}
                </button>
            </div>
        </Modal>
    );
}
