import React, { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import Drawer from '@/Components/Drawer';
import { Head, Link, useForm, router } from '@inertiajs/react';
import Swal from 'sweetalert2';

import Pagination from '@/Components/Pagination';

export default function Index({ expenses = [], categories = [] }) {

    const [showDrawer, setShowDrawer] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);
    const now = new Date();
    const { data, setData, post, put, processing, errors, reset, transform, delete: destroy } = useForm({
        description: '',
        amount: '',
        category_id: '',
        date: now.toISOString().split('T')[0],
        time: now.toTimeString().slice(0, 5),
        payment_method: 'cash',
        split_payments: [],
    });

    const formatPaymentMethod = (method) => {
        const methods = {
            'cash': 'Efectivo',
            'debit_card': 'Débito',
            'credit_card': 'Crédito',
            'transfer': 'Transferencia',
            'qr': 'QR',
            'multiple': 'Múltiple'
        };
        return methods[method] || method;
    };


    const updateSplitPayment = (index, field, value) => {
        const updated = [...data.split_payments];
        updated[index][field] = value;
        setData('split_payments', updated);
    };

    const addSplitPayment = () => {
        setData('split_payments', [
            ...data.split_payments,
            { method: 'cash', amount: '' }
        ]);
    };

    const removeSplitPayment = (index) => {
        setData('split_payments', data.split_payments.filter((_, i) => i !== index));
    };

    const calculateSplitTotal = () => {
        return data.split_payments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
    };

    const formatCurrency = (amount, decimals = 2) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(amount);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    };

    const handleEdit = (expense) => {
        setEditingExpense(expense);
        const expenseDate = new Date(expense.date);
        setData({
            description: expense.description,
            amount: expense.amount,
            category_id: expense.category_id,
            date: expenseDate.toISOString().split('T')[0],
            time: expenseDate.toTimeString().slice(0, 5),
            payment_method: expense.payment_method || 'cash',
            split_payments: expense.payments ? expense.payments.map(p => ({
                method: p.payment_method,
                amount: p.amount
            })) : []
        });
        setShowDrawer(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();


        const datetime = `${data.date}T${data.time}:00`;


        if (data.payment_method === 'cash' && !editingExpense) {
            const selectedDate = new Date(datetime);
            const twoDaysAgo = new Date();
            twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

            if (selectedDate < twoDaysAgo) {
                Swal.fire({
                    text: 'Estás registrando un gasto con fecha pasada en la caja actual, ¿es correcto?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#df0f13',
                    cancelButtonColor: '#6c757d',
                    confirmButtonText: 'Sí, continuar',
                    cancelButtonText: 'Cancelar',
                    customClass: {
                        popup: 'swal-minimal',
                        confirmButton: 'btn btn-primary px-4',
                        cancelButton: 'btn btn-secondary px-4'
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        submitExpense();
                    }
                });
                return;
            }
        }


        if (data.payment_method === 'multiple') {
            const splitTotal = calculateSplitTotal();
            if (Math.abs(splitTotal - parseFloat(data.amount)) > 0.01) {
                window.toast.error('Error en distribución', `La suma de los pagos (${formatCurrency(splitTotal)}) debe ser igual al total (${formatCurrency(data.amount)})`);
                return;
            }
        }

        submitExpense();
    };

    const submitExpense = () => {
        setShowDrawer(false);
        transform((data) => ({
            ...data,
            date: `${data.date}T${data.time}:00`
        }));

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                setEditingExpense(null);
                reset();
                window.toast.success(editingExpense ? 'Gasto actualizado' : 'Gasto guardado', 'La operación se realizó con éxito.');
            },
            onError: (errors) => {
                setShowDrawer(true);
                const errorMessage = errors.error || (editingExpense ? 'Error al actualizar el gasto' : 'Error al registrar el gasto');
                window.toast.error('Error', errorMessage);
            }
        };

        if (editingExpense) {
            put(route('expense.update', editingExpense.id), options);
        } else {
            post(route('expense.store'), options);
        }
    };

    const handleCloseDrawer = () => {
        setShowDrawer(false);
        setEditingExpense(null);
        reset();
    };

    const handleDelete = (id) => {
        Swal.fire({
            text: "¿Eliminar este gasto?",
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
                router.delete(route('expense.destroy', id), {
                    preserveScroll: true,
                    onSuccess: () => {
                        window.toast.success('Eliminado', 'El gasto ha sido eliminado correctamente.');
                    },
                });
            }
        });
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
                                    <th scope="col">Categoría</th>
                                    <th scope="col">Monto</th>
                                    <th scope="col">Método Pago</th>
                                    <th scope="col" className="text-end">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {expenses.data.map((expense, index) => (
                                    <tr key={expense.id}>
                                        <td className="text-muted">{(expenses.current_page - 1) * expenses.per_page + index + 1}</td>
                                        <td>{formatDate(expense.date)}</td>
                                        <td className="fw-medium">{expense.description}</td>
                                        <td>
                                            <span className="badge bg-transparent border text-dark">
                                                {expense.category ? expense.category.name : 'Sin categoría'}
                                            </span>
                                        </td>
                                        <td className="font-tabular fw-semibold">{formatCurrency(expense.amount)}</td>
                                        <td>
                                            <span className="badge bg-transparent border text-dark">
                                                {formatPaymentMethod(expense.payment_method)}
                                            </span>
                                        </td>
                                        <td className="text-end">
                                            <div className="d-flex justify-content-end gap-2">
                                                <button
                                                    className="btn btn-icon-only bg-transparent border-0"
                                                    onClick={() => handleEdit(expense)}
                                                    title="Editar"
                                                >
                                                    <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--text-muted)' }}>edit_square</span>
                                                </button>
                                                <button
                                                    className="btn btn-icon-only bg-transparent border-0"
                                                    onClick={() => handleDelete(expense.id)}
                                                    title="Eliminar"
                                                >
                                                    <span className="material-symbols-outlined" style={{ fontSize: '22px', color: 'var(--text-muted)', transform: 'translateY(-1px)' }}>delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {expenses.data.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="text-center py-4 text-muted">
                                            No hay gastos registrados
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <Pagination
                        links={expenses.links}
                        from={expenses.from}
                        to={expenses.to}
                        total={expenses.total}
                        perPage={expenses.per_page}
                        onPerPageChange={(newPerPage) => {
                            router.get(route('expense.index'), { per_page: newPerPage }, { preserveState: true, replace: true });
                        }}
                    />
                </div>
            </div>

            <Drawer
                isOpen={showDrawer}
                onClose={handleCloseDrawer}
                title={editingExpense ? 'Editar Gasto' : 'Nuevo Gasto'}
                footer={
                    <>
                        <button type="button" className="btn btn-light" onClick={handleCloseDrawer}>Cancelar</button>
                        <button type="button" className="btn btn-primary text-nowrap" onClick={handleSubmit}>
                            {editingExpense ? 'Actualizar Gasto' : 'Guardar Gasto'}
                        </button>
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
                            step="0.01"
                            required
                            value={data.amount}
                            onChange={(e) => setData('amount', e.target.value)}
                            placeholder="0.00"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="category_id" className="form-label">Categoría</label>
                        <select
                            className="form-select"
                            id="category_id"
                            value={data.category_id}
                            onChange={(e) => setData('category_id', e.target.value)}
                            required
                        >
                            <option value="">Seleccionar categoría</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-6">
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
                        <div className="col-md-6">
                            <label htmlFor="time" className="form-label">Hora</label>
                            <input
                                type="time"
                                className="form-control"
                                id="time"
                                value={data.time}
                                onChange={(e) => setData('time', e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="form-label fw-semibold">Método de Pago</label>
                        <div className="d-flex gap-2 flex-wrap">
                            <button
                                type="button"
                                className={`btn btn-sm ${data.payment_method === 'cash' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                onClick={() => setData('payment_method', 'cash')}
                            >
                                Efectivo
                            </button>
                            <button
                                type="button"
                                className={`btn btn-sm ${data.payment_method === 'debit_card' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                onClick={() => setData('payment_method', 'debit_card')}
                            >
                                Débito
                            </button>
                            <button
                                type="button"
                                className={`btn btn-sm ${data.payment_method === 'credit_card' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                onClick={() => setData('payment_method', 'credit_card')}
                            >
                                Crédito
                            </button>
                            <button
                                type="button"
                                className={`btn btn-sm ${data.payment_method === 'transfer' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                onClick={() => setData('payment_method', 'transfer')}
                            >
                                Transferencia
                            </button>
                            <button
                                type="button"
                                className={`btn btn-sm ${data.payment_method === 'qr' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                onClick={() => setData('payment_method', 'qr')}
                            >
                                QR
                            </button>
                            <button
                                type="button"
                                className={`btn btn-sm ${data.payment_method === 'multiple' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                onClick={() => {
                                    setData('payment_method', 'multiple');
                                    if (data.split_payments.length === 0) {
                                        setData('split_payments', [
                                            { method: 'cash', amount: '' },
                                            { method: 'debit_card', amount: '' }
                                        ]);
                                    }
                                }}
                            >
                                Múltiple
                            </button>
                        </div>


                        {data.payment_method === 'multiple' && (
                            <div className="mt-3 p-3 border rounded" style={{ backgroundColor: 'var(--bg-card)' }}>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <strong className="small">Distribución de Pago</strong>
                                    <small className="text-muted">Total: {formatCurrency(data.amount || 0)}</small>
                                </div>

                                {data.split_payments.map((payment, index) => (
                                    <div key={index} className="row mb-2 align-items-center">
                                        <div className="col-5">
                                            <select
                                                className="form-select form-select-sm"
                                                value={payment.method}
                                                onChange={(e) => updateSplitPayment(index, 'method', e.target.value)}
                                            >
                                                <option value="cash">Efectivo</option>
                                                <option value="debit_card">Débito</option>
                                                <option value="credit_card">Crédito</option>
                                                <option value="transfer">Transferencia</option>
                                                <option value="qr">QR</option>
                                            </select>
                                        </div>
                                        <div className="col-6">
                                            <input
                                                type="number"
                                                step="0.01"
                                                className="form-control form-control-sm"
                                                placeholder="Monto"
                                                value={payment.amount}
                                                onChange={(e) => updateSplitPayment(index, 'amount', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-1">
                                            {data.split_payments.length > 1 && (
                                                <button
                                                    type="button"
                                                    className="border-0 bg-transparent p-0"
                                                    onClick={() => removeSplitPayment(index)}
                                                    style={{ color: '#dc3545', cursor: 'pointer' }}
                                                >
                                                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>delete</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-secondary mt-2"
                                    onClick={addSplitPayment}
                                >
                                    <i className="bi bi-plus-lg me-1"></i>
                                    Agregar Método
                                </button>


                                {Math.abs(calculateSplitTotal() - (parseFloat(data.amount) || 0)) > 0.01 && (
                                    <div
                                        className="mt-3 p-2 rounded small border"
                                        style={{
                                            backgroundColor: 'var(--bg-card)',
                                            color: 'var(--text-primary)'
                                        }}
                                    >
                                        <div className="d-flex justify-content-between">
                                            <span>Suma actual:</span>
                                            <strong>{formatCurrency(calculateSplitTotal())}</strong>
                                        </div>
                                        <div className="d-flex justify-content-between mt-1">
                                            <span>Diferencia:</span>
                                            <strong style={{ color: '#dc3545' }}>
                                                {formatCurrency(Math.abs((parseFloat(data.amount) || 0) - calculateSplitTotal()))}
                                                {calculateSplitTotal() < (parseFloat(data.amount) || 0) ? ' (falta)' : ' (sobra)'}
                                            </strong>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {data.payment_method === 'cash' && (
                            <div className="alert alert-info mt-2 mb-0 py-2 small">
                                <i className="bi bi-info-circle me-2"></i>
                                Este monto se descontará del efectivo disponible
                            </div>
                        )}
                        {data.payment_method !== 'cash' && data.payment_method !== 'multiple' && (
                            <div className="alert alert-secondary mt-2 mb-0 py-2 small">
                                <i className="bi bi-info-circle me-2"></i>
                                Gasto administrativo. No afecta el saldo de caja
                            </div>
                        )}
                    </div>
                </form>
            </Drawer>
        </MainLayout>
    );
}
