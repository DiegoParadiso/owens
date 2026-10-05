import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';

export default function ComingSoon({ title = "Sección en Construcción" }) {
    return (
        <MainLayout>
            <Head title={title} />
            <div className="container-fluid pt-4 px-4">
                <div className="row vh-100 bg-white rounded align-items-center justify-content-center mx-0">
                    <div className="col-md-6 text-center p-4">
                        <i className="bi bi-tools display-1 text-primary mb-4"></i>
                        <h1 className="display-4 fw-bold mb-3">{title}</h1>
                        <p className="lead mb-4">Esta sección no se encuentra disponible temporalmente. Pronto estará habilitada.</p>
                        <a className="btn btn-primary rounded-pill py-3 px-5" href="/admin/dashboard">Volver al Inicio</a>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
