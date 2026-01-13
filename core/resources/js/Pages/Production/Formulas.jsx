import React, { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import Drawer from '@/Components/Drawer';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Formulas({ formulas, supplies }) {
    const [editingFormula, setEditingFormula] = useState(null);
    const [showDrawer, setShowDrawer] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        id: null,
        name: '',
        usage_unit: '',
        ingredients: [] // { id, quantity }
    });

    const openDrawer = (formula = null) => {
        if (formula) {
            setEditingFormula(formula);
            setData({
                id: formula.id,
                name: formula.name,
                usage_unit: formula.usage_unit || '',
                ingredients: formula.components.map(c => ({
                    id: c.child_product_id,
                    quantity: parseFloat(c.quantity)
                }))
            });
        } else {
            setEditingFormula(null);
            setData({
                id: null,
                name: '',
                usage_unit: '',
                ingredients: [{ id: '', quantity: '' }]
            });
        }
        setShowDrawer(true);
    };

    const handleClose = () => {
        setShowDrawer(false);
        setEditingFormula(null);
        reset();
    };

    const addIngredientRow = () => {
        setData('ingredients', [...data.ingredients, { id: '', quantity: '' }]);
    };

    const removeIngredientRow = (index) => {
        const newIngs = [...data.ingredients];
        newIngs.splice(index, 1);
        setData('ingredients', newIngs);
    };

    const updateIngredient = (index, field, value) => {
        const newIngs = [...data.ingredients];
        newIngs[index][field] = value;
        setData('ingredients', newIngs);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Usamos transform() para calcular la cantidad final basada en la unidad seleccionada antes de enviar
        post(route('production.storeFormula'), {
            forceFormData: false,
            preserveScroll: true,
            transform: (data) => ({
                ...data,
                ingredients: data.ingredients.map(ing => {
                    const supply = supplies.find(s => s.id == ing.id);
                    let finalQty = parseFloat(ing.quantity);

                    // Convertir a Unidad Base si se seleccionó usar la unidad de compra/uso
                    if (ing.use_usage_unit && supply && supply.usage_factor) {
                        finalQty = finalQty * parseFloat(supply.usage_factor);
                    }
                    return { id: ing.id, quantity: finalQty };
                })
            }),
            onSuccess: () => {
                handleClose();
                if (window.toast) {
                    window.toast.success(editingFormula ? 'Fórmula actualizada' : 'Fórmula creada');
                }
            }
        });
    };

    return (
        <MainLayout>
            <Head title="Gestionar Fórmulas" />
            <div className="container-fluid pt-4 px-4">

                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <Link href={route('production.index')} className="text-muted text-decoration-none small mb-1 d-block">
                            <i className="bi bi-arrow-left me-1"></i>Volver a Cocina
                        </Link>
                        <h4 className="mb-0 fw-bold">Recetas / Fórmulas</h4>
                    </div>
                    <button className="btn btn-primary rounded-pill px-3" onClick={() => openDrawer()}>
                        <i className="bi bi-plus-lg me-2"></i>Nueva Fórmula
                    </button>
                </div>

                <div className="card-minimal">
                    <div className="table-responsive">
                        <table className="table-minimal">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Unidad</th>
                                    <th>Ingredientes</th>
                                    <th className="text-end">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {formulas.map(formula => (
                                    <tr key={formula.id}>
                                        <td className="fw-bold">{formula.name}</td>
                                        <td>{formula.usage_unit}</td>
                                        <td>
                                            <div className="d-flex flex-wrap gap-1">
                                                {formula.components.map(comp => (
                                                    <span key={comp.id} className="badge bg-transparent border text-adaptive-contrast">
                                                        {parseFloat(comp.quantity)} {comp.child_product?.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="text-end">
                                            <button
                                                className="btn btn-icon-only bg-transparent border-0"
                                                onClick={() => openDrawer(formula)}
                                                title="Editar"
                                            >
                                                <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--text-muted)' }}>edit_square</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {formulas.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="text-center py-4 text-muted">
                                            No hay fórmulas registradas.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <Drawer
                    isOpen={showDrawer}
                    onClose={handleClose}
                    title={editingFormula ? 'Editar Fórmula' : 'Nueva Fórmula'}
                    footer={
                        <>
                            <button type="button" className="btn btn-light" onClick={handleClose}>Cancelar</button>
                            <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={processing}>
                                Guardar Fórmula
                            </button>
                        </>
                    }
                >
                    <div className="mb-3">
                        <label className="form-label">Nombre del Producto (Resultado)</label>
                        <input
                            type="text"
                            className="form-control input-clean"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            placeholder="Ej. Salsa Cheddar Casera"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="form-label">Unidad de Medida (Stock)</label>
                        <input
                            type="text"
                            className="form-control input-clean"
                            value={data.usage_unit}
                            onChange={e => setData('usage_unit', e.target.value)}
                            placeholder="Ej. Litros"
                        />
                    </div>

                    <h6 className="fw-bold mb-3">Ingredientes</h6>
                    <div className="table-responsive mb-3">
                        <table className="table table-sm table-borderless align-middle">
                            <thead className="text-muted small text-uppercase" style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <tr>
                                    <th style={{ width: '40%' }}>Insumo</th>
                                    <th style={{ width: '25%' }}>Cantidad</th>
                                    <th style={{ width: '25%' }}>Unidad</th>
                                    <th style={{ width: '10%' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.ingredients.map((ing, index) => {
                                    const supply = supplies.find(s => s.id == ing.id);
                                    const hasUsageUnit = supply && supply.usage_unit;
                                    const baseUnitName = supply?.base_unit || 'Base';

                                    return (
                                        <tr key={index} style={{ borderBottom: '1px solid var(--bs-border-color)' }}>
                                            <td className="py-3">
                                                <select
                                                    className="form-select form-select-sm input-clean"
                                                    value={ing.id}
                                                    onChange={e => {
                                                        updateIngredient(index, 'id', e.target.value);
                                                        updateIngredient(index, 'use_usage_unit', false);
                                                    }}
                                                    required
                                                >
                                                    <option value="">Seleccionar...</option>
                                                    {supplies.map(s => (
                                                        <option key={s.id} value={s.id}>{s.name}</option>
                                                    ))}
                                                </select>
                                                {hasUsageUnit && ing.use_usage_unit && (
                                                    <div className="small text-muted mt-1">
                                                        <i className="bi bi-arrow-return-right me-1"></i>
                                                        = {parseFloat(ing.quantity || 0) * parseFloat(supply.usage_factor)} {baseUnitName}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-3">
                                                <input
                                                    type="number"
                                                    className="form-control form-control-sm input-clean text-center"
                                                    placeholder="0"
                                                    value={ing.quantity}
                                                    onChange={e => updateIngredient(index, 'quantity', e.target.value)}
                                                    step="0.001"
                                                    required
                                                />
                                            </td>
                                            <td className="py-3">
                                                {hasUsageUnit ? (
                                                    <select
                                                        className="form-select form-select-sm input-clean"
                                                        value={ing.use_usage_unit ? 'true' : 'false'}
                                                        onChange={(e) => updateIngredient(index, 'use_usage_unit', e.target.value === 'true')}
                                                    >
                                                        <option value="false">{baseUnitName}</option>
                                                        <option value="true">{supply.usage_unit}</option>
                                                    </select>
                                                ) : (
                                                    <span className="small text-muted">{baseUnitName}</span>
                                                )}
                                            </td>
                                            <td className="py-3 text-end">
                                                <button
                                                    type="button"
                                                    className="btn btn-icon-only bg-transparent border-0 p-0"
                                                    onClick={() => removeIngredientRow(index)}
                                                    title="Eliminar"
                                                >
                                                    <span className="material-symbols-outlined text-danger" style={{ fontSize: '20px' }}>delete</span>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {data.ingredients.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="text-center text-muted py-4 small">
                                            No hay ingredientes agregados
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <button type="button" className="btn btn-sm btn-outline-secondary w-100 dashed-border" onClick={addIngredientRow}>
                        + Agregar Ingrediente
                    </button>
                </Drawer>

            </div >
        </MainLayout >
    );
}
