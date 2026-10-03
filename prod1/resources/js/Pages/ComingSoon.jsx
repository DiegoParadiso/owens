import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';

export default function ComingSoon({ title }) {
    return (
        <MainLayout>
            <Head title={title} />
            <div className="container-fluid pt-4 px-4">
                <div className="row vh-100 bg-white rounded align-items-center justify-content-center mx-0">
                    <div className="col-md-6 text-center p-4">
                        <i className="bi bi-exclamation-triangle display-1 text-primary"></i>
                        <h1 className="display-1 fw-bold">WIP</h1>
                        <h1 className="mb-4">{title}</h1>
                        <p className="mb-4">Esta sección está en construcción. ¡Pronto estará disponible!</p>
                        <a className="btn btn-primary rounded-pill py-3 px-5" href="/dashboard">Volver al Dashboard</a>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
