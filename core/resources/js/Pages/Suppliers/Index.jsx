import React, { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import Drawer from '@/Components/Drawer';
import { Head, Link, useForm, router } from '@inertiajs/react';
import Swal from 'sweetalert2';

import Pagination from '@/Components/Pagination';

export default function Index({ suppliers }) {
    const [showDrawer, setShowDrawer] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);
    const { data, setData, post, put, processing, errors, reset, delete: destroy } = useForm({
        name: '',
        contact_info: '',
    });

    const handleDelete = (id) => {
        Swal.fire({
            text: "¿Eliminar este proveedor?",
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
                destroy(route('supplier.destroy', id), {
                    preserveScroll: true,
                    onSuccess: () => {
                        window.toast.success('Eliminado', 'El proveedor ha sido eliminado correctamente.');
                    }
                });
            }
        });
    };

    const handleEdit = (supplier) => {
        setEditingSupplier(supplier);
        setData({
            name: supplier.name,
            contact_info: supplier.contact_info || '',
        });
        setShowDrawer(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowDrawer(false);

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                setEditingSupplier(null);
                reset();
                window.toast.success(editingSupplier ? 'Proveedor actualizado' : 'Proveedor guardado', 'La operación se realizó con éxito.');
            },
            onError: () => {
                setShowDrawer(true);
                window.toast.error('Error', editingSupplier ? 'Error al actualizar el proveedor.' : 'Error al registrar el proveedor.');
            }
        };

        if (editingSupplier) {
            put(route('supplier.update', editingSupplier.id), options);
        } else {
            post(route('supplier.store'), options);
        }
    };

    const handleCloseDrawer = () => {
        setShowDrawer(false);
        setEditingSupplier(null);
        reset();
    };

    return (
        <MainLayout>
            <Head title="Proveedores" />
            <div className="container-fluid pt-4 px-4">

                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="mb-0 fw-bold">Proveedores</h4>
                    <button
                        className="btn btn-primary rounded-pill px-3"
                        onClick={() => setShowDrawer(true)}
                    >
                        <i className="bi bi-plus-lg me-2"></i>Agregar Proveedor
                    </button>
                </div>

                <div className="card-minimal">
                    <div className="table-responsive">
                        <table className="table-minimal">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Información de Contacto</th>
                                    <th scope="col" className="text-end">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {suppliers.data.map((supplier, index) => (
                                    <tr key={supplier.id}>
                                        <td className="text-muted">{(suppliers.current_page - 1) * suppliers.per_page + index + 1}</td>
                                        <td className="fw-medium">{supplier.name}</td>
                                        <td>{supplier.contact_info || '-'}</td>
                                        <td className="text-end">
                                            <div className="d-flex justify-content-end gap-2">
                                                <button
                                                    className="btn btn-icon-only bg-transparent border-0"
                                                    onClick={() => handleEdit(supplier)}
                                                    title="Editar"
                                                >
                                                    <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--text-muted)' }}>edit_square</span>
                                                </button>
                                                <button
                                                    className="btn btn-icon-only bg-transparent border-0"
                                                    onClick={() => handleDelete(supplier.id)}
                                                    title="Eliminar"
                                                >
                                                    <span className="material-symbols-outlined" style={{ fontSize: '22px', color: 'var(--text-muted)', transform: 'translateY(-1px)' }}>delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {suppliers.data.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="text-center py-4 text-muted">
                                            No hay proveedores registrados
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <Pagination
                        links={suppliers.links}
                        from={suppliers.from}
                        to={suppliers.to}
                        total={suppliers.total}
                        perPage={suppliers.per_page}
                        onPerPageChange={(newPerPage) => {
                            router.get(route('supplier.index'), { per_page: newPerPage }, { preserveState: true, replace: true });
                        }}
                    />
                </div>
            </div>

            <Drawer
                isOpen={showDrawer}
                onClose={handleCloseDrawer}
                title={editingSupplier ? 'Editar Proveedor' : 'Nuevo Proveedor'}
                footer={
                    <>
                        <button type="button" className="btn btn-light" onClick={handleCloseDrawer}>Cancelar</button>
                        <button type="button" className="btn btn-primary text-nowrap d-flex justify-content-center align-items-center" onClick={handleSubmit}>
                            {editingSupplier ? 'Actualizar Proveedor' : 'Guardar Proveedor'}
                        </button>
                    </>
                }
            >
                <form id="createSupplierForm" onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Nombre del Proveedor</label>
                        <input
                            type="text"
                            className="form-control input-clean"
                            id="name"
                            required
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Ej. Distribuidora ABC"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="contact_info" className="form-label">Información de Contacto</label>
                        <textarea
                            className="form-control input-clean"
                            id="contact_info"
                            rows="3"
                            required
                            value={data.contact_info}
                            onChange={(e) => setData('contact_info', e.target.value)}
                            placeholder="Teléfono, Email, Dirección..."
                        ></textarea>
                    </div>
                </form>
            </Drawer>
        </MainLayout>
    );
}
