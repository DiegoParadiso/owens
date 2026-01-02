import React, { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import Drawer from '@/Components/Drawer';
import { Head, Link, useForm } from '@inertiajs/react';
import Swal from 'sweetalert2';

export default function Index({ suppliers }) {
    const [showDrawer, setShowDrawer] = useState(false);
    const { data, setData, post, processing, errors, reset, delete: destroy } = useForm({
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
                Swal.fire({
                    text: 'Proveedor eliminado',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                    customClass: {
                        popup: 'swal-minimal'
                    }
                });
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Proveedor registrado (Simulación)');
        setShowDrawer(false);
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
                                    <th scope="col" className="text-end">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {suppliers.map((supplier, index) => (
                                    <tr key={supplier.id}>
                                        <td className="text-muted font-monospace">{index + 1}</td>
                                        <td className="fw-medium">{supplier.name}</td>
                                        <td>{supplier.contact_info}</td>
                                        <td className="text-end">
                                            <button className="btn btn-sm text-muted me-1" title="Editar">
                                                <span className="material-symbols-outlined">stylus</span>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(supplier.id)}
                                                className="btn btn-sm text-danger"
                                                title="Eliminar"
                                            >
                                                <span className="material-symbols-outlined">delete</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {suppliers.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="text-center py-4 text-muted">No hay datos de proveedores</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Drawer
                isOpen={showDrawer}
                onClose={() => setShowDrawer(false)}
                title="Nuevo Proveedor"
                footer={
                    <>
                        <button type="button" className="btn btn-light" onClick={() => setShowDrawer(false)}>Cancelar</button>
                        <button type="button" className="btn btn-primary" onClick={handleSubmit}>Guardar Proveedor</button>
                    </>
                }
            >
                <form id="createSupplierForm" onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Nombre del Proveedor</label>
                        <input
                            type="text"
                            className="form-control"
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
                            className="form-control"
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
