import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function Dashboard({ stats, recentSales, chartData, cashRegister }) {
    const chartLabels = chartData.labels;

    const salesChartData = {
        labels: chartLabels,
        datasets: [
            {
                label: 'Ventas',
                data: chartData.sales,
                backgroundColor: 'rgba(223, 15, 19, 0.5)',
                borderColor: 'rgba(223, 15, 19, 1)',
                borderWidth: 2,
            },
        ],
    };

    const revenueChartData = {
        labels: chartLabels,
        datasets: [
            {
                label: 'Ingresos',
                data: chartData.revenue,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: true,
            },
        ],
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
    };

    const handleDelete = (id) => {
        Swal.fire({
            text: "¿Eliminar esta venta?",
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
                router.delete(route('sales.destroy', id), {
                    preserveScroll: true,
                    onSuccess: () => {
                        window.toast.success('Venta eliminada', 'La venta ha sido eliminada correctamente.');
                    }
                });
            }
        });
    };

    return (
        <MainLayout>
            <Head title="Dashboard" />
            <div className="container-fluid pt-4 px-4">

                <div className="row g-4 mb-4">
                    <div className="col-sm-6 col-xl-3">
                        <div className="card-dash border-accent-primary h-100">
                            <span className="card-label">Ventas hoy</span>
                            <h3 className="card-value">{stats.todaySales}</h3>
                        </div>
                    </div>
                    <div className="col-sm-6 col-xl-3">
                        <div className="card-dash border-accent-primary h-100">
                            <span className="card-label">Ventas totales</span>
                            <h3 className="card-value">{stats.totalSales}</h3>
                        </div>
                    </div>
                    <div className="col-sm-6 col-xl-3">
                        <div className="card-dash border-accent-primary h-100">
                            <span className="card-label">Ingresos hoy</span>
                            <h3 className="card-value">{formatCurrency(stats.todayRevenue)}</h3>
                        </div>
                    </div>
                    <div className="col-sm-6 col-xl-3">
                        <div className="card-dash border-accent-primary h-100">
                            <span className="card-label">Ingresos totales</span>
                            <h3 className="card-value">{formatCurrency(stats.totalRevenue)}</h3>
                        </div>
                    </div>
                </div>

                <div className="row g-4 mb-4">
                    <div className="col-sm-12 col-xl-6">
                        <div className="card-minimal h-100">
                            <div className="d-flex align-items-center justify-content-between mb-4">
                                <h6 className="mb-0 fw-bold">Ventas Globales</h6>
                                <Link href={route('sales.index')} className="small text-muted text-decoration-none">Mostrar Todo</Link>
                            </div>
                            <Bar options={{ responsive: true }} data={salesChartData} />
                        </div>
                    </div>
                    <div className="col-sm-12 col-xl-6">
                        <div className="card-minimal h-100">
                            <div className="d-flex align-items-center justify-content-between mb-4">
                                <h6 className="mb-0 fw-bold">Ventas e Ingresos</h6>
                                <Link href={route('sales.index')} className="small text-muted text-decoration-none">Mostrar Todo</Link>
                            </div>
                            <Line options={{ responsive: true }} data={revenueChartData} />
                        </div>
                    </div>
                </div>

                <div className="card-minimal">
                    <div className="d-flex align-items-center justify-content-between mb-4">
                        <h6 className="mb-0 fw-bold">Ventas Recientes</h6>
                        <Link href={route('sales.index')} className="small text-muted text-decoration-none">Ver Todo</Link>
                    </div>
                    <div className="table-responsive">
                        <table className="table-minimal align-top">
                            <thead>
                                <tr>
                                    <th scope="col" style={{ width: '140px' }}>Fecha</th>
                                    <th scope="col">Detalles</th>
                                    <th scope="col">Cajero</th>
                                    <th scope="col" style={{ width: '130px' }} className="text-end">Monto</th>
                                    <th scope="col" style={{ width: '130px' }}>Método Pago</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentSales.map((sale) => (
                                    <tr key={sale.id}>
                                        <td>{new Date(sale.sale_date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
                                        <td>
                                            <ul className="list-unstyled mb-0 small">
                                                {sale.sale_details && sale.sale_details.length > 0 ? (
                                                    sale.sale_details.map((detail, idx) => (
                                                        <li key={idx}>
                                                            <span className="text-muted">{parseInt(detail.quantity)}x</span> {detail.product.name}
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li className="text-muted fst-italic">Sin detalles</li>
                                                )}
                                            </ul>
                                        </td>
                                        <td>{sale.cashier}</td>
                                        <td className="text-end font-tabular fw-semibold">{formatCurrency(sale.total_price)}</td>
                                        <td>
                                            <span className="badge bg-transparent border text-dark">
                                                {(() => {
                                                    const methods = {
                                                        'cash': 'Efectivo',
                                                        'debit_card': 'Débito',
                                                        'credit_card': 'Crédito',
                                                        'transfer': 'Transferencia',
                                                        'qr': 'QR',
                                                        'multiple': 'Múltiple'
                                                    };
                                                    return methods[sale.payment_method] || sale.payment_method;
                                                })()}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {recentSales.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4 text-muted">
                                            No hay ventas recientes
                                        </td>
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
