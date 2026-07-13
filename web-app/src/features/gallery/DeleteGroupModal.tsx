import Modal from '../../shared/Modal';

interface DeleteGroupModalProps {
    isOpen: boolean;
    groupName: string;
    deleting: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function DeleteGroupModal({ isOpen, groupName, deleting, onConfirm, onCancel }: DeleteGroupModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onCancel} title="Delete Group">
            <p>Delete group "{groupName}"? This cannot be undone.</p>
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
