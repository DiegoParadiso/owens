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

    const handleConfirmRecipe = async () => {
        if (window.confirmAction) {
            const ok = await window.confirmAction({
                title: 'Confirmar Registro de Receta',
                category: 'Catálogo de Recetas BOM',
                message: '¿Confirma la publicación de la receta comercial de Bacon Burger Doble? Se actualizarán los costos de insumos en el menú activo.',
                variant: 'info',
                confirmText: 'PUBLICAR RECETA',
                cancelText: 'CANCELAR'
            });
            if (ok) {
                triggerToast('success', 'Operación Exitosa', "El producto 'Bacon Burger Doble' ha sido registrado y publicado correctamente en el menú.");
            }
        }
    };

    const handleConfirmOpenRegister = async () => {
        if (window.confirmAction) {
            const ok = await window.confirmAction({
                title: 'Confirmar Apertura de Caja',
                category: 'Gestión de Caja POS',
                message: '¿Confirma la apertura de turno con un fondo inicial declarado de $15,000?',
                variant: 'info',
                confirmText: 'ABRIR CAJA',
                cancelText: 'CANCELAR'
            });
            if (ok) {
                triggerToast('success', 'Caja Abierta', 'El turno de caja ha sido iniciado exitosamente.');
            }
        }
    };

    const handleInactivateProduct = async () => {
        if (window.confirmAction) {
            const ok = await window.confirmAction({
                title: 'Inactivar Producto del Menú',
                category: 'Inactivación',
                message: '¿Confirma que desea inactivar Cheese Burger Simple? Esta acción impedirá su venta en mostrador y pausará su receta en cocina.',
                variant: 'danger',
                confirmText: 'INACTIVAR',
                cancelText: 'CANCELAR'
            });
            if (ok) {
                triggerToast('success', 'Producto inactivado', "El producto 'Cheese Burger Simple' ha sido inactivado correctamente del menú.");
            }
        }
    };

    const handleInactivateSupply = async () => {
        if (window.confirmAction) {
            const ok = await window.confirmAction({
                title: 'Inactivar Insumo de Almacén',
                category: 'Inventario de Insumos',
                message: '¿Confirma que desea inactivar Pan Brioche? Dejará de estar disponible para compras y recetas.',
                variant: 'danger',
                confirmText: 'INACTIVAR',
                cancelText: 'CANCELAR'
            });
            if (ok) {
                triggerToast('success', 'Insumo inactivado', "La materia prima 'Pan Brioche' ha sido inactivada en el depósito.");
            }
        }
    };

    const handleInactivateCombo = async () => {
        if (window.confirmAction) {
            const ok = await window.confirmAction({
                title: 'Inactivar Combo Comercial',
                category: 'Inactivación',
                message: '¿Confirma que desea inactivar el Combo Familiar? Dejará de ofertarse en mostrador y canales digitales.',
                variant: 'danger',
                confirmText: 'INACTIVAR',
                cancelText: 'CANCELAR'
            });
            if (ok) {
                triggerToast('success', 'Combo inactivado', "El combo 'Combo Familiar' ha sido inactivado correctamente.");
            }
        }
    };

    const handleDeleteExpense = async () => {
        if (window.confirmAction) {
            const ok = await window.confirmAction({
                title: 'Eliminar Comprobante de Gasto',
                category: 'Egresos y Finanzas',
                message: '¿Confirma que desea eliminar el comprobante #EXP-1042? Esta acción es irreversible.',
                variant: 'danger',
                confirmText: 'ELIMINAR',
                cancelText: 'CANCELAR'
            });
            if (ok) {
                triggerToast('success', 'Gasto eliminado', 'El comprobante #EXP-1042 ha sido eliminado correctamente.');
            }
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
                        category="Catálogo de Recetas BOM"
                        title="Confirmar Registro de Receta"
                        message="¿Confirma la publicación de la receta comercial de Bacon Burger Doble? Se actualizarán los costos de insumos en el menú activo."
                        confirmText="PUBLICAR RECETA"
                        cancelText="CANCELAR"
                        freeze={true}
                    />
                )}
                {(component === 'f' || component === 'modal_delete') && (
                    <ConfirmDialog
                        isOpen={true}
                        variant="danger"
                        category="Inactivación"
                        title="Inactivar Producto del Menú"
                        message="¿Confirma que desea inactivar Cheese Burger Simple? Esta acción impedirá su venta en mostrador y pausará su receta en cocina."
                        confirmText="INACTIVAR"
                        cancelText="CANCELAR"
                        freeze={true}
                    />
                )}
            </div>
        );
    }

    // Modo interactivo en pantalla: HTML nativo puro, organizado por Casos de Uso con ciclo completo a toast
    return (
        <div style={{ padding: '16px', fontSize: '13px', fontFamily: 'system-ui, sans-serif' }}>
            <Head title="Playground de Retroalimentaciones" />

            <h3 style={{ margin: '0 0 8px 0', fontSize: '15px' }}>
                Playground de Pruebas: Retroalimentaciones del Sistema Owens
            </h3>
            <p style={{ margin: '0 0 16px 0', color: '#555' }}>
                Pruebe las alertas asíncronas no bloqueantes y los flujos transaccionales en dos tiempos (Modal &rarr; Confirmar &rarr; Toast de Éxito):
            </p>

            <div style={{ marginBottom: '16px' }}>
                <strong>1. Notificaciones Asíncronas (Toasts [Pantalla A..D]):</strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
                    <button
                        type="button"
                        onClick={() => triggerToast('success', 'Operación Exitosa', "El producto 'Bacon Burger Doble' ha sido registrado y publicado correctamente en el menú.")}
                    >
                        [A] Toast de éxito (CU-15)
                    </button>

                    <button
                        type="button"
                        onClick={() => triggerToast('error', 'Error de Validación', 'Faltan completar campos obligatorios exigidos por el sistema (Precio o Insumos).')}
                    >
                        [B] Toast de error de validación (CU-15 / CU-12)
                    </button>

                    <button
                        type="button"
                        onClick={() => triggerToast('error', 'Inconsistencia de Negocio', "Quiebre de stock. Materia prima 'Medallón de Carne Vacuna' insuficiente para elaborar la orden.")}
                    >
                        [C] Toast de inconsistencia / conflicto (CU-25 / CU-13)
                    </button>

                    <button
                        type="button"
                        onClick={() => triggerToast('warning', 'Advertencia de Duplicado', "Ya existe un producto registrado con la denominación 'Bacon Burger Doble'.")}
                    >
                        [D] Toast de advertencia / duplicado (CU-15 / CU-12)
                    </button>
                </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
                <strong>2. Modales de Confirmación de Operación [Pantalla E] (&rarr; Toast de Éxito [Pantalla A]):</strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
                    <button
                        type="button"
                        onClick={handleConfirmRecipe}
                    >
                        [E] CU-15: Publicar Receta BOM (&rarr; PUBLICAR RECETA)
                    </button>

                    <button
                        type="button"
                        onClick={handleConfirmOpenRegister}
                    >
                        [E] CU-42: Apertura de Caja POS (&rarr; ABRIR CAJA)
                    </button>
                </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
                <strong>3. Modales de Inactivación y Eliminación [Pantalla F] (&rarr; Toast de Éxito [Pantalla A]):</strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
                    <button
                        type="button"
                        onClick={handleInactivateProduct}
                    >
                        [F] CU-25: Inactivar Producto del Menú (&rarr; INACTIVAR)
                    </button>

                    <button
                        type="button"
                        onClick={handleInactivateSupply}
                    >
                        [F] CU-13: Inactivar Insumo de Almacén (&rarr; INACTIVAR)
                    </button>

                    <button
                        type="button"
                        onClick={handleInactivateCombo}
                    >
                        [F] CU-61: Inactivar Combo Comercial (&rarr; INACTIVAR)
                    </button>

                    <button
                        type="button"
                        onClick={handleDeleteExpense}
                    >
                        [F] Finanzas: Eliminar Comprobante de Gasto (&rarr; ELIMINAR)
                    </button>
                </div>
            </div>

            <p style={{ margin: '20px 0 0 0', color: '#777', fontSize: '12px' }}>
                Ejecutar captura automatizada de láminas para la documentación: <code>npm run capture:toasts</code>
            </p>
        </div>
    );
}
