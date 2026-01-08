import React, { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import Drawer from '@/Components/Drawer';
import { Head, Link, useForm, router } from '@inertiajs/react';
import Swal from 'sweetalert2';

import Pagination from '@/Components/Pagination';

export default function Index({ combos = [], products = [] }) {

    const [showDrawer, setShowDrawer] = useState(false);
    const [editingCombo, setEditingCombo] = useState(null);
    const [rows, setRows] = useState([{ id: Date.now(), child_product_id: '', quantity: 1 }]);

    const { data, setData, post, put, processing, errors, delete: destroy, reset } = useForm({
        name: '',
        price: '',
        items: [],
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    const addRow = () => {
        setRows([...rows, { id: Date.now(), child_product_id: '', quantity: 1 }]);
    };

    const removeRow = (id) => {
        if (rows.length > 1) {
            setRows(rows.filter(row => row.id !== id));
        }
    };

    const updateRow = (id, field, value) => {
        const newRows = rows.map(row => {
            if (row.id === id) {
                return { ...row, [field]: value };
            }
            return row;
        });
        setRows(newRows);
        setData('items', newRows);
    };

    const handleEdit = (combo) => {
        setEditingCombo(combo);
        setData({
            name: combo.name,
            price: combo.price,
            items: combo.components || [],
        });

        // Load combo components into rows
        if (combo.components && combo.components.length > 0) {
            const comboRows = combo.components.map((comp, idx) => ({
                id: Date.now() + idx,
                child_product_id: comp.child_product_id,
                quantity: parseInt(comp.quantity)
            }));
            setRows(comboRows);
        } else {
            setRows([{ id: Date.now(), child_product_id: '', quantity: 1 }]);
        }

        setShowDrawer(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log('=== INICIO HANDLESUBMIT ===');
        console.log('data:', data);
        console.log('rows:', rows);
        console.log('editingCombo:', editingCombo);

        // Validar que haya filas válidas
        const validRows = rows.filter(row => row.child_product_id !== '');
        if (validRows.length === 0) {
            window.toast.warning('Advertencia', 'Debes agregar al menos un producto.');
            return;
        }

        setShowDrawer(false); // Close immediately

        const formData = {
            name: data.name,
            price: data.price,
            child_product_id: validRows.map(row => row.child_product_id),
            quantity: validRows.map(row => parseInt(row.quantity)),
        };

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                setEditingCombo(null);
                reset();
                setRows([{ id: Date.now(), child_product_id: '', quantity: 1 }]);
                window.toast.success(editingCombo ? 'Combo actualizado' : 'Combo guardado', 'La operación se realizó con éxito.');
            },
            onError: (errors) => {
                setShowDrawer(true); // Re-open on error
                console.error('❌ ERROR! Errores:', errors);
                window.toast.error('Error', 'Ocurrió un error al guardar el combo.');
            }
        };

        if (editingCombo) {
            router.put(route('product.updateCombo', editingCombo.id), formData, options);
        } else {
            router.post(route('product.storeCombo'), formData, options);
        }
    };

    const handleCloseDrawer = () => {
        setShowDrawer(false);
        setEditingCombo(null);
        reset();
        setRows([{ id: Date.now(), child_product_id: '', quantity: 1 }]);
    };

    const handleDelete = (id) => {
        Swal.fire({
            text: "¿Eliminar este combo?",
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
                destroy(route('product.destroy', id), {
                    preserveScroll: true,
                    onSuccess: () => {
                        window.toast.success('Eliminado', 'El combo ha sido eliminado correctamente.');
                    },
                });
            }
        });
    };

    return (
        <MainLayout>
            <Head title="Combos" />
            <div className="container-fluid pt-4 px-4">

                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="mb-0 fw-bold">Combos</h4>
                    <button
                        className="btn btn-primary rounded-pill px-3"
                        onClick={() => setShowDrawer(true)}
                    >
                        <i className="bi bi-plus-lg me-2"></i>Crear Combo
                    </button>
                </div>

                <div className="card-minimal">
                    <div className="table-responsive">
                        <table className="table-minimal">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Precio</th>
                                    <th scope="col">Componentes</th>
                                    <th scope="col" className="text-end">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {combos.data.map((combo, index) => (
                                    <tr key={combo.id}>
                                        <td className="text-muted">{(combos.current_page - 1) * combos.per_page + index + 1}</td>
                                        <td className="fw-medium">{combo.name}</td>
                                        <td className="font-tabular fw-semibold">{formatCurrency(combo.price)}</td>
                                        <td>
                                            <ul className="list-unstyled mb-0 small">
                                                {combo.components && combo.components.length > 0 ? (
                                                    combo.components.map((component, idx) => (
                                                        component.child_product ? (
                                                            <li key={idx}>
                                                                <span className="text-muted">{parseInt(component.quantity)}x</span> {component.child_product.name}
                                                            </li>
                                                        ) : null
                                                    ))
                                                ) : (
                                                    <li className="text-muted fst-italic">Sin componentes</li>
                                                )}
                                            </ul>
                                        </td>
                                        <td className="text-end">
                                            <div className="d-flex justify-content-end gap-2">
                                                <button
                                                    className="btn btn-icon-only bg-transparent border-0"
                                                    onClick={() => handleEdit(combo)}
                                                    title="Editar"
                                                >
                                                    <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--text-muted)' }}>edit_square</span>
                                                </button>
                                                <button
                                                    className="btn btn-icon-only bg-transparent border-0"
                                                    onClick={() => handleDelete(combo.id)}
                                                    title="Eliminar"
                                                >
                                                    <span className="material-symbols-outlined" style={{ fontSize: '22px', color: 'var(--text-muted)', transform: 'translateY(-1px)' }}>delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {combos.data.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4 text-muted">
                                            No hay combos registrados
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <Pagination
                        links={combos.links}
                        from={combos.from}
                        to={combos.to}
                        total={combos.total}
                        perPage={combos.per_page}
                        onPerPageChange={(newPerPage) => {
                            router.get(route('product.indexCombo'), { per_page: newPerPage }, { preserveState: true, replace: true });
                        }}
                    />
                </div>
            </div>

            <Drawer
                isOpen={showDrawer}
                onClose={handleCloseDrawer}
                title={editingCombo ? 'Editar Combo' : 'Crear Nuevo Combo'}
                footer={
                    <>
                        <button type="button" className="btn btn-light" onClick={handleCloseDrawer}>Cancelar</button>
                        <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                            {editingCombo ? 'Actualizar Combo' : 'Guardar Combo'}
                        </button>
                    </>
                }
            >
                <form id="createComboForm" onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Nombre del Combo</label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            required
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Ej. Combo Familiar"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="price" className="form-label">Precio ($)</label>
                        <input
                            type="number"
                            className="form-control"
                            id="price"
                            min="0"
                            required
                            value={data.price}
                            onChange={(e) => setData('price', e.target.value)}
                            placeholder="0.00"
                        />
                    </div>

                    <h6 className="text-uppercase small fw-bold text-muted mb-3">Componentes</h6>

                    {rows.map((row, index) => (
                        <div key={row.id} className="d-flex gap-2 mb-2 align-items-start">
                            <div className="flex-grow-1">
                                <select
                                    className="form-select form-select-sm"
                                    value={row.child_product_id}
                                    onChange={(e) => updateRow(row.id, 'child_product_id', e.target.value)}
                                    required
                                >
                                    <option value="">Producto...</option>
                                    {products.map(product => (
                                        <option key={product.id} value={product.id}>{product.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ width: '80px' }}>
                                <input
                                    type="number"
                                    className="form-control form-control-sm text-center"
                                    value={row.quantity}
                                    min="1"
                                    onChange={(e) => updateRow(row.id, 'quantity', parseInt(e.target.value) || 0)}
                                    required
                                    placeholder="Cant."
                                />
                            </div>
                            <button
                                type="button"
                                className="btn btn-icon-only text-danger"
                                onClick={() => removeRow(row.id)}
                                disabled={rows.length === 1}
                                style={{ width: '31px', height: '31px' }}
                            >
                                <span className="material-symbols-outlined">delete</span>
                            </button>
                        </div>
                    ))}

                    <button type="button" className="btn btn-sm btn-outline-secondary mt-2 w-100" onClick={addRow}>
                        <i className="bi bi-plus-lg me-1"></i> Agregar Componente
                    </button>
                </form>
            </Drawer>
        </MainLayout>
    );
}
