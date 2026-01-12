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
    const { data, setData, post, put, processing, errors, reset, delete: destroy } = useForm({
        name: '',
        type: 'single',
        price: '',
        stock: '',
        purchase_unit: '',
        usage_unit: '',
        conversion_factor: '',
    });

    const formatCurrency = (amount, decimals = 0) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
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
        setData({
            name: product.name,
            type: product.type || 'single',
            price: product.price ? parseFloat(product.price) : '',
            stock: product.stock ? parseFloat(product.stock) : '',
            purchase_unit: product.purchase_unit,
            usage_unit: product.usage_unit,
            conversion_factor: product.conversion_factor ? parseFloat(product.conversion_factor) : '',
        });
        setShowDrawer(true);
    };

    const openEditDrawer = (product) => {
        setEditingProduct(product);
        setData({
            name: product.name,
            type: product.type || 'single',
            price: product.price ? parseFloat(product.price) : '',
            stock: product.stock ? parseFloat(product.stock) : '',
            purchase_unit: product.purchase_unit,
            usage_unit: product.usage_unit,
            conversion_factor: product.conversion_factor ? parseFloat(product.conversion_factor) : '',
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
                        <table className="table-minimal">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Precio</th>
                                    <th scope="col">Costo</th>
                                    <th scope="col">Stock</th>
                                    <th scope="col" className="text-end">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.data.map((product, index) => (
                                    <tr key={product.id}>
                                        <td className="text-muted">{(products.current_page - 1) * products.per_page + index + 1}</td>
                                        <td className="fw-medium">
                                            <div className="d-flex align-items-center gap-2">
                                                {product.name}
                                                {product.type === 'supply' && (
                                                    <span className="badge bg-secondary-subtle text-secondary" style={{ fontSize: '0.65rem' }}>INSUMO</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="font-tabular fw-semibold">
                                            {product.price ? formatCurrency(product.price) : <span className="text-muted">-</span>}
                                        </td>
                                        <td className="font-tabular text-muted">{formatCurrency(product.cost, 2)}</td>
                                        <td>
                                            <div className="d-flex flex-column">
                                                <div className="d-flex align-items-center gap-2">
                                                    <span
                                                        className={`rounded-circle ${product.stock > 10 ? 'bg-success' : product.stock > 0 ? 'bg-warning' : 'bg-danger'}`}
                                                        style={{ width: '8px', height: '8px', display: 'inline-block' }}
                                                    ></span>
                                                    <span className="fw-medium">
                                                        {Number(product.stock).toLocaleString()} {product.usage_unit || 'Unidades'}
                                                    </span>
                                                </div>
                                                {product.type === 'supply' && (
                                                    <div className="d-flex flex-column">
                                                        <small className="text-muted mt-1" style={{ fontSize: '0.7rem' }}>
                                                            ~{parseFloat((product.stock / (product.conversion_factor || 1)).toFixed(1))} {product.purchase_unit || 'Packs'}
                                                        </small>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="text-end">
                                            <div className="d-flex justify-content-end gap-2">
                                                <button
                                                    className="btn btn-icon-only bg-transparent border-0"
                                                    onClick={() => openEditDrawer(product)}
                                                    title="Editar"
                                                >
                                                    <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--text-muted)' }}>edit_square</span>
                                                </button>
                                                <button
                                                    className="btn btn-icon-only bg-transparent border-0"
                                                    onClick={() => handleDelete(product.id)}
                                                    title="Eliminar"
                                                >
                                                    <span className="material-symbols-outlined" style={{ fontSize: '22px', color: 'var(--text-muted)', transform: 'translateY(-1px)' }}>delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {products.data.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4 text-muted">
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
                            <div className="form-text mt-1" style={{ fontSize: '0.8rem' }}>
                                Equivale a {data.stock ? parseFloat(Number(data.stock).toFixed(2)) : 0} {data.usage_unit || 'Unidades'}
                            </div>
                        )}
                    </div>

                    {data.type === 'supply' && (
                        <div className="p-3 rounded mb-3">
                            <h6 className="text-uppercase small fw-bold text-muted mb-3">Configuración de Inventario</h6>

                            <div className="mb-3">
                                <label htmlFor="purchase_unit" className="form-label small">Unidad de Compra</label>
                                <input
                                    type="text"
                                    className="form-control input-clean"
                                    id="purchase_unit"
                                    value={data.purchase_unit || ''}
                                    onChange={(e) => setData('purchase_unit', e.target.value)}
                                    placeholder="Ej. Pack, Caja, Bolsa"
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="usage_unit" className="form-label small">Unidad de Uso</label>
                                <input
                                    type="text"
                                    className="form-control input-clean"
                                    id="usage_unit"
                                    value={data.usage_unit || ''}
                                    onChange={(e) => setData('usage_unit', e.target.value)}
                                    placeholder="Ej. Feta, Unidad, Gramo"
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="conversion_factor" className="form-label small">Factor de Conversión</label>
                                <input
                                    type="number"
                                    className="form-control input-clean input-natural"
                                    id="conversion_factor"
                                    min="1"
                                    step="1"
                                    value={data.conversion_factor || ''}
                                    onChange={(e) => {
                                        const newFactor = parseInt(e.target.value) || 0;
                                        // Calculate current Packs based on OLD factor (or current stock if factor was missing)
                                        const currentPacks = (data.stock && data.conversion_factor)
                                            ? data.stock / data.conversion_factor
                                            : 0;

                                        setData(prev => ({
                                            ...prev,
                                            conversion_factor: newFactor,
                                            // Update stock (Units) to maintain the same number of Packs with the NEW factor
                                            stock: currentPacks ? currentPacks * newFactor : prev.stock
                                        }));
                                    }}
                                    placeholder="Ej. 8"
                                />
                                <div className="form-text mt-2" style={{ fontSize: '0.8rem' }}>
                                    1 {data.purchase_unit || 'Pack'} contiene {data.conversion_factor || 'X'} {data.usage_unit || 'Unidades'}
                                </div>
                            </div>
                        </div>
                    )}
                </form>
            </Drawer>
        </MainLayout >
    );
}
