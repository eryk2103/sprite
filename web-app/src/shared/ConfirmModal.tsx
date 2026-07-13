import Modal from './Modal';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    confirmingLabel?: string;
    confirming: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmModal({
    isOpen,
    title,
    message,
    confirmLabel = 'Confirm',
    confirmingLabel = 'Working…',
    confirming,
    onConfirm,
    onCancel,
}: ConfirmModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onCancel} title={title}>
            <p>{message}</p>
            <div className="form__footer">
                <button type="button" className="btn btn--secondary" onClick={onCancel} disabled={confirming}>
                    Cancel
                </button>
                <button type="button" className="btn btn--danger" onClick={onConfirm} disabled={confirming}>
                    {confirming ? confirmingLabel : confirmLabel}
                </button>
            </div>
        </Modal>
    );
}
