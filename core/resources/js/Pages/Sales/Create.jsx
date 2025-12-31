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
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
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
                                                            className="form-control border-0 border-bottom rounded-0 font-monospace text-muted"
                                                            value={formatCurrency(row.price)}
                                                            readOnly
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            className="form-control border-0 border-bottom rounded-0 font-monospace text-center"
                                                            value={row.quantity}
                                                            min="1"
                                                            onChange={(e) => updateRow(row.id, 'quantity', parseFloat(e.target.value) || 0)}
                                                            required
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            className="form-control border-0 border-bottom rounded-0 font-monospace fw-bold"
                                                            value={formatCurrency(row.total)}
                                                            readOnly
                                                        />
                                                    </td>
                                                    <td className="text-end">
                                                        <button
                                                            onClick={() => removeProductRow(row.id)}
                                                            className="btn btn-sm text-danger"
                                                            type="button"
                                                        >
                                                            <i className="bi bi-trash-fill"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td colSpan="3" className="text-end fw-bold text-uppercase small letter-spacing-1 pt-4">Precio Total</td>
                                                <td colSpan="2" className="pt-3">
                                                    <div className="input-group">
                                                        <input
                                                            type="text"
                                                            className="form-control border-0 font-monospace fw-bold fs-5 text-end bg-transparent"
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
