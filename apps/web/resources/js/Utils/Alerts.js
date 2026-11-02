/**
 * Owens Native Confirm Helper (replaces SweetAlert2 with React-native ConfirmDialog)
 */
export const confirmAction = ({
    title = '¿Estás seguro?',
    text = 'No podrás revertir esto',
    message,
    icon = 'warning',
    variant,
    confirmButtonText,
    confirmText,
    cancelButtonText,
    cancelText = 'Cancelar',
    onConfirm,
    onCancel,
    freeze = false,
} = {}) => {
    const fn = (typeof window !== 'undefined' && window.confirmAction)
        ? window.confirmAction
        : () => Promise.resolve({ isConfirmed: false, isDismissed: true });

    return fn({
        title,
        message: message || text,
        variant: variant || icon,
        confirmText: confirmText || confirmButtonText,
        cancelText: cancelText || cancelButtonText,
        freeze
    }).then((result) => {
        if (result && result.isConfirmed) {
            if (onConfirm) onConfirm();
        } else {
            if (onCancel) onCancel();
        }
        return result;
    });
};

export default { confirmAction };
