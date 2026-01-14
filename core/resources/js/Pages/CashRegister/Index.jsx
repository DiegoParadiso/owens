import React, { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import Drawer from '@/Components/Drawer';
import { Head, Link, useForm } from '@inertiajs/react';
import Swal from 'sweetalert2';


export default function Index({ openRegister, currentBalance, income, expense, movements }) {
    const [showCloseDrawer, setShowCloseDrawer] = useState(false);
    const [showOpenDrawer, setShowOpenDrawer] = useState(false);

    const { data: closeData, setData: setCloseData, post: postClose, processing: closeProsessing, errors: closeErrors, reset: resetClose } = useForm({
        closing_amount: '',
    });

    const { data: openData, setData: setOpenData, post: postOpen, processing: openProcessing, errors: openErrors, reset: resetOpen } = useForm({
        opening_amount: '',
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const submitClose = (e) => {
        e.preventDefault();
        setShowCloseDrawer(false);

        postClose(route('cash_register.close', openRegister.id), {
            preserveScroll: true,
            onSuccess: () => {
                resetClose();
                window.toast.success('Caja cerrada', 'La caja se ha cerrado correctamente.');
            },
            onError: (errors) => {
                setShowCloseDrawer(true);
                window.toast.error('Error', 'Error al cerrar la caja.');
            }
        });
    };

    const submitOpen = (e) => {
        e.preventDefault();
        setShowOpenDrawer(false);

        postOpen(route('cash_register.store'), {
            preserveScroll: true,
            onSuccess: () => {
                resetOpen();
                window.toast.success('Caja abierta', 'La caja se ha abierto correctamente.');
            },
            onError: (errors) => {
                setShowOpenDrawer(true);
                window.toast.error('Error', 'Error al abrir la caja.');
            }
        });
    };


    if (!openRegister) {
        return (
            <MainLayout>
                <Head title="Caja Registradora" />
                <div className="container-fluid pt-4 px-4">
                    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                        <div className="text-center">
                            <div className="mb-4">
                                <i className="bi bi-cash-coin" style={{ fontSize: '4rem', color: 'var(--text-muted)' }}></i>
                            </div>
                            <h4 className="mb-3">No hay caja abierta</h4>
                            <p className="text-muted mb-4">Abre la caja para comenzar a registrar movimientos</p>
                            <button
                                className="btn btn-primary rounded-pill px-4"
                                onClick={() => setShowOpenDrawer(true)}
                            >
                                <i className="bi bi-unlock me-2"></i>Abrir Caja
                            </button>
                        </div>
                    </div>
                </div>

                <Drawer
                    isOpen={showOpenDrawer}
                    onClose={() => setShowOpenDrawer(false)}
                    title="Abrir Caja"
                    footer={
                        <>
                            <button type="button" className="btn btn-light" onClick={() => setShowOpenDrawer(false)}>Cancelar</button>
                            <button type="button" className="btn btn-primary" onClick={submitOpen} disabled={openProcessing}>
                                {openProcessing ? 'Abriendo...' : 'Abrir Caja'}
                            </button>
                        </>
                    }
                >
                    <form id="openRegisterForm" onSubmit={submitOpen}>
                        <div className="mb-3">
                            <label htmlFor="opening_amount" className="form-label">Monto Inicial</label>
                            <input
                                type="number"
                                className="form-control input-clean"
                                id="opening_amount"
                                min="0"
                                step="0.01"
                                required
                                value={openData.opening_amount}
                                onChange={(e) => setOpenData('opening_amount', e.target.value)}
                                placeholder="0.00"
                                autoFocus
                            />
                            {openErrors.opening_amount && <div className="text-danger small mt-1">{openErrors.opening_amount}</div>}
                            <div className="form-text">Ingresa el dinero inicial con el que abres la caja.</div>
                        </div>
                    </form>
                </Drawer>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Head title="Caja Registradora" />
            <div className="container-fluid pt-4 px-4">


                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="d-flex align-items-center">
                        <h4 className="mb-0 fw-bold">Caja Registradora</h4>
                        <span className="ms-3 rounded-circle bg-minimal-success shadow-sm" style={{ width: '10px', height: '10px' }} title="Caja Abierta"></span>
                    </div>
                    <div>
                        <button
                            type="button"
                            className="btn btn-outline-secondary rounded-pill px-3"
                            onClick={() => setShowCloseDrawer(true)}
                        >
                            <i className="bi bi-x-circle me-2"></i>Cerrar Caja
                        </button>
                    </div>
                </div>

                <div className="row g-4 mb-4">
                    <div className="col-md-4">
                        <div className="card-dash h-100">
                            <span className="card-label">Saldo actual</span>
                            <h3 className="card-value">{formatCurrency(currentBalance)}</h3>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card-dash h-100">
                            <span className="card-label">Ingresos</span>
                            <h3 className="card-value">{formatCurrency(income)}</h3>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card-dash h-100">
                            <span className="card-label">Egresos</span>
                            <h3 className="card-value">{formatCurrency(expense)}</h3>
                        </div>
                    </div>
                </div>

                <div className="card-minimal">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="fw-bold mb-0">Movimientos recientes</h6>
                        <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => window.print()}
                        >
                            <i className="bi bi-printer me-2"></i>Imprimir Reporte
                        </button>
                    </div>

                    <div className="table-responsive">
                        <table className="table-minimal">
                            <thead>
                                <tr>
                                    <th scope="col" style={{ width: '120px' }}>Hora</th>
                                    <th scope="col">Descripción</th>
                                    <th scope="col" className="text-end text-nowrap" style={{ width: '15%' }}>Monto</th>
                                </tr>
                            </thead>
                            <tbody>
                                {movements && movements.length > 0 ? movements.map((movement) => (
                                    <tr key={movement.id}>
                                        <td>{formatTime(movement.created_at)}</td>
                                        <td className="fw-medium">
                                            <div className="d-flex align-items-center gap-2">
                                                {/* Icon Indicator */}
                                                <div style={{ width: '20px', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                                                    {movement.type === 'income' || movement.type === 'sale' ? (
                                                        <span className="text-success d-flex" title="Ingreso">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-banknote-arrow-up-icon lucide-banknote-arrow-up">
                                                                <path d="M12 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5" />
                                                                <path d="M18 12h.01" />
                                                                <path d="M19 22v-6" />
                                                                <path d="m22 19-3-3-3 3" />
                                                                <path d="M6 12h.01" />
                                                                <circle cx="12" cy="12" r="2" />
                                                            </svg>
                                                        </span>
                                                    ) : (
                                                        <span className="text-danger d-flex" title="Egreso">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-banknote-arrow-down-icon lucide-banknote-arrow-down">
                                                                <path d="M12 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5" />
                                                                <path d="m16 19 3 3 3-3" />
                                                                <path d="M18 12h.01" />
                                                                <path d="M19 16v6" />
                                                                <path d="M6 12h.01" />
                                                                <circle cx="12" cy="12" r="2" />
                                                            </svg>
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Description Text */}
                                                <div>
                                                    {(() => {
                                                        if (movement.related) {
                                                            // Handle Sale
                                                            if (movement.type === 'sale') {
                                                                const details = movement.related.sale_details || movement.related.saleDetails;
                                                                if (details && details.length > 0) {
                                                                    const products = details
                                                                        .map(d => d.product ? d.product.name : '')
                                                                        .filter(Boolean)
                                                                        .join(', ');
                                                                    return products ? `Venta de ${products}` : movement.description;
                                                                }
                                                            }
                                                            // Handle Purchase
                                                            if (movement.type === 'purchase') {
                                                                const details = movement.related.details;
                                                                if (details && details.length > 0) {
                                                                    const products = details
                                                                        .map(d => d.product ? d.product.name : '')
                                                                        .filter(Boolean)
                                                                        .join(', ');
                                                                    return products ? `Compra de ${products}` : movement.description;
                                                                }
                                                            }
                                                            // Handle Expense
                                                            if (movement.type === 'expense') {
                                                                return `Gasto de ${movement.related.description}`;
                                                            }
                                                        }
                                                        return movement.description;
                                                    })()}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-end font-tabular fw-bold text-headings" style={{ fontSize: '1em' }}>{formatCurrency(movement.amount)}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="3" className="text-center py-4 text-muted">No hay movimientos</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* --- Printable Report Section (Hidden in Screen, Visible in Print) --- */}
            <div id="printable-area" className="d-none">
                <div className="report-header">
                    <h2 className="fw-bold mb-1">REPORTE DE CAJA</h2>
                    <p className="text-muted mb-0 small">Generado el {new Date().toLocaleDateString()} a las {new Date().toLocaleTimeString()}</p>
                </div>

                <div className="row mb-4">
                    <div className="col-6">
                        <strong className="d-block text-uppercase small text-muted">Apertura</strong>
                        <div>{openRegister ? new Date(openRegister.created_at).toLocaleString() : '-'}</div>
                        <div className="small text-muted">Usuario: {openRegister?.user?.name || 'Cajero'}</div>
                    </div>
                    <div className="col-6 text-end">
                        <strong className="d-block text-uppercase small text-muted">Estado</strong>
                        <div className="fw-bold text-uppercase">{openRegister ? 'ABIERTA' : 'CERRADA'}</div>
                    </div>
                </div>

                <div className="summary-box">
                    <h5 className="fw-bold border-bottom pb-2 mb-3">RESUMEN FINANCIERO</h5>
                    <div className="d-flex justify-content-between mb-2">
                        <span>Saldo Inicial (Apertura):</span>
                        <span className="font-tabular fw-bold">{formatCurrency(openRegister ? parseFloat(openRegister.opening_amount || 0) : 0)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                        <span>Total Ingresos (+):</span>
                        <span className="font-tabular text-success">{formatCurrency(income)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                        <span>Total Egresos (-):</span>
                        <span className="font-tabular text-danger">{formatCurrency(expense)}</span>
                    </div>
                    <div className="d-flex justify-content-between mt-3 pt-2 border-top">
                        <span className="fw-bold h5 mb-0">SALDO ACTUAL:</span>
                        <span className="fw-bold h5 mb-0 font-tabular">{formatCurrency(currentBalance)}</span>
                    </div>
                </div>

                {/* Movements Table for Print */}
                <h5 className="fw-bold mt-4 mb-2">DETALLE DE MOVIMIENTOS</h5>
                <table className="table-report">
                    <thead>
                        <tr>
                            <th style={{ width: '80px' }}>Hora</th>
                            <th>Concepto / Descripción</th>
                            <th style={{ width: '80px' }}>Tipo</th>
                            <th className="text-end" style={{ width: '100px' }}>Monto</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movements && movements.length > 0 ? movements.map((movement) => (
                            <tr key={'print-' + movement.id}>
                                <td>{formatTime(movement.created_at)}</td>
                                <td>
                                    {(() => {
                                        let desc = movement.description;
                                        if (movement.related) {
                                            if (movement.type === 'sale') {
                                                const details = movement.related.sale_details || movement.related.saleDetails;
                                                if (details && details.length > 0) {
                                                    const products = details.map(d => d.product ? d.product.name : '').filter(Boolean).join(', ');
                                                    if (products) desc = `Venta: ${products}`;
                                                }
                                            } else if (movement.type === 'purchase') {
                                                const details = movement.related.details;
                                                if (details && details.length > 0) {
                                                    const products = details.map(d => d.product ? d.product.name : '').filter(Boolean).join(', ');
                                                    if (products) desc = `Compra: ${products}`;
                                                }
                                            } else if (movement.type === 'expense') {
                                                desc = `Gasto: ${movement.related.description}`;
                                            }
                                        }
                                        return desc;
                                    })()}
                                </td>
                                <td>
                                    <span style={{
                                        fontWeight: '500',
                                        fontSize: '0.85em',
                                        textTransform: 'uppercase'
                                    }}>
                                        {movement.type === 'income' ? 'INGRESO' :
                                            movement.type === 'expense' ? 'EGRESO' :
                                                movement.type === 'sale' ? 'VENTA' : 'OTRO'}
                                    </span>
                                </td>
                                <td className="text-end fw-bold font-tabular">
                                    {movement.type === 'expense' || movement.type === 'purchase' ? '-' : ''}{formatCurrency(movement.amount)}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="4" className="text-center py-3">No hay registros en esta sesión.</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className="report-footer">
                    <div className="row mt-5">
                        <div className="col-6 text-center">
                            <div style={{ borderTop: '1px solid #000', width: '80%', margin: '0 auto', paddingTop: '5px' }}>
                                Firma Cajero / Responsable
                            </div>
                        </div>
                        <div className="col-6 text-center">
                            <div style={{ borderTop: '1px solid #000', width: '80%', margin: '0 auto', paddingTop: '5px' }}>
                                Firma Supervisor / Gerente
                            </div>
                        </div>
                    </div>
                    <p className="mt-4">Reporte generado por Sistema de Gestión - Uso Interno</p>
                </div>
            </div>

            <Drawer
                isOpen={showCloseDrawer}
                onClose={() => setShowCloseDrawer(false)}
                title="Cerrar Caja"
                footer={
                    <>
                        <button type="button" className="btn btn-light" onClick={() => setShowCloseDrawer(false)}>Cancelar</button>
                        <button type="button" className="btn btn-danger" onClick={submitClose} disabled={closeProsessing}>
                            {closeProsessing ? 'Cerrando...' : 'Confirmar Cierre'}
                        </button>
                    </>
                }
            >
                <form id="closeRegisterForm" onSubmit={submitClose}>
                    <div className="alert alert-light border mb-4">
                        <small className="text-muted d-block text-uppercase mb-1">Saldo Esperado</small>
                        <h3 className="font-tabular fw-semibold mb-0">{formatCurrency(currentBalance)}</h3>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="closing_amount" className="form-label">Efectivo Contado Físicamente</label>
                        <input
                            type="number"
                            className="form-control input-clean"
                            id="closing_amount"
                            min="0"
                            step="0.01"
                            required
                            value={closeData.closing_amount}
                            onChange={(e) => setCloseData('closing_amount', e.target.value)}
                            placeholder="0.00"
                            autoFocus
                        />
                        {closeErrors.closing_amount && <div className="text-danger small mt-1">{closeErrors.closing_amount}</div>}
                        <div className="form-text mt-2">Ingresa SOLO el efectivo físico. No incluir transferencias.</div>
                    </div>
                </form>
            </Drawer>
        </MainLayout>
    );
}
