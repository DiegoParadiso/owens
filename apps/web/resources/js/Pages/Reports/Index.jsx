import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import Drawer from '@/Components/Drawer';
import { Head, router } from '@inertiajs/react';

export default function Index({
    date_from: initialFrom,
    date_to: initialTo,
    user_id: initialUserId = '',
    payment_method: initialMethod = '',
    dateError = null,
    sales = 0,
    salesCount = 0,
    salesBreakdown = {},
    expenses = 0,
    expensesBreakdown = {},
    purchases = 0,
    purchasesBreakdown = {},
    netProfit = 0,
    closures = [],
    cashiers = [],
}) {
    const [dateFrom, setDateFrom] = useState(initialFrom || new Date().toISOString().split('T')[0]);
    const [dateTo, setDateTo] = useState(initialTo || new Date().toISOString().split('T')[0]);
    const [userId, setUserId] = useState(initialUserId || '');
    const [paymentMethod, setPaymentMethod] = useState(initialMethod || '');
    const [selectedClosure, setSelectedClosure] = useState(null);

    useEffect(() => {
        if (dateError && window.toast) {
            window.toast.warning('Rango de fechas inválido', dateError);
        }
    }, [dateError]);

    const formatCurrency = (amount, decimals = 2) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(amount || 0);
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const paymentMethodsMap = {
        'cash': 'Efectivo',
        'transfer': 'Transferencia',
        'qr': 'QR',
        'debit_card': 'Débito',
        'credit_card': 'Crédito',
    };

    const renderBreakdown = (breakdown) => {
        if (!breakdown || Object.keys(breakdown).length === 0) return null;

        return (
            <div className="mt-3 pt-3 border-top" style={{ borderColor: 'var(--border-color) !important' }}>
                {Object.entries(breakdown).sort((a, b) => b[1] - a[1]).map(([method, amount]) => {
                    if (amount > 0) {
                        return (
                            <div key={method} className="d-flex justify-content-between align-items-center mb-1">
                                <span className="small text-muted">{paymentMethodsMap[method] || method}</span>
                                <span className="small font-tabular">{formatCurrency(amount)}</span>
                            </div>
                        );
                    }
                    return null;
                })}
            </div>
        );
    };

    const handleFilter = (e) => {
        e.preventDefault();
        if (dateFrom && dateTo && dateFrom > dateTo) {
            if (window.toast) {
                window.toast.error('Validación de fechas', 'La "Fecha Desde" no puede ser posterior a la "Fecha Hasta".');
            }
            return;
        }
        router.get(route('report.index'), {
            date_from: dateFrom,
            date_to: dateTo,
            user_id: userId,
            payment_method: paymentMethod,
        }, { preserveState: true, preserveScroll: true });
    };

    const handleClearFilters = () => {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        const today = now.toISOString().split('T')[0];
        setDateFrom(firstDay);
        setDateTo(today);
        setUserId('');
        setPaymentMethod('');
        router.get(route('report.index'), {
            date_from: firstDay,
            date_to: today,
        }, { preserveState: true, preserveScroll: true });
    };

    const hasExportableData = salesCount > 0 || (closures && closures.length > 0) || expenses > 0 || purchases > 0;
    const exportQuery = new URLSearchParams({
        date_from: dateFrom,
        date_to: dateTo,
        ...(userId ? { user_id: userId } : {}),
        ...(paymentMethod ? { payment_method: paymentMethod } : {}),
    }).toString();

    return (
        <MainLayout>
            <Head title="Reportes Consolidados" />
            <div className="container-fluid pt-4 px-4">

                {/* Header & Export Actions (UC-27 / CU-29) */}
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                    <div>
                        <h4 className="mb-0 fw-bold">Reportes Consolidados y Auditoría de Caja</h4>
                        <small className="text-muted">Rendición financiera por período, cajero y medio de pago</small>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <a
                            href={hasExportableData ? `${route('report.pdf')}?${exportQuery}` : '#'}
                            className={`btn btn-primary rounded-pill px-3 ${!hasExportableData ? 'disabled' : ''}`}
                            aria-disabled={!hasExportableData}
                            onClick={(e) => { if (!hasExportableData) e.preventDefault(); }}
                        >
                            <i className="bi bi-file-earmark-pdf me-2"></i>Exportar a PDF
                        </a>
                        <a
                            href={hasExportableData ? `${route('report.csv')}?${exportQuery}` : '#'}
                            className={`btn btn-outline-secondary rounded-pill px-3 ${!hasExportableData ? 'disabled' : ''}`}
                            aria-disabled={!hasExportableData}
                            onClick={(e) => { if (!hasExportableData) e.preventDefault(); }}
                        >
                            <i className="bi bi-file-earmark-spreadsheet me-2"></i>Exportar a CSV
                        </a>
                    </div>
                </div>

                {/* Filter Bar (CU-29 Paso 2-3) */}
                <div className="card-minimal mb-4">
                    <form onSubmit={handleFilter} className="row g-3 align-items-end">
                        <div className="col-sm-6 col-md-2">
                            <label className="form-label small text-muted mb-1">Fecha Desde</label>
                            <input
                                type="date"
                                className="form-control form-control-sm input-clean"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-sm-6 col-md-2">
                            <label className="form-label small text-muted mb-1">Fecha Hasta</label>
                            <input
                                type="date"
                                className="form-control form-control-sm input-clean"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-sm-6 col-md-3">
                            <label className="form-label small text-muted mb-1">Responsable / Cajero</label>
                            <select
                                className="form-select form-select-sm input-clean"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                            >
                                <option value="">Todos los usuarios</option>
                                {cashiers.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name} ({c.role})</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-sm-6 col-md-2">
                            <label className="form-label small text-muted mb-1">Medio de Pago</label>
                            <select
                                className="form-select form-select-sm input-clean"
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            >
                                <option value="">Todos</option>
                                <option value="cash">Efectivo</option>
                                <option value="debit_card">Débito</option>
                                <option value="credit_card">Crédito</option>
                                <option value="transfer">Transferencia</option>
                                <option value="qr">QR</option>
                            </select>
                        </div>
                        <div className="col-md-3 d-flex gap-2">
                            <button type="submit" className="btn btn-sm btn-primary px-3 flex-grow-1">
                                Consultar
                            </button>
                            <button type="button" className="btn btn-sm btn-outline-secondary px-3" onClick={handleClearFilters}>
                                Limpiar Filtros
                            </button>
                        </div>
                    </form>
                </div>

                {/* KPI Summary Cards */}
                <div className="row g-4 mb-4">
                    <div className="col-md-3">
                        <div className="card-dash h-100 d-flex flex-column">
                            <div>
                                <span className="card-label">Ventas totales ({salesCount})</span>
                                <h3 className="card-value">{formatCurrency(sales)}</h3>
                            </div>
                            <div className="mt-auto">
                                {renderBreakdown(salesBreakdown)}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card-dash h-100 d-flex flex-column">
                            <div>
                                <span className="card-label">Gastos operativos</span>
                                <h3 className="card-value text-danger">{formatCurrency(expenses)}</h3>
                            </div>
                            <div className="mt-auto">
                                {renderBreakdown(expensesBreakdown)}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card-dash h-100 d-flex flex-column">
                            <div>
                                <span className="card-label">Compras (Inventario)</span>
                                <h3 className="card-value text-danger">{formatCurrency(purchases)}</h3>
                            </div>
                            <div className="mt-auto">
                                {renderBreakdown(purchasesBreakdown)}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card-dash h-100 d-flex flex-column">
                            <div>
                                <span className="card-label">Resultado neto</span>
                                <h3 className={`card-value ${netProfit >= 0 ? 'text-success' : 'text-danger'}`}>
                                    {formatCurrency(netProfit)}
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Closed Cash Sessions Matrix (UC-29) */}
                <div className="card-minimal mt-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="fw-bold mb-0">Historial de Sesiones de Caja <span className="text-muted fw-normal">({closures ? closures.length : 0})</span></h6>
                    </div>

                    <div className="table-responsive">
                        <table className="table-minimal">
                            <thead>
                                <tr>
                                    <th scope="col">Responsable</th>
                                    <th scope="col">Apertura</th>
                                    <th scope="col">Cierre</th>
                                    <th scope="col" className="text-end">Fondo Inicial</th>
                                    <th scope="col" className="text-end">Esperado</th>
                                    <th scope="col" className="text-end">Declarado</th>
                                    <th scope="col" className="text-end">Diferencia</th>
                                    <th scope="col" className="text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {closures && closures.length > 0 ? closures.map((closure) => (
                                    <tr key={closure.id}>
                                        <td className="fw-medium">{closure.user}</td>
                                        <td className="small text-muted">{formatDateTime(closure.opened_at)}</td>
                                        <td className="small text-muted">{formatDateTime(closure.closed_at)}</td>
                                        <td className="text-end font-tabular">{formatCurrency(closure.opening_amount)}</td>
                                        <td className="text-end font-tabular">{formatCurrency(closure.expected_balance)}</td>
                                        <td className="text-end font-tabular">{formatCurrency(closure.closing_amount)}</td>
                                        <td className={`text-end font-tabular fw-bold ${closure.difference < 0 ? 'text-danger' : (closure.difference > 0 ? 'text-success' : 'text-muted')}`}>
                                            {formatCurrency(closure.difference)}
                                        </td>
                                        <td className="text-center">
                                            <div className="d-flex justify-content-center gap-2">
                                                <button
                                                    type="button"
                                                    className="btn btn-icon-only bg-transparent border-0 p-1"
                                                    onClick={() => setSelectedClosure(closure)}
                                                    title="Inspeccionar Balance"
                                                >
                                                    <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--text-muted)' }}>visibility</span>
                                                </button>
                                                <a
                                                    href={route('cash_register.downloadPdf', closure.id)}
                                                    className="btn p-1 d-inline-flex justify-content-center align-items-center"
                                                    title="Descargar PDF de Arqueo"
                                                    style={{ border: 'none', background: 'transparent', color: '#6c757d' }}
                                                >
                                                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>picture_as_pdf</span>
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="8" className="text-center py-4 text-muted">No hay cierres de caja registrados en el período seleccionado.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Detail Drawer for UC-29 Paso 5-6 */}
            <Drawer
                isOpen={!!selectedClosure}
                onClose={() => setSelectedClosure(null)}
                title={selectedClosure ? `Balance de Sesión #${selectedClosure.id} — ${selectedClosure.user}` : 'Detalle de Sesión'}
                width="640px"
                footer={
                    selectedClosure && (
                        <>
                            <button type="button" className="btn btn-light" onClick={() => setSelectedClosure(null)}>Cerrar</button>
                            <a href={route('cash_register.downloadPdf', selectedClosure.id)} className="btn btn-primary">
                                <i className="bi bi-file-earmark-pdf me-2"></i>Descargar PDF Oficial
                            </a>
                        </>
                    )
                }
            >
                {selectedClosure && (
                    <div>
                        <div className="row g-3 mb-4">
                            <div className="col-6">
                                <div className="p-3 border rounded">
                                    <small className="text-muted d-block">Fondo Inicial</small>
                                    <strong className="font-tabular fs-5">{formatCurrency(selectedClosure.opening_amount)}</strong>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="p-3 border rounded">
                                    <small className="text-muted d-block">Saldo Teórico Esperado</small>
                                    <strong className="font-tabular fs-5">{formatCurrency(selectedClosure.expected_balance)}</strong>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="p-3 border rounded">
                                    <small className="text-muted d-block">Ingresos (Ventas + Manual)</small>
                                    <strong className="font-tabular text-success">+{formatCurrency(selectedClosure.total_income)}</strong>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="p-3 border rounded">
                                    <small className="text-muted d-block">Egresos (Gastos + Compras)</small>
                                    <strong className="font-tabular text-danger">-{formatCurrency(selectedClosure.total_expense)}</strong>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="p-3 border rounded">
                                    <small className="text-muted d-block">Efectivo Declarado</small>
                                    <strong className="font-tabular fs-5">{formatCurrency(selectedClosure.closing_amount)}</strong>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="p-3 border rounded">
                                    <small className="text-muted d-block">Diferencia de Arqueo</small>
                                    <strong className={`font-tabular fs-5 ${selectedClosure.difference < 0 ? 'text-danger' : (selectedClosure.difference > 0 ? 'text-success' : '')}`}>
                                        {formatCurrency(selectedClosure.difference)}
                                    </strong>
                                </div>
                            </div>
                        </div>

                        <h6 className="fw-bold mb-2">Movimientos de la Sesión ({selectedClosure.movements?.length || 0})</h6>
                        <div className="table-responsive">
                            <table className="table table-sm small">
                                <thead>
                                    <tr>
                                        <th>Tipo</th>
                                        <th>Descripción</th>
                                        <th className="text-end">Monto</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedClosure.movements && selectedClosure.movements.length > 0 ? selectedClosure.movements.map((mov) => (
                                        <tr key={mov.id}>
                                            <td><span className="badge bg-light text-dark border text-uppercase">{mov.type}</span></td>
                                            <td>{mov.description || '-'}</td>
                                            <td className={`text-end font-tabular fw-semibold ${['expense', 'purchase'].includes(mov.type) ? 'text-danger' : 'text-success'}`}>
                                                {['expense', 'purchase'].includes(mov.type) ? '-' : '+'}{formatCurrency(mov.amount)}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="3" className="text-center text-muted py-3">Sin movimientos registrados.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </Drawer>
        </MainLayout>
    );
}
