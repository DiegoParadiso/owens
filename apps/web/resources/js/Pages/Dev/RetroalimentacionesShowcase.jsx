import React, { useState } from 'react';
import { Head } from '@inertiajs/react';

export default function RetroalimentacionesShowcase() {
    const [activeModal, setActiveModal] = useState(null);
    const [liveToast, setLiveToast] = useState(null);
    const isCapture = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('capture') === '1';

    const triggerToast = (type, title, message) => {
        setLiveToast({ type, title, message });
        setTimeout(() => setLiveToast(null), 3500);
    };

    return (
        <div style={{
            minHeight: isCapture ? 'auto' : '100vh',
            backgroundColor: isCapture ? '#ffffff' : '#f1f5f9',
            padding: isCapture ? '0' : '30px 16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: isCapture ? 'flex-start' : 'initial',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            color: '#0f172a'
        }}>
            <Head title="Showcase de Retroalimentaciones - Owens" />

            <style dangerouslySetInnerHTML={{ __html: `
                * { box-sizing: border-box; }
                .owens-btn-dev {
                    padding: 6px 14px;
                    font-size: 12px;
                    font-weight: 600;
                    border-radius: 8px;
                    border: 1px solid transparent;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .owens-btn-dev:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 2px 4px rgba(0,0,0,0.08);
                }
                .grid-container {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                }
                @media (max-width: 768px) {
                    .grid-container {
                        grid-template-columns: 1fr;
                    }
                    .grid-right-col {
                        border-left: none !important;
                        border-top: 1px solid #cbd5e1;
                    }
                }
            `}} />

            {/* Barra de control para el desarrollador */}
            {!isCapture && (
                <div style={{
                    width: '100%',
                    maxWidth: '960px',
                    marginBottom: '20px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    backgroundColor: '#ffffff',
                    padding: '16px 20px',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }}></span>
                            Showcase de Pantallas de Retroalimentación — Owens
                        </h1>
                        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                            Vista técnica para previsualización, pruebas interactivas y captura gráfica para memoria de cátedra y APA 7.
                        </p>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
                        <button
                            onClick={() => triggerToast('success', 'Operación Exitosa', 'El producto ha sido registrado correctamente.')}
                            className="owens-btn-dev"
                            style={{ backgroundColor: '#ecfdf5', color: '#047857', borderColor: '#a7f3d0' }}
                        >
                            Probar Toast [A]
                        </button>
                        <button
                            onClick={() => triggerToast('error', 'Error de Validación', 'Campos obligatorios vacíos.')}
                            className="owens-btn-dev"
                            style={{ backgroundColor: '#fef2f2', color: '#b91c1c', borderColor: '#fecaca' }}
                        >
                            Probar Toast [B]
                        </button>
                        <button
                            onClick={() => triggerToast('warning', 'Advertencia', 'Registro previamente existente.')}
                            className="owens-btn-dev"
                            style={{ backgroundColor: '#fffbeb', color: '#b45309', borderColor: '#fde68a' }}
                        >
                            Probar Toast [D]
                        </button>
                        <button
                            onClick={() => setActiveModal('E')}
                            className="owens-btn-dev"
                            style={{ backgroundColor: '#f0f9ff', color: '#0369a1', borderColor: '#bae6fd' }}
                        >
                            Abrir Modal [E]
                        </button>
                        <button
                            onClick={() => setActiveModal('F')}
                            className="owens-btn-dev"
                            style={{ backgroundColor: '#fff1f2', color: '#be123c', borderColor: '#fecdd3' }}
                        >
                            Abrir Modal [F]
                        </button>
                    </div>
                </div>
            )}

            {/* Toast Interactivo Flotante (si se activa con los botones de prueba) */}
            {liveToast && (
                <div style={{
                    position: 'fixed',
                    top: '24px',
                    right: '24px',
                    zIndex: 9999,
                    animation: 'fadeIn 0.3s ease-out'
                }}>
                    <div style={{
                        padding: '12px 18px',
                        borderRadius: '10px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        fontSize: '13px',
                        fontWeight: 500,
                        backgroundColor: liveToast.type === 'success' ? '#10b981' : liveToast.type === 'error' ? '#dc2626' : '#f59e0b'
                    }}>
                        <span><strong>{liveToast.title}:</strong> {liveToast.message}</span>
                        <button
                            onClick={() => setLiveToast(null)}
                            style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}
                        >✕</button>
                    </div>
                </div>
            )}

            {/* TABLA/CUADRO ESTANDARIZADO PARA CAPTURA (Fiel al modelo de cátedra de IMAX) */}
            <div id="capture-container" style={{
                width: isCapture ? '960px' : '100%',
                maxWidth: '960px',
                backgroundColor: '#ffffff',
                borderRadius: isCapture ? '0' : '12px',
                border: '1px solid #cbd5e1',
                boxShadow: isCapture ? 'none' : '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.05)',
                overflow: 'hidden'
            }}>
                {/* Título de la tabla de diseño */}
                <div style={{
                    padding: '16px 24px',
                    borderBottom: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff'
                }}>
                    <h2 style={{
                        margin: 0,
                        fontSize: '20px',
                        fontWeight: 700,
                        color: '#0f172a',
                        letterSpacing: '-0.3px'
                    }}>
                        Pantallas de retroalimentación
                    </h2>
                </div>

                {/* Cuadrícula 2 columnas */}
                <div className="grid-container">
                    
                    {/* COLUMNA IZQUIERDA: PANTALLAS [A], [C], [E] */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        
                        {/* PANTALLA [A] */}
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid #cbd5e1' }}>
                            <span style={{ display: 'block', textAlign: 'center', fontWeight: 700, fontSize: '14px', color: '#1e293b', marginBottom: '12px' }}>
                                Pantalla [A]
                            </span>
                            <div style={{
                                backgroundColor: '#10b981',
                                color: '#ffffff',
                                padding: '14px 18px',
                                borderRadius: '10px',
                                boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'between',
                                gap: '14px'
                            }}>
                                <div style={{
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '50%',
                                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                                <div style={{ flex: 1, fontSize: '13px', lineHeight: '1.4' }}>
                                    <strong>Operación Exitosa:</strong> El producto &apos;Bacon Burger Doble&apos; ha sido registrado y publicado correctamente en el menú.
                                </div>
                                <span style={{ opacity: 0.75, fontSize: '16px', cursor: 'pointer', flexShrink: 0 }}>✕</span>
                            </div>
                        </div>

                        {/* PANTALLA [C] */}
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid #cbd5e1' }}>
                            <span style={{ display: 'block', textAlign: 'center', fontWeight: 700, fontSize: '14px', color: '#1e293b', marginBottom: '12px' }}>
                                Pantalla [C]
                            </span>
                            <div style={{
                                backgroundColor: '#dc2626',
                                color: '#ffffff',
                                padding: '14px 18px',
                                borderRadius: '10px',
                                boxShadow: '0 2px 4px rgba(220, 38, 38, 0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'between',
                                gap: '14px'
                            }}>
                                <div style={{
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '50%',
                                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="15" y1="9" x2="9" y2="15"></line>
                                        <line x1="9" y1="9" x2="15" y2="15"></line>
                                    </svg>
                                </div>
                                <div style={{ flex: 1, fontSize: '13px', lineHeight: '1.4' }}>
                                    <strong>Inconsistencia de Negocio:</strong> Quiebre de stock. Materia prima &apos;Medallón de Carne Vacuna&apos; insuficiente para elaborar la orden.
                                </div>
                                <span style={{ opacity: 0.75, fontSize: '16px', cursor: 'pointer', flexShrink: 0 }}>✕</span>
                            </div>
                        </div>

                        {/* PANTALLA [E] */}
                        <div style={{ padding: '20px 24px', backgroundColor: '#f8fafc' }}>
                            <span style={{ display: 'block', textAlign: 'center', fontWeight: 700, fontSize: '14px', color: '#1e293b', marginBottom: '12px' }}>
                                Pantalla [E]
                            </span>
                            <div style={{
                                backgroundColor: '#ffffff',
                                border: '1px solid #e2e8f0',
                                borderRadius: '16px',
                                padding: '24px 20px',
                                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                maxWidth: '380px',
                                margin: '0 auto',
                                width: '100%'
                            }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '50%',
                                    backgroundColor: '#e0f2fe',
                                    color: '#0284c7',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '12px'
                                }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                    </svg>
                                </div>
                                <h3 style={{ margin: '0 0 8px 0', fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                                    Confirmación de Registro de Receta
                                </h3>
                                <p style={{ margin: '0 0 20px 0', fontSize: '12px', color: '#64748b', lineHeight: '1.5' }}>
                                    ¿Está seguro de que desea registrar y publicar la receta comercial de <strong>Bacon Burger Doble</strong> en el catálogo activo?
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', width: '100%' }}>
                                    <button style={{
                                        padding: '8px 20px',
                                        fontSize: '12px',
                                        fontWeight: 700,
                                        color: '#475569',
                                        backgroundColor: '#f1f5f9',
                                        border: '1px solid #cbd5e1',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        width: '120px'
                                    }}>
                                        CANCELAR
                                    </button>
                                    <button style={{
                                        padding: '8px 20px',
                                        fontSize: '12px',
                                        fontWeight: 700,
                                        color: '#ffffff',
                                        backgroundColor: '#0284c7',
                                        border: 'none',
                                        borderRadius: '8px',
                                        boxShadow: '0 2px 4px rgba(2, 132, 199, 0.3)',
                                        cursor: 'pointer',
                                        width: '120px'
                                    }}>
                                        ACEPTAR
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* COLUMNA DERECHA: PANTALLAS [B], [D], [F] */}
                    <div className="grid-right-col" style={{ display: 'flex', flexDirection: 'column', borderLeft: '1px solid #cbd5e1' }}>
                        
                        {/* PANTALLA [B] */}
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid #cbd5e1' }}>
                            <span style={{ display: 'block', textAlign: 'center', fontWeight: 700, fontSize: '14px', color: '#1e293b', marginBottom: '12px' }}>
                                Pantalla [B]
                            </span>
                            <div style={{
                                backgroundColor: '#dc2626',
                                color: '#ffffff',
                                padding: '14px 18px',
                                borderRadius: '10px',
                                boxShadow: '0 2px 4px rgba(220, 38, 38, 0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'between',
                                gap: '14px'
                            }}>
                                <div style={{
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '50%',
                                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                                        <line x1="12" y1="9" x2="12" y2="13"></line>
                                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                    </svg>
                                </div>
                                <div style={{ flex: 1, fontSize: '13px', lineHeight: '1.4' }}>
                                    <strong>Error de Validación:</strong> Faltan completar campos obligatorios exigidos por el sistema (Precio o Insumos).
                                </div>
                                <span style={{ opacity: 0.75, fontSize: '16px', cursor: 'pointer', flexShrink: 0 }}>✕</span>
                            </div>
                        </div>

                        {/* PANTALLA [D] */}
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid #cbd5e1' }}>
                            <span style={{ display: 'block', textAlign: 'center', fontWeight: 700, fontSize: '14px', color: '#1e293b', marginBottom: '12px' }}>
                                Pantalla [D]
                            </span>
                            <div style={{
                                backgroundColor: '#f59e0b',
                                color: '#ffffff',
                                padding: '14px 18px',
                                borderRadius: '10px',
                                boxShadow: '0 2px 4px rgba(245, 158, 11, 0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'between',
                                gap: '14px'
                            }}>
                                <div style={{
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '50%',
                                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                                        <line x1="12" y1="9" x2="12" y2="13"></line>
                                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                    </svg>
                                </div>
                                <div style={{ flex: 1, fontSize: '13px', lineHeight: '1.4' }}>
                                    <strong>Advertencia de Duplicado:</strong> Ya existe un producto registrado con la denominación &apos;Bacon Burger Doble&apos;.
                                </div>
                                <span style={{ opacity: 0.75, fontSize: '16px', cursor: 'pointer', flexShrink: 0 }}>✕</span>
                            </div>
                        </div>

                        {/* PANTALLA [F] */}
                        <div style={{ padding: '20px 24px', backgroundColor: '#f8fafc' }}>
                            <span style={{ display: 'block', textAlign: 'center', fontWeight: 700, fontSize: '14px', color: '#1e293b', marginBottom: '12px' }}>
                                Pantalla [F]
                            </span>
                            <div style={{
                                backgroundColor: '#ffffff',
                                border: '1px solid #e2e8f0',
                                borderRadius: '16px',
                                padding: '24px 20px',
                                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                maxWidth: '380px',
                                margin: '0 auto',
                                width: '100%'
                            }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '50%',
                                    backgroundColor: '#fee2e2',
                                    color: '#dc2626',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '12px'
                                }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                                        <line x1="12" y1="9" x2="12" y2="13"></line>
                                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                    </svg>
                                </div>
                                <h3 style={{ margin: '0 0 8px 0', fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                                    Inactivar Producto del Menú
                                </h3>
                                <p style={{ margin: '0 0 20px 0', fontSize: '12px', color: '#64748b', lineHeight: '1.5' }}>
                                    ¿Está seguro de que desea dar de baja lógica el producto <strong>Cheese Burger Simple</strong>? Esta acción impedirá su venta en caja y web.
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', width: '100%' }}>
                                    <button style={{
                                        padding: '8px 20px',
                                        fontSize: '12px',
                                        fontWeight: 700,
                                        color: '#475569',
                                        backgroundColor: '#f1f5f9',
                                        border: '1px solid #cbd5e1',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        width: '120px'
                                    }}>
                                        CANCELAR
                                    </button>
                                    <button style={{
                                        padding: '8px 20px',
                                        fontSize: '12px',
                                        fontWeight: 700,
                                        color: '#ffffff',
                                        backgroundColor: '#dc2626',
                                        border: 'none',
                                        borderRadius: '8px',
                                        boxShadow: '0 2px 4px rgba(220, 38, 38, 0.3)',
                                        cursor: 'pointer',
                                        width: '120px'
                                    }}>
                                        ELIMINAR
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>

                {/* Pie formal de figura */}
                <div style={{
                    padding: '12px 24px',
                    borderTop: '1px solid #cbd5e1',
                    backgroundColor: '#f8fafc',
                    textAlign: 'center'
                }}>
                    <p style={{ margin: 0, fontSize: '12px', fontStyle: 'italic', color: '#64748b' }}>
                        Figura N° 4.2.0.1 - Retroalimentaciones del Sistema Owens Fast Food &amp; Grill
                    </p>
                </div>
            </div>

            {/* Modal flotante de demostración interactiva (al hacer click en botones de test) */}
            {activeModal && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 9999,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '16px'
                }}>
                    <div style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '16px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        maxWidth: '420px',
                        width: '100%',
                        padding: '24px',
                        textAlign: 'center'
                    }}>
                        <h3 style={{ margin: '0 0 8px 0', fontSize: '17px', fontWeight: 700, color: '#0f172a' }}>
                            {activeModal === 'E' ? 'Confirmación de Operación [E]' : 'Confirmación de Baja Lógica [F]'}
                        </h3>
                        <p style={{ margin: '0 0 24px 0', fontSize: '13px', color: '#64748b' }}>
                            {activeModal === 'E' 
                                ? '¿Confirma la persistencia de los datos en la base de datos relacional?' 
                                : '¿Confirma la inactivación lógica del registro? Se conservará la trazabilidad histórica contable.'}
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                            <button
                                onClick={() => setActiveModal(null)}
                                style={{
                                    padding: '8px 20px',
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    color: '#475569',
                                    backgroundColor: '#f1f5f9',
                                    border: '1px solid #cbd5e1',
                                    borderRadius: '8px',
                                    cursor: 'pointer'
                                }}
                            >
                                CANCELAR
                            </button>
                            <button
                                onClick={() => {
                                    setActiveModal(null);
                                    triggerToast('success', 'Completado', 'Acción ejecutada con éxito.');
                                }}
                                style={{
                                    padding: '8px 20px',
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    color: '#ffffff',
                                    backgroundColor: activeModal === 'E' ? '#0284c7' : '#dc2626',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer'
                                }}
                            >
                                {activeModal === 'E' ? 'ACEPTAR' : 'CONFIRMAR BAJA'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
