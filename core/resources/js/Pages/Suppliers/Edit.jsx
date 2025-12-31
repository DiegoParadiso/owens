import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ supplier }) {
    const { data, setData, put, processing, errors } = useForm({
        name: supplier.name,
        contact_info: supplier.contact_info,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('supplier.update', supplier.id));
    };

    return (
        <MainLayout>
            <Head title="Editar Proveedor" />
            <div className="container-fluid pt-4 px-4">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link href={route('dashboard')}>Dashboard</Link></li>
                        <li className="breadcrumb-item"><Link href={route('supplier.index')}>Proveedores</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">Editar Proveedor</li>
                    </ol>
                </nav>
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-6">
                        <div className="card-minimal border-accent-primary">
                            <h6 className="mb-4 fw-bold">Editar proveedor</h6>
                            <form onSubmit={submit}>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Nombre del Proveedor</label>
                                    <input
                                        type="text"
                                        className="form-control border-0 border-bottom rounded-0"
                                        id="name"
                                        required
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                    />
                                    {errors.name && <div className="text-danger small mt-1">{errors.name}</div>}
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="contact_info" className="form-label">Información de Contacto</label>
                                    <textarea
                                        className="form-control border-0 border-bottom rounded-0"
                                        id="contact_info"
                                        rows="3"
                                        value={data.contact_info}
                                        onChange={(e) => setData('contact_info', e.target.value)}
                                    ></textarea>
                                    {errors.contact_info && <div className="text-danger small mt-1">{errors.contact_info}</div>}
                                </div>
                                <div className="d-flex justify-content-end pt-3 border-top">
                                    <Link href={route('supplier.index')} className="btn btn-outline-secondary rounded-pill me-2">
                                        Cancelar
                                    </Link>
                                    <button type="submit" className="btn btn-primary px-4 rounded-pill" disabled={processing}>
                                        <i className="bi bi-save me-2"></i> Actualizar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
