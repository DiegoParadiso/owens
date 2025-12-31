import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ purchases = [] }) {

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    return (
        <MainLayout>
            <Head title="Compras" />
            <div className="container-fluid pt-4 px-4">

                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="mb-0 fw-bold">Compras</h4>
                    <Link
                        href={route('purchase.create')}
                        className="btn btn-primary rounded-pill px-3"
                    >
                        <i className="bi bi-plus-lg me-2"></i>Registrar Compra
                    </Link>
                </div>

                <div className="card-minimal">
                    <div className="table-responsive">
                        <table className="table-minimal">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Fecha</th>
                                    <th scope="col">Proveedor</th>
                                    <th scope="col">Costo Total</th>
                                    <th scope="col">Registrado por</th>
                                </tr>
                            </thead>
                            <tbody>
                                {purchases.map((purchase, index) => (
                                    <tr key={purchase.id}>
                                        <td className="text-muted font-monospace">{index + 1}</td>
                                        <td>{formatDate(purchase.date)}</td>
                                        <td className="fw-medium">{purchase.supplier.name}</td>
                                        <td className="font-tabular fw-semibold">{formatCurrency(purchase.total_cost)}</td>
                                        <td>{purchase.user.name}</td>
                                    </tr>
                                ))}
                                {purchases.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4 text-muted">No hay datos de compras</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
