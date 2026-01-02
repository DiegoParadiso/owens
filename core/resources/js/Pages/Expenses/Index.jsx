import React, { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import Drawer from '@/Components/Drawer';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Index({ expenses = [] }) {

    const [showDrawer, setShowDrawer] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        description: '',
        amount: '',
        type: 'fixed',
        date: new Date().toISOString().split('T')[0],
        payment_method: 'cash',
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Gasto registrado (Simulación)');
        setShowDrawer(false);
        reset();
    };

    return (
        <MainLayout>
            <Head title="Gastos" />
            <div className="container-fluid pt-4 px-4">

                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="mb-0 fw-bold">Gastos</h4>
                    <button
                        className="btn btn-primary rounded-pill px-3"
                        onClick={() => setShowDrawer(true)}
                    >
                        <i className="bi bi-plus-lg me-2"></i>Registrar Gasto
                    </button>
                </div>

                <div className="card-minimal">
                    <div className="table-responsive">
                        <table className="table-minimal">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Fecha</th>
                                    <th scope="col">Descripción</th>
                                    <th scope="col">Tipo</th>
                                    <th scope="col" className="text-end">Monto</th>
                                    <th scope="col">Registrado por</th>
                                </tr>
                            </thead>
                            <tbody>
                                {expenses.map((expense, index) => (
                                    <tr key={expense.id}>
                                        <td className="text-muted font-monospace">{index + 1}</td>
                                        <td className="font-monospace text-muted">{formatDate(expense.date)}</td>
                                        <td className="fw-medium">{expense.description}</td>
                                        <td>
                                            {expense.type === 'fixed' ? (
                                                <span className="fw-medium">Fijo</span>
                                            ) : (
                                                <span className="fw-medium">Variable</span>
                                            )}
                                        </td>
                                        <td className="text-end font-tabular fw-semibold">{formatCurrency(expense.amount)}</td>
                                        <td>{expense.user.name}</td>
                                    </tr>
                                ))}
                                {expenses.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4 text-muted">No hay datos de gastos</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Drawer
                isOpen={showDrawer}
                onClose={() => setShowDrawer(false)}
                title="Registrar Gasto"
                footer={
                    <>
                        <button type="button" className="btn btn-light" onClick={() => setShowDrawer(false)}>Cancelar</button>
                        <button type="button" className="btn btn-primary" onClick={handleSubmit}>Guardar Gasto</button>
                    </>
                }
            >
                <form id="createExpenseForm" onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Descripción</label>
                        <input
                            type="text"
                            className="form-control"
                            id="description"
                            required
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Ej. Pago de Luz"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="amount" className="form-label">Monto ($)</label>
                        <input
                            type="number"
                            className="form-control"
                            id="amount"
                            min="0"
                            required
                            value={data.amount}
                            onChange={(e) => setData('amount', e.target.value)}
                            placeholder="0.00"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="type" className="form-label">Tipo de Gasto</label>
                        <select
                            className="form-select"
                            id="type"
                            value={data.type}
                            onChange={(e) => setData('type', e.target.value)}
                            required
                        >
                            <option value="fixed">Fijo</option>
                            <option value="variable">Variable</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="date" className="form-label">Fecha</label>
                        <input
                            type="date"
                            className="form-control"
                            id="date"
                            value={data.date}
                            onChange={(e) => setData('date', e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="payment_method" className="form-label">Método de Pago</label>
                        <select
                            className="form-select"
                            id="payment_method"
                            value={data.payment_method}
                            onChange={(e) => setData('payment_method', e.target.value)}
                            required
                        >
                            <option value="cash">Caja (Se descontará del saldo actual)</option>
                            <option value="external">Externo (Banco, Tarjeta, etc.)</option>
                        </select>
                    </div>
                </form>
            </Drawer>
        </MainLayout>
    );
}
