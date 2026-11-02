import React, { useEffect, useRef } from 'react';

export default function ConfirmDialog({
    isOpen = true,
    title = '¿Está seguro?',
    message = '¿Confirma que desea realizar esta acción?',
    variant = 'danger', // 'danger' | 'warning' | 'info' | 'question'
    confirmText,
    cancelText = 'Cancelar',
    onConfirm,
    onCancel,
    freeze = false,
}) {
    const confirmBtnRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;

        // Auto-focus confirm button
        if (confirmBtnRef.current) {
            confirmBtnRef.current.focus();
        }

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                if (onCancel) onCancel();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onCancel]);

    if (!isOpen) return null;

    // Determinación de iconos y colores según variante
    const isDanger = variant === 'danger';
    const isWarning = variant === 'warning';
    const isInfo = variant === 'info' || variant === 'question';

    const defaultConfirmText = isDanger ? 'Eliminar' : 'Aceptar';
    const finalConfirmText = confirmText || defaultConfirmText;

    const iconBadge = () => {
        if (isDanger) {
            return (
                <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    backgroundColor: '#fee2e2',
                    color: '#dc2626',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px auto'
                }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                </div>
            );
        }

        if (isWarning) {
            return (
                <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    backgroundColor: '#fef3c7',
                    color: '#d97706',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px auto'
                }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                </div>
            );
        }

        // Info / Question / Operación exitosa de alta
        return (
            <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: '#e0f2fe',
                color: '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto'
            }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
            </div>
        );
    };

    const confirmBtnBg = isDanger ? '#dc2626' : isWarning ? '#d97706' : '#0284c7';

    return (
        <div
            id="owens-confirm-backdrop"
            onClick={(e) => {
                if (e.target.id === 'owens-confirm-backdrop' && onCancel) {
                    onCancel();
                }
            }}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 10500,
                backgroundColor: freeze ? 'transparent' : 'rgba(0, 0, 0, 0.45)',
                backdropFilter: freeze ? 'none' : 'blur(2px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px',
                fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
            }}
        >
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes owensModalPopIn {
                    0% { opacity: 0; transform: scale(0.95) translateY(4px); }
                    100% { opacity: 1; transform: scale(1) translateY(0); }
                }
            `}} />

            <div
                id="owens-confirm-modal"
                role="dialog"
                aria-modal="true"
                style={{
                    backgroundColor: 'var(--bg-card, #ffffff)',
                    color: 'var(--text-main, #0f172a)',
                    border: '1px solid var(--border-color, #e2e8f0)',
                    borderRadius: '16px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                    width: '100%',
                    maxWidth: '380px',
                    padding: '24px 20px',
                    textAlign: 'center',
                    animation: freeze ? 'none' : 'owensModalPopIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxSizing: 'border-box'
                }}
            >
                {iconBadge()}

                <h3 style={{
                    margin: '0 0 8px 0',
                    fontSize: '16px',
                    fontWeight: 700,
                    color: 'var(--text-main, #0f172a)',
                    lineHeight: 1.3
                }}>
                    {title}
                </h3>

                <p style={{
                    margin: '0 0 20px 0',
                    fontSize: '13px',
                    lineHeight: 1.5,
                    color: 'var(--text-muted, #64748b)'
                }}>
                    {message}
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <button
                        type="button"
                        onClick={onCancel}
                        style={{
                            flex: 1,
                            padding: '9px 14px',
                            fontSize: '13px',
                            fontWeight: 600,
                            borderRadius: '8px',
                            border: '1px solid var(--border-color, #cbd5e1)',
                            backgroundColor: 'transparent',
                            color: 'var(--text-main, #334155)',
                            cursor: 'pointer',
                            transition: 'background-color 0.15s ease'
                        }}
                    >
                        {cancelText}
                    </button>

                    <button
                        ref={confirmBtnRef}
                        type="button"
                        onClick={onConfirm}
                        style={{
                            flex: 1,
                            padding: '9px 14px',
                            fontSize: '13px',
                            fontWeight: 600,
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: confirmBtnBg,
                            color: '#ffffff',
                            cursor: 'pointer',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                            transition: 'opacity 0.15s ease'
                        }}
                    >
                        {finalConfirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
