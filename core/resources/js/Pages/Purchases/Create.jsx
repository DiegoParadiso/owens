import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ suppliers = [], products = [] }) {

    const [rows, setRows] = useState([
        { id: Date.now(), product_id: '', quantity: 1, unit_cost: 0, subtotal: 0 }
    ]);
    const [grandTotal, setGrandTotal] = useState(0);

    const { data, setData, post, processing, errors } = useForm({
        supplier_id: '',
        date: new Date().toISOString().split('T')[0],
        items: [],
        total_cost: 0,
    });

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
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
    };

    return (
        <MainLayout>
            <Head title="Registrar Compra" />
            <div className="container-fluid pt-4 px-4">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link href={route('dashboard')}>Dashboard</Link></li>
                        <li className="breadcrumb-item"><Link href={route('purchase.index')}>Compras</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">Registrar Compra</li>
                    </ol>
                </nav>
                <div className="card-minimal border-accent-primary">
                    <div className="col-12">
                        <div className="h-100">
                            <h6 className="mb-4 fw-bold">Registrar compra</h6>

                            <form onSubmit={submit}>
                                <div className="row mb-4">
                                    <div className="col-md-6">
                                        <label htmlFor="supplier_id" className="form-label">Proveedor</label>
                                        <select
                                            className="form-select border-0 border-bottom rounded-0"
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
                                            className="form-control border-0 border-bottom rounded-0"
                                            id="date"
                                            value={data.date}
                                            onChange={(e) => setData('date', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <h6 className="mb-3 fw-bold">Detalles de compra</h6>
                                <div className="table-responsive mb-4">
                                    <table className="table-minimal">
                                        <thead>
                                            <tr>
                                                <th style={{ width: '30%' }}>Producto</th>
                                                <th style={{ width: '15%' }}>Cantidad</th>
                                                <th style={{ width: '20%' }}>Costo Unitario</th>
                                                <th style={{ width: '20%' }}>Subtotal</th>
                                                <th style={{ width: '15%' }} className="text-end">Acción</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rows.map((row) => (
                                                <tr key={row.id}>
                                                    <td>
                                                        <select
                                                            className="form-select border-0 border-bottom rounded-0"
                                                            value={row.product_id}
                                                            onChange={(e) => updateRow(row.id, 'product_id', e.target.value)}
                                                            required
                                                        >
                                                            <option value="">Seleccionar Producto</option>
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
                                                            className="form-control border-0 border-bottom rounded-0"
                                                            value={row.unit_cost}
                                                            min="0"
                                                            onChange={(e) => updateRow(row.id, 'unit_cost', parseFloat(e.target.value) || 0)}
                                                            required
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            className="form-control border-0 border-bottom rounded-0 font-tabular fw-semibold"
                                                            value={formatCurrency(row.subtotal)}
                                                            readOnly
                                                        />
                                                    </td>
                                                    <td className="text-end">
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm text-danger"
                                                            onClick={() => removeRow(row.id)}
                                                            disabled={rows.length === 1}
                                                            title="Eliminar"
                                                        >
                                                            <span className="material-symbols-outlined">delete</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td colSpan="3" className="text-end fw-bold text-uppercase small letter-spacing-1">Total Compra</td>
                                                <td colSpan="2">
                                                    <input
                                                        type="text"
                                                        className="form-control border-0 font-tabular fw-semibold fs-5 text-end bg-transparent"
                                                        value={formatCurrency(grandTotal)}
                                                        readOnly
                                                    />
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                                <button type="button" className="btn btn-outline-secondary btn-sm mb-4 rounded-pill" onClick={addRow}>
                                    <i className="bi bi-plus-lg me-1"></i> Agregar Producto
                                </button>

                                <div className="d-flex justify-content-end pt-3 border-top">
                                    <button type="submit" className="btn btn-primary px-4 rounded-pill">
                                        <i className="bi bi-save me-2"></i> Registrar Compra
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
