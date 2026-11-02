import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import Swal from 'sweetalert2';
import Toast from '../../Components/Toast/Toast';

export default function RetroalimentacionesShowcase() {
    const [isolate, setIsolate] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const iso = params.get('isolate');
            if (iso) {
                setIsolate(iso.toUpperCase());
                if (iso.toUpperCase() === 'E') {
                    openModalE(true);
                } else if (iso.toUpperCase() === 'F') {
                    openModalF(true);
                }
            }
        }
    }, []);

    // Disparadores reales de producción
    const triggerToastA = () => {
        if (window.toast) {
            window.toast.success(
                'Operación Exitosa',
                "El producto 'Bacon Burger Doble' ha sido registrado y publicado correctamente en el menú."
            );
        }
    };

    const triggerToastB = () => {
        if (window.toast) {
            window.toast.error(
                'Error de Validación',
                'Faltan completar campos obligatorios exigidos por el sistema (Precio o Insumos).'
            );
        }
    };

    const triggerToastC = () => {
        if (window.toast) {
            window.toast.error(
                'Inconsistencia de Negocio',
                "Quiebre de stock. Materia prima 'Medallón de Carne Vacuna' insuficiente para elaborar la orden."
            );
        }
    };

    const triggerToastD = () => {
        if (window.toast) {
            window.toast.warning(
                'Advertencia de Duplicado',
                "Ya existe un producto registrado con la denominación 'Bacon Burger Doble'."
            );
        }
    };

    const openModalE = (isIso = false) => {
        Swal.fire({
            title: 'Confirmación de Registro de Receta',
            text: "¿Está seguro de que desea registrar y publicar la receta comercial de 'Bacon Burger Doble' en el catálogo activo?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#0284c7',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'ACEPTAR',
            cancelButtonText: 'CANCELAR',
            backdrop: isIso ? false : true,
            customClass: {
                popup: 'swal2-owens-popup',
            }
        });
    };

    const openModalF = (isIso = false) => {
        Swal.fire({
            title: 'Inactivar Producto del Menú',
            text: '¿Está seguro de que desea dar de baja lógica el producto Cheese Burger Simple? Esta acción impedirá su venta en caja y web.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'ELIMINAR',
            cancelButtonText: 'CANCELAR',
            backdrop: isIso ? false : true,
            customClass: {
                popup: 'swal2-owens-popup',
            }
        });
    };

    // MODO AISLADO (Para capturas limpias automatizadas sin fondo)
    if (isolate) {
        const allowAnimation = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('animate') === '1';

        return (
            <div
                id="isolate-stage"
                style={{
                    minHeight: '100vh',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    fontFamily: "'Inter', system-ui, sans-serif"
                }}
            >
                <Head title={`Captura Pantalla [${isolate}]`} />

                {!allowAnimation && (
                    <style dangerouslySetInnerHTML={{ __html: `
                        #isolate-stage *, .swal2-popup {
                            animation: none !important;
                            transition: none !important;
                            transform: none !important;
                        }
                    `}} />
                )}

                {isolate === 'A' && (
                    <div id="toast-target">
                        <Toast
                            id="isolate-a"
                            type="success"
                            title="Operación Exitosa"
                            message="El producto 'Bacon Burger Doble' ha sido registrado y publicado correctamente en el menú."
                            duration={0}
                            onClose={() => {}}
                        />
                    </div>
                )}

                {isolate === 'B' && (
                    <div id="toast-target">
                        <Toast
                            id="isolate-b"
                            type="error"
                            title="Error de Validación"
                            message="Faltan completar campos obligatorios exigidos por el sistema (Precio o Insumos)."
                            duration={0}
                            onClose={() => {}}
                        />
                    </div>
                )}

                {isolate === 'C' && (
                    <div id="toast-target">
                        <Toast
                            id="isolate-c"
                            type="error"
                            title="Inconsistencia de Negocio"
                            message="Quiebre de stock. Materia prima 'Medallón de Carne Vacuna' insuficiente para elaborar la orden."
                            duration={0}
                            onClose={() => {}}
                        />
                    </div>
                )}

                {isolate === 'D' && (
                    <div id="toast-target">
                        <Toast
                            id="isolate-d"
                            type="warning"
                            title="Advertencia de Duplicado"
                            message="Ya existe un producto registrado con la denominación 'Bacon Burger Doble'."
                            duration={0}
                            onClose={() => {}}
                        />
                    </div>
                )}
            </div>
        );
    }

    // MODO PLAYGROUND (Sin estilos decorativos, limpio y funcional para desarrollo)
    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#ffffff',
            padding: '40px 24px',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            color: '#111827'
        }}>
            <Head title="Feedback Playground - Owens" />

            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <header style={{ marginBottom: '32px', borderBottom: '1px solid #e5e7eb', paddingBottom: '16px' }}>
                    <h1 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 6px 0', color: '#111827' }}>
                        Feedback Playground
                    </h1>
                    <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
                        Entorno de pruebas y disparador en vivo de componentes de retroalimentación reales (Toasts y Modales).
                    </p>
                </header>

                <main style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                    {/* Sección Notificaciones Flotantes (Toasts) */}
                    <div>
                        <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '14px' }}>
                            Toasts Asíncronos
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                            <button
                                onClick={triggerToastA}
                                style={{
                                    padding: '12px 16px',
                                    backgroundColor: '#ffffff',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    fontSize: '13px'
                                }}
                            >
                                <strong style={{ color: '#059669', display: 'block', marginBottom: '2px' }}>Toast [A]</strong>
                                <span style={{ color: '#4b5563', fontSize: '12px' }}>Éxito Transaccional</span>
                            </button>

                            <button
                                onClick={triggerToastB}
                                style={{
                                    padding: '12px 16px',
                                    backgroundColor: '#ffffff',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    fontSize: '13px'
                                }}
                            >
                                <strong style={{ color: '#dc2626', display: 'block', marginBottom: '2px' }}>Toast [B]</strong>
                                <span style={{ color: '#4b5563', fontSize: '12px' }}>Error de Validación</span>
                            </button>

                            <button
                                onClick={triggerToastC}
                                style={{
                                    padding: '12px 16px',
                                    backgroundColor: '#ffffff',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    fontSize: '13px'
                                }}
                            >
                                <strong style={{ color: '#b91c1c', display: 'block', marginBottom: '2px' }}>Toast [C]</strong>
                                <span style={{ color: '#4b5563', fontSize: '12px' }}>Inconsistencia de Negocio</span>
                            </button>

                            <button
                                onClick={triggerToastD}
                                style={{
                                    padding: '12px 16px',
                                    backgroundColor: '#ffffff',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    fontSize: '13px'
                                }}
                            >
                                <strong style={{ color: '#d97706', display: 'block', marginBottom: '2px' }}>Toast [D]</strong>
                                <span style={{ color: '#4b5563', fontSize: '12px' }}>Advertencia de Duplicado</span>
                            </button>
                        </div>
                    </div>

                    {/* Sección Diálogos Modales */}
                    <div>
                        <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '14px' }}>
                            Diálogos Modales (SweetAlert2)
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                            <button
                                onClick={openModalE}
                                style={{
                                    padding: '12px 16px',
                                    backgroundColor: '#ffffff',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    fontSize: '13px'
                                }}
                            >
                                <strong style={{ color: '#0284c7', display: 'block', marginBottom: '2px' }}>Modal [E]</strong>
                                <span style={{ color: '#4b5563', fontSize: '12px' }}>Confirmación de Operación</span>
                            </button>

                            <button
                                onClick={openModalF}
                                style={{
                                    padding: '12px 16px',
                                    backgroundColor: '#ffffff',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    fontSize: '13px'
                                }}
                            >
                                <strong style={{ color: '#dc2626', display: 'block', marginBottom: '2px' }}>Modal [F]</strong>
                                <span style={{ color: '#4b5563', fontSize: '12px' }}>Confirmación de Baja Lógica</span>
                            </button>
                        </div>
                    </div>

                    {/* Automatización y Documentación */}
                    <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#111827', marginBottom: '6px' }}>
                            Generador de Assets Automatizado
                        </div>
                        <div style={{ fontSize: '12px', color: '#4b5563', lineHeight: '1.5' }}>
                            Para exportar automáticamente todas las capturas individuales en PNG y las animaciones en WebP a <code>docs/4_Diseno/img/toasts/</code>, ejecuta en la terminal:
                            <pre style={{ margin: '8px 0 0 0', padding: '8px 12px', backgroundColor: '#111827', color: '#f9fafb', borderRadius: '4px', fontSize: '12px' }}>
                                npm run capture:toasts
                            </pre>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
