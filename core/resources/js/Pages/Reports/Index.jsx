import React, { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Index({ date: initialDate, sales = 0, expenses = 0, cogs = 0, grossProfit = 0, netProfit = 0 }) {
    const [date, setDate] = useState(initialDate || new Date().toISOString().split('T')[0]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
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
                    <h4 className="mb-0 fw-bold">Reporte Diario <span className="text-muted fw-normal fs-6 ms-2">| {formatDate(date)}</span></h4>
                    <form onSubmit={handleFilter} className="d-flex align-items-center gap-2">
                        <input
                            type="date"
                            className="form-control form-control-sm border-0 bg-transparent text-end px-2"
                            style={{ maxWidth: '140px' }}
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            onClick={(e) => {
                                if (e.target.showPicker) {
                                    e.target.showPicker();
                                }
                            }}
                        />
                        <button type="submit" className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: '34px', height: '34px', minWidth: '34px', padding: '0', flexShrink: 0 }}>
                            <i className="bi bi-arrow-clockwise" style={{ fontSize: '15px' }}></i>
                        </button>
                    </form>
                </div>

                <div className="row g-4 mb-4">
                    <div className="col-md-3">
                        <div className="card-dash h-100">
                            <span className="card-label">Ventas totales</span>
                            <h3 className="card-value">{formatCurrency(sales)}</h3>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card-dash h-100">
                            <span className="card-label">Costo de ventas (COGS)</span>
                            <h3 className="card-value">{formatCurrency(cogs)}</h3>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card-dash h-100">
                            <span className="card-label">Gastos operativos</span>
                            <h3 className="card-value">{formatCurrency(expenses)}</h3>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card-dash h-100">
                            <span className="card-label">Resultado neto</span>
                            <h3 className={`card-value ${netProfit >= 0 ? 'text-success' : 'text-danger'}`}>
                                {formatCurrency(netProfit)}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="alert alert-light border d-flex align-items-center" role="alert">
                    <i className="bi bi-info-circle-fill text-muted me-2 fs-5"></i>
                    <div>
                        <strong>Nota:</strong> El Resultado Neto se calcula como: <em>Ventas - Costo de Productos Vendidos - Gastos Operativos</em>.
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
