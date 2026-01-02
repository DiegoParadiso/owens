import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ products = [] }) {

    const [rows, setRows] = useState([]);
    const [grandTotal, setGrandTotal] = useState(0);

    const { data, setData, post, processing, errors } = useForm({
        items: [],
        total: 0,
    });

    const addRow = () => {
        setRows([...rows, { id: Date.now(), product_id: '', price: 0, quantity: 1, total: 0 }]);
    };

    const removeRow = (id) => {
        setRows(rows.filter(row => row.id !== id));
    };

    const updateRow = (id, field, value) => {
        const newRows = rows.map(row => {
            if (row.id === id) {
                const updatedRow = { ...row, [field]: value };

                if (field === 'product_id') {
                    const product = products.find(p => p.id == value);
                    if (product) {
                        updatedRow.price = product.price;
                        updatedRow.total = product.price * updatedRow.quantity;
                    } else {
                        updatedRow.price = 0;
                        updatedRow.total = 0;
                    }
                }

                if (field === 'quantity') {
                    updatedRow.total = updatedRow.price * value;
                }

                return updatedRow;
            }
            return row;
        });
        setRows(newRows);
    };

    useEffect(() => {
        const total = rows.reduce((sum, row) => sum + row.total, 0);
        setGrandTotal(total);
        setData('items', rows);
        setData('total', total);
    }, [rows]);

    const submit = (e) => {
        e.preventDefault();
        alert('Venta guardada (Simulación)');
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
    };

    return (
        <MainLayout>
            <Head title="Nueva Venta" />
            <div className="container-fluid pt-4 px-4">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link href={route('dashboard')}>Dashboard</Link></li>
                        <li className="breadcrumb-item"><Link href={route('sales.index')}>Ventas</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">Nueva Venta</li>
                    </ol>
                </nav>
                <div className="card-minimal border-accent-primary">
                    <div className="col-12">
                        <form onSubmit={submit}>
                            <div className="h-100">
                                <h6 className="mb-4 fw-bold">Nueva venta</h6>

                                <div className="table-responsive mb-4">
                                    <table className="table-minimal">
                                        <thead>
                                            <tr>
                                                <th scope="col" style={{ width: '35%' }}>Producto</th>
                                                <th scope="col" style={{ width: '15%' }}>Precio</th>
                                                <th scope="col" style={{ width: '15%' }}>Cantidad</th>
                                                <th scope="col" style={{ width: '20%' }}>Total</th>
                                                <th scope="col" style={{ width: '15%' }} className="text-end">Acción</th>
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
                                                                <option key={product.id} value={product.id}>
                                                                    {product.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            className="form-control border-0 border-bottom rounded-0 font-tabular fw-semibold"
                                                            value={formatCurrency(row.price)}
                                                            readOnly
                                                        />
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
                                                            type="text"
                                                            className="form-control border-0 border-bottom rounded-0 font-tabular fw-semibold"
                                                            value={formatCurrency(row.total)}
                                                            readOnly
                                                        />
                                                    </td>
                                                    <td className="text-end">
                                                        <button
                                                            onClick={() => removeRow(row.id)}
                                                            className="btn btn-sm text-danger"
                                                            type="button"
                                                        >
                                                            <span className="material-symbols-outlined">delete</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td colSpan="3" className="text-end fw-bold text-uppercase small letter-spacing-1">Precio Total</td>
                                                <td colSpan="2">
                                                    <div className="input-group">
                                                        <input
                                                            type="text"
                                                            className="form-control border-0 font-tabular fw-semibold fs-5 text-end bg-transparent"
                                                            value={formatCurrency(grandTotal)}
                                                            readOnly
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                                <button type="button" className="btn btn-outline-secondary btn-sm mb-4 rounded-pill" onClick={addRow}>
                                    <i className="bi bi-plus-lg me-1"></i> Agregar Producto
                                </button>
                            </div>
                            <div className="d-flex justify-content-end pt-3 border-top">
                                <button type="submit" className="btn btn-primary px-4 rounded-pill" disabled={rows.length === 0}>
                                    <i className="bi bi-save me-2"></i> Guardar Venta
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
