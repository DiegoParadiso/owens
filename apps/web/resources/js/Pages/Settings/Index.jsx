import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import Drawer from '@/Components/Drawer';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { confirmAction } from '@/Utils/Alerts';

const ROLE_LABELS = {
    admin: 'Administrador',
    owner: 'Dueño',
    cajero: 'Cajero',
    cocinero: 'Cocinero',
    encargado: 'Encargado de Depósito',
    auditor: 'Auditor',
    employee: 'Empleado',
};

export default function Index({ users, system_mode, manage_stock }) {
    const { url } = usePage();
    const getTabFromUrl = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get('tab') === 'system' ? 'system' : 'profiles';
    };
    const [activeTab, setActiveTab] = useState(getTabFromUrl);

    useEffect(() => {
        setActiveTab(getTabFromUrl());
    }, [url]);

    const [showDrawer, setShowDrawer] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const { data, setData, post, put, processing, errors, reset, delete: destroy } = useForm({
        name: '',
        email: '',
        password: '',
        role: 'cajero',
    });

    const handleEdit = (user) => {
        setEditingUser(user);
        setData({
            name: user.name,
            email: user.email,
            password: '',
            role: user.role,
        });
        setShowDrawer(true);
    };

    const handleCloseDrawer = () => {
        setShowDrawer(false);
        setEditingUser(null);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        setShowDrawer(false);

        const options = {
            onSuccess: () => {
                handleCloseDrawer();
                window.toast.success(editingUser ? 'Usuario actualizado' : 'Usuario creado', 'La operación se realizó con éxito.');
            },
            onError: (errors) => {
                setShowDrawer(true);
                window.toast.error('Error', 'Error al guardar el usuario.');
            }
        };

        if (editingUser) {
            put(route('settings.updateUser', editingUser.id), options);
        } else {
            post(route('settings.storeUser'), options);
        }
    };

    const handleDelete = async (user) => {
        const ok = await confirmAction({
            title: 'Dar de Baja Usuario',
            category: 'Seguridad y Personal',
            message: `¿Confirma que desea revocar el acceso operativo de "${user.name}"?`,
            variant: 'danger',
            confirmText: 'Dar de Baja'
        });
        if (ok) {
            router.delete(route('settings.destroyUser', user.id), {
                onSuccess: (page) => {
                    if (page.props.flash?.error) {
                        window.toast.error('Operación bloqueada', page.props.flash.error);
                    } else {
                        window.toast.success('Usuario dado de baja', 'El acceso del usuario ha sido revocado correctamente.');
                    }
                },
                onError: () => {
                    window.toast.error('Error', 'No se pudo dar de baja al usuario.');
                }
            });
        }
    };

    const handleModeChange = (mode) => {
        router.post(route('settings.updateMode'), { mode: mode }, {
            preserveScroll: true,
            onSuccess: () => {
                window.toast.success('Modo Cambiado', `El sistema ahora está en modo ${mode === 'normal' ? 'Normal' : 'Avanzado'}.`);
            },
            onError: () => {
                window.toast.error('Error', 'No se pudo cambiar el modo del sistema.');
            }
        });
    };

    const handleStockToggle = (e) => {
        const isEnabled = e.target.checked;
        router.post(route('settings.updateStock'), { manage_stock: isEnabled }, {
            preserveScroll: true,
            onSuccess: () => {
                window.toast.success('Configuración guardada', `Gestión de stock ${isEnabled ? 'activada' : 'desactivada'}.`);
            },
            onError: () => {
                window.toast.error('Error', 'No se pudo guardar la configuración de stock.');
            }
        });
    };

    const handleResetDatabase = async () => {
        const ok = await confirmAction({
            title: 'Reiniciar Base de Datos',
            message: 'Se borrarán todos los datos de la base de datos, esta acción es irreversible.',
            variant: 'danger',
            confirmText: 'Sí, borrar todo'
        });
        if (ok) {
            router.post(route('settings.resetDatabase'), {}, {
                onSuccess: () => {
                    window.toast.success('Base de datos reiniciada', 'Todos los datos han sido borrados.');
                },
                onError: () => {
                    window.toast.error('Error', 'Error al reiniciar la base de datos.');
                }
            });
        }
    };

    return (
        <MainLayout>
            <Head title="Configuración" />
            <div className="container-fluid pt-4 px-4">
                <h4 className="mb-4 fw-bold">Configuración</h4>

                <ul className="nav nav-tabs mb-4 border-bottom-0">
                    <li className="nav-item">
                        <button
                            className={`nav-link border-0 ${activeTab === 'profiles' ? 'active fw-bold' : ''}`}
                            style={{
                                color: activeTab === 'profiles' ? 'var(--text-main)' : 'var(--text-muted)',
                                backgroundColor: 'transparent',
                                borderBottom: activeTab === 'profiles' ? '2px solid var(--primary-color)' : 'none'
                            }}
                            onClick={() => setActiveTab('profiles')}
                        >
                            Perfiles
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link border-0 ${activeTab === 'system' ? 'active fw-bold' : ''}`}
                            style={{
                                color: activeTab === 'system' ? 'var(--text-main)' : 'var(--text-muted)',
                                backgroundColor: 'transparent',
                                borderBottom: activeTab === 'system' ? '2px solid var(--primary-color)' : 'none'
                            }}
                            onClick={() => setActiveTab('system')}
                        >
                            Sistema
                        </button>
                    </li>
                </ul>

                {activeTab === 'profiles' && (
                    <div className="card-minimal">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="mb-0">Administrar Usuarios</h5>
                            <button className="btn btn-primary btn-sm" onClick={() => setShowDrawer(true)}>
                                <i className="bi bi-plus-lg me-2"></i>Nuevo Usuario
                            </button>
                        </div>
                        <div className="table-responsive">
                            <table className="table-minimal">
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Email</th>
                                        <th>Rol</th>
                                        <th className="text-end">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.id}>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>
                                                <span className={`badge ${['admin', 'owner'].includes(user.role) ? 'bg-primary' : 'bg-secondary'}`}>
                                                    {ROLE_LABELS[user.role] || user.role}
                                                </span>
                                            </td>
                                            <td className="text-end">
                                                <div className="d-flex justify-content-end gap-2">
                                                    <button
                                                        className="btn btn-icon-only bg-transparent border-0"
                                                        onClick={() => handleEdit(user)}
                                                        title="Editar"
                                                    >
                                                        <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--text-muted)' }}>edit_square</span>
                                                    </button>
                                                    {user.role !== 'admin' && (
                                                        <button
                                                            className="btn btn-icon-only bg-transparent border-0"
                                                            onClick={() => handleDelete(user)}
                                                            title="Eliminar"
                                                        >
                                                            <span className="material-symbols-outlined" style={{ fontSize: '22px', color: 'var(--text-muted)', transform: 'translateY(-1px)' }}>delete</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>                )}

                {activeTab === 'system' && (
                    <div className="card-minimal">
                        <h5 className="mb-4">Configuración del Sistema</h5>

                        <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom">
                            <div>
                                <h6 className="mb-1 fw-bold">Gestión de Stock</h6>
                                <p className="text-muted small mb-0">Habilitar validaciones de stock y opciones visuales en Punto de Venta.</p>
                            </div>
                            <div className="form-check form-switch fs-4">
                                <input 
                                    className="form-check-input" 
                                    type="checkbox" 
                                    role="switch" 
                                    checked={manage_stock}
                                    onChange={handleStockToggle}
                                />
                            </div>
                        </div>

                        <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom">
                            <div>
                                <h6 className="mb-1 fw-bold">Base de Datos</h6>
                                <p className="text-muted small mb-0">Reiniciar el sistema borrando todas las ventas, productos y registros (mantiene usuarios).</p>
                            </div>
                            <button className="btn btn-outline-danger btn-sm px-3" onClick={handleResetDatabase}>
                                <i className="bi bi-trash me-2"></i>Resetear Datos
                            </button>
                        </div>
                    </div>
                )}

            </div>

            <Drawer
                isOpen={showDrawer}
                onClose={handleCloseDrawer}
                title={editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
                footer={
                    <>
                        <button type="button" className="btn btn-light" onClick={handleCloseDrawer}>Cancelar</button>
                        <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={processing}>
                            {editingUser ? 'Actualizar' : 'Guardar'}
                        </button>
                    </>
                }
            >
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Nombre</label>
                        <input
                            type="text"
                            className="form-control input-clean"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            required
                        />
                        {errors.name && <div className="text-danger small">{errors.name}</div>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control input-clean"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            required
                        />
                        {errors.email && <div className="text-danger small">{errors.email}</div>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Contraseña {editingUser && <span className="text-muted small">(Dejar en blanco para mantener)</span>}</label>
                        <input
                            type="password"
                            className="form-control input-clean"
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                            required={!editingUser}
                        />
                        {errors.password && <div className="text-danger small">{errors.password}</div>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Rol</label>
                        <select
                            className="form-select input-clean"
                            value={data.role}
                            onChange={e => setData('role', e.target.value)}
                            required
                        >
                            <option value="cajero">Cajero</option>
                            <option value="cocinero">Cocinero</option>
                            <option value="encargado">Encargado de Depósito</option>
                            <option value="auditor">Auditor</option>
                            <option value="admin">Administrador</option>
                            <option value="owner">Dueño</option>
                        </select>
                        {errors.role && <div className="text-danger small">{errors.role}</div>}
                    </div>
                </form>
            </Drawer>
        </MainLayout>
    );
}
