import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import ConfirmDialog from '../Components/Modal/ConfirmDialog';

// Permite que tanto `if (ok)` como `if (result.isConfirmed)` funcionen universalmente
if (typeof Boolean !== 'undefined' && !Boolean.prototype.hasOwnProperty('isConfirmed')) {
    try {
        Object.defineProperty(Boolean.prototype, 'isConfirmed', {
            get() { return this.valueOf(); },
            configurable: true
        });
        Object.defineProperty(Boolean.prototype, 'isDismissed', {
            get() { return !this.valueOf(); },
            configurable: true
        });
    } catch (e) {}
}

const ConfirmContext = createContext(null);

export const useConfirm = () => {
    const context = useContext(ConfirmContext);
    if (!context) {
        throw new Error('useConfirm debe ser utilizado dentro de un ConfirmProvider');
    }
    return context;
};

export const ConfirmProvider = ({ children }) => {
    const [dialogState, setDialogState] = useState({
        isOpen: false,
        title: '',
        message: '',
        variant: 'danger',
        category: '',
        confirmText: '',
        cancelText: 'Cancelar',
        freeze: false,
        icon: null,
        resolve: null
    });

    const confirmAction = useCallback((options = {}) => {
        return new Promise((resolve) => {
            // Normalización de opciones (compatible con SweetAlert y nativo)
            const title = options.title || (options.text ? '' : '¿Está seguro?');
            const message = options.message || options.text || '¿Confirma que desea realizar esta acción?';
            const iconVariant = options.iconVariant || options.icon || options.variant || 'danger';
            
            // Mapeo de variantes
            let variant = 'danger';
            if (iconVariant === 'warning') variant = 'warning';
            else if (iconVariant === 'question' || iconVariant === 'info') variant = 'info';
            else if (iconVariant === 'danger' || iconVariant === 'error') variant = 'danger';

            const category = options.category || '';
            const customIcon = (typeof options.icon === 'object' && React.isValidElement(options.icon)) ? options.icon : null;
            const confirmText = options.confirmButtonText || options.confirmText;
            const cancelText = options.cancelButtonText || options.cancelText || 'Cancelar';
            const freeze = options.freeze || options.backdrop === false;

            setDialogState({
                isOpen: true,
                title,
                message,
                variant,
                category,
                confirmText,
                cancelText,
                freeze,
                icon: customIcon,
                resolve
            });
        });
    }, []);

    const handleConfirm = useCallback(() => {
        if (dialogState.resolve) {
            dialogState.resolve(true);
        }
        setDialogState((prev) => ({ ...prev, isOpen: false, resolve: null }));
    }, [dialogState]);

    const handleCancel = useCallback(() => {
        if (dialogState.resolve) {
            dialogState.resolve(false);
        }
        setDialogState((prev) => ({ ...prev, isOpen: false, resolve: null }));
    }, [dialogState]);

    useEffect(() => {
        window.confirmAction = confirmAction;
        window.confirmModal = confirmAction;

        return () => {
            delete window.confirmAction;
            delete window.confirmModal;
        };
    }, [confirmAction]);

    return (
        <ConfirmContext.Provider value={{ confirmAction }}>
            {children}
            {typeof document !== 'undefined' && createPortal(
                <ConfirmDialog
                    isOpen={dialogState.isOpen}
                    title={dialogState.title}
                    message={dialogState.message}
                    variant={dialogState.variant}
                    category={dialogState.category}
                    confirmText={dialogState.confirmText}
                    cancelText={dialogState.cancelText}
                    freeze={dialogState.freeze}
                    icon={dialogState.icon}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                />,
                document.body
            )}
        </ConfirmContext.Provider>
    );
};
