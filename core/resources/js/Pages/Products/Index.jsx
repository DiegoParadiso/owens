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
        price: '',
        stock: '',
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
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
            price: product.price,
            stock: product.stock,
        });
        setShowDrawer(true);
    };

    const openEditDrawer = (product) => {
        setEditingProduct(product);
        setData({
            name: product.name,
            price: product.price,
            stock: product.stock,
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
                        <button className="btn btn-outline-secondary btn-sm rounded-pill px-3">
                            <i className="bi bi-printer me-2"></i>Imprimir Etiquetas
                        </button>
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
                                        <td className="fw-medium">{product.name}</td>
                                        <td className="font-tabular fw-semibold">{formatCurrency(product.price)}</td>
                                        <td className="font-tabular text-muted">{formatCurrency(product.cost)}</td>
                                        <td>
                                            <span className={`badge ${product.stock > 10 ? 'bg-success-subtle text-success' : product.stock > 0 ? 'bg-warning-subtle text-warning' : 'bg-danger-subtle text-danger'}`}>
                                                {product.stock} unidades
                                            </span>
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
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Nombre del Producto</label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            required
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Ej. Hamburguesa Doble"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="price" className="form-label">Precio de Venta ($)</label>
                        <input
                            type="number"
                            className="form-control"
                            id="price"
                            min="0"
                            required
                            value={data.price}
                            onChange={(e) => setData('price', e.target.value)}
                            placeholder="0.00"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="stock" className="form-label">Stock Inicial</label>
                        <input
                            type="number"
                            className="form-control"
                            id="stock"
                            min="0"
                            step="1"
                            required
                            value={data.stock}
                            onChange={(e) => setData('stock', e.target.value)}
                            placeholder="0"
                        />
                    </div>
                </form>
            </Drawer>
        </MainLayout>
    );
}
