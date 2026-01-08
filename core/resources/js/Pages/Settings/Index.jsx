import React, { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import Drawer from '@/Components/Drawer';
import { Head, useForm, router } from '@inertiajs/react';
import Swal from 'sweetalert2';
import Toast from '@/Utils/Toast';

export default function Index({ users }) {
    const [activeTab, setActiveTab] = useState('profiles');
    const [showDrawer, setShowDrawer] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const { data, setData, post, put, processing, errors, reset, delete: destroy } = useForm({
        name: '',
        email: '',
        password: '',
        role: 'employee',
    });

    const handleEdit = (user) => {
        setEditingUser(user);
        setData({
            name: user.name,
            email: user.email,
            password: '', // Password is optional on edit
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

        setShowDrawer(false); // Close immediately

        const options = {
            onSuccess: () => {
                handleCloseDrawer(); // Reset state
                Toast.fire({
                    icon: 'success',
                    title: editingUser ? 'Usuario actualizado' : 'Usuario creado'
                });
            },
            onError: (errors) => {
                setShowDrawer(true); // Re-open on error
                Toast.fire({
                    icon: 'error',
                    title: 'Error al guardar usuario'
                });
            }
        };

        if (editingUser) {
            put(route('settings.updateUser', editingUser.id), options);
        } else {
            post(route('settings.storeUser'), options);
        }
    };

    const handleDelete = (user) => {
        Swal.fire({
            text: "¿Eliminar este usuario?",
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
                router.delete(route('settings.destroyUser', user.id), {
                    onSuccess: () => {
                        Toast.fire({
                            icon: 'success',
                            title: 'Usuario eliminado'
                        });
                    },
                    onError: (errors) => {
                        Toast.fire({
                            icon: 'error',
                            title: 'No se pudo eliminar el usuario'
                        });
                    }
                });
            }
        });
    };

    const handleResetDatabase = () => {
        Swal.fire({
            text: "Se borrarán todos los datos de la base de datos, esta acción es irreversible.",
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Si, borrar todo',
            cancelButtonText: 'Cancelar',
            buttonsStyling: true,
            customClass: {
                popup: 'swal-minimal',
                confirmButton: 'btn btn-danger px-4',
                cancelButton: 'btn btn-secondary px-4'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(route('settings.resetDatabase'), {}, {
                    onSuccess: () => {
                        Swal.fire(
                            '¡Reiniciado!',
                            'La base de datos ha sido reiniciada.',
                            'success'
                        );
                    },
                    onError: () => {
                        Swal.fire(
                            'Error',
                            'Hubo un problema al reiniciar la base de datos.',
                            'error'
                        );
                    }
                });
            }
        });
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
                                                <span className={`badge ${user.role === 'employee' ? 'bg-secondary' : 'bg-primary'}`}>
                                                    {user.role === 'admin' ? 'Administrador' : (user.role === 'owner' ? 'Dueño' : 'Empleado')}
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
                    </div>
                )}

                {activeTab === 'system' && (
                    <div className="card-minimal border-danger">
                        <h5 className="text-danger mb-3">Zona Crítica</h5>
                        <p className="text-muted">
                            Estas acciones no se pueden deshacer.
                        </p>
                        <hr />
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 className="fw-bold">Reiniciar Base de Datos</h6>
                                <p className="small text-muted mb-0">Borra todos los datos y restaura los valores por defecto.</p>
                            </div>
                            <button className="btn btn-danger" onClick={handleResetDatabase}>
                                Borrar Todo
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
                            className="form-control"
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
                            className="form-control"
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
                            className="form-control"
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                            required={!editingUser}
                        />
                        {errors.password && <div className="text-danger small">{errors.password}</div>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Rol</label>
                        <select
                            className="form-select"
                            value={data.role}
                            onChange={e => setData('role', e.target.value)}
                            required
                        >
                            <option value="employee">Empleado</option>
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
