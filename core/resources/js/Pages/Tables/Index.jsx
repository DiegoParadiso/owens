import React, { useState, useRef, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, router, usePage } from '@inertiajs/react';
import Swal from 'sweetalert2';
import { maintenanceMode } from './Config';

export default function Index({ auth, tables }) {
    if (maintenanceMode) {
        return (
            <MainLayout
                user={auth.user}
                header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestión de Mesas</h2>}
            >
                <Head title="Mesas" />

                <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
                    <div className="text-center p-5" style={{
                        maxWidth: '450px'
                    }}>
                        <div className="mb-4 d-inline-flex align-items-center justify-content-center" style={{ width: '70px', height: '70px' }}>
                            <i className="fa fa-tools fa-2x text-black"></i>
                        </div>
                        <h4 className="fw-bold mb-3" style={{ color: 'var(--text-main)' }}>Sección en Mantenimiento</h4>
                        <p className="text-muted mb-0 small text-secondary" style={{ lineHeight: '1.6' }}>
                            Estamos optimizando el módulo de mesas para mejorar su rendimiento y funcionalidad. <br className="d-none d-md-block" />
                            Estará disponible nuevamente muy pronto.
                        </p>
                    </div>
                </div>
            </MainLayout>
        );
    }

    const [originalTables, setOriginalTables] = useState([]);
    const [localTables, setLocalTables] = useState(tables);
    const [editMode, setEditMode] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const containerRef = useRef(null);
    const [draggedItem, setDraggedItem] = useState(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const isAdmin = auth.user.role === 'admin' || auth.user.role === 'owner';

    useEffect(() => {
        setLocalTables(tables);
    }, [tables]);

    const handleEnterEditMode = () => {
        setOriginalTables(JSON.parse(JSON.stringify(localTables)));
        setEditMode(true);
    };

    const handleCancelEditMode = () => {
        setLocalTables(originalTables);
        setEditMode(false);
        setIsDirty(false);
    };



    const handleDragStart = (e, table) => {
        if (!editMode) return;

        const container = containerRef.current.getBoundingClientRect();
        // Calculate offset (mouse position relative to the element's top-left)
        // We need the element's current screen position. 
        // Since we render based on %, we can't easily get the element rect from the 'table' data alone 
        // without a ref, but we can trust the event target if it's the draggable div.
        const rect = e.currentTarget.getBoundingClientRect();

        setOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });

        setDraggedItem(table);
    };

    const handleMouseMove = (e) => {
        if (!draggedItem || !editMode) return;

        const container = containerRef.current.getBoundingClientRect();

        // New position relative to container
        let x = e.clientX - container.left - offset.x;
        let y = e.clientY - container.top - offset.y;

        // Convert to percentage
        let xPercent = (x / container.width) * 100;
        let yPercent = (y / container.height) * 100;

        // Clamp
        xPercent = Math.max(0, Math.min(92, xPercent)); // 92 to account for width
        yPercent = Math.max(0, Math.min(92, yPercent));

        setLocalTables(prev => prev.map(t =>
            t.id === draggedItem.id ? { ...t, x_position: Math.round(xPercent), y_position: Math.round(yPercent) } : t
        ));
        setIsDirty(true);
    };

    const handleMouseUp = () => {
        setDraggedItem(null);
    };

    const savePositions = () => {
        router.post(route('tables.updatePositions'), {
            positions: localTables.map(t => ({
                id: t.id,
                x: t.x_position,
                y: t.y_position
            }))
        }, {
            onSuccess: () => {
                setIsDirty(false);
                setEditMode(false);
                setIsDirty(false);
                setEditMode(false);
                window.toast.success('Guardado', 'Las posiciones han sido actualizadas.');
            }
        });
    };

    const handleAddTable = (type = 'table') => {
        Swal.fire({
            input: 'text',
            inputLabel: 'Nombre/Identificador',
            inputValue: type === 'table' ? `Mesa ${localTables.length + 1}` : 'Carrito',
            showCancelButton: true,
            confirmButtonText: 'Crear',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#df0f13', // Primary
            cancelButtonColor: '#6c757d',
            buttonsStyling: true,
            customClass: {
                popup: 'swal-medium',
                confirmButton: 'btn btn-primary px-4',
                cancelButton: 'btn btn-secondary px-4',
                input: 'form-control input-clean text-center mx-auto w-75'
            },
            preConfirm: (name) => {
                if (!name) {
                    Swal.showValidationMessage('El nombre es requerido');
                }
                return name;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(route('tables.store'), {
                    name: result.value,
                    type: type,
                    seats: 4
                });
            }
        });
    };

    const handleDelete = (id) => {
        if (!editMode) return;

        Swal.fire({
            text: "¿Eliminar esta mesa?",
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar',
            buttonsStyling: true,
            customClass: {
                popup: 'swal-minimal',
                confirmButton: 'btn btn-danger px-4',
                cancelButton: 'btn btn-secondary px-4'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('tables.destroy', id), {
                    preserveScroll: true,
                });
            }
        });
    }

    return (
        <MainLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestión de Mesas</h2>}
        >
            <Head title="Mesas" />

            <div className="py-6 container-fluid" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
                <div className="card" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
                    <div className="card-header py-3 d-flex justify-content-between align-items-center" style={{ backgroundColor: 'transparent', borderBottom: '1px solid var(--border-color)' }}>
                        <h5 className="mb-0 text-dark fw-bold">
                            Distribución del Local
                        </h5>
                        <div className="d-flex gap-2">
                            {isAdmin && (
                                <>
                                    {editMode ? (
                                        <>
                                            <button
                                                className="btn btn-primary d-flex align-items-center gap-2"
                                                onClick={savePositions}
                                                disabled={!isDirty}
                                            >
                                                <i className="fa fa-save"></i> Guardar Distribución
                                            </button>
                                            <div className="vr mx-2"></div>
                                            <button className="btn btn-outline-secondary btn-sm" onClick={() => handleAddTable('table')}>
                                                <i className="fa fa-plus"></i> Mesa
                                            </button>
                                            <button className="btn btn-outline-secondary btn-sm" onClick={() => handleAddTable('cart')}>
                                                <i className="fa fa-cart-plus"></i> Carrito
                                            </button>
                                            <button className="btn btn-secondary btn-sm ms-2" onClick={handleCancelEditMode}>
                                                Cancelar
                                            </button>
                                        </>
                                    ) : (
                                        <button className="btn btn-outline-primary" onClick={handleEnterEditMode}>
                                            <i className="fa fa-edit me-1"></i> Modo Edición
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                    <div className="card-body p-0 position-relative" style={{ height: '70vh', overflow: 'hidden', userSelect: 'none', backgroundColor: 'var(--bg-card)' }}>

                        {/* Grid Background */}
                        {editMode && (
                            <div className="position-absolute w-100 h-100" style={{
                                backgroundImage: 'linear-gradient(var(--border-color) 1px, transparent 1px), linear-gradient(90deg, var(--border-color) 1px, transparent 1px)',
                                backgroundSize: '5% 5%',
                                opacity: 0.2,
                                pointerEvents: 'none'
                            }}></div>
                        )}

                        {/* Drop Zone Area */}
                        <div
                            ref={containerRef}
                            className="w-100 h-100 position-relative"
                        >
                            {localTables.map((table) => (
                                <div
                                    key={table.id}
                                    onMouseDown={(e) => handleDragStart(e, table)}
                                    className={`position-absolute d-flex flex-column align-items-center justify-content-center ${editMode ? 'cursor-move' : ''}`}
                                    style={{
                                        left: `${table.x_position}%`,
                                        top: `${table.y_position}%`,
                                        width: '8%', // Fixed width relative to container
                                        aspectRatio: '1/1',
                                        transition: draggedItem?.id === table.id ? 'none' : 'all 0.2s ease',
                                        zIndex: draggedItem?.id === table.id ? 50 : 10,
                                        cursor: editMode ? 'grab' : 'default'
                                    }}
                                >
                                    {/* Table Shape */}
                                    <div
                                        className={`d-flex align-items-center justify-content-center fw-bold text-white rounded
                                            ${table.type === 'cart' ? 'bg-warning' : 'bg-primary'}
                                        `}
                                        style={{
                                            width: table.type === 'cart' ? '60%' : '70%',
                                            height: table.type === 'cart' ? '80%' : '70%',
                                            borderRadius: table.type === 'cart' ? '8px' : '50%', // Circle for tables, rect for cart
                                            fontSize: '0.8rem',
                                            position: 'relative'
                                        }}
                                    >
                                        {table.type === 'cart' ? <i className="fa fa-hamburger"></i> : table.name.replace('Mesa ', '')}

                                        {/* Delete Button (Edit Mode Only) */}
                                        {editMode && (
                                            <button
                                                className="position-absolute top-0 start-100 translate-middle btn-delete-table"
                                                onClick={(e) => { e.stopPropagation(); handleDelete(table.id); }}
                                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.1)'}
                                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)'}
                                            >
                                                <i className="fa fa-times" style={{ fontSize: '10px' }}></i>
                                            </button>
                                        )}
                                    </div>

                                    {/* Chairs Visuals (Only for tables) */}
                                    {table.type === 'table' && (
                                        <>
                                            <div className="position-absolute bg-secondary rounded-circle" style={{ width: '20%', height: '20%', top: '5%', left: '50%', transform: 'translate(-50%, -150%)' }}></div>
                                            <div className="position-absolute bg-secondary rounded-circle" style={{ width: '20%', height: '20%', bottom: '5%', left: '50%', transform: 'translate(-50%, 150%)' }}></div>
                                            <div className="position-absolute bg-secondary rounded-circle" style={{ width: '20%', height: '20%', left: '5%', top: '50%', transform: 'translate(-150%, -50%)' }}></div>
                                            <div className="position-absolute bg-secondary rounded-circle" style={{ width: '20%', height: '20%', right: '5%', top: '50%', transform: 'translate(150%, -50%)' }}></div>
                                        </>
                                    )}

                                    {/* Label */}
                                    <div className="mt-1 bg-white px-2 py-0 rounded border small text-nowrap" style={{ fontSize: '0.7rem', transform: 'scale(0.9)' }}>
                                        {table.name}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .cursor-move { cursor: move; }
            `}</style>
        </MainLayout>
    );
}
