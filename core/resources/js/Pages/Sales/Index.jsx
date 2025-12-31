import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ sales = [] }) {

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <MainLayout>
            <Head title="Ventas" />
            <div className="container-fluid pt-4 px-4">

                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="mb-0 fw-bold">Ventas</h4>
                    <Link
                        href={route('sales.create')}
                        className="btn btn-primary rounded-pill px-3"
                    >
                        <i className="bi bi-plus-lg me-2"></i>Nueva Venta
                    </Link>
                </div>

                <div className="card-minimal">
                    <div className="table-responsive">
                        <table className="table-minimal">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Fecha</th>
                                    <th scope="col">Detalle</th>
                                    <th scope="col">Total</th>
                                    <th scope="col">Vendedor</th>
                                    <th scope="col" className="text-end">Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sales.map((sale, index) => (
                                    <tr key={sale.id}>
                                        <td className="text-muted font-monospace">{index + 1}</td>
                                        <td>{formatDate(sale.sale_date)}</td>
                                        <td>
                                            <ul className="list-unstyled mb-0 small">
                                                {sale.saleDetails.map((detail, idx) => (
                                                    <li key={idx}>
                                                        <span className="fw-medium">{detail.quantity}x</span> {detail.product.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        </td>
                                        <td className="font-tabular fw-semibold">{formatCurrency(sale.total_price)}</td>
                                        <td>{sale.name}</td>
                                        <td className="text-end">
                                            {sale.payment_status === 'Lunas' ? (
                                                <span className="text-success fw-medium">Pagado</span>
                                            ) : (
                                                <span className="text-warning fw-medium">Pendiente</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {sales.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4 text-muted">No hay datos de ventas</td>
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
