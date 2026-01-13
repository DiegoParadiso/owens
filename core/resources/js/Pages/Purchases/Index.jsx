import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import Drawer from '@/Components/Drawer';
import { Head, Link, useForm, router } from '@inertiajs/react';
import Swal from 'sweetalert2';

import Pagination from '@/Components/Pagination';

export default function Index({ purchases = [], suppliers = [], products = [] }) {
    const [showDrawer, setShowDrawer] = useState(false);
    const [rows, setRows] = useState([]);
    const [grandTotal, setGrandTotal] = useState(0);
    const [editingPurchase, setEditingPurchase] = useState(null);

    const { data, setData, post, put, processing, errors, reset, transform, delete: destroy } = useForm({
        supplier_id: '',
        date: new Date().toISOString().split('T')[0],
        items: [],
        total_cost: 0,
        payment_method: 'cash',
        split_payments: [],
    });

    const [showSplitInputs, setShowSplitInputs] = useState(false);

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

    // Split payment helper functions
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

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const addRow = () => {
        setRows([...rows, {
            id: Date.now(),
            product_id: '',
            quantity: 1,
            unit_cost: 0,
            subtotal: 0,
            isNew: false,
            productName: '',
            salePrice: '',
            purchase_unit: '',
            usage_unit: '',
            conversion_factor: '',
            productType: 'supply'
        }]);
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

    const handleProductSelect = (id, productId) => {
        const product = products.find(p => p.id == productId);
        if (product) {
            const newRows = rows.map(row => {
                if (row.id === id) {
                    return {
                        ...row,
                        product_id: productId,
                        productName: product.name,
                        salePrice: product.price || '',
                        unit_cost: product.cost || 0,
                        subtotal: row.quantity * (product.cost || 0),
                        productType: product.type || 'single', // Default to single if not set
                        purchase_unit: product.purchase_unit || '',
                        usage_unit: product.usage_unit || '',
                        conversion_factor: product.conversion_factor ? parseFloat(product.conversion_factor) : '',
                    };
                }
                return row;
            });
            setRows(newRows);
        } else {
            updateRow(id, 'product_id', productId);
        }
    };

    const toggleNewProduct = (id) => {
        const newRows = rows.map(row => {
            if (row.id === id) {
                return {
                    ...row,
                    isNew: !row.isNew,
                    product_id: '', // Reset selection
                    productName: '', // Reset name
                    salePrice: '', // Reset price
                    purchase_unit: '',
                    usage_unit: '',
                    conversion_factor: '',
                    productType: 'supply'
                };
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

        // Validar que haya filas válidas
        // Validar que haya filas válidas
        const validRows = rows.filter(row => (row.product_id !== '' && !row.isNew) || (row.isNew && row.productName !== '' && (row.productType === 'supply' || row.salePrice !== '')));
        if (validRows.length === 0) {
            window.toast.warning('Advertencia', 'Debes agregar al menos un producto.');
            return;
        }

        // Validate old date for cash payments
        if (data.payment_method === 'cash' && !editingPurchase) {
            const selectedDate = new Date(data.date);
            const twoDaysAgo = new Date();
            twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

            if (selectedDate < twoDaysAgo) {
                Swal.fire({
                    text: 'Estás registrando una compra con fecha pasada en la caja actual, ¿es correcto?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#df0f13',
                    cancelButtonColor: '#6c757d',
                    confirmButtonText: 'Sí, continuar',
                    cancelButtonText: 'Cancelar',
                    customClass: {
                        popup: 'swal-minimal',
                        confirmButton: 'btn btn-primary px-4',
                        cancelButton: 'btn btn-secondary px-4'
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        proceedSubmit(validRows);
                    }
                });
                return;
            }
        }

        // Validate split payments if using multiple
        if (data.payment_method === 'multiple') {
            const splitTotal = calculateSplitTotal();
            if (Math.abs(splitTotal - grandTotal) > 0.01) {
                window.toast.error('Error en distribución', `La suma de los pagos (${formatCurrency(splitTotal, 2)}) debe ser igual al total (${formatCurrency(grandTotal, 2)})`);
                return;
            }
        }

        proceedSubmit(validRows);
    };

    const proceedSubmit = (validRows) => {
        setShowDrawer(false); // Close immediately to show loading screen

        transform((data) => ({
            ...data,
            product_id: validRows.map(r => r.isNew ? null : r.product_id),
            product_name: validRows.map(r => r.isNew ? r.productName : null),
            sale_price: validRows.map(r => r.salePrice), // Send for both new and existing to update
            purchase_unit: validRows.map(r => r.purchase_unit), // Send for both
            usage_unit: validRows.map(r => r.usage_unit), // Send for both
            conversion_factor: validRows.map(r => r.conversion_factor), // Send for both
            product_type: validRows.map(r => r.productType), // Send for both
            quantity: validRows.map(r => r.quantity),
            unit_cost: validRows.map(r => r.unit_cost),
            split_payments: data.payment_method === 'multiple' ? data.split_payments : [],
        }));

        const options = {
            onSuccess: (page) => {
                const flash = page.props.flash;
                if (flash && flash.error) {
                    setShowDrawer(true);
                    window.toast.error('Error', flash.error);
                } else {
                    setEditingPurchase(null);
                    setRows([{
                        id: Date.now(),
                        product_id: '',
                        quantity: 1,
                        unit_cost: 0,
                        subtotal: 0,
                        isNew: false,
                        productName: '',
                        salePrice: '',
                        purchase_unit: '',
                        usage_unit: '',
                        conversion_factor: '',
                        productType: 'supply'
                    }]);
                    reset();
                    window.toast.success(editingPurchase ? 'Compra actualizada' : 'Compra guardada', 'La operación se realizó con éxito.');
                }
            },
            onError: (errors) => {
                setShowDrawer(true); // Re-open on error
                console.error('❌ Errores:', errors);
                const errorMsg = Object.values(errors).flat().join(', ') || 'Error al procesar la compra';
                window.toast.error('Error', errorMsg);
            }
        };

        if (editingPurchase) {
            put(route('purchase.update', editingPurchase.id), options);
        } else {
            post(route('purchase.store'), options);
        }
    };

    const handleEdit = (purchase) => {
        setEditingPurchase(purchase);
        setData({
            supplier_id: purchase.supplier_id,
            date: purchase.date,
            items: [], // Will be populated by rows
            total_cost: purchase.total_cost,
            payment_method: purchase.payment_method || 'cash',
            split_payments: purchase.payments ? purchase.payments.map(p => ({
                method: p.payment_method,
                amount: p.amount
            })) : []
        });

        if (purchase.payment_method === 'multiple') {
            setShowSplitInputs(true);
        } else {
            setShowSplitInputs(false);
        }

        // Populate rows from purchase details if available (assuming details are loaded)
        // Note: The controller index currently loads 'supplier' and 'user', but not 'details'.
        // We might need to fetch details or pass them. 
        // For now, let's assume details are not passed in index and we might need to fetch them or 
        // update the controller to include 'details'.
        // Let's check if purchase has details.
        if (purchase.details) {
            const purchaseRows = purchase.details.map((detail, index) => ({
                id: Date.now() + index,
                product_id: detail.product_id,
                quantity: detail.quantity,
                unit_cost: detail.unit_cost,
                subtotal: detail.quantity * detail.unit_cost,
                isNew: false,
                productName: detail.product ? detail.product.name : '',
                salePrice: detail.product ? (detail.product.price || '') : '',
                productType: detail.product ? (detail.product.type || 'single') : 'single',
                purchase_unit: detail.product ? (detail.product.purchase_unit || '') : '',
                usage_unit: detail.product ? (detail.product.usage_unit || '') : '',
                conversion_factor: detail.product && detail.product.conversion_factor ? parseFloat(detail.product.conversion_factor) : ''
            }));
            setRows(purchaseRows);
        } else {
            // If details are missing, we can't edit properly without fetching.
            // But let's assume for now we just open the drawer.
            setRows([{
                id: Date.now(),
                product_id: '',
                quantity: 1,
                unit_cost: 0,
                subtotal: 0,
                isNew: false,
                productName: '',
                salePrice: '',
                purchase_unit: '',
                usage_unit: '',
                conversion_factor: '',
                productType: 'supply'
            }]);
        }

        setShowDrawer(true);
    };

    const handleDelete = (id) => {
        Swal.fire({
            text: "¿Eliminar esta compra? Esto revertirá el stock.",
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
                destroy(route('purchase.destroy', id), {
                    preserveScroll: true,
                    onSuccess: () => {
                        window.toast.success('Eliminado', 'La compra ha sido eliminada correctamente.');
                    },
                });
            }
        });
    };

    const handleOpenDrawer = () => {
        setEditingPurchase(null);
        setShowDrawer(true);
        setRows([{
            id: Date.now(),
            product_id: '',
            quantity: 1,
            unit_cost: 0,
            subtotal: 0,
            isNew: false,
            productName: '',
            salePrice: '',
            purchase_unit: '',
            usage_unit: '',
            conversion_factor: '',
            productType: 'supply'
        }]);
        setData({
            supplier_id: '',
            date: new Date().toISOString().split('T')[0],
            items: [],
            items: [],
            total_cost: 0,
            payment_method: 'cash',
            split_payments: []
        });
        setShowSplitInputs(false);
    };

    const handleCloseDrawer = () => {
        setShowDrawer(false);
        setEditingPurchase(null);
        setRows([{
            id: Date.now(),
            product_id: '',
            quantity: 1,
            unit_cost: 0,
            subtotal: 0,
            isNew: false,
            productName: '',
            salePrice: '',
            purchase_unit: '',
            usage_unit: '',
            conversion_factor: ''
        }]);
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
                        <table className="table-minimal align-top">
                            <thead>
                                <tr>
                                    <th scope="col" style={{ width: '140px' }}>Fecha</th>
                                    <th scope="col">Proveedor</th>
                                    <th scope="col">Detalles</th>
                                    <th scope="col" className="text-end" style={{ width: '130px' }}>Total</th>
                                    <th scope="col" style={{ width: '130px' }}>Método Pago</th>
                                    <th scope="col" className="text-center" style={{ width: '100px' }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {purchases.data.map((purchase, index) => (
                                    <tr key={purchase.id}>
                                        <td>{formatDate(purchase.date)}</td>
                                        <td>{purchase.supplier ? purchase.supplier.name : 'N/A'}</td>
                                        <td>
                                            <ul className="list-unstyled mb-0 small">
                                                {purchase.details && purchase.details.length > 0 ? (
                                                    purchase.details.map((detail, idx) => (
                                                        <li key={idx}>
                                                            <span className="text-muted">{parseFloat(detail.quantity)}x</span> {detail.product ? detail.product.name : detail.product_name || 'Producto eliminado'}
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li className="text-muted fst-italic">Sin detalles</li>
                                                )}
                                            </ul>
                                        </td>
                                        <td className="font-tabular fw-semibold text-end">{formatCurrency(purchase.total_cost, 2)}</td>
                                        <td>
                                            <span className="badge bg-transparent border text-dark">
                                                {formatPaymentMethod(purchase.payment_method)}
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            <div className="d-flex justify-content-center gap-1">
                                                <button
                                                    className="btn btn-icon-only btn-action-icon bg-transparent border-0"
                                                    onClick={() => handleEdit(purchase)}
                                                    title="Editar"
                                                >
                                                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>edit_square</span>
                                                </button>
                                                <button
                                                    className="btn btn-icon-only btn-action-icon bg-transparent border-0"
                                                    onClick={() => handleDelete(purchase.id)}
                                                    title="Eliminar"
                                                >
                                                    <span className="material-symbols-outlined" style={{ fontSize: '22px', transform: 'translateY(-1px)' }}>delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {purchases.data.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4 text-muted">
                                            No hay compras registradas
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <Pagination
                        links={purchases.links}
                        from={purchases.from}
                        to={purchases.to}
                        total={purchases.total}
                        perPage={purchases.per_page}
                        onPerPageChange={(newPerPage) => {
                            router.get(route('purchase.index'), { per_page: newPerPage }, { preserveState: true, replace: true });
                        }}
                    />
                </div>
            </div>

            <Drawer
                isOpen={showDrawer}
                onClose={handleCloseDrawer}
                title={editingPurchase ? 'Editar Compra' : 'Registrar Compra'}
                width="950px"
                footer={
                    <>
                        <button type="button" className="btn btn-light" onClick={handleCloseDrawer}>Cancelar</button>
                        <button type="submit" form="purchaseForm" className="btn btn-primary text-nowrap" disabled={processing}>
                            {processing ? 'Guardando...' : (editingPurchase ? 'Actualizar Compra' : 'Registrar Compra')}
                        </button>
                    </>
                }
            >
                <form id="purchaseForm" onSubmit={submit}>
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <label htmlFor="supplier_id" className="form-label">Proveedor</label>
                            <select
                                className="form-select input-clean"
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
                                className="form-control input-clean"
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
                                            <div className="d-flex flex-column gap-2">
                                                <div className="d-flex gap-2 align-items-center">
                                                    {row.isNew ? (
                                                        <input
                                                            type="text"
                                                            className="form-control form-control-sm input-clean"
                                                            placeholder="Nombre del Nuevo Producto"
                                                            value={row.productName}
                                                            onChange={(e) => updateRow(row.id, 'productName', e.target.value)}
                                                            required
                                                            autoFocus
                                                        />
                                                    ) : (
                                                        <select
                                                            className="form-select form-select-sm flex-grow-1 input-clean"
                                                            value={row.product_id}
                                                            onChange={(e) => handleProductSelect(row.id, e.target.value)}
                                                            required
                                                        >
                                                            <option value="">Seleccionar</option>
                                                            {products.map(product => (
                                                                <option key={product.id} value={product.id}>{product.name} ({product.unit || 'Unidad'})</option>
                                                            ))}
                                                        </select>
                                                    )}

                                                    <button
                                                        type="button"
                                                        className="btn btn-sm border-0 text-dark"
                                                        onClick={() => toggleNewProduct(row.id)}
                                                        title={row.isNew ? "Cancelar nuevo producto" : "Crear nuevo producto"}
                                                        style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                    >
                                                        <span className="material-symbols-outlined" style={row.isNew ? { transform: 'translateY(-8px)' } : {}}>
                                                            {row.isNew ? 'minimize' : 'add'}
                                                        </span>
                                                    </button>
                                                </div>

                                                {(row.isNew || row.product_id) && (
                                                    <div className="mt-2 p-2 rounded" >
                                                        {/* 
                                                            Simplificación: La compra no define si es Insumo o Venta, ni el precio de venta.
                                                            Eso se hace en Inventario. 
                                                        */}

                                                        <div className="d-flex flex-column gap-2">
                                                            <input
                                                                type="text"
                                                                className="form-control form-control-sm input-clean"
                                                                placeholder="Unidad de Compra (Caja, Bolsa...)"
                                                                value={row.purchase_unit}
                                                                onChange={(e) => updateRow(row.id, 'purchase_unit', e.target.value)}
                                                                style={{ fontSize: '0.75rem' }}
                                                            />
                                                            {/* 
                                                                Receta / Conversión se configura en Inventario. 
                                                                Aquí solo registramos qué llega del proveedor. 
                                                            */}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
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
                                                className="form-control form-control-sm input-clean"
                                                value={row.unit_cost || ''}
                                                onChange={(e) => updateRow(row.id, 'unit_cost', parseFloat(e.target.value) || 0)}
                                                placeholder="Costo"
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm font-tabular fw-semibold input-clean"
                                                value={formatCurrency(row.subtotal, 2)}
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
                                            className="form-control form-control-sm font-tabular fw-bold input-clean"
                                            value={formatCurrency(grandTotal, 2)}
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

                        {/* Split Payment Inputs */}
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
                                                className="form-select form-select-sm"
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
                                                className="form-control form-control-sm"
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

                                {/* Total and difference display */}
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
                                Este monto se descontará del efectivo disponible
                            </div>
                        )}
                        {data.payment_method !== 'cash' && data.payment_method !== 'multiple' && (
                            <div className="alert alert-secondary mt-2 mb-0 py-2 small">
                                <i className="bi bi-info-circle me-2"></i>
                                Gasto administrativo. No afecta el saldo de caja
                            </div>
                        )}
                    </div>
                </form>
            </Drawer>
        </MainLayout>
    );
}
