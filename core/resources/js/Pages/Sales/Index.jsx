import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import Drawer from '@/Components/Drawer';
import { Head, Link, useForm, router } from '@inertiajs/react';
import Swal from 'sweetalert2';

import Pagination from '@/Components/Pagination';

export default function Index({ sales = [], products = [] }) {
    const [showDrawer, setShowDrawer] = useState(false);
    const [rows, setRows] = useState([]);
    const [grandTotal, setGrandTotal] = useState(0);

    const { data, setData, post, processing, errors, reset } = useForm({
        items: [],
        total: 0,
        payment_method: 'cash',
        split_payments: [],
    });

    const [showSplitInputs, setShowSplitInputs] = useState(false);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    };

    const formatPaymentMethod = (method) => {
        const methods = {
            'cash': 'Efectivo',
            'debit_card': 'Débito',
            'credit_card': 'Crédito',
            'transfer': 'Transferencia',
            'qr': 'QR',
            'multiple': 'Múltiple'
        };
        return methods[method] || method;
    };


    const updateSplitPayment = (index, field, value) => {
        const updated = [...data.split_payments];
        updated[index][field] = value;
        setData('split_payments', updated);
    };

    const addSplitPayment = () => {
        setData('split_payments', [
            ...data.split_payments,
            { method: 'cash', amount: '' }
        ]);
    };

    const removeSplitPayment = (index) => {
        setData('split_payments', data.split_payments.filter((_, i) => i !== index));
    };

    const calculateSplitTotal = () => {
        return data.split_payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
    };

    const handleDelete = (id) => {
        Swal.fire({
            text: "¿Eliminar esta venta?",
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
                router.delete(route('sales.destroy', id), {
                    preserveScroll: true,
                    onSuccess: () => {
                        window.toast.success('Venta eliminada', 'La venta ha sido eliminada correctamente.');
                    }
                });
            }
        });
    };


    const checkStock = (productId, quantity) => {
        const product = products.find(p => p.id == productId);
        if (!product) return { hasStock: true, missingComponents: [] };

        const missingComponents = [];

        if (product.type === 'combo' || (product.components && product.components.length > 0)) {
            if (product.components && product.components.length > 0) {
                product.components.forEach(component => {
                    const requiredQty = component.quantity * quantity;
                    const availableStock = component.child_product?.stock || 0;

                    if (availableStock < requiredQty) {
                        missingComponents.push({
                            name: component.child_product?.name || 'Producto desconocido',
                            required: requiredQty,
                            available: availableStock,
                            missing: requiredQty - availableStock
                        });
                    }
                });
            }
        } else {

            if (product.stock < quantity) {
                missingComponents.push({
                    name: product.name,
                    required: quantity,
                    available: product.stock,
                    missing: quantity - product.stock
                });
            }
        }

        return {
            hasStock: missingComponents.length === 0,
            missingComponents: missingComponents
        };
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
                        updatedRow.productType = product.type;


                        const stockCheck = checkStock(value, updatedRow.quantity);
                        updatedRow.stockWarning = !stockCheck.hasStock;
                        updatedRow.missingComponents = stockCheck.missingComponents;
                    } else {
                        updatedRow.price = 0;
                        updatedRow.total = 0;
                        updatedRow.stockWarning = false;
                        updatedRow.missingComponents = [];
                    }
                }

                if (field === 'quantity') {
                    updatedRow.total = updatedRow.price * value;


                    if (updatedRow.product_id) {
                        const stockCheck = checkStock(updatedRow.product_id, value);
                        updatedRow.stockWarning = !stockCheck.hasStock;
                        updatedRow.missingComponents = stockCheck.missingComponents;
                    }
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


        const validRows = rows.filter(row => row.product_id !== '');
        if (validRows.length === 0) {
            window.toast.warning('Advertencia', 'Debes agregar al menos un producto.');
            return;
        }


        if (data.payment_method === 'multiple') {
            const splitTotal = calculateSplitTotal();
            if (Math.abs(splitTotal - grandTotal) > 0.01) {
                window.toast.error('Error en distribución', `La suma de los pagos (${formatCurrency(splitTotal)}) debe ser igual al total (${formatCurrency(grandTotal)})`);
                return;
            }
        }


        const formData = {
            product_id: validRows.map(row => row.product_id),
            quantity: validRows.map(row => row.quantity),
            price: validRows.map(row => row.price),
            total_price: validRows.map(row => row.total),
            total: grandTotal,
            payment_method: data.payment_method
        };


        setShowDrawer(false);
        router.post(route('sales.store'), formData, {
            preserveScroll: true,
            onSuccess: () => {
                window.toast.success('Venta guardada', 'La venta se ha registrado correctamente.');
                setRows([]);
                reset();
            },
            onError: (errors) => {
                setShowDrawer(true);
                console.error('❌ ERROR! Errores:', errors);


                const errorMessage = errors.error || Object.values(errors)[0] || 'Error al registrar la venta';

                window.toast.error('Error', errorMessage);
            }
        });
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
                                    <th scope="col">Detalles</th>
                                    <th scope="col">Total</th>
                                    <th scope="col">Método Pago</th>
                                    <th scope="col" className="text-end">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sales.data.map((sale, index) => (
                                    <tr key={sale.id}>
                                        <td className="text-muted">{(sales.current_page - 1) * sales.per_page + index + 1}</td>
                                        <td>{formatDate(sale.sale_date)}</td>
                                        <td>
                                            <ul className="list-unstyled mb-0 small">
                                                {sale.sale_details && sale.sale_details.length > 0 ? (
                                                    sale.sale_details.map((detail, idx) => (
                                                        <li key={idx}>
                                                            <span className="text-muted">{parseInt(detail.quantity)}x</span> {detail.product.name}
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li className="text-muted fst-italic">Sin detalles</li>
                                                )}
                                            </ul>
                                        </td>
                                        <td className="font-tabular fw-semibold">{formatCurrency(sale.total_price)}</td>
                                        <td>
                                            <span className="badge bg-transparent border text-dark">
                                                {formatPaymentMethod(sale.payment_method)}
                                            </span>
                                        </td>
                                        <td className="text-end">
                                            <button
                                                className="btn btn-icon-only bg-transparent border-0"
                                                onClick={() => handleDelete(sale.id)}
                                                title="Eliminar"
                                            >
                                                <span className="material-symbols-outlined" style={{ fontSize: '22px', color: 'var(--text-muted)', transform: 'translateY(-1px)' }}>delete</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {sales.data.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4 text-muted">No hay datos de ventas</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <Pagination
                        links={sales.links}
                        from={sales.from}
                        to={sales.to}
                        total={sales.total}
                        perPage={sales.per_page}
                        onPerPageChange={(newPerPage) => {
                            const url = new URL(window.location.href);
                            url.searchParams.set('per_page', newPerPage);
                            url.searchParams.set('page', 1);
                            router.get(url.toString(), {}, { preserveState: true, preserveScroll: true });
                        }}
                    />
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
                    <h6 className="mb-3">Detalles de venta</h6>
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
                                    <React.Fragment key={row.id}>
                                        <tr>
                                            <td>
                                                <select
                                                    className="form-select form-select-sm input-clean"
                                                    value={row.product_id}
                                                    onChange={(e) => updateRow(row.id, 'product_id', e.target.value)}
                                                    required
                                                >
                                                    <option value="">Seleccionar</option>
                                                    {products.map(product => (
                                                        <option key={product.id} value={product.id}>
                                                            {product.name} {product.type === 'combo' || (product.components && product.components.length > 0) ? '' : `(Stock: ${product.stock})`}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm font-tabular input-clean"
                                                    value={formatCurrency(row.price)}
                                                    readOnly
                                                />
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center justify-content-center gap-2">
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm text-muted p-0"
                                                        onClick={() => updateRow(row.id, 'quantity', Math.max(1, (parseInt(row.quantity) || 0) - 1))}
                                                        style={{ width: '24px', height: '24px', fontSize: '1rem' }}
                                                    >
                                                        <i className="bi bi-dash"></i>
                                                    </button>
                                                    <input
                                                        type="number"
                                                        className="form-control form-control-sm text-center p-0 input-clean"
                                                        style={{ width: '50px', height: '28px' }}
                                                        value={row.quantity}
                                                        onChange={(e) => updateRow(row.id, 'quantity', e.target.value === '' ? '' : parseInt(e.target.value))}
                                                        onBlur={(e) => {
                                                            if (e.target.value === '' || parseInt(e.target.value) < 1) {
                                                                updateRow(row.id, 'quantity', 1);
                                                            }
                                                        }}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm text-muted p-0"
                                                        onClick={() => updateRow(row.id, 'quantity', (parseInt(row.quantity) || 0) + 1)}
                                                        style={{ width: '24px', height: '24px', fontSize: '1rem' }}
                                                    >
                                                        <i className="bi bi-plus"></i>
                                                    </button>
                                                </div>
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm font-tabular fw-semibold input-clean"
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
                                        {row.stockWarning && row.missingComponents && row.missingComponents.length > 0 && (
                                            <tr>
                                                <td colSpan="5" className="py-2 px-3" style={{ backgroundColor: '#fff3cd' }}>
                                                    <div className="d-flex align-items-start gap-2">
                                                        <i className="bi bi-exclamation-triangle-fill text-warning" style={{ fontSize: '1.1rem' }}></i>
                                                        <div className="flex-grow-1">
                                                            <strong className="text-warning d-block mb-1">Advertencia de stock:</strong>
                                                            <ul className="list-unstyled mb-0 small">
                                                                {row.missingComponents.map((comp, idx) => (
                                                                    <li key={idx} className="text-muted">
                                                                        • <strong>{comp.name}</strong>: {comp.available === 0 ? 'Sin stock' : `Solo hay ${comp.available} (necesitas ${comp.required})`}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                            <p className="small text-muted mb-0 mt-2">
                                                                Si continúas, la venta se registrará solo con los componentes disponibles en stock.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan="3" className="text-end fw-bold small">TOTAL</td>
                                    <td colSpan="2">
                                        <input
                                            type="text"
                                            className="form-control form-control-sm font-tabular fw-bold input-clean"
                                            value={formatCurrency(grandTotal)}
                                            readOnly
                                        />
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    <button type="button" className="btn btn-outline-secondary btn-sm mb-4" onClick={addRow}>
                        <i className="bi bi-plus-lg me-1"></i> Agregar Producto
                    </button>


                    <div className="mb-4">
                        <label className="form-label fw-semibold">Método de Pago</label>
                        <div className="d-flex gap-2 flex-wrap">
                            <button
                                type="button"
                                className={`btn btn-sm ${data.payment_method === 'cash' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                onClick={() => setData('payment_method', 'cash')}
                            >
                                Efectivo
                            </button>
                            <button
                                type="button"
                                className={`btn btn-sm ${data.payment_method === 'debit_card' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                onClick={() => setData('payment_method', 'debit_card')}
                            >
                                Débito
                            </button>
                            <button
                                type="button"
                                className={`btn btn-sm ${data.payment_method === 'credit_card' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                onClick={() => setData('payment_method', 'credit_card')}
                            >
                                Crédito
                            </button>
                            <button
                                type="button"
                                className={`btn btn-sm ${data.payment_method === 'transfer' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                onClick={() => setData('payment_method', 'transfer')}
                            >
                                Transferencia
                            </button>
                            <button
                                type="button"
                                className={`btn btn-sm ${data.payment_method === 'qr' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                onClick={() => setData('payment_method', 'qr')}
                            >
                                QR
                            </button>
                            <button
                                type="button"
                                className={`btn btn-sm ${data.payment_method === 'multiple' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                onClick={() => {
                                    setData('payment_method', 'multiple');
                                    setShowSplitInputs(true);
                                    if (data.split_payments.length === 0) {
                                        setData('split_payments', [
                                            { method: 'cash', amount: '' },
                                            { method: 'debit_card', amount: '' }
                                        ]);
                                    }
                                }}
                            >
                                Múltiple
                            </button>
                        </div>


                        {showSplitInputs && data.payment_method === 'multiple' && (
                            <div className="mt-3 p-3 border rounded" style={{ backgroundColor: 'var(--bg-card)' }}>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <strong className="small">Distribución de Pago</strong>
                                    <small className="text-muted">Total: {formatCurrency(grandTotal)}</small>
                                </div>

                                {data.split_payments.map((payment, index) => (
                                    <div key={index} className="row mb-2 align-items-center">
                                        <div className="col-5">
                                            <select
                                                className="form-select form-select-sm input-clean"
                                                value={payment.method}
                                                onChange={(e) => updateSplitPayment(index, 'method', e.target.value)}
                                            >
                                                <option value="cash">Efectivo</option>
                                                <option value="debit_card">Débito</option>
                                                <option value="credit_card">Crédito</option>
                                                <option value="transfer">Transferencia</option>
                                                <option value="qr">QR</option>
                                            </select>
                                        </div>
                                        <div className="col-6">
                                            <input
                                                type="number"
                                                step="0.01"
                                                className="form-control form-control-sm input-clean"
                                                placeholder="Monto"
                                                value={payment.amount}
                                                onChange={(e) => updateSplitPayment(index, 'amount', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-1">
                                            {data.split_payments.length > 1 && (
                                                <button
                                                    type="button"
                                                    className="border-0 bg-transparent p-0"
                                                    onClick={() => removeSplitPayment(index)}
                                                    style={{ color: '#dc3545', cursor: 'pointer' }}
                                                >
                                                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>delete</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-secondary mt-2"
                                    onClick={addSplitPayment}
                                >
                                    <i className="bi bi-plus-lg me-1"></i>
                                    Agregar Método
                                </button>


                                {Math.abs(calculateSplitTotal() - grandTotal) > 0.01 && (
                                    <div
                                        className="mt-3 p-2 rounded small border"
                                        style={{
                                            backgroundColor: 'var(--bg-card)',
                                            color: 'var(--text-primary)'
                                        }}
                                    >
                                        <div className="d-flex justify-content-between">
                                            <span>Suma actual:</span>
                                            <strong>{formatCurrency(calculateSplitTotal())}</strong>
                                        </div>
                                        <div className="d-flex justify-content-between mt-1">
                                            <span>Diferencia:</span>
                                            <strong style={{ color: '#dc3545' }}>
                                                {formatCurrency(Math.abs(grandTotal - calculateSplitTotal()))}
                                                {calculateSplitTotal() < grandTotal ? ' (falta)' : ' (sobra)'}
                                            </strong>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {data.payment_method === 'cash' && (
                            <div className="alert alert-info mt-2 mb-0 py-2 small">
                                <i className="bi bi-info-circle me-2"></i>
                                Este monto se sumará al saldo de caja física
                            </div>
                        )}
                        {data.payment_method !== 'cash' && data.payment_method !== 'multiple' && (
                            <div className="alert alert-secondary mt-2 mb-0 py-2 small">
                                <i className="bi bi-info-circle me-2"></i>
                                Esta venta se registrará, pero no afectará el saldo físico de caja
                            </div>
                        )}
                    </div>
                </form>
            </Drawer>
        </MainLayout>
    );
}
