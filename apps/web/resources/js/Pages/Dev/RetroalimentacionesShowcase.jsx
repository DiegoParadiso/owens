import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import Toast from '../../Components/Toast/Toast';
import ConfirmDialog from '../../Components/Modal/ConfirmDialog';

export default function RetroalimentacionesShowcase() {
    const [component, setComponent] = useState(null);
    const [isStatic, setIsStatic] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const comp = (params.get('component') || params.get('isolate') || '').toLowerCase();
            const stat = params.get('static') === '1';

            if (comp) {
                setComponent(comp);
            }
            setIsStatic(stat);
        }
    }, []);

    const triggerToast = (type, title, message) => {
        if (window.toast && window.toast[type]) {
            window.toast[type](title, message);
        } else if (window.toast && window.toast.show) {
            window.toast.show(type, title, message);
        }
    };

    const openModalConfirm = () => {
        if (window.confirmAction) {
            window.confirmAction({
                title: 'Confirmación de Registro de Receta',
                message: '¿Está seguro de que desea registrar y publicar la receta comercial de Bacon Burger Doble en el catálogo activo?',
                variant: 'info',
                confirmText: 'ACEPTAR',
                cancelText: 'CANCELAR'
            });
        }
    };

    const openModalDelete = () => {
        if (window.confirmAction) {
            window.confirmAction({
                title: 'Inactivar Producto del Menú',
                message: '¿Está seguro de que desea dar de baja lógica el producto Cheese Burger Simple? Esta acción impedirá su venta en caja y web.',
                variant: 'danger',
                confirmText: 'ELIMINAR',
                cancelText: 'CANCELAR'
            });
        }
    };

    // Modo de captura aislada para snapshots limpios
    if (component) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
                <Head title="Captura" />
                {isStatic && (
                    <style dangerouslySetInnerHTML={{ __html: `
                        *, *::before, *::after {
                            animation: none !important;
                            transition: none !important;
                            transform: none !important;
                        }
                    `}} />
                )}
                {(component === 'a' || component === 'toast_success') && (
                    <Toast
                        id="t-a"
                        type="success"
                        title="Operación Exitosa"
                        message="El producto 'Bacon Burger Doble' ha sido registrado y publicado correctamente en el menú."
                        duration={0}
                        onClose={() => {}}
                    />
                )}
                {(component === 'b' || component === 'toast_error') && (
                    <Toast
                        id="t-b"
                        type="error"
                        title="Error de Validación"
                        message="Faltan completar campos obligatorios exigidos por el sistema (Precio o Insumos)."
                        duration={0}
                        onClose={() => {}}
                    />
                )}
                {(component === 'c' || component === 'toast_conflict') && (
                    <Toast
                        id="t-c"
                        type="error"
                        title="Inconsistencia de Negocio"
                        message="Quiebre de stock. Materia prima 'Medallón de Carne Vacuna' insuficiente para elaborar la orden."
                        duration={0}
                        onClose={() => {}}
                    />
                )}
                {(component === 'd' || component === 'toast_warning') && (
                    <Toast
                        id="t-d"
                        type="warning"
                        title="Advertencia de Duplicado"
                        message="Ya existe un producto registrado con la denominación 'Bacon Burger Doble'."
                        duration={0}
                        onClose={() => {}}
                    />
                )}
                {(component === 'e' || component === 'modal_confirm') && (
                    <ConfirmDialog
                        isOpen={true}
                        variant="info"
                        title="Confirmación de Registro de Receta"
                        message="¿Está seguro de que desea registrar y publicar la receta comercial de Bacon Burger Doble en el catálogo activo?"
                        confirmText="ACEPTAR"
                        cancelText="CANCELAR"
                        freeze={true}
                    />
                )}
                {(component === 'f' || component === 'modal_delete') && (
                    <ConfirmDialog
                        isOpen={true}
                        variant="danger"
                        title="Inactivar Producto del Menú"
                        message="¿Está seguro de que desea dar de baja lógica el producto Cheese Burger Simple? Esta acción impedirá su venta en caja y web."
                        confirmText="ELIMINAR"
                        cancelText="CANCELAR"
                        freeze={true}
                    />
                )}
            </div>
        );
    }

    // Modo interactivo en pantalla: HTML nativo puro, sin estilos decorativos, letras pequeñas
    return (
        <div style={{ padding: '16px', fontSize: '13px' }}>
            <Head title="Playground" />

            <p style={{ margin: '0 0 12px 0' }}>
                <strong>Playground de pruebas</strong> — haz clic para probar las alertas y modales en pantalla:
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <button
                    type="button"
                    onClick={() => triggerToast('success', 'Operación Exitosa', "El producto 'Bacon Burger Doble' ha sido registrado y publicado correctamente en el menú.")}
                >
                    Toast de éxito
                </button>

                <button
                    type="button"
                    onClick={() => triggerToast('error', 'Error de Validación', 'Faltan completar campos obligatorios exigidos por el sistema (Precio o Insumos).')}
                >
                    Toast de error de validación
                </button>

                <button
                    type="button"
                    onClick={() => triggerToast('error', 'Inconsistencia de Negocio', "Quiebre de stock. Materia prima 'Medallón de Carne Vacuna' insuficiente para elaborar la orden.")}
                >
                    Toast de inconsistencia
                </button>

                <button
                    type="button"
                    onClick={() => triggerToast('warning', 'Advertencia de Duplicado', "Ya existe un producto registrado con la denominación 'Bacon Burger Doble'.")}
                >
                    Toast de advertencia
                </button>

                <button
                    type="button"
                    onClick={() => openModalConfirm(false)}
                >
                    Modal de confirmación
                </button>

                <button
                    type="button"
                    onClick={() => openModalDelete(false)}
                >
                    Modal de baja
                </button>
            </div>

            <p style={{ margin: '20px 0 0 0', color: '#555' }}>
                Ejecutar capturas en terminal: <code>npm run capture:toasts</code>
            </p>
        </div>
    );
}
