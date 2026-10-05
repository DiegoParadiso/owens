import React, { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import Drawer from '@/Components/Drawer';
import CurrencyInput from '@/Components/CurrencyInput';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import Swal from 'sweetalert2';

import Pagination from '@/Components/Pagination';

import ComingSoon from '@/Pages/ComingSoon';

export default function Index({ products }) {
    return <ComingSoon title="Sección en Construcción" />;
    const { system_mode, manage_stock } = usePage().props;
    const isManageStock = String(manage_stock) !== 'false';
    const [showDrawer, setShowDrawer] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const { data, setData, post, put, processing, errors, reset, transform, delete: destroy } = useForm({
        name: '',
        type: 'single',
        price: '',
        stock: '',
    });

    // Search State
    const [searchQuery, setSearchQuery] = useState(new URLSearchParams(window.location.search).get('search') || '');
    const [isFocused, setIsFocused] = useState(false);

    const handleSearch = (query = searchQuery) => {
        router.get(
            route('product.index'),
            { search: query },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    const handleClear = () => {
        setSearchQuery('');
        handleSearch('');
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    const cleanCurrency = (val) => {
        if (!val) return '';
        if (typeof val === 'number') return val;
        return parseFloat(String(val).replace(/[$,]/g, '')) || '';
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
            price: product.price ? String(product.price) : '', // Ensure string for input
            stock: product.stock !== null ? parseFloat(product.stock) : '',
        });
        setShowDrawer(true);
    };

    const openEditDrawer = (product) => {
        setEditingProduct(product);
        setData({
            name: product.name,
            type: product.type || 'single',
            price: product.price ? String(product.price) : '', // Ensure string for input
            stock: product.stock !== null ? parseFloat(product.stock) : '',
        });
        setShowDrawer(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowDrawer(false);

        transform((data) => ({
            ...data,
            price: cleanCurrency(data.price),
            stock: isManageStock ? data.stock : 0,
        }));

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
                    <button
                        className="btn btn-primary rounded-pill px-3"
                        onClick={() => setShowDrawer(true)}
                    >
                        <i className="bi bi-plus-lg me-2"></i>Agregar Producto
                    </button>
                </div>

                <div className="card-minimal">
                    <div className="mb-4">
                        <div
                            className={`d-flex align-items-center rounded-3 ps-3 pe-2 py-0 transition-all bg-white ${isFocused ? 'border-primary ring-2 ring-primary-100' : ''}`}
                            style={{
                                transition: 'all 0.2s ease-in-out',
                                height: '38px' // Explicit height constraint for compacter look
                            }}
                        >
                            <i className={`bi bi-search me-2 transition-colors ${isFocused ? 'text-primary' : 'text-muted'}`}></i>
                            <input
                                type="text"
                                className="form-control border-0 bg-transparent shadow-none p-0 py-1"
                                placeholder="Buscar productos..."
                                style={{
                                    fontSize: '0.95rem'
                                }}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            {searchQuery && (
                                <button
                                    className="btn btn-link text-decoration-none p-0 me-2 text-muted opacity-50 hover-opacity-100"
                                    type="button"
                                    onClick={handleClear}
                                    title="Limpiar búsqueda"
                                    style={{ border: 'none' }}
                                >
                                    <i className="bi bi-x-circle-fill" style={{ fontSize: '1rem' }}></i>
                                </button>
                            )}
                            <div className="vr mx-2 text-muted opacity-25" style={{ height: '20px' }}></div>
                            <button
                                className={`btn btn-link text-decoration-none px-2 fw-semibold transition-colors ${isFocused ? 'text-primary' : 'text-muted'}`}
                                type="button"
                                onClick={() => handleSearch()}
                                style={{ fontSize: '0.85rem' }}
                            >
                                BUSCAR
                            </button>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table-minimal align-top">
                            <thead>
                                <tr>
                                    <th scope="col">Nombre</th>
                                    <th scope="col" className="text-end">Precio</th>
                                    {isManageStock && <th scope="col" className="text-end">Stock</th>}
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
                                                    <span className="badge bg-secondary-subtle text-secondary" style={{ fontSize: '0.65rem' }}>
                                                        {system_mode === 'normal' ? 'VENTA FIJA' : 'INSUMO'}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="font-tabular fw-semibold text-end">
                                            {(product.type === 'single' || (product.type === 'supply' && system_mode === 'normal')) && product.price ? formatCurrency(product.price) : <span className="text-muted">-</span>}
                                        </td>

                                        {isManageStock && (
                                            <td className="text-end">
                                                {product.type === 'supply' && system_mode === 'normal' ? (
                                                    <span className="text-muted fst-italic">-</span>
                                                ) : (
                                                    <div className="d-flex flex-column align-items-end">
                                                        <div className="d-flex align-items-center gap-2 justify-content-end">
                                                            <span
                                                                className={`rounded-circle ${product.stock > 10 ? 'bg-success' : product.stock > 0 ? 'bg-warning' : 'bg-danger'}`}
                                                                style={{ width: '8px', height: '8px', display: 'inline-block' }}
                                                            ></span>
                                                            <span className="fw-medium">
                                                                {Number(product.stock).toLocaleString()} Unidades
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                        )}
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
                                        <td colSpan={isManageStock ? "4" : "3"} className="text-center py-4 text-muted">
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

                    {(data.type === 'single' || (data.type === 'supply' && system_mode === 'normal')) && (
                        <div className="mb-3">
                            <label htmlFor="price" className="form-label">Precio de Venta</label>
                            <CurrencyInput
                                className="form-control input-clean"
                                id="price"
                                required
                                value={data.price}
                                onChange={(e) => setData('price', e.target.value)}
                                placeholder="$0.00"
                            />
                        </div>
                    )}

                    {(data.type === 'single' || (data.type === 'supply' && system_mode !== 'normal')) && isManageStock && (
                        <div className="mb-3">
                            <label htmlFor="stock" className="form-label">
                                Stock Inicial
                            </label>
                            <input
                                type="text"
                                className="form-control input-clean input-natural"
                                id="stock"
                                min="0"
                                required
                                value={data.stock}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/[^0-9]/g, '');
                                    if (val === '') {
                                        setData('stock', '');
                                    } else {
                                        setData('stock', parseInt(val));
                                    }
                                }}
                            />
                        </div>
                    )}


                </form>
            </Drawer>
        </MainLayout >
    );
}
