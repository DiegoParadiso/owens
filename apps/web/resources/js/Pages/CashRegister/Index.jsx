import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import Drawer from '@/Components/Drawer';
import CurrencyInput from '@/Components/CurrencyInput';
import { Head, Link, useForm, usePage } from '@inertiajs/react';


export default function Index({ openRegister, currentBalance, income, expense, movements }) {
    const { flash } = usePage().props;
    const [showCloseDrawer, setShowCloseDrawer] = useState(false);
    const [showOpenDrawer, setShowOpenDrawer] = useState(false);
    const [showMovementDrawer, setShowMovementDrawer] = useState(false);
    const [closureSummary, setClosureSummary] = useState(null);

    useEffect(() => {
        if (flash?.closure_summary) {
            setClosureSummary(flash.closure_summary);
        }
    }, [flash?.closure_summary]);

    const { data: closeData, setData: setCloseData, post: postClose, processing: closeProsessing, errors: closeErrors, reset: resetClose, transform: transformClose } = useForm({
        closing_amount: '',
    });

    const { data: openData, setData: setOpenData, post: postOpen, processing: openProcessing, errors: openErrors, reset: resetOpen, transform: transformOpen } = useForm({
        opening_amount: '',
    });

    const { data: movData, setData: setMovData, post: postMov, processing: movProcessing, errors: movErrors, reset: resetMov, transform: transformMov } = useForm({
        type: 'expense',
        amount: '',
        description: '',
    });

    const cleanCurrency = (val) => {
        if (!val) return 0;
        if (typeof val === 'number') return val;
        // Strip '$' and '.' (thousands), then replace ',' with '.' for JS parsing
        return parseFloat(String(val).replace(/[$.]/g, '').replace(',', '.')) || 0;
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
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

        transformClose((data) => ({
            ...data,
            closing_amount: cleanCurrency(data.closing_amount)
        }));

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

        transformOpen((data) => ({
            ...data,
            opening_amount: cleanCurrency(data.opening_amount)
        }));

        postOpen(route('cash_register.store'), {
            preserveScroll: true,
            onSuccess: () => {
                resetOpen();
                setClosureSummary(null);
                window.toast.success('Caja abierta', 'La caja se ha abierto correctamente.');
            },
            onError: (errors) => {
                setShowOpenDrawer(true);
                window.toast.error('Error', 'Error al abrir la caja.');
            }
        });
    };

    const submitMovement = (e) => {
        e.preventDefault();
        const numericAmount = cleanCurrency(movData.amount);
        if (numericAmount <= 0 || !movData.description.trim()) {
            window.toast.error('Datos inválidos', 'Ingresa un monto mayor a cero y un motivo.');
            return;
        }

        transformMov((data) => ({
            ...data,
            amount: cleanCurrency(data.amount)
        }));

        postMov(route('cash_register.storeMovement', openRegister.id), {
            preserveScroll: true,
            onSuccess: () => {
                setShowMovementDrawer(false);
                resetMov();
                window.toast.success('Movimiento registrado', 'El movimiento manual ha sido asentado en caja.');
            },
            onError: (errors) => {
                const msg = errors.amount || errors.description || 'No se pudo registrar el movimiento.';
                window.toast.error('Error', msg);
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

                            {closureSummary && (
                                <div className="card-minimal mt-4 mx-auto text-start" style={{ maxWidth: '460px' }}>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h6 className="fw-bold mb-0">Resultado de Arqueo Ciego (#{closureSummary.id})</h6>
                                        <button type="button" className="btn-close btn-sm" onClick={() => setClosureSummary(null)} aria-label="Cerrar"></button>
                                    </div>
                                    <div className="d-flex justify-content-between small mb-1">
                                        <span className="text-muted">Saldo teórico esperado:</span>
                                        <strong className="font-tabular">{formatCurrency(closureSummary.expected_balance)}</strong>
                                    </div>
                                    <div className="d-flex justify-content-between small mb-1">
                                        <span className="text-muted">Efectivo físico declarado:</span>
                                        <strong className="font-tabular">{formatCurrency(closureSummary.closing_amount)}</strong>
                                    </div>
                                    <div className="d-flex justify-content-between pt-2 mt-2 border-top">
                                        <span className="fw-semibold">Diferencia ({closureSummary.difference === 0 ? 'Exacto' : closureSummary.difference > 0 ? 'Sobrante' : 'Faltante'}):</span>
                                        <strong className={`font-tabular ${closureSummary.difference < 0 ? 'text-danger' : closureSummary.difference > 0 ? 'text-success' : ''}`}>
                                            {formatCurrency(closureSummary.difference)}
                                        </strong>
                                    </div>
                                    <div className="mt-3 text-end">
                                        <a href={route('cash_register.downloadPdf', closureSummary.id)} className="btn btn-sm btn-outline-primary rounded-pill">
                                            <i className="bi bi-file-earmark-pdf me-1"></i>Descargar Reporte de Arqueo (PDF)
                                        </a>
                                    </div>
                                </div>
                            )}
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
                            <CurrencyInput
                                className="form-control input-clean"
                                id="opening_amount"
                                required
                                value={openData.opening_amount}
                                onChange={(e) => setOpenData('opening_amount', e.target.value)}
                                placeholder="$0.00"
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
                    <div className="d-flex gap-2">
                        <button
                            type="button"
                            className="btn btn-primary rounded-pill px-3"
                            onClick={() => setShowMovementDrawer(true)}
                        >
                            <i className="bi bi-plus-lg me-2"></i>Movimiento Manual
                        </button>
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
                                        <td className="text-nowrap">{formatTime(movement.created_at)}</td>
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
                        <small className="text-muted d-block text-uppercase mb-1">Arqueo con Cierre Ciego</small>
                        <span className="small text-muted">
                            Por seguridad contable, el saldo teórico esperado permanece oculto hasta confirmar el conteo físico.
                        </span>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="closing_amount" className="form-label">Efectivo Contado Físicamente</label>
                        <CurrencyInput
                            className="form-control input-clean"
                            id="closing_amount"
                            required
                            value={closeData.closing_amount}
                            onChange={(e) => setCloseData('closing_amount', e.target.value)}
                            placeholder="$0.00"
                            autoFocus
                        />
                        {closeErrors.closing_amount && <div className="text-danger small mt-1">{closeErrors.closing_amount}</div>}
                        <div className="form-text mt-2">Ingresa SOLO el efectivo físico. No incluir transferencias.</div>
                    </div>
                </form>
            </Drawer>

            <Drawer
                isOpen={showMovementDrawer}
                onClose={() => setShowMovementDrawer(false)}
                title="Registrar Movimiento Manual de Caja"
                footer={
                    <>
                        <button type="button" className="btn btn-light" onClick={() => setShowMovementDrawer(false)}>Cancelar</button>
                        <button type="button" className="btn btn-primary" onClick={submitMovement} disabled={movProcessing}>
                            {movProcessing ? 'Guardando...' : 'Guardar Movimiento'}
                        </button>
                    </>
                }
            >
                <form id="manualMovementForm" onSubmit={submitMovement}>
                    <div className="mb-3">
                        <label htmlFor="mov_type" className="form-label">Tipo de Movimiento</label>
                        <select
                            id="mov_type"
                            className="form-select input-clean"
                            value={movData.type}
                            onChange={(e) => setMovData('type', e.target.value)}
                            required
                        >
                            <option value="income">Ingreso Extraordinario (Refuerzo de cambio)</option>
                            <option value="expense">Egreso Operativo (Retiro de efectivo)</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="mov_amount" className="form-label">Monto</label>
                        <CurrencyInput
                            className="form-control input-clean"
                            id="mov_amount"
                            required
                            value={movData.amount}
                            onChange={(e) => setMovData('amount', e.target.value)}
                            placeholder="$0.00"
                        />
                        {movErrors.amount && <div className="text-danger small mt-1">{movErrors.amount}</div>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="mov_description" className="form-label">Motivo / Justificación</label>
                        <textarea
                            id="mov_description"
                            className="form-control input-clean"
                            rows="3"
                            required
                            value={movData.description}
                            onChange={(e) => setMovData('description', e.target.value)}
                            placeholder="Ej. Refuerzo de cambio en billetes chicos o retiro parcial"
                        ></textarea>
                        {movErrors.description && <div className="text-danger small mt-1">{movErrors.description}</div>}
                    </div>
                </form>
            </Drawer>
        </MainLayout>
    );
}
