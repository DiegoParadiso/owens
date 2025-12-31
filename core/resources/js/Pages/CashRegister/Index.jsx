import React, { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import Drawer from '@/Components/Drawer';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Index() {
    const currentBalance = 1500.00;
    const income = 2000.00;
    const expense = 500.00;
    const movements = [
        { id: 1, created_at: '2025-12-29 08:00:00', type: 'income', description: 'Apertura de Caja', amount: 1000.00 },
        { id: 2, created_at: '2025-12-29 10:30:00', type: 'income', description: 'Venta #1', amount: 150.00 },
        { id: 3, created_at: '2025-12-29 12:00:00', type: 'expense', description: 'Compra de Insumos', amount: 50.00 },
    ];
    const openRegister = { id: 1 };

    const [showCloseDrawer, setShowCloseDrawer] = useState(false);
    const { data, setData, put, processing, errors } = useForm({
        closing_amount: '',
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const submitClose = (e) => {
        e.preventDefault();
        alert('Caja cerrada (Simulación)');
        setShowCloseDrawer(false);
    };

    return (
        <MainLayout>
            <Head title="Caja Registradora" />
            <div className="container-fluid pt-4 px-4">

                {/* Header & Actions */}
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
                                    <th scope="col">Hora</th>
                                    <th scope="col">Tipo</th>
                                    <th scope="col">Descripción</th>
                                    <th scope="col" className="text-end">Monto</th>
                                </tr>
                            </thead>
                            <tbody>
                                {movements.map((movement) => (
                                    <tr key={movement.id}>
                                        <td className="text-muted font-monospace">{formatTime(movement.created_at)}</td>
                                        <td>
                                            {movement.type === 'income' ? (
                                                <span className="text-success fw-medium">Ingreso</span>
                                            ) : (
                                                <span className="text-danger fw-medium">Egreso</span>
                                            )}
                                        </td>
                                        <td className="fw-medium">{movement.description}</td>
                                        <td className="text-end font-tabular fw-semibold">{formatCurrency(movement.amount)}</td>
                                    </tr>
                                ))}
                                {movements.length === 0 && (
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
                        <button type="button" className="btn btn-danger" onClick={submitClose}>Confirmar Cierre</button>
                    </>
                }
            >
                <form id="closeRegisterForm" onSubmit={submitClose}>
                    <div className="alert alert-light border mb-4">
                        <small className="text-muted d-block text-uppercase mb-1">Saldo Esperado</small>
                        <h3 className="font-monospace mb-0">{formatCurrency(currentBalance)}</h3>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="closing_amount" className="form-label">Monto Real en Caja (Contado)</label>
                        <input
                            type="number"
                            className="form-control font-monospace"
                            min="0"
                            required
                            value={data.closing_amount}
                            onChange={(e) => setData('closing_amount', e.target.value)}
                            placeholder="0"
                            autoFocus
                        />
                        <div className="form-text">Ingresa el total de dinero físico contado.</div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Notas (Opcional)</label>
                        <textarea className="form-control" rows="3" placeholder="Observaciones del cierre..."></textarea>
                    </div>
                </form>
            </Drawer>
        </MainLayout>
    );
}
