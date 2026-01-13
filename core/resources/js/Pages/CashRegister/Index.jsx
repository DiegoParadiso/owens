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
                        <button className="btn btn-sm text-muted">
                            <i className="bi bi-printer"></i>
                        </button>
                    </div>

                    <div className="table-responsive">
                        <table className="table-minimal">
                            <thead>
                                <tr>
                                    <th scope="col" style={{ width: '120px' }}>Hora</th>
                                    <th scope="col">Descripción</th>
                                    <th scope="col" className="text-end text-nowrap" style={{ width: '1%' }}>Monto</th>
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
                                        <td colSpan="4" className="text-center py-4 text-muted">No hay movimientos</td>
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
