import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { moduleConfig } from '../Config/moduleConfig';

export default function Sidebar({ isOpen, toggleSidebar, darkMode }) {
    const { url, props } = usePage();
    const user = props.auth.user;

    const isActive = (route) => {
        return url.startsWith(route) ? 'active' : '';
    };



    return (
        <>
            <div
                className={`sidebar pe-4 pb-3 pt-4 ${isOpen ? 'open' : ''} d-flex flex-column`}
            >
                <nav className="navbar navbar-light d-flex flex-column align-items-start h-100 w-100">
                    <div className="w-100 d-flex flex-column" style={{ flex: 1, minHeight: 0 }}>
                        <Link href="/admin/dashboard" className="d-flex justify-content-center w-100 mx-auto" style={{ marginBottom: '1.5rem' }}>
                            <img
                                id="sidebarLogo"
                                src={darkMode ? "/img/owens-darkmode.png" : "/img/owens.png"}
                                alt="Owens Logo"
                                style={{ width: '150px', height: 'auto', paddingLeft: '15px' }}
                            />
                        </Link>

                        <div className="d-flex align-items-center ms-4 mb-3">
                            <div className="position-relative">
                                <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '35px', height: '35px', backgroundColor: 'var(--border-color)', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '24px', color: 'var(--text-muted)' }}>
                                        {user.role === 'admin' ? 'person_4' : (user.role === 'owner' ? 'person' : 'person_apron')}
                                    </span>
                                </div>
                                <div className="bg-success rounded-circle border-2 border-white position-absolute end-0 bottom-0 p-1">
                                </div>
                            </div>
                            <div className="ms-3">
                                <h6 className="mb-0">{user.name}</h6>
                                <span className="small text-muted">
                                    {user.role === 'admin' ? 'Administrador' : (user.role === 'owner' ? 'Dueño' : 'Empleado')}
                                </span>
                            </div>
                        </div>

                        <div className="navbar-nav w-100" style={{ overflowY: 'auto', overflowX: 'hidden', flex: 1 }}>
                            {(user.role === 'admin' || user.role === 'owner') && moduleConfig.dashboard && (
                                <Link href="/admin/dashboard" className={`nav-item nav-link d-flex align-items-center ${isActive('/admin/dashboard')}`}>
                                    <i className="fa fa-tachometer-alt me-3" style={{ width: '24px', textAlign: 'center' }}></i>Dashboard
                                </Link>
                            )}
                            {(user.role === 'admin' || user.role === 'owner' || user.role === 'cajero') && moduleConfig.cashRegister && (
                                <Link href="/admin/cash-register" className={`nav-item nav-link d-flex align-items-center ${isActive('/admin/cash-register')}`}>
                                    <i className="fa fa-cash-register me-3" style={{ width: '24px', textAlign: 'center' }}></i>Caja
                                </Link>
                            )}
                            {(user.role === 'admin' || user.role === 'owner' || user.role === 'encargado') && moduleConfig.products && (
                                <Link href="/admin/products" className={`nav-item nav-link d-flex align-items-center ${isActive('/admin/products')}`}>
                                    <i className="fa fa-box me-3" style={{ width: '24px', textAlign: 'center' }}></i>Inventario
                                </Link>
                            )}
                            {(user.role === 'admin' || user.role === 'owner' || user.role === 'cajero') && moduleConfig.menu && (
                                <Link href="/admin/menu" className={`nav-item nav-link d-flex align-items-center ${isActive('/admin/menu')}`}>
                                    <i className="fa fa-book-open me-3" style={{ width: '24px', textAlign: 'center' }}></i>Menú
                                </Link>
                            )}

                            {(user.role === 'admin' || user.role === 'owner' || user.role === 'cajero') && moduleConfig.sales && (
                                <Link href="/admin/sales" className={`nav-item nav-link d-flex align-items-center ${isActive('/admin/sales')}`}>
                                    <i className="fa fa-shopping-cart me-3" style={{ width: '24px', textAlign: 'center' }}></i>Ventas
                                </Link>
                            )}

                            {(user.role === 'admin' || user.role === 'owner' || user.role === 'cajero') && moduleConfig.customers && (
                                <Link href="/admin/coming-soon" className={`nav-item nav-link d-flex align-items-center ${isActive('/admin/customers')}`}>
                                    <i className="fa fa-users me-3" style={{ width: '24px', textAlign: 'center' }}></i>Clientes
                                </Link>
                            )}

                            {(user.role === 'admin' || user.role === 'owner' || user.role === 'cocinero') && moduleConfig.kitchen && (
                                <Link href="/admin/coming-soon" className={`nav-item nav-link d-flex align-items-center ${isActive('/admin/kitchen')}`}>
                                    <i className="fa fa-fire me-3" style={{ width: '24px', textAlign: 'center' }}></i>Cocina
                                </Link>
                            )}

                            {(user.role === 'admin' || user.role === 'owner' || user.role === 'auditor') && (
                                <Link href="/admin/expenses" className={`nav-item nav-link d-flex align-items-center ${isActive('/admin/expenses') || isActive('/admin/purchases') || isActive('/admin/suppliers') ? 'active' : ''}`}>
                                    <i className="fa fa-wallet me-3" style={{ width: '24px', textAlign: 'center' }}></i>Finanzas
                                </Link>
                            )}

                            {(user.role === 'admin' || user.role === 'owner' || user.role === 'auditor') && moduleConfig.reports && (
                                <Link href="/admin/reports" className={`nav-item nav-link d-flex align-items-center ${isActive('/admin/reports')}`}>
                                    <i className="fa fa-chart-line me-3" style={{ width: '24px', textAlign: 'center' }}></i>Reportes
                                </Link>
                            )}

                            {(user.role === 'admin' || user.role === 'owner') && moduleConfig.staff && (
                                <Link href="/admin/coming-soon" className={`nav-item nav-link d-flex align-items-center ${isActive('/admin/staff')}`}>
                                    <i className="fa fa-id-badge me-3" style={{ width: '24px', textAlign: 'center' }}></i>Personal
                                </Link>
                            )}
                            
                            {(user.role === 'admin' || user.role === 'owner') && moduleConfig.settings && (
                                <Link href="/admin/settings" className={`nav-item nav-link d-flex align-items-center ${isActive('/admin/settings')}`}>
                                    <i className="fa fa-cog me-3" style={{ width: '24px', textAlign: 'center' }}></i>Configuración
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="navbar-nav w-100 mt-auto">
                        <Link href="/admin/logout" className="nav-item nav-link d-flex align-items-center">
                            <i className="fa fa-sign-out-alt me-3" style={{ width: '24px', textAlign: 'center' }}></i>Cerrar Sesión
                        </Link>
                    </div>
                </nav>
            </div>


        </>
    );

}
