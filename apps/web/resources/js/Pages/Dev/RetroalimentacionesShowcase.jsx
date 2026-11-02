import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import Swal from 'sweetalert2';
import Toast from '../../Components/Toast/Toast';

export default function RetroalimentacionesShowcase() {
    const [harnessMode, setHarnessMode] = useState(null);
    const [isStatic, setIsStatic] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const comp = params.get('component') || params.get('isolate');
            const stat = params.get('static') === '1';

            if (comp) {
                setHarnessMode(comp.toLowerCase());
            }
            setIsStatic(stat);

            if (comp) {
                const target = comp.toLowerCase();
                if (target === 'e' || target === 'modal_confirm') {
                    openModalConfirm(stat);
                } else if (target === 'f' || target === 'modal_delete') {
                    openModalDelete(stat);
                }
            }
        }
    }, []);

    // Handlers para disparo en modo interactivo
    const triggerToast = (type, title, message) => {
        if (window.toast && window.toast[type]) {
            window.toast[type](title, message);
        } else if (window.toast && window.toast.show) {
            window.toast.show(type, title, message);
        }
    };

    const openModalConfirm = (freeze = false) => {
        Swal.fire({
            title: 'Confirmacion de Registro de Receta',
            text: '¿Esta seguro de que desea registrar y publicar la receta comercial de Bacon Burger Doble en el catalogo activo?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#0284c7',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'ACEPTAR',
            cancelButtonText: 'CANCELAR',
            backdrop: freeze ? false : true,
            allowOutsideClick: !freeze,
        });
    };

    const openModalDelete = (freeze = false) => {
        Swal.fire({
            title: 'Inactivar Producto del Menu',
            text: '¿Esta seguro de que desea dar de baja logica el producto Cheese Burger Simple? Esta accion impedira su venta en caja y web.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'ELIMINAR',
            cancelButtonText: 'CANCELAR',
            backdrop: freeze ? false : true,
            allowOutsideClick: !freeze,
        });
    };

    // MODO ARNES DE COMPONENTE AISLADO (Test Harness / CI Snapshot Mode)
    if (harnessMode) {
        return (
            <div
                id="harness-root"
                style={{
                    width: '100vw',
                    minHeight: '100vh',
                    margin: 0,
                    padding: '24px',
                    boxSizing: 'border-box',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#ffffff'
                }}
            >
                <Head title={`Harness - Component [${harnessMode}]`} />

                {/* Reset industrial de animaciones: elimina condiciones de carrera en capturas estaticas */}
                {isStatic && (
                    <style dangerouslySetInnerHTML={{ __html: `
                        *, *::before, *::after {
                            animation-duration: 0s !important;
                            animation-delay: 0s !important;
                            transition-duration: 0s !important;
                            transition-delay: 0s !important;
                            transform: none !important;
                        }
                        .swal2-popup {
                            transform: none !important;
                            animation: none !important;
                        }
                    `}} />
                )}

                {(harnessMode === 'a' || harnessMode === 'toast_success') && (
                    <div id="harness-target" style={{ width: '100%', maxWidth: '800px' }}>
                        <Toast
                            id="harness-toast-a"
                            type="success"
                            title="Operacion Exitosa"
                            message="El producto 'Bacon Burger Doble' ha sido registrado y publicado correctamente en el menu."
                            duration={0}
                            onClose={() => {}}
                        />
                    </div>
                )}

                {(harnessMode === 'b' || harnessMode === 'toast_error') && (
                    <div id="harness-target" style={{ width: '100%', maxWidth: '800px' }}>
                        <Toast
                            id="harness-toast-b"
                            type="error"
                            title="Error de Validacion"
                            message="Faltan completar campos obligatorios exigidos por el sistema (Precio o Insumos)."
                            duration={0}
                            onClose={() => {}}
                        />
                    </div>
                )}

                {(harnessMode === 'c' || harnessMode === 'toast_conflict') && (
                    <div id="harness-target" style={{ width: '100%', maxWidth: '800px' }}>
                        <Toast
                            id="harness-toast-c"
                            type="error"
                            title="Inconsistencia de Negocio"
                            message="Quiebre de stock. Materia prima 'Medallon de Carne Vacuna' insuficiente para elaborar la orden."
                            duration={0}
                            onClose={() => {}}
                        />
                    </div>
                )}

                {(harnessMode === 'd' || harnessMode === 'toast_warning') && (
                    <div id="harness-target" style={{ width: '100%', maxWidth: '800px' }}>
                        <Toast
                            id="harness-toast-d"
                            type="warning"
                            title="Advertencia de Duplicado"
                            message="Ya existe un producto registrado con la denominacion 'Bacon Burger Doble'."
                            duration={0}
                            onClose={() => {}}
                        />
                    </div>
                )}
            </div>
        );
    }

    // MODO CONSOLA / PLAYGROUND DE DESARROLLO (HTML puro, tecnico, sin estilos decorativos)
    return (
        <div style={{ width: '100%', minHeight: '100vh', margin: 0, padding: '20px', boxSizing: 'border-box', fontFamily: 'monospace', fontSize: '13px', lineHeight: 1.5, color: '#000000', backgroundColor: '#ffffff' }}>
            <Head title="Component Harness &amp; Feedback Playground" />

            <header style={{ borderBottom: '1px solid #000000', paddingBottom: '12px', marginBottom: '20px' }}>
                <h1 style={{ fontSize: '16px', margin: 0, fontWeight: 'bold' }}>
                    DEV_PLAYGROUND :: COMPONENT_HARNESS
                </h1>
                <p style={{ margin: '4px 0 0 0', color: '#555555' }}>
                    Consola técnica de ejecucion de componentes en aislamiento y banco de pruebas de retroalimentacion.
                </p>
            </header>

            <main style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Modulo 1: Notificaciones Asincronas (Toasts) */}
                <fieldset style={{ border: '1px solid #cccccc', padding: '16px', margin: 0 }}>
                    <legend style={{ fontWeight: 'bold', padding: '0 6px' }}>
                        MODULO_1: TOAST_NOTIFICATIONS
                    </legend>
                    <p style={{ margin: '0 0 12px 0', color: '#666666' }}>
                        Disparo interactivo de notificaciones no bloqueantes montadas en el arbol del cliente.
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        <button
                            type="button"
                            onClick={() => triggerToast('success', 'Operacion Exitosa', "El producto 'Bacon Burger Doble' ha sido registrado y publicado correctamente en el menu.")}
                            style={{ padding: '8px 16px', cursor: 'pointer', fontFamily: 'monospace' }}
                        >
                            Trigger: Toast [Success]
                        </button>
                        <button
                            type="button"
                            onClick={() => triggerToast('error', 'Error de Validacion', 'Faltan completar campos obligatorios exigidos por el sistema (Precio o Insumos).')}
                            style={{ padding: '8px 16px', cursor: 'pointer', fontFamily: 'monospace' }}
                        >
                            Trigger: Toast [Validation Error]
                        </button>
                        <button
                            type="button"
                            onClick={() => triggerToast('error', 'Inconsistencia de Negocio', "Quiebre de stock. Materia prima 'Medallon de Carne Vacuna' insuficiente para elaborar la orden.")}
                            style={{ padding: '8px 16px', cursor: 'pointer', fontFamily: 'monospace' }}
                        >
                            Trigger: Toast [Business Conflict]
                        </button>
                        <button
                            type="button"
                            onClick={() => triggerToast('warning', 'Advertencia de Duplicado', "Ya existe un producto registrado con la denominacion 'Bacon Burger Doble'.")}
                            style={{ padding: '8px 16px', cursor: 'pointer', fontFamily: 'monospace' }}
                        >
                            Trigger: Toast [Warning Duplicate]
                        </button>
                    </div>
                </fieldset>

                {/* Modulo 2: Dialogos Modales Bloqueantes */}
                <fieldset style={{ border: '1px solid #cccccc', padding: '16px', margin: 0 }}>
                    <legend style={{ fontWeight: 'bold', padding: '0 6px' }}>
                        MODULO_2: MODAL_DIALOGS
                    </legend>
                    <p style={{ margin: '0 0 12px 0', color: '#666666' }}>
                        Dialogos de interrupcion transaccional con resolucion de promesas (Aceptar / Cancelar).
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        <button
                            type="button"
                            onClick={() => openModalConfirm(false)}
                            style={{ padding: '8px 16px', cursor: 'pointer', fontFamily: 'monospace' }}
                        >
                            Trigger: Modal [Confirm Operation]
                        </button>
                        <button
                            type="button"
                            onClick={() => openModalDelete(false)}
                            style={{ padding: '8px 16px', cursor: 'pointer', fontFamily: 'monospace' }}
                        >
                            Trigger: Modal [Confirm Deletion]
                        </button>
                    </div>
                </fieldset>

                {/* Modulo 3: Endpoints de Aislamiento para Herramientas de Captura (CI / Headless) */}
                <fieldset style={{ border: '1px solid #cccccc', padding: '16px', margin: 0 }}>
                    <legend style={{ fontWeight: 'bold', padding: '0 6px' }}>
                        MODULO_3: HEADLESS_HARNESS_ENDPOINTS
                    </legend>
                    <p style={{ margin: '0 0 12px 0', color: '#666666' }}>
                        Rutas parametrizadas para herramientas CLI, crawlers o tests de regresion visual. El parametro <code>static=1</code> deshabilita animaciones para evitar condiciones de carrera.
                    </p>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #000000' }}>
                                <th style={{ padding: '6px' }}>Identificador</th>
                                <th style={{ padding: '6px' }}>Tipo</th>
                                <th style={{ padding: '6px' }}>URL de Aislamiento Estático</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{ borderBottom: '1px solid #eeeeee' }}>
                                <td style={{ padding: '6px' }}>Pantalla [A]</td>
                                <td style={{ padding: '6px' }}>Toast Success</td>
                                <td style={{ padding: '6px' }}><code>/dev/retroalimentaciones?component=toast_success&amp;static=1</code></td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #eeeeee' }}>
                                <td style={{ padding: '6px' }}>Pantalla [B]</td>
                                <td style={{ padding: '6px' }}>Toast Error</td>
                                <td style={{ padding: '6px' }}><code>/dev/retroalimentaciones?component=toast_error&amp;static=1</code></td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #eeeeee' }}>
                                <td style={{ padding: '6px' }}>Pantalla [C]</td>
                                <td style={{ padding: '6px' }}>Toast Conflict</td>
                                <td style={{ padding: '6px' }}><code>/dev/retroalimentaciones?component=toast_conflict&amp;static=1</code></td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #eeeeee' }}>
                                <td style={{ padding: '6px' }}>Pantalla [D]</td>
                                <td style={{ padding: '6px' }}>Toast Warning</td>
                                <td style={{ padding: '6px' }}><code>/dev/retroalimentaciones?component=toast_warning&amp;static=1</code></td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #eeeeee' }}>
                                <td style={{ padding: '6px' }}>Pantalla [E]</td>
                                <td style={{ padding: '6px' }}>Modal Confirm</td>
                                <td style={{ padding: '6px' }}><code>/dev/retroalimentaciones?component=modal_confirm&amp;static=1</code></td>
                            </tr>
                            <tr>
                                <td style={{ padding: '6px' }}>Pantalla [F]</td>
                                <td style={{ padding: '6px' }}>Modal Delete</td>
                                <td style={{ padding: '6px' }}><code>/dev/retroalimentaciones?component=modal_delete&amp;static=1</code></td>
                            </tr>
                        </tbody>
                    </table>
                </fieldset>
            </main>
        </div>
    );
}
