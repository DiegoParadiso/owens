import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import Drawer from '@/Components/Drawer';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Index({ products, history }) {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showDrawer, setShowDrawer] = useState(false);

    // Form handling
    const { data, setData, post, processing, reset, errors } = useForm({
        product_id: '',
        quantity: ''
    });

    const openProductionDrawer = (product) => {
        setSelectedProduct(product);
        setData({
            product_id: product.id,
            quantity: ''
        });
        setShowDrawer(true);
    };

    const handleCloseDrawer = () => {
        setShowDrawer(false);
        setSelectedProduct(null);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowDrawer(false); // Close immediately for better UX

        post(route('production.store'), {
            preserveScroll: true,
            onSuccess: () => {
                handleCloseDrawer();
                if (window.toast) {
                    window.toast.success('Producción registrada', `Se han producido ${data.quantity} unidades correctamente.`);
                }
            },
            onError: (errors) => {
                setShowDrawer(true); // Re-open on error
                console.error(errors);
                if (window.toast) {
                    window.toast.error('Error', 'No se pudo registrar la producción. Verifica el stock de los ingredientes.');
                }
            }
        });
    };

    // Calculate estimated production based on input quantity
    const getIngredientStatus = () => {
        if (!selectedProduct || !data.quantity) return [];

        const qty = parseFloat(data.quantity);
        if (isNaN(qty) || qty <= 0) return [];

        return selectedProduct.components.map(comp => {
            const required = comp.quantity * qty;
            const available = comp.stock;
            const isEnough = available >= required;

            return {
                ...comp,
                required,
                available,
                isEnough
            };
        });
    };

    const ingredientStatus = getIngredientStatus();
    const canProduce = ingredientStatus.every(i => i.isEnough);

    return (
        <MainLayout>
            <Head title="Cocina / Producción" />
            <div className="container-fluid pt-4 px-4">

                {/* Header Actions */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="mb-0 fw-bold">Cocina</h4>
                    <Link href={route('production.formulas')} className="btn btn-outline-primary rounded-pill px-3">
                        <i className="bi bi-gear-fill me-2"></i>Gestionar Fórmulas
                    </Link>
                </div>

                {/* Production Grid */}
                <div className="row g-4">
                    {products.length > 0 ? (
                        products.map(product => (
                            <div key={product.id} className="col-12 col-md-6 col-lg-4 col-xl-3">
                                <div
                                    className="card h-100 border-0 shadow-sm hover-scale cursor-pointer"
                                    onClick={() => openProductionDrawer(product)}
                                    style={{ transition: 'transform 0.2s', background: 'var(--bg-card)' }}
                                >
                                    <div className="card-body d-flex flex-column align-items-center text-center p-4">
                                        <div className="mb-3 text-primary">
                                            <span className="material-symbols-outlined" style={{ fontSize: '42px' }}>skillet</span>
                                        </div>
                                        <h5 className="card-title fw-bold mb-1">{product.name}</h5>
                                        <p className="text-muted small mb-3">
                                            Stock actual: <span className="fw-bold text-dark">{product.stock} {product.usage_unit}</span>
                                        </p>

                                        <div className="mt-auto w-100">
                                            <div className="d-flex justify-content-between text-muted small mb-1">
                                                <span className="text-nowrap">Disponible:</span>
                                                <span className="fw-bold">{product.max_producible > 9000 ? '∞' : product.max_producible}</span>
                                            </div>
                                            <div className="progress" style={{ height: '6px' }}>
                                                <div
                                                    className={`progress-bar ${product.max_producible > 0 ? 'bg-success' : 'bg-danger'}`}
                                                    role="progressbar"
                                                    style={{ width: '100%' }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center py-5">
                            <div className="text-muted mb-3">
                                <i className="bi bi-journal-x" style={{ fontSize: '3rem' }}></i>
                            </div>
                            <h5>No hay fórmulas definidas</h5>
                            <p className="text-muted">Crea recetas intermedias (salsas, panes, blends) para empezar a producir.</p>
                            <Link href={route('production.formulas')} className="btn btn-primary mt-2">
                                Crear mi primera fórmula
                            </Link>
                        </div>
                    )}
                </div>

                {/* Recent History */}
                <div className="mt-5">
                    <h5 className="fw-bold mb-3">Historial Reciente</h5>
                    <div className="card-minimal">
                        <div className="table-responsive">
                            <table className="table-minimal">
                                <thead>
                                    <tr>
                                        <th>Hora</th>
                                        <th>Producto</th>
                                        <th>Cantidad</th>
                                        <th>Detalle</th>
                                        <th>Usuario</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {history && history.length > 0 ? (
                                        history.map(log => (
                                            <tr key={log.id}>
                                                <td className="text-muted" style={{ whiteSpace: 'nowrap' }}>
                                                    {new Date(log.created_at).toLocaleString()}
                                                </td>
                                                <td className="fw-medium">{log.product_name}</td>
                                                <td className="fw-bold text-success">+{parseFloat(log.quantity)}</td>
                                                <td className="text-muted small">{log.description}</td>
                                                <td><small className="badge bg-transparent border text-adaptive-contrast">{log.user_name}</small></td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center py-3 text-muted">
                                                No hay movimientos de producción recientes
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Production Drawer */}
                <Drawer
                    isOpen={showDrawer}
                    onClose={handleCloseDrawer}
                    title={selectedProduct ? `Producir ${selectedProduct.name}` : 'Producción'}
                    footer={
                        <>
                            <button type="button" className="btn btn-secondary" onClick={handleCloseDrawer}>Cancelar</button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleSubmit}
                                disabled={processing || !canProduce || !data.quantity || data.quantity <= 0}
                            >
                                {processing ? 'Procesando...' : 'Confirmar Producción'}
                            </button>
                        </>
                    }
                >
                    <div className="text-center mb-4">
                        <label className="form-label text-muted text-uppercase small fw-bold spacing-2 mb-3">Cantidad a Producir</label>
                        <div className="d-flex justify-content-center align-items-baseline gap-2">
                            <input
                                type="number"
                                className="form-control border-0 border-bottom border-2 rounded-0 text-center fw-bold p-0 text-body-emphasis bg-transparent"
                                style={{ fontSize: '3rem', width: '140px', boxShadow: 'none' }}
                                value={data.quantity}
                                onChange={e => setData('quantity', e.target.value === '' ? '' : parseInt(e.target.value))}
                                placeholder="0"
                                min="1"
                                step="1"
                                autoFocus
                            />
                            <span className="text-muted fw-bold" style={{ fontSize: '1.25rem' }}>
                                {selectedProduct?.usage_unit || 'u'}
                            </span>
                        </div>
                        {selectedProduct && (
                            <div className={`mt-2 small fw-bold ${selectedProduct.max_producible > 0 ? 'text-success' : 'text-danger'}`}>
                                Máximo posible: {Math.floor(selectedProduct.max_producible) > 9000 ? '∞' : Math.floor(selectedProduct.max_producible)}
                            </div>
                        )}
                    </div>

                    {data.quantity > 0 && ingredientStatus.length > 0 && (
                        <div className="mb-3">
                            <h6 className="fw-bold mb-3 px-2">Consumo de Ingredientes</h6>
                            <div className="table-responsive rounded-3 border">
                                <table className="table table-borderless align-middle mb-0">
                                    <thead className="bg-body-tertiary">
                                        <tr>
                                            <th className="fw-bold text-uppercase text-muted small ps-3 py-2">Ingrediente</th>
                                            <th className="fw-bold text-uppercase text-muted small text-end py-2">Stock</th>
                                            <th className="fw-bold text-uppercase text-muted small text-end pe-3 py-2">Consumo</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ingredientStatus.map((ing, index) => (
                                            <tr key={ing.id} style={{ borderBottom: index === ingredientStatus.length - 1 ? 'none' : '1px solid var(--border-color)' }}>
                                                <td className="ps-3 py-2">
                                                    <div className="fw-medium text-body-emphasis small">{ing.name}</div>
                                                </td>
                                                <td className="text-end py-2 small text-muted">
                                                    <span className={!ing.isEnough ? 'text-danger fw-bold' : ''}>
                                                        {Math.floor(ing.available)} {ing.unit}
                                                    </span>
                                                </td>
                                                <td className="text-end pe-3 py-2 fw-bold text-body-emphasis small">
                                                    -{Math.ceil(ing.required)} {ing.unit}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {!canProduce && (
                                <div className="alert alert-danger d-flex align-items-center mt-3 py-2 px-3 small border-0 alert-stock-warning">
                                    <span className="material-symbols-outlined me-2 fill-icon" style={{ fontSize: '18px' }}>error</span>
                                    <div>
                                        <strong>Stock insuficiente.</strong> Revisa los ingredientes marcados.
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </Drawer>

            </div>
        </MainLayout>
    );
}
