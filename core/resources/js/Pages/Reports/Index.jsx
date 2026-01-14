import React, { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Index({ date: initialDate, sales = 0, expenses = 0, purchases = 0, cogs = 0, grossProfit = 0, netProfit = 0, closures = [] }) {
    const [date, setDate] = useState(initialDate || new Date().toISOString().split('T')[0]);

    const formatCurrency = (amount, decimals = 2) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(amount);
    };

    const formatDate = (dateString) => {
        // Crear fecha sin conversión UTC para evitar problema de zona horaria
        const [year, month, day] = dateString.split('-');
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const handleFilter = (e) => {
        e.preventDefault();
        window.location.href = `/reports?date=${date}`;
    };

    return (
        <MainLayout>
            <Head title="Reportes" />
            <div className="container-fluid pt-4 px-4">

                {/* Header & Filter */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="mb-0 fw-bold">Reporte Diario</h4>
                    <form onSubmit={handleFilter} className="d-flex align-items-center gap-2">

                        <div className="minimal-date-wrapper">
                            <span className="minimal-date-display">
                                {(() => {
                                    if (!date) return '';
                                    const [y, m, d] = date.split('-');
                                    return `${d}/${m}/${y}`;
                                })()}
                            </span>
                            <input
                                type="date"
                                className="minimal-date-input"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                onClick={(e) => {
                                    if (e.target.showPicker) e.target.showPicker();
                                }}
                            />
                        </div>

                        <button type="submit" className="btn btn-sm text-muted p-0 ms-2 bg-transparent border-0" title="Actualizar">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-rotate-ccw">
                                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                                <path d="M3 3v5h5" />
                            </svg>
                        </button>
                    </form>
                </div>

                <div className="row g-4 mb-4">
                    <div className="col-md-4">
                        <div className="card-dash h-100">
                            <span className="card-label">Ventas totales</span>
                            <h3 className="card-value">{formatCurrency(sales)}</h3>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card-dash h-100">
                            <span className="card-label">Costo de ventas (COGS)</span>
                            <h3 className="card-value">{formatCurrency(cogs)}</h3>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card-dash h-100">
                            <span className="card-label">Resultado neto</span>
                            <h3 className={`card-value ${netProfit >= 0 ? 'text-success' : 'text-danger'}`}>
                                {formatCurrency(netProfit)}
                            </h3>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card-dash h-100">
                            <span className="card-label">Gastos operativos</span>
                            <h3 className="card-value">{formatCurrency(expenses)}</h3>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card-dash h-100">
                            <span className="card-label">Compras (Inventario)</span>
                            <h3 className="card-value">{formatCurrency(purchases)}</h3>
                        </div>
                    </div>
                </div>



                {/* Daily Closures Section */}
                <div className="card-minimal mt-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="fw-bold mb-0">Cierres de Caja <span className="text-muted fw-normal">({closures ? closures.length : 0})</span></h6>
                    </div>

                    <div className="table-responsive">
                        <table className="table-minimal">
                            <thead>
                                <tr>
                                    <th scope="col">Responsable</th>
                                    <th scope="col">Inicio</th>
                                    <th scope="col">Cierre</th>
                                    <th scope="col" className="text-end">Apertura</th>
                                    <th scope="col" className="text-end">Cierre</th>
                                    <th scope="col" className="text-end">Diferencia</th>
                                    <th scope="col" className="text-center">Reporte</th>
                                </tr>
                            </thead>
                            <tbody>
                                {closures && closures.length > 0 ? closures.map((closure) => (
                                    <tr key={closure.id}>
                                        <td className="fw-medium">{closure.user}</td>
                                        <td className="small text-muted">{new Date(closure.opened_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                        <td className="small text-muted">{new Date(closure.closed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                        <td className="text-end font-tabular">{formatCurrency(closure.opening_amount)}</td>
                                        <td className="text-end font-tabular">{formatCurrency(closure.closing_amount)}</td>
                                        <td className={`text-end font-tabular fw-bold ${closure.difference < 0 ? 'text-danger' : (closure.difference > 0 ? 'text-success' : 'text-muted')}`}>
                                            {formatCurrency(closure.difference)}
                                        </td>
                                        <td className="text-center">
                                            <a
                                                href={route('cash_register.downloadPdf', closure.id)}
                                                className="btn p-1 d-inline-flex justify-content-center align-items-center"
                                                title="Descargar PDF"
                                                style={{ border: 'none', background: 'transparent', color: '#6c757d', transition: 'color 0.2s', cursor: 'pointer' }}
                                                onMouseEnter={(e) => e.currentTarget.style.color = '#dc3545'}
                                                onMouseLeave={(e) => e.currentTarget.style.color = '#6c757d'}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="22"
                                                    height="22"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
                                                    <path d="M14 2v5a1 1 0 0 0 1 1h5" />
                                                    <path d="M10 9H8" />
                                                    <path d="M16 13H8" />
                                                    <path d="M16 17H8" />
                                                </svg>
                                            </a>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="7" className="text-center py-4 text-muted">No hay cierres de caja registrados en esta fecha.</td>
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
