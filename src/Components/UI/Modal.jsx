import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const Modal = ({ 
    isOpen, 
    onClose, 
    children, 
    title, 
    size = 'md',
    showClose = true,
    closeOnOverlay = true,
    closeOnEscape = true,
}) => {
    const modalRef = useRef(null);
    const previousFocus = useRef(null);

    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-6xl',
    };

    useEffect(() => {
        if (isOpen) {
            previousFocus.current = document.activeElement;
            modalRef.current?.focus();
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
            previousFocus.current?.focus();
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e) => {
            if (closeOnEscape && e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose, closeOnEscape]);

    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (closeOnOverlay && e.target === e.currentTarget) {
            onClose();
        }
    };

    const modalContent = (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={handleOverlayClick}
        >
            <div 
                ref={modalRef}
                className={`relative w-full ${sizes[size]} max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl ring-1 ring-slate-200 animate-in fade-in zoom-in duration-200`}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? 'modal-title' : undefined}
            >
                {showClose && (
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-500 transition-all hover:bg-slate-200 hover:text-slate-700"
                        aria-label="Close modal"
                    >
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}

                {title && (
                    <div className="border-b border-slate-100 px-6 py-4">
                        <h2 id="modal-title" className="text-lg font-black text-slate-950">
                            {title}
                        </h2>
                    </div>
                )}

                <div className="px-6 py-4">
                    {children}
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default Modal;
