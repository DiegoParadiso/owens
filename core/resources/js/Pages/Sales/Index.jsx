import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import Drawer from '@/Components/Drawer';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Index({ sales = [], products = [] }) {
    const [showDrawer, setShowDrawer] = useState(false);
    const [rows, setRows] = useState([]);
    const [grandTotal, setGrandTotal] = useState(0);

    const { data, setData, post, processing, errors, reset } = useForm({
        items: [],
        total: 0,
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    };

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
        setShowDrawer(false);
        setRows([]);
        reset();
    };

    const handleOpenDrawer = () => {
        setShowDrawer(true);
        setRows([{ id: Date.now(), product_id: '', price: 0, quantity: 1, total: 0 }]);
    };

    const handleCloseDrawer = () => {
        setShowDrawer(false);
        setRows([]);
        reset();
    };

    return (
        <MainLayout>
            <Head title="Ventas" />
            <div className="container-fluid pt-4 px-4">

                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="mb-0 fw-bold">Ventas</h4>
                    <button
                        onClick={handleOpenDrawer}
                        className="btn btn-primary rounded-pill px-3"
                    >
                        <i className="bi bi-plus-lg me-2"></i>Nueva Venta
                    </button>
                </div>

                <div className="card-minimal">
                    <div className="table-responsive">
                        <table className="table-minimal">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Fecha</th>
                                    <th scope="col">Detalle</th>
                                    <th scope="col">Total</th>
                                    <th scope="col">Vendedor</th>
                                    <th scope="col" className="text-end">Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sales.map((sale, index) => (
                                    <tr key={sale.id}>
                                        <td className="text-muted">{index + 1}</td>
                                        <td>{formatDate(sale.sale_date)}</td>
                                        <td>
                                            <ul className="list-unstyled mb-0 small">
                                                {sale.saleDetails.map((detail, idx) => (
                                                    <li key={idx}>
                                                        <span className="fw-medium">{detail.quantity}x</span> {detail.product.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        </td>
                                        <td className="font-tabular fw-semibold">{formatCurrency(sale.total_price)}</td>
                                        <td>{sale.name}</td>
                                        <td className="text-end">
                                            {sale.payment_status === 'Lunas' ? (
                                                <span className="text-success fw-medium">Pagado</span>
                                            ) : (
                                                <span className="text-warning fw-medium">Pendiente</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {sales.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4 text-muted">No hay datos de ventas</td>
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
                title="Nueva Venta"
                width="900px"
                footer={
                    <>
                        <button type="button" className="btn btn-light" onClick={handleCloseDrawer}>Cancelar</button>
                        <button type="submit" form="saleForm" className="btn btn-primary" disabled={rows.length === 0 || processing}>
                            {processing ? 'Guardando...' : 'Guardar Venta'}
                        </button>
                    </>
                }
            >
                <form id="saleForm" onSubmit={submit}>
                    <div className="table-responsive mb-4">
                        <table className="table table-sm">
                            <thead>
                                <tr>
                                    <th style={{ width: '45%' }}>Producto</th>
                                    <th style={{ width: '18%' }}>Precio</th>
                                    <th style={{ width: '18%' }} className="text-center">Cantidad</th>
                                    <th style={{ width: '14%' }}>Total</th>
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
                                                    <option key={product.id} value={product.id}>
                                                        {product.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm font-tabular"
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
                                                className="form-control form-control-sm font-tabular fw-semibold"
                                                value={formatCurrency(row.total)}
                                                readOnly
                                            />
                                        </td>
                                        <td className="text-end">
                                            <button
                                                onClick={() => removeRow(row.id)}
                                                className="btn btn-icon-only text-danger"
                                                type="button"
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
