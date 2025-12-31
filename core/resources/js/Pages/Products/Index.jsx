import React, { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import Drawer from '@/Components/Drawer';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Index({ products }) {
    const [showDrawer, setShowDrawer] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const { data, setData, post, processing, errors, reset } = useForm({
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

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('product.store'), {
            onSuccess: () => {
                setShowDrawer(false);
                reset();
            }
        });
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
                                    <th style={{ width: '40px' }}>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="selectAll"
                                                checked={selectedProducts.length === products.length && products.length > 0}
                                                onChange={handleSelectAll}
                                            />
                                        </div>
                                    </th>
                                    <th scope="col">#</th>
                                    <th scope="col">Producto</th>
                                    <th scope="col">Precio</th>
                                    <th scope="col">Stock</th>
                                    <th scope="col" className="text-end">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product, index) => (
                                    <tr key={product.id}>
                                        <td>
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    name="id_produk[]"
                                                    type="checkbox"
                                                    value={product.id}
                                                    checked={selectedProducts.includes(product.id)}
                                                    onChange={() => handleSelectProduct(product.id)}
                                                />
                                            </div>
                                        </td>
                                        <td className="text-muted font-monospace">{index + 1}</td>
                                        <td className="fw-medium">{product.name}</td>
                                        <td className="font-tabular fw-semibold">{formatCurrency(product.price)}</td>
                                        <td>
                                            <span className="fw-medium">
                                                {product.stock} u.
                                            </span>
                                        </td>
                                        <td className="text-end">
                                            <button className="btn btn-sm text-muted me-1" title="Editar">
                                                <i className="bi bi-pencil-square"></i>
                                            </button>
                                            <button className="btn btn-sm text-danger" title="Eliminar">
                                                <i className="bi bi-trash-fill"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Drawer
                isOpen={showDrawer}
                onClose={() => setShowDrawer(false)}
                title="Nuevo Producto"
                footer={
                    <>
                        <button type="button" className="btn btn-light" onClick={() => setShowDrawer(false)}>Cancelar</button>
                        <button type="button" className="btn btn-primary" onClick={handleSubmit}>Guardar Producto</button>
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
                            className="form-control font-monospace"
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
                            className="form-control font-monospace"
                            id="stock"
                            min="0"
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
