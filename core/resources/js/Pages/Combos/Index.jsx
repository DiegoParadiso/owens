import React, { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import Drawer from '@/Components/Drawer';
import { Head, Link, useForm } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function Index({ combos = [], products = [] }) {

    const [showDrawer, setShowDrawer] = useState(false);
    const [rows, setRows] = useState([{ id: Date.now(), child_product_id: '', quantity: 1 }]);

    const { data, setData, post, processing, errors, delete: destroy, reset } = useForm({
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

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Combo creado (Simulación)');
        setShowDrawer(false);
        reset();
        setRows([{ id: Date.now(), child_product_id: '', quantity: 1 }]);
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Se eliminará este combo",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#df0f13',
            cancelButtonColor: '#6c757d',
            confirmButtonText: '¡Sí, eliminar!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                destroy(route('product.destroy', id), {
                    preserveScroll: true,
                    onSuccess: () => Swal.fire('¡Eliminado!', 'El combo ha sido eliminado.', 'success'),
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
                                    <th scope="col" className="text-end">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {combos.map((combo, index) => (
                                    <tr key={combo.id}>
                                        <td className="text-muted font-monospace">{index + 1}</td>
                                        <td className="fw-medium">{combo.name}</td>
                                        <td className="font-tabular fw-semibold">{formatCurrency(combo.price)}</td>
                                        <td>
                                            <ul className="list-unstyled mb-0 small text-muted">
                                                {combo.components.map((component, idx) => (
                                                    <li key={idx}>
                                                        {component.quantity}x {component.childProduct.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        </td>
                                        <td className="text-end">
                                            <button className="btn btn-sm text-muted me-1" title="Editar">
                                                <i className="bi bi-pencil-square"></i>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(combo.id)}
                                                className="btn btn-sm text-danger"
                                                title="Eliminar"
                                            >
                                                <i className="bi bi-trash-fill"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {combos.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4 text-muted">No hay combos registrados</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Drawer
                isOpen={showDrawer}
                onClose={() => setShowDrawer(false)}
                title="Crear Nuevo Combo"
                footer={
                    <>
                        <button type="button" className="btn btn-light" onClick={() => setShowDrawer(false)}>Cancelar</button>
                        <button type="button" className="btn btn-primary" onClick={handleSubmit}>Guardar Combo</button>
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
                            className="form-control font-monospace"
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
                                    className="form-control form-control-sm font-monospace text-center"
                                    value={row.quantity}
                                    min="1"
                                    onChange={(e) => updateRow(row.id, 'quantity', parseFloat(e.target.value) || 0)}
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
                                <i className="bi bi-trash"></i>
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
