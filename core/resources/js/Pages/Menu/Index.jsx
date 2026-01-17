import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import Drawer from '@/Components/Drawer';
import { Head, Link, useForm, router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import Pagination from '@/Components/Pagination';

export default function Index({ products = [], supplies = [], category = 'burger' }) {

    const [showDrawer, setShowDrawer] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [rows, setRows] = useState([{ id: Date.now(), child_product_id: '', quantity: 1 }]);

    // Map category to display name
    const categoryNames = {
        'burger': 'Hamburguesas',
        'extra': 'Extras',
        'combo': 'Combos'
    };

    const { data, setData, post, put, processing, errors, delete: destroy, reset } = useForm({
        name: '',
        price: '',
        category: category,
        items: [],
    });

    // Update form category when prop changes or drawer opens
    useEffect(() => {
        setData('category', category);
    }, [category]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    const addRow = () => {
        setRows([...rows, { id: Date.now(), child_product_id: '', quantity: 1, use_usage_unit: false }]);
    };

    const removeRow = (id) => {
        if (rows.length > 1) {
            setRows(rows.filter(row => row.id !== id));
        }
    };

    const updateRow = (id, field, value) => {
        const newRows = rows.map(row => {
            if (row.id === id) {
                if (typeof field === 'object') {
                    return { ...row, ...field };
                }
                return { ...row, [field]: value };
            }
            return row;
        });
        setRows(newRows);
        setData('items', newRows);
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setData({
            name: item.name,
            price: item.price,
            category: item.category,
            items: item.components || [],
        });

        // Load components into rows
        if (item.components && item.components.length > 0) {
            const itemRows = item.components.map((comp, idx) => ({
                id: Date.now() + idx,
                child_product_id: comp.child_product_id,
                quantity: parseFloat(comp.quantity),
                use_usage_unit: false
            }));
            setRows(itemRows);
        } else {
            setRows([{ id: Date.now(), child_product_id: '', quantity: 1, use_usage_unit: false }]);
        }

        setShowDrawer(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const validRows = rows.filter(row => row.child_product_id !== '');

        if (data.category === 'combo' && validRows.length === 0) {
            window.toast.warning('Advertencia', 'Un combo debe tener al menos un componente.');
            return;
        }

        setShowDrawer(false);

        const formData = {
            name: data.name,
            price: data.price,
            category: data.category,
            child_product_id: validRows.map(row => row.child_product_id),
            quantity: validRows.map(row => {
                let qty = parseFloat(row.quantity);
                const supply = supplies.find(s => s.id == row.child_product_id);
                if (supply && row.use_usage_unit && supply.usage_factor) {
                    qty = qty * (parseFloat(supply.usage_factor) || 1);
                }
                return qty;
            }),
        };

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                setEditingItem(null);
                reset();
                setRows([{ id: Date.now(), child_product_id: '', quantity: 1 }]);
                window.toast.success(editingItem ? 'Ítem actualizado' : 'Ítem guardado', 'La operación se realizó con éxito.');
            },
            onError: (errors) => {
                setShowDrawer(true);
                console.error('❌ ERROR! Errores:', errors);
                window.toast.error('Error', 'Ocurrió un error al guardar el ítem.');
            }
        };

        if (editingItem) {
            router.put(route('product.updateMenu', editingItem.id), formData, options);
        } else {
            router.post(route('product.storeMenu'), formData, options);
        }
    };

    const handleCloseDrawer = () => {
        setShowDrawer(false);
        setEditingItem(null);
        reset();
        setRows([{ id: Date.now(), child_product_id: '', quantity: 1 }]);
    };

    const handleDelete = (id) => {
        Swal.fire({
            text: "¿Eliminar este ítem?",
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
                        window.toast.success('Eliminado', 'El ítem ha sido eliminado correctamente.');
                    },
                });
            }
        });
    };

    const handleTabChange = (newCategory) => {
        router.get(route('product.indexMenu'), { category: newCategory }, { preserveState: true, preserveScroll: true });
    };

    return (
        <MainLayout>
            <Head title="Menú" />
            <div className="container-fluid pt-4 px-4">

                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="mb-0 fw-bold">Gestión del Menú</h4>
                    <button
                        className="btn btn-primary rounded-pill px-3"
                        onClick={() => {
                            setData('category', category); // Ensure current category is set
                            setShowDrawer(true);
                        }}
                    >
                        <i className="bi bi-plus-lg me-2"></i>Crear {categoryNames[category].slice(0, -1)}
                    </button>
                </div>

                {/* Tabs */}
                {/* Tabs */}
                <ul className="nav nav-tabs mb-4 border-bottom-0 gap-3">
                    <li className="nav-item">
                        <button
                            className={`nav-link border-0 bg-transparent px-0 ${category === 'burger' ? 'text-primary fw-bold' : 'text-muted'}`}
                            onClick={() => handleTabChange('burger')}
                        >
                            Hamburguesas
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link border-0 bg-transparent px-0 ${category === 'extra' ? 'text-primary fw-bold' : 'text-muted'}`}
                            onClick={() => handleTabChange('extra')}
                        >
                            Extras
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link border-0 bg-transparent px-0 ${category === 'combo' ? 'text-primary fw-bold' : 'text-muted'}`}
                            onClick={() => handleTabChange('combo')}
                        >
                            Combos
                        </button>
                    </li>
                </ul>

                <div className="card-minimal">
                    <div className="table-responsive">
                        <table className="table-minimal align-top">
                            <thead>
                                <tr>
                                    <th scope="col">Nombre</th>
                                    <th scope="col" className="text-end">Precio</th>
                                    <th scope="col">Receta / Componentes</th>
                                    <th scope="col" className="text-center" style={{ width: '100px' }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.data.map((item, index) => (
                                    <tr key={item.id}>
                                        <td className="fw-medium">{item.name}</td>
                                        <td className="font-tabular fw-bold text-end" style={{ fontSize: '1.05rem' }}>{formatCurrency(item.price)}</td>
                                        <td>
                                            <ul className="list-unstyled mb-0 small">
                                                {item.components && item.components.length > 0 ? (
                                                    item.components.map((component, idx) => (
                                                        component.child_product ? (
                                                            <li key={idx} className="mb-1">
                                                                <span className="text-muted">{parseFloat(component.quantity)}x</span> {component.child_product.name}
                                                            </li>
                                                        ) : null
                                                    ))
                                                ) : (
                                                    <li className="text-muted fst-italic">Sin componentes</li>
                                                )}
                                            </ul>
                                        </td>
                                        <td className="text-center">
                                            <div className="d-flex justify-content-center gap-1">
                                                <button
                                                    className="btn btn-icon-only bg-transparent border-0 btn-action-icon"
                                                    onClick={() => handleEdit(item)}
                                                    title="Editar"
                                                >
                                                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>edit_square</span>
                                                </button>
                                                <button
                                                    className="btn btn-icon-only bg-transparent border-0 btn-action-icon"
                                                    onClick={() => handleDelete(item.id)}
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
                                        <td colSpan="4" className="text-center py-4 text-muted">
                                            No hay {categoryNames[category].toLowerCase()} registrados
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
                            router.get(route('product.indexMenu'), { per_page: newPerPage, category: category }, { preserveState: true, replace: true });
                        }}
                    />
                </div>
            </div>

            <Drawer
                isOpen={showDrawer}
                onClose={handleCloseDrawer}
                title={editingItem ? `Editar ${categoryNames[category].slice(0, -1)}` : `Crear ${categoryNames[category].slice(0, -1)}`}
                footer={
                    <>
                        <button type="button" className="btn btn-light" onClick={handleCloseDrawer}>Cancelar</button>
                        <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                            {editingItem ? 'Actualizar' : 'Guardar'}
                        </button>
                    </>
                }
            >
                <form id="createMenuForm" onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Nombre</label>
                        <input
                            type="text"
                            className="form-control input-clean"
                            id="name"
                            required
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder={`Ej. ${category === 'burger' ? 'American Burger' : (category === 'combo' ? 'Combo 1' : 'Papas Fritas')}`}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="price" className="form-label">Precio ($)</label>
                        <input
                            type="number"
                            className="form-control input-clean"
                            id="price"
                            min="0"
                            step="0.01"
                            required
                            value={data.price}
                            onChange={(e) => setData('price', e.target.value)}
                            placeholder="0.00"
                        />
                    </div>



                    <h6 className="text-uppercase small fw-bold text-muted mb-3">
                        {category === 'combo' ? 'Contenido del Combo' : 'Receta / Ingredientes'}
                    </h6>
                    <p className="small text-muted mb-3">
                        {category === 'combo'
                            ? 'Selecciona los productos que incluye este combo.'
                            : 'Selecciona los insumos o productos base necesarios para preparar este ítem.'}
                    </p>

                    <div className="table-responsive mb-2">
                        <table className="table table-sm table-borderless align-middle mb-0">
                            <thead className="text-muted small text-uppercase">
                                <tr>
                                    <th style={{ width: '55%' }}>Producto</th>
                                    <th style={{ width: '20%' }} className="text-center">Cant.</th>
                                    <th style={{ width: '15%' }}>Unidad</th>
                                    <th style={{ width: '10%' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, index) => (
                                    <tr key={row.id}>
                                        <td>
                                            <select
                                                className="form-select form-select-sm input-clean"
                                                value={row.child_product_id}
                                                onChange={(e) => {
                                                    updateRow(row.id, {
                                                        child_product_id: e.target.value,
                                                        use_usage_unit: false
                                                    });
                                                }}
                                                required={category === 'combo'}
                                            >
                                                <option value="">Seleccionar...</option>
                                                {(() => {
                                                    const filtered = supplies.filter(s => {
                                                        if (category === 'combo') {
                                                            return ['burger', 'extra'].includes(s.category);
                                                        } else {
                                                            return !['burger', 'extra', 'combo'].includes(s.category);
                                                        }
                                                    });

                                                    const grouped = {
                                                        'burger': [],
                                                        'extra': [],
                                                        'ingredient': [],
                                                        'other': []
                                                    };

                                                    filtered.forEach(s => {
                                                        if (s.category === 'burger') grouped.burger.push(s);
                                                        else if (s.category === 'extra') grouped.extra.push(s);
                                                        else if (s.type === 'supply') grouped.ingredient.push(s);
                                                        else grouped.other.push(s);
                                                    });

                                                    return (
                                                        <>
                                                            {grouped.burger.length > 0 && (
                                                                <optgroup label="Hamburguesas">
                                                                    {grouped.burger.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                                                </optgroup>
                                                            )}
                                                            {grouped.extra.length > 0 && (
                                                                <optgroup label="Extras / Acompañamientos">
                                                                    {grouped.extra.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                                                </optgroup>
                                                            )}
                                                            {grouped.ingredient.length > 0 && (
                                                                <optgroup label="Insumos / Ingredientes">
                                                                    {grouped.ingredient.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                                                </optgroup>
                                                            )}
                                                            {grouped.other.length > 0 && (
                                                                <optgroup label="Otros">
                                                                    {grouped.other.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                                                </optgroup>
                                                            )}
                                                        </>
                                                    );
                                                })()}
                                            </select>
                                            {(() => {
                                                const selectedSupply = supplies.find(s => s.id == row.child_product_id);
                                                if (selectedSupply && selectedSupply.usage_unit && row.use_usage_unit) {
                                                    const baseUnitName = selectedSupply.base_unit || 'Base';
                                                    const usageFactor = parseFloat(selectedSupply.usage_factor) || 1;
                                                    const qty = parseFloat(row.quantity) || 0;
                                                    return (
                                                        <div className="small text-muted mt-1">
                                                            <i className="bi bi-arrow-return-right me-1"></i>
                                                            = {qty * usageFactor} {baseUnitName}
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            })()}
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                className="form-control form-control-sm text-center input-clean"
                                                value={row.quantity}
                                                min="0.01"
                                                step="0.001"
                                                onChange={(e) => updateRow(row.id, 'quantity', e.target.value === '' ? '' : parseFloat(e.target.value))}
                                                required={category === 'combo'}
                                            />
                                        </td>
                                        <td className="small text-muted">
                                            {(() => {
                                                const selectedSupply = supplies.find(s => s.id == row.child_product_id);
                                                const hasUsageUnit = selectedSupply && selectedSupply.usage_unit;
                                                const baseUnitName = selectedSupply?.base_unit || selectedSupply?.purchase_unit || '-';

                                                if (hasUsageUnit) {
                                                    return (
                                                        <select
                                                            className="form-select form-select-sm input-clean p-0 ps-1"
                                                            style={{ border: 'none', background: 'transparent', fontWeight: '500' }}
                                                            value={row.use_usage_unit ? 'true' : 'false'}
                                                            onChange={(e) => updateRow(row.id, 'use_usage_unit', e.target.value === 'true')}
                                                        >
                                                            <option value="false">{baseUnitName}</option>
                                                            <option value="true">{selectedSupply.usage_unit}</option>
                                                        </select>
                                                    );
                                                }

                                                return baseUnitName;
                                            })()}
                                        </td>
                                        <td className="text-end">
                                            <button
                                                type="button"
                                                className="btn btn-icon-only text-danger"
                                                onClick={() => removeRow(row.id)}
                                                disabled={rows.length === 1 && category === 'combo'}
                                                style={{ width: '31px', height: '31px' }}
                                            >
                                                <span className="material-symbols-outlined">delete</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <button type="button" className="btn btn-sm btn-outline-secondary mt-2 w-100" onClick={addRow}>
                        <i className="bi bi-plus-lg me-1"></i> Agregar Componente
                    </button>
                </form>
            </Drawer>
        </MainLayout>
    );
}
