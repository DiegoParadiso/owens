import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';

export default function ComingSoon({ title = "Sección en Construcción" }) {
    return (
        <MainLayout>
            <Head title={title} />
            <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '55vh' }}>
                <div className="text-center" style={{ maxWidth: '260px' }}>
                    <i className="bi bi-tools" style={{ fontSize: '1.6rem', color: 'var(--text-muted)' }}></i>
                    <p className="mt-2 mb-0 fw-semibold small" style={{ color: 'var(--text-muted)', fontSize: '0.78rem', letterSpacing: '0.02em' }}>
                        {title}
                    </p>
                    <p className="mt-1 mb-0" style={{ color: 'var(--text-muted)', fontSize: '0.7rem', opacity: 0.7 }}>
                        Esta sección estará disponible pronto.
                    </p>
                </div>
            </div>
        </MainLayout>
    );
}
