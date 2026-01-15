import Swal from 'sweetalert2';

export const confirmAction = ({
    title = '¿Estás seguro?',
    text = 'No podrás revertir esto',
    icon = 'warning',
    confirmButtonText = 'Sí, eliminar',
    cancelButtonText = 'Cancelar',
    onConfirm,
    onCancel
}) => {
    Swal.fire({
        title,
        text,
        icon,
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText,
        cancelButtonText,
    }).then((result) => {
        if (result.isConfirmed) {
            if (onConfirm) onConfirm();
        } else {
            if (onCancel) onCancel();
        }
    });
};
