import { createPortal } from 'react-dom';
import './Modal.css';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
    if (!isOpen) return null;

    return createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal__header">
                    <span className="modal__title label">{title}</span>
                    <button className="btn btn--icon" onClick={onClose}>✕</button>
                </div>
                <div className="modal__body">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}
