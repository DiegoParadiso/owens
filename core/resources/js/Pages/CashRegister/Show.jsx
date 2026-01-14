import React, { useEffect } from 'react';
import { Head } from '@inertiajs/react';

export default function Show({ register, income, expense, balance }) {

    // Auto-print when loaded (optional, but convenient for PDF generation)
    useEffect(() => {
        // window.print();
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount);
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString();
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <div className="bg-white min-vh-100 font-sans text-dark">
            <Head title={`Reporte Caja #${register.id}`} />

            {/* Non-printable controls */}
            <div className="d-print-none p-3 bg-light border-bottom d-flex justify-content-between align-items-center sticky-top">
                <div>
                    <a href={route('report.index')} className="btn btn-outline-secondary btn-sm me-2">
                        <i className="bi bi-arrow-left me-1"></i> Volver
                    </a>
                    <span className="text-muted small">Vista Previa de Impresión</span>
                </div>
                <button onClick={() => window.print()} className="btn btn-primary btn-sm">
                    <i className="bi bi-printer me-2"></i> Imprimir / Guardar PDF
                </button>
            </div>

            {/* Printable Area - Centered A4-like container */}
            <div className="container py-5" style={{ maxWidth: '210mm' }}>

                {/* Header */}
                <div className="text-center mb-5 border-bottom pb-4">
                    <h1 className="fw-bold mb-2">REPORTE DE CIERRE DE CAJA</h1>
                    <h5 className="text-muted fw-normal">#{register.id} — {formatDate(register.created_at)}</h5>
                    <div className="mt-3 badge bg-light text-dark border p-2 px-3 rounded-pill fw-normal">
                        Cajero: <strong>{register.user ? register.user.name : 'Desconocido'}</strong>
                    </div>
                </div>

                {/* Meta Info Grid */}
                <div className="row mb-5 border rounded p-4 mx-0 bg-light-subtle">
                    <div className="col-4 border-end">
                        <small className="text-muted text-uppercase d-block mb-1">Apertura</small>
                        <div className="fw-bold fs-5">{formatTime(register.opened_at)}</div>
                        <div className="small text-muted">{new Date(register.opened_at).toLocaleDateString()}</div>
                    </div>
                    <div className="col-4 border-end text-center">
                        <small className="text-muted text-uppercase d-block mb-1">Cierre</small>
                        <div className="fw-bold fs-5">{register.closed_at ? formatTime(register.closed_at) : '-'}</div>
                        <div className="small text-muted">{register.closed_at ? new Date(register.closed_at).toLocaleDateString() : 'En curso'}</div>
                    </div>
                    <div className="col-4 text-end">
                        <small className="text-muted text-uppercase d-block mb-1">Duración</small>
                        <div className="fw-bold fs-5">
                            {register.closed_at
                                ? Math.round((new Date(register.closed_at) - new Date(register.opened_at)) / 1000 / 60 / 60 * 10) / 10 + ' hrs'
                                : 'Activa'}
                        </div>
                    </div>
                </div>

                {/* Financial Summary */}
                <div className="row mb-5">
                    <div className="col-6">
                        <h5 className="fw-bold border-bottom pb-2 mb-3">RESUMEN DE FLUJO</h5>
                        <table className="table table-sm table-borderless">
                            <tbody>
                                <tr>
                                    <td className="text-muted">Fondo Inicial (Apertura)</td>
                                    <td className="text-end fw-bold font-tabular">{formatCurrency(register.opening_amount)}</td>
                                </tr>
                                <tr>
                                    <td className="text-success"><i className="bi bi-plus me-1"></i> Ingresos / Ventas</td>
                                    <td className="text-end fw-bold text-success font-tabular">{formatCurrency(income)}</td>
                                </tr>
                                <tr>
                                    <td className="text-danger"><i className="bi bi-dash me-1"></i> Egresos / Compras</td>
                                    <td className="text-end fw-bold text-danger font-tabular">{formatCurrency(expense)}</td>
                                </tr>
                                <tr className="border-top">
                                    <td className="pt-2 fw-bold">Saldo Teórico (Sistema)</td>
                                    <td className="pt-2 text-end fw-bold fs-5 font-tabular">{formatCurrency(balance)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="col-6">
                        <h5 className="fw-bold border-bottom pb-2 mb-3">CONCILIACIÓN DE EFECTIVO</h5>
                        <div className="p-3 border rounded bg-light-subtle">
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Efectivo Reportado (Cierre)</span>
                                <span className="fw-bold fs-5 font-tabular">{register.closing_amount ? formatCurrency(register.closing_amount) : '-'}</span>
                            </div>
                            {register.closing_amount && (
                                <div className={`d-flex justify-content-between pt-2 border-top ${register.closing_amount - balance < 0 ? 'text-danger' : 'text-success'}`}>
                                    <span className="fw-bold">Diferencia</span>
                                    <span className="fw-bold font-tabular">
                                        {formatCurrency(register.closing_amount - balance)}
                                    </span>
                                </div>
                            )}
                        </div>
                        {register.closing_amount && (register.closing_amount - balance !== 0) && (
                            <div className="mt-3 small text-muted fst-italic">
                                * Una diferencia negativa indica faltante de dinero, positiva indica sobrante.
                            </div>
                        )}
                    </div>
                </div>

                {/* Detailed Movements Table */}
                <h5 className="fw-bold border-bottom pb-2 mb-3 mt-5">DETALLE DE OPERACIONES</h5>
                <table className="table table-striped table-sm fs-6">
                    <thead>
                        <tr>
                            <th style={{ width: '80px' }}>Hora</th>
                            <th>Descripción / Concepto</th>
                            <th style={{ width: '100px' }}>Tipo</th>
                            <th className="text-end" style={{ width: '120px' }}>Monto</th>
                        </tr>
                    </thead>
                    <tbody>
                        {register.movements && register.movements.map(mov => (
                            <tr key={mov.id}>
                                <td className="font-monospace small">{formatTime(mov.created_at)}</td>
                                <td>
                                    {(() => {
                                        let desc = mov.description;
                                        if (mov.related) {
                                            if (mov.type === 'sale') {
                                                const details = mov.related.sale_details || mov.related.saleDetails;
                                                if (details && details.length > 0) {
                                                    const products = details.map(d => d.product ? d.product.name : '').filter(Boolean).join(', ');
                                                    if (products) desc = `Venta: ${products}`;
                                                }
                                            } else if (mov.type === 'purchase') {
                                                const details = mov.related.details;
                                                if (details && details.length > 0) {
                                                    const products = details.map(d => d.product ? d.product.name : '').filter(Boolean).join(', ');
                                                    if (products) desc = `Compra: ${products}`;
                                                }
                                            } else if (mov.type === 'expense') {
                                                desc = `Gasto: ${mov.related.description}`;
                                            }
                                        }
                                        return desc;
                                    })()}
                                </td>
                                <td>
                                    <span className={`badge ${mov.type === 'income' ? 'bg-success-subtle text-success' :
                                        mov.type === 'sale' ? 'bg-success-subtle text-success' :
                                            'bg-danger-subtle text-danger'
                                        } border border-opacity-10 fw-normal`}>
                                        {mov.type === 'income' ? 'INGRESO' :
                                            mov.type === 'sale' ? 'VENTA' :
                                                mov.type === 'purchase' ? 'COMPRA' : 'GASTO'}
                                    </span>
                                </td>
                                <td className="text-end font-tabular fw-medium">
                                    {['expense', 'purchase'].includes(mov.type) ? '-' : '+'}{formatCurrency(mov.amount)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Signatures */}
                <div className="row mt-5 pt-5">
                    <div className="col-6 text-center">
                        <div style={{ borderTop: '1px solid #000', width: '60%', margin: '0 auto', paddingTop: '10px' }}>
                            Firma del Cajero
                        </div>
                    </div>
                    <div className="col-6 text-center">
                        <div style={{ borderTop: '1px solid #000', width: '60%', margin: '0 auto', paddingTop: '10px' }}>
                            Firma del Supervisor
                        </div>
                    </div>
                </div>

                <div className="text-center text-muted small mt-5 pt-4">
                    Documento generado el {new Date().toLocaleString()} — Sistema de Gestión
                </div>
            </div>
        </div>
    );
}