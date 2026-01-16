import React, { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import Drawer from '@/Components/Drawer';
import { Head, Link, useForm, router } from '@inertiajs/react';
import Swal from 'sweetalert2';

import Pagination from '@/Components/Pagination';

export default function Index({ products }) {
    const [showDrawer, setShowDrawer] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [showUsageConfig, setShowUsageConfig] = useState(false); // New state for toggle
    const [usageCalcMode, setUsageCalcMode] = useState('direct'); // 'direct' or 'purchase'
    const { data, setData, post, put, processing, errors, reset, delete: destroy } = useForm({
        name: '',
        type: 'single',
        price: '',
        stock: '',
        purchase_unit: '',
        usage_unit: '',
        conversion_factor: '',
        usage_factor: '', // Added missing field
        base_unit: '', // Added missing field
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedProducts(products.map(p => p.id));
        } else {
            setSelectedProducts([]);
        }
    };

    const handleSelectProduct = (productId) => {
        if (selectedProducts.includes(productId)) {
            setSelectedProducts(selectedProducts.filter(id => id !== productId));
        } else {
            setSelectedProducts([...selectedProducts, productId]);
        }
    };

    const handleDelete = (id) => {
        Swal.fire({
            text: "¿Eliminar este producto?",
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
                        window.toast.success('Eliminado', 'El producto ha sido eliminado correctamente.');
                    },
                });
            }
        });
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setShowUsageConfig(!!product.usage_unit); // Initialize toggle state
        setData({
            name: product.name,
            type: product.type || 'single',
            price: product.price ? parseFloat(product.price) : '',
            stock: product.stock ? parseFloat(product.stock) : '',
            purchase_unit: product.purchase_unit,
            usage_unit: product.usage_unit,
            conversion_factor: product.conversion_factor ? parseFloat(product.conversion_factor) : '',
            usage_factor: product.usage_factor ? parseFloat(product.usage_factor) : '',
            base_unit: product.base_unit,
        });
        setShowDrawer(true);
    };

    const openEditDrawer = (product) => {
        setEditingProduct(product);
        setShowUsageConfig(!!product.usage_unit); // Initialize toggle state
        setData({
            name: product.name,
            type: product.type || 'single',
            price: product.price ? parseFloat(product.price) : '',
            stock: product.stock ? parseFloat(product.stock) : '',
            purchase_unit: product.purchase_unit,
            usage_unit: product.usage_unit,
            conversion_factor: product.conversion_factor ? parseFloat(product.conversion_factor) : '',
            usage_factor: product.usage_factor ? parseFloat(product.usage_factor) : '',
            base_unit: product.base_unit,
        });
        setShowDrawer(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowDrawer(false);

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                setEditingProduct(null);
                reset();
                window.toast.success(editingProduct ? 'Producto actualizado' : 'Producto guardado', 'La operación se realizó con éxito.');
            },
            onError: (errors) => {
                setShowDrawer(true);
                window.toast.error('Error', 'Ocurrió un error al guardar el producto.');
            }
        };

        if (editingProduct) {
            put(route('product.update', editingProduct.id), options);
        } else {
            post(route('product.store'), options);
        }
    };

    const handleCloseDrawer = () => {
        setShowDrawer(false);
        setEditingProduct(null);
        reset();
    };

    return (
        <MainLayout>
            <Head title="Inventario" />
            <div className="container-fluid pt-4 px-4">

                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="mb-0 fw-bold">Inventario</h4>
                    <div className="d-flex gap-2">

                        <button
                            className="btn btn-primary rounded-pill px-3"
                            onClick={() => setShowDrawer(true)}
                        >
                            <i className="bi bi-plus-lg me-2"></i>Agregar Producto
                        </button>
                    </div>
                </div>

                <div className="card-minimal">
                    <div className="table-responsive">
                        <table className="table-minimal align-top">
                            <thead>
                                <tr>
                                    <th scope="col">Nombre</th>
                                    <th scope="col" className="text-end">Precio</th>
                                    <th scope="col" className="text-end">Costo</th>
                                    <th scope="col" className="text-end">Stock</th>
                                    <th scope="col" className="text-center" style={{ width: '100px' }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.data.map((product, index) => (
                                    <tr key={product.id}>
                                        <td className="fw-medium">
                                            <div className="d-flex align-items-center gap-2">
                                                {product.name}
                                                {product.type === 'supply' && (
                                                    <span className="badge bg-secondary-subtle text-secondary" style={{ fontSize: '0.65rem' }}>INSUMO</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="font-tabular fw-semibold text-end">
                                            {product.price ? formatCurrency(product.price) : <span className="text-muted">-</span>}
                                        </td>
                                        <td className="font-tabular text-muted text-end">
                                            {product.cost > 0 ? (
                                                <>
                                                    {formatCurrency(product.cost, product.cost % 1 === 0 ? 0 : 2)}
                                                    {product.purchase_unit && (
                                                        <span style={{ fontSize: '0.7em', marginLeft: '4px' }}>/ {product.purchase_unit}</span>
                                                    )}
                                                </>
                                            ) : (
                                                <span className="text-muted">-</span>
                                            )}
                                        </td>
                                        <td className="text-end">
                                            <div className="d-flex flex-column align-items-end">
                                                <div className="d-flex align-items-center gap-2 justify-content-end">
                                                    <span
                                                        className={`rounded-circle ${product.stock > 10 ? 'bg-success' : product.stock > 0 ? 'bg-warning' : 'bg-danger'}`}
                                                        style={{ width: '8px', height: '8px', display: 'inline-block' }}
                                                    ></span>
                                                    <span className="fw-medium">
                                                        {Number(product.stock).toLocaleString()} {product.base_unit || product.usage_unit || 'Unidades'}
                                                    </span>
                                                </div>
                                                {product.type === 'supply' && (
                                                    <div className="d-flex flex-column align-items-end">
                                                        {product.usage_unit && product.usage_factor > 0 ? (
                                                            <small className="text-muted mt-1" style={{ fontSize: '0.75rem' }}>
                                                                ≈ {Math.floor(product.stock / product.usage_factor)} {product.usage_unit}
                                                            </small>
                                                        ) : (
                                                            product.purchase_unit && product.conversion_factor > 0 && (
                                                                <small className="text-muted mt-1" style={{ fontSize: '0.75rem' }}>
                                                                    ≈ {Math.floor(product.stock / product.conversion_factor)} {product.purchase_unit}
                                                                </small>
                                                            )
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            <div className="d-flex justify-content-center gap-1">
                                                <button
                                                    className="btn btn-icon-only bg-transparent border-0 btn-action-icon"
                                                    onClick={() => openEditDrawer(product)}
                                                    title="Editar"
                                                >
                                                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>edit_square</span>
                                                </button>
                                                <button
                                                    className="btn btn-icon-only bg-transparent border-0 btn-action-icon"
                                                    onClick={() => handleDelete(product.id)}
                                                    title="Eliminar"
                                                >
                                                    <span className="material-symbols-outlined" style={{ fontSize: '22px', transform: 'translateY(-1px)' }}>delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {products.data.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4 text-muted">
                                            No hay productos registrados
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <Pagination
                        links={products.links}
                        from={products.from}
                        to={products.to}
                        total={products.total}
                        perPage={products.per_page}
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
                title={editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                footer={
                    <>
                        <button type="button" className="btn btn-light" onClick={handleCloseDrawer}>Cancelar</button>
                        <button type="button" className="btn btn-primary text-nowrap d-flex justify-content-center align-items-center" onClick={handleSubmit}>
                            {editingProduct ? 'Actualizar Producto' : 'Guardar Producto'}
                        </button>
                    </>
                }
            >
                <form id="createProductForm" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="form-label fw-semibold d-block mb-2">Tipo de Producto</label>
                        <div className="d-flex gap-2">
                            <button
                                type="button"
                                className={`btn flex-fill py-2 ${data.type === 'single' ? 'btn-dark' : 'btn-outline-secondary'}`}
                                onClick={() => setData('type', 'single')}
                            >
                                VENTA DIRECTA
                            </button>
                            <button
                                type="button"
                                className={`btn flex-fill py-2 ${data.type === 'supply' ? 'btn-dark' : 'btn-outline-secondary'}`}
                                onClick={() => setData('type', 'supply')}
                            >
                                INSUMO
                            </button>
                        </div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Nombre del Producto</label>
                        <input
                            type="text"
                            className="form-control input-clean"
                            id="name"
                            required
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Ej. Hamburguesa Doble"
                        />
                    </div>

                    {data.type === 'single' && (
                        <div className="mb-3">
                            <label htmlFor="price" className="form-label">Precio de Venta ($)</label>
                            <input
                                type="number"
                                className="form-control input-clean"
                                id="price"
                                min="0"
                                required
                                value={data.price}
                                onChange={(e) => setData('price', e.target.value)}
                                placeholder="0.00"
                            />
                        </div>
                    )}

                    {data.type === 'supply' && (
                        <div className="p-3 bg-light rounded mb-3 border">
                            <h6 className="text-uppercase small fw-bold text-muted mb-3 d-flex align-items-center gap-2">
                                <i className="bi bi-sliders"></i> Configuración de Unidades
                            </h6>

                            {/* 1. Base Unit (Technical) */}
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-muted">1. Unidad Base (Técnica)</label>
                                <select
                                    className="form-select form-select-sm input-clean"
                                    value={data.base_unit || ''}
                                    onChange={(e) => setData('base_unit', e.target.value)}
                                    disabled={editingProduct && data.stock > 0 && !!editingProduct.base_unit}
                                >
                                    <option value="">Seleccionar Unidad...</option>
                                    <optgroup label="Peso">
                                        <option value="g">Gramos (g)</option>
                                        <option value="kg">Kilogramos (kg)</option>
                                    </optgroup>
                                    <optgroup label="Volumen">
                                        <option value="ml">Mililitros (ml)</option>
                                        <option value="l">Litros (l)</option>
                                    </optgroup>
                                    <optgroup label="Conteo">
                                        <option value="un">Unidades (un)</option>
                                    </optgroup>
                                </select>
                                <div className="form-text" style={{ fontSize: '0.75rem' }}>
                                    {editingProduct && data.stock > 0 && !!editingProduct.base_unit
                                        ? <span className="text-danger"><i className="bi bi-lock-fill me-1"></i>Bloqueado porque el producto tiene stock.</span>
                                        : "Es la unidad mínima con la que el sistema contará el stock."
                                    }
                                </div>
                            </div>

                            <hr className="my-3 border-secondary-subtle" />

                            {/* 2. Purchase Unit -> Base Conversion */}
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-muted">2. Unidad de Compra</label>
                                <div className="d-flex align-items-center gap-2">
                                    <div style={{ flex: 1 }}>
                                        <input
                                            type="text"
                                            className="form-control form-control-sm input-clean"
                                            placeholder="Ej. Kg, Caja, Pack"
                                            value={data.purchase_unit || ''}
                                            onChange={(e) => setData('purchase_unit', e.target.value)}
                                        />
                                    </div>
                                    <div className="text-muted fw-bold">=</div>
                                    <div style={{ flex: 1 }}>
                                        <div className="input-group input-group-sm">
                                            <input
                                                type="number"
                                                className="form-control form-control-sm"
                                                placeholder="Cant."
                                                value={data.conversion_factor || ''}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    const newFactor = parseFloat(val);
                                                    const oldFactor = parseFloat(data.conversion_factor);

                                                    if (data.type === 'supply' && data.stock !== '' && oldFactor > 0 && newFactor > 0) {
                                                        const currentQty = data.stock / oldFactor;
                                                        const newStock = Math.round(currentQty * newFactor); // Keep integer if possible

                                                        setData(prev => ({
                                                            ...prev,
                                                            conversion_factor: val,
                                                            stock: newStock
                                                        }));
                                                    } else {
                                                        setData('conversion_factor', val);
                                                    }
                                                }}
                                            />
                                            <span className="input-group-text bg-light text-muted">
                                                {data.base_unit || 'Base'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-text mt-1" style={{ fontSize: '0.75rem' }}>
                                    Ej: 1 <b>{data.purchase_unit || 'Caja'}</b> contiene <b>{data.conversion_factor || '1000'}</b> {data.base_unit || 'gramos'}.
                                </div>
                            </div>

                            <hr className="my-3 border-secondary-subtle" />

                            {/* 3. Usage Unit -> Base Conversion */}
                            <div className="mb-2">
                                <div className="form-check form-switch mb-2">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="toggleUsageUnit"
                                        checked={showUsageConfig}
                                        onChange={(e) => {
                                            const isChecked = e.target.checked;
                                            setShowUsageConfig(isChecked);
                                            if (!isChecked) {
                                                setData(d => ({ ...d, usage_unit: '', usage_factor: '' }));
                                            }
                                        }}
                                    />
                                    <label className="form-check-label small fw-bolder text-muted" htmlFor="toggleUsageUnit">
                                        3. Uso (Vista) <span className="text-muted fw-normal fst-italic ms-1"></span>
                                    </label>
                                </div>

                                {showUsageConfig && (
                                    <>
                                        {/* Calculation Mode Toggle */}
                                        <div className="d-flex gap-3 mb-2 ps-1">
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="usageCalcMode"
                                                    id="modeDirect"
                                                    checked={usageCalcMode === 'direct'}
                                                    onChange={() => setUsageCalcMode('direct')}
                                                />
                                                <label className="form-check-label small text-muted" htmlFor="modeDirect">
                                                    Peso Individual
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="usageCalcMode"
                                                    id="modePurchase"
                                                    checked={usageCalcMode === 'purchase'}
                                                    disabled={!data.conversion_factor || !data.purchase_unit}
                                                    onChange={() => setUsageCalcMode('purchase')}
                                                />
                                                <label className={`form-check-label small ${!data.conversion_factor ? 'text-muted opacity-50' : 'text-muted'}`} htmlFor="modePurchase">
                                                    Contenido de {data.purchase_unit || 'Compra'}
                                                </label>
                                            </div>
                                        </div>

                                        <div className="d-flex align-items-center gap-2">
                                            <div style={{ flex: 1 }}>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm input-clean"
                                                    placeholder="Ej. Unidad, Porción"
                                                    value={data.usage_unit || ''}
                                                    onChange={(e) => setData('usage_unit', e.target.value)}
                                                />
                                            </div>
                                            <div className="text-muted fw-bold">=</div>
                                            <div style={{ flex: 1 }}>
                                                <div className="input-group input-group-sm">
                                                    {usageCalcMode === 'purchase' ? (
                                                        // Purchase Mode: Input quantity per purchase unit
                                                        <input
                                                            type="number"
                                                            className="form-control form-control-sm"
                                                            placeholder="Cant."
                                                            value={data.usage_factor && data.conversion_factor ? Math.round(data.conversion_factor / data.usage_factor) : ''}
                                                            onChange={(e) => {
                                                                const qty = parseFloat(e.target.value);
                                                                if (qty > 0 && data.conversion_factor) {
                                                                    // Calculate weight per unit: Total Weight / Total Qty
                                                                    const weightPerUnit = data.conversion_factor / qty;
                                                                    setData('usage_factor', weightPerUnit);
                                                                } else {
                                                                    setData('usage_factor', '');
                                                                }
                                                            }}
                                                        />
                                                    ) : (
                                                        // Direct Mode: Input weight per unit
                                                        <input
                                                            type="number"
                                                            className="form-control form-control-sm"
                                                            placeholder="20"
                                                            value={data.usage_factor ? parseFloat(Number(data.usage_factor).toFixed(4)) : ''}
                                                            onChange={(e) => setData('usage_factor', e.target.value)}
                                                        />
                                                    )}

                                                    <span className="input-group-text bg-light text-muted">
                                                        {usageCalcMode === 'purchase' ? (data.usage_unit || 'Unidades') : (data.base_unit || 'Base')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-text mt-1" style={{ fontSize: '0.75rem' }}>
                                            {usageCalcMode === 'purchase' ? (
                                                <>Ej: 1 <b>{data.purchase_unit || 'Caja'}</b> trae <b>{data.usage_factor && data.conversion_factor ? Math.round(data.conversion_factor / data.usage_factor) : '56'}</b> {data.usage_unit || (['ml', 'l'].includes(data.base_unit) ? 'Baldes' : (data.base_unit === 'un' ? 'Packs' : 'Unidades'))}.</>
                                            ) : (
                                                <>Ej: 1 <b>{data.usage_unit || (['ml', 'l'].includes(data.base_unit) ? 'Balde' : (data.base_unit === 'un' ? 'Pack' : 'Unidad'))}</b> {['ml', 'l'].includes(data.base_unit) || data.base_unit === 'un' ? 'trae' : 'pesa'} <b>{data.usage_factor ? parseFloat(Number(data.usage_factor).toFixed(2)) : '20'}</b> {data.base_unit || 'gramos'}.</>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="mb-3">
                        <label htmlFor="stock" className="form-label">
                            {data.type === 'supply' && data.purchase_unit
                                ? `Stock Inicial (en ${data.purchase_unit}s)`
                                : 'Stock Inicial'}
                        </label>
                        <input
                            type="number"
                            className="form-control input-clean input-natural"
                            id="stock"
                            min="0"
                            step="1"
                            required
                            value={data.type === 'supply' && data.conversion_factor && data.conversion_factor > 0
                                ? (data.stock === '' ? '' : Math.floor(data.stock / data.conversion_factor)) // Display in Purchase Units, integer only
                                : data.stock}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val === '') {
                                    setData('stock', '');
                                } else if (data.type === 'supply' && data.conversion_factor && data.conversion_factor > 0) {
                                    // Save as Usage Units
                                    setData('stock', parseInt(val) * data.conversion_factor);
                                } else {
                                    setData('stock', parseInt(val));
                                }
                            }}
                        />
                        {data.type === 'supply' && data.conversion_factor && (
                            <div className="mt-2 p-2 bg-light border rounded small">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                    <span className="text-muted">Stock Técnico (Interno):</span>
                                    <span className="fw-bold font-monospace">
                                        {data.stock ? parseFloat(Number(data.stock).toFixed(2)) : 0} {data.base_unit || 'g/ml'}
                                    </span>
                                </div>
                                {data.usage_factor > 0 && data.usage_unit && (
                                    <div className="d-flex justify-content-between align-items-center text-primary border-top pt-1 mt-1 border-secondary-subtle">
                                        <span>
                                            <i className="bi bi-calculator me-1"></i>
                                            Equivalencia ({data.usage_unit}):
                                        </span>
                                        <span className="fw-bold">
                                            ≈ {data.stock ? Math.floor(Number(data.stock) / Number(data.usage_factor)) : 0}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>


                </form>
            </Drawer>
        </MainLayout >
    );
}
