import React, { useEffect, useRef } from 'react';

/**
 * ConfirmDialog — Estilo Minimalista Tipográfico (Linear / Stripe)
 * Diálogo de confirmación transaccional agnóstico sin iconos decorativos.
 */
export default function ConfirmDialog({
    isOpen = true,
    title = '¿Está seguro?',
    message = '¿Confirma que desea realizar esta acción?',
    variant = 'danger', // 'danger' | 'warning' | 'info' | 'question'
    category = '',      // Pill contextual opcional (ej. 'CATÁLOGO DE RECETAS')
    confirmText,
    cancelText = 'Cancelar',
    onConfirm,
    onCancel,
    freeze = false,
}) {
    const confirmBtnRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;

        // Auto-focus en el botón de confirmación
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

    const isDanger = variant === 'danger';
    const isWarning = variant === 'warning';

    const defaultConfirmText = isDanger ? 'Inactivar' : 'Aceptar';
    const finalConfirmText = confirmText || defaultConfirmText;

    const confirmBtnBg = isDanger ? '#df0f13' : isWarning ? '#d97706' : '#0284c7';
    const accentDotColor = isDanger ? '#df0f13' : isWarning ? '#d97706' : '#0284c7';

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
                    0% { opacity: 0; transform: scale(0.97) translateY(4px); }
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
                    borderRadius: '14px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.06)',
                    width: '100%',
                    maxWidth: '430px',
                    minWidth: '320px',
                    padding: '24px',
                    textAlign: 'left',
                    animation: freeze ? 'none' : 'owensModalPopIn 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxSizing: 'border-box'
                }}
            >
                {category && (
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '11px',
                        fontWeight: 600,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        color: 'var(--text-muted, #64748b)',
                        backgroundColor: 'var(--bg-main, #f1f5f9)',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        marginBottom: '12px'
                    }}>
                        <span style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: accentDotColor
                        }} />
                        {category}
                    </div>
                )}

                <h3 style={{
                    margin: '0 0 8px 0',
                    fontSize: '16px',
                    fontWeight: 700,
                    letterSpacing: '-0.015em',
                    color: 'var(--text-main, #0f172a)',
                    lineHeight: 1.35
                }}>
                    {title}
                </h3>

                <p style={{
                    margin: '0 0 24px 0',
                    fontSize: '13px',
                    lineHeight: 1.6,
                    color: 'var(--text-muted, #64748b)'
                }}>
                    {message}
                </p>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button
                        type="button"
                        onClick={onCancel}
                        style={{
                            padding: '8px 18px',
                            fontSize: '13px',
                            fontWeight: 500,
                            borderRadius: '8px',
                            border: '1px solid var(--border-color, #cbd5e1)',
                            backgroundColor: 'transparent',
                            color: 'var(--text-main, #334155)',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
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
                            padding: '8px 20px',
                            fontSize: '13px',
                            fontWeight: 600,
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: confirmBtnBg,
                            color: '#ffffff',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
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
