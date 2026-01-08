import React, { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import Drawer from '@/Components/Drawer';
import { Head, Link, useForm, router } from '@inertiajs/react';
import Swal from 'sweetalert2';


export default function Index({ categories }) {
    const [showDrawer, setShowDrawer] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        type: 'fixed',
    });

    const handleDelete = (id) => {
        Swal.fire({
            text: "¿Eliminar esta categoría?",
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
                router.delete(route('expense-categories.destroy', id), {
                    preserveScroll: true,
                    onSuccess: () => {
                        window.toast.success('Eliminado', 'La categoría ha sido eliminada correctamente.');
                    },
                    onError: (errors) => {
                        const errorMessage = errors.error || 'No se puede eliminar esta categoría';
                        window.toast.error('Error', errorMessage);
                    }
                });
            }
        });
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setData({
            name: category.name,
            type: category.type,
        });
        setShowDrawer(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowDrawer(false); // Close immediately

        if (editingCategory) {
            put(route('expense-categories.update', editingCategory.id), {
                preserveScroll: true,
                onSuccess: () => {
                    window.toast.success('Categoría actualizada', 'La categoría ha sido actualizada correctamente.');
                    // Drawer is already closed
                    setEditingCategory(null);
                    reset();
                },
                onError: () => {
                    setShowDrawer(true); // Re-open on error
                    window.toast.error('Error', 'Error al actualizar la categoría.');
                }
            });
        } else {
            post(route('expense-categories.store'), {
                preserveScroll: true,
                onSuccess: () => {
                    window.toast.success('Categoría guardada', 'La categoría ha sido guardada correctamente.');
                    // Drawer is already closed
                    reset();
                },
                onError: () => {
                    setShowDrawer(true); // Re-open on error
                    window.toast.error('Error', 'Error al crear la categoría.');
                }
            });
        }
    };

    const handleCloseDrawer = () => {
        setShowDrawer(false);
        setEditingCategory(null);
        reset();
    };

    return (
        <MainLayout>
            <Head title="Categorías de Gastos" />
            <div className="container-fluid pt-4 px-4">

                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="mb-0 fw-bold">Categorías de Gastos</h4>
                    <button
                        className="btn btn-primary rounded-pill px-3"
                        onClick={() => setShowDrawer(true)}
                    >
                        <i className="bi bi-plus-lg me-2"></i>Nueva Categoría
                    </button>
                </div>

                <div className="card-minimal">
                    <div className="table-responsive">
                        <table className="table-minimal">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Tipo Interno</th>
                                    <th scope="col">Gastos Asociados</th>
                                    <th scope="col" className="text-end">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((category, index) => (
                                    <tr key={category.id}>
                                        <td className="text-muted font-monospace">{index + 1}</td>
                                        <td className="fw-medium">{category.name}</td>
                                        <td>
                                            {category.type === 'fixed' ? (
                                                <span className="badge bg-primary">Fijo</span>
                                            ) : (
                                                <span className="badge bg-secondary">Variable</span>
                                            )}
                                        </td>
                                        <td className="text-muted">{category.expenses_count || 0}</td>
                                        <td className="text-end">
                                            <button
                                                onClick={() => handleEdit(category)}
                                                className="btn btn-icon-only bg-transparent border-0 me-1"
                                                title="Editar"
                                            >
                                                <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--text-muted)' }}>edit_square</span>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category.id)}
                                                className="btn btn-icon-only bg-transparent border-0"
                                                title="Eliminar"
                                            >
                                                <span className="material-symbols-outlined" style={{ fontSize: '22px', color: 'var(--text-muted)', transform: 'translateY(-1px)' }}>delete</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {categories.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4 text-muted">No hay categorías definidas</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Drawer
                isOpen={showDrawer}
                onClose={handleCloseDrawer}
                title={editingCategory ? "Editar Categoría" : "Nueva Categoría"}
                footer={
                    <>
                        <button type="button" className="btn btn-light" onClick={handleCloseDrawer}>Cancelar</button>
                        <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                            {editingCategory ? 'Actualizar' : 'Guardar'} Categoría
                        </button>
                    </>
                }
            >
                <form id="categoryForm" onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Nombre de la Categoría</label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            required
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Ej. Servicios (Luz, Agua, Internet)"
                        />
                        <div className="form-text">
                            Sea descriptivo. Puede incluir ejemplos entre paréntesis.
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="type" className="form-label">Tipo Interno</label>
                        <select
                            className="form-select"
                            id="type"
                            value={data.type}
                            onChange={(e) => setData('type', e.target.value)}
                            required
                        >
                            <option value="fixed">Fijo</option>
                            <option value="variable">Variable</option>
                        </select>
                        <div className="form-text">
                            <strong>Fijo:</strong> Gastos recurrentes y predecibles (alquiler, servicios).<br />
                            <strong>Variable:</strong> Gastos que fluctúan (mercadería, mantenimiento).
                        </div>
                    </div>
                </form>
            </Drawer>
        </MainLayout>
    );
}
