import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import Drawer from '@/Components/Drawer';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Index({ purchases = [], suppliers = [], products = [] }) {
    const [showDrawer, setShowDrawer] = useState(false);
    const [rows, setRows] = useState([]);
    const [grandTotal, setGrandTotal] = useState(0);

    const { data, setData, post, processing, errors, reset } = useForm({
        supplier_id: '',
        date: new Date().toISOString().split('T')[0],
        items: [],
        total_cost: 0,
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const addRow = () => {
        setRows([...rows, { id: Date.now(), product_id: '', quantity: 1, unit_cost: 0, subtotal: 0 }]);
    };

    const removeRow = (id) => {
        if (rows.length > 1) {
            setRows(rows.filter(row => row.id !== id));
        }
    };

    const updateRow = (id, field, value) => {
        const newRows = rows.map(row => {
            if (row.id === id) {
                const updatedRow = { ...row, [field]: value };

                if (field === 'quantity' || field === 'unit_cost') {
                    updatedRow.subtotal = updatedRow.quantity * updatedRow.unit_cost;
                }

                return updatedRow;
            }
            return row;
        });
        setRows(newRows);
    };

    useEffect(() => {
        const total = rows.reduce((sum, row) => sum + row.subtotal, 0);
        setGrandTotal(total);
        setData(prev => ({ ...prev, items: rows, total_cost: total }));
    }, [rows]);

    const submit = (e) => {
        e.preventDefault();
        alert('Compra registrada (Simulación)');
        setShowDrawer(false);
        setRows([{ id: Date.now(), product_id: '', quantity: 1, unit_cost: 0, subtotal: 0 }]);
        reset();
    };

    const handleOpenDrawer = () => {
        setShowDrawer(true);
        setRows([{ id: Date.now(), product_id: '', quantity: 1, unit_cost: 0, subtotal: 0 }]);
        setData('date', new Date().toISOString().split('T')[0]);
    };

    const handleCloseDrawer = () => {
        setShowDrawer(false);
        setRows([{ id: Date.now(), product_id: '', quantity: 1, unit_cost: 0, subtotal: 0 }]);
        reset();
    };

    return (
        <MainLayout>
            <Head title="Compras" />
            <div className="container-fluid pt-4 px-4">

                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="mb-0 fw-bold">Compras</h4>
                    <button
                        onClick={handleOpenDrawer}
                        className="btn btn-primary rounded-pill px-3"
                    >
                        <i className="bi bi-plus-lg me-2"></i>Registrar Compra
                    </button>
                </div>

                <div className="card-minimal">
                    <div className="table-responsive">
                        <table className="table-minimal">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Fecha</th>
                                    <th scope="col">Proveedor</th>
                                    <th scope="col">Costo Total</th>
                                    <th scope="col">Registrado por</th>
                                </tr>
                            </thead>
                            <tbody>
                                {purchases.map((purchase, index) => (
                                    <tr key={purchase.id}>
                                        <td className="text-muted">{index + 1}</td>
                                        <td>{formatDate(purchase.date)}</td>
                                        <td className="fw-medium">{purchase.supplier.name}</td>
                                        <td className="font-tabular fw-semibold">{formatCurrency(purchase.total_cost)}</td>
                                        <td>{purchase.user.name}</td>
                                    </tr>
                                ))}
                                {purchases.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4 text-muted">No hay datos de compras</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Drawer
                isOpen={showDrawer}
                onClose={handleCloseDrawer}
                title="Registrar Compra"
                width="950px"
                footer={
                    <>
                        <button type="button" className="btn btn-light" onClick={handleCloseDrawer}>Cancelar</button>
                        <button type="submit" form="purchaseForm" className="btn btn-primary" disabled={processing}>
                            {processing ? 'Guardando...' : 'Registrar Compra'}
                        </button>
                    </>
                }
            >
                <form id="purchaseForm" onSubmit={submit}>
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <label htmlFor="supplier_id" className="form-label">Proveedor</label>
                            <select
                                className="form-select"
                                id="supplier_id"
                                value={data.supplier_id}
                                onChange={(e) => setData('supplier_id', e.target.value)}
                                required
                            >
                                <option value="">Seleccionar Proveedor</option>
                                {suppliers.map(supplier => (
                                    <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="date" className="form-label">Fecha</label>
                            <input
                                type="date"
                                className="form-control"
                                id="date"
                                value={data.date}
                                onChange={(e) => setData('date', e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <h6 className="mb-3">Detalles de compra</h6>
                    <div className="table-responsive mb-4">
                        <table className="table table-sm">
                            <thead>
                                <tr>
                                    <th style={{ width: '40%' }}>Producto</th>
                                    <th style={{ width: '18%' }} className="text-center">Cantidad</th>
                                    <th style={{ width: '18%' }}>Costo Unit.</th>
                                    <th style={{ width: '19%' }}>Subtotal</th>
                                    <th style={{ width: '5%' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row) => (
                                    <tr key={row.id}>
                                        <td>
                                            <select
                                                className="form-select form-select-sm"
                                                value={row.product_id}
                                                onChange={(e) => updateRow(row.id, 'product_id', e.target.value)}
                                                required
                                            >
                                                <option value="">Seleccionar</option>
                                                {products.map(product => (
                                                    <option key={product.id} value={product.id}>{product.name} ({product.unit})</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center justify-content-center gap-2">
                                                <button
                                                    type="button"
                                                    className="btn btn-sm text-muted p-0"
                                                    onClick={() => updateRow(row.id, 'quantity', Math.max(1, row.quantity - 1))}
                                                    style={{ width: '24px', height: '24px', fontSize: '1rem' }}
                                                >
                                                    <i className="bi bi-dash"></i>
                                                </button>
                                                <span className="fw-semibold" style={{ minWidth: '30px', textAlign: 'center' }}>
                                                    {row.quantity}
                                                </span>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm text-muted p-0"
                                                    onClick={() => updateRow(row.id, 'quantity', row.quantity + 1)}
                                                    style={{ width: '24px', height: '24px', fontSize: '1rem' }}
                                                >
                                                    <i className="bi bi-plus"></i>
                                                </button>
                                            </div>
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                className="form-control form-control-sm"
                                                value={row.unit_cost}
                                                min="0"
                                                onChange={(e) => updateRow(row.id, 'unit_cost', parseFloat(e.target.value) || 0)}
                                                required
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm font-tabular fw-semibold"
                                                value={formatCurrency(row.subtotal)}
                                                readOnly
                                            />
                                        </td>
                                        <td className="text-end">
                                            <button
                                                type="button"
                                                className="btn btn-icon-only text-danger"
                                                onClick={() => removeRow(row.id)}
                                                disabled={rows.length === 1}
                                                style={{ width: '31px', height: '31px' }}
                                            >
                                                <span className="material-symbols-outlined">delete</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan="3" className="text-end fw-bold small">TOTAL</td>
                                    <td colSpan="2">
                                        <input
                                            type="text"
                                            className="form-control form-control-sm font-tabular fw-bold"
                                            value={formatCurrency(grandTotal)}
                                            readOnly
                                        />
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={addRow}>
                        <i className="bi bi-plus-lg me-1"></i> Agregar Producto
                    </button>
                </form>
            </Drawer>
        </MainLayout>
    );
}
