import React, { useEffect } from 'react';

export default function Drawer({ isOpen, onClose, title, children, footer, width = '800px' }) {
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <>
            <div
                className={`drawer-overlay ${isOpen ? 'open' : ''}`}
                onClick={onClose}
            ></div>

            <div className={`drawer-panel ${isOpen ? 'open' : ''}`} style={{ width }}>
                <div className="drawer-header">
                    <h5 className="mb-0 fw-bold">{title}</h5>
                    <button
                        type="button"
                        className="btn-close"
                        onClick={onClose}
                        aria-label="Close"
                    ></button>
                </div>

                <div className="drawer-body">
                    {children}
                </div>

                {footer && (
                    <div className="drawer-footer">
                        {footer}
                    </div>
                )}
            </div>
        </>
    );
}
