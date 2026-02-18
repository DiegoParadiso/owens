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
                    <div className="w-100">
                        <Link href="/admin/dashboard" className="d-flex justify-content-center w-100 mx-auto" style={{ marginBottom: '2.25rem' }}>
                            <img
                                id="sidebarLogo"
                                src={darkMode ? "/img/owens-darkmode.png" : "/img/owens.png"}
                                alt="Owens Logo"
                                style={{ width: '150px', height: 'auto', paddingLeft: '15px' }}
                            />
                        </Link>

                        <div className="d-flex align-items-center ms-4 mb-4">
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

                        <div className="navbar-nav w-100">
                            {moduleConfig.dashboard && (
                                <Link href="/admin/dashboard" className={`nav-item nav-link d-flex align-items-center ${isActive('/admin/dashboard')}`}>
                                    <i className="fa fa-tachometer-alt me-3" style={{ width: '24px', textAlign: 'center' }}></i>Dashboard
                                </Link>
                            )}
                            {moduleConfig.cashRegister && (
                                <Link href="/admin/cash-register" className={`nav-item nav-link d-flex align-items-center ${isActive('/admin/cash-register')}`}>
                                    <i className="fa fa-cash-register me-3" style={{ width: '24px', textAlign: 'center' }}></i>Caja
                                </Link>
                            )}
                            {moduleConfig.products && (
                                <Link href="/admin/products" className={`nav-item nav-link d-flex align-items-center ${isActive('/admin/products')}`}>
                                    <i className="fa fa-box me-3" style={{ width: '24px', textAlign: 'center' }}></i>Inventario
                                </Link>
                            )}
                            {moduleConfig.menu && (
                                <Link href="/admin/menu" className={`nav-item nav-link d-flex align-items-center ${isActive('/admin/menu')}`}>
                                    <i className="fa fa-book-open me-3" style={{ width: '24px', textAlign: 'center' }}></i>Menú
                                </Link>
                            )}
                            {moduleConfig.whatsapp && (
                                <Link href="/admin/whatsapp" className={`nav-item nav-link d-flex align-items-center ${isActive('/admin/whatsapp')}`}>
                                    <i className="bi bi-whatsapp me-3" style={{ width: '24px', textAlign: 'center' }}></i>WhatsApp
                                </Link>
                            )}
                            {moduleConfig.production && (
                                <Link href="/admin/production" className={`nav-item nav-link d-flex align-items-center ${isActive('/admin/production')}`}>
                                    <i className="fa fa-blender me-3" style={{ width: '24px', textAlign: 'center' }}></i>Producción
                                </Link>
                            )}
                            {moduleConfig.tables && (
                                <Link href="/admin/tables" className={`nav-item nav-link d-flex align-items-center ${isActive('/admin/tables')}`}>
                                    <i className="fa fa-chair me-3" style={{ width: '24px', textAlign: 'center' }}></i>Mesas
                                </Link>
                            )}

                            {moduleConfig.sales && (
                                <Link href="/admin/sales" className={`nav-item nav-link d-flex align-items-center ${isActive('/admin/sales')}`}>
                                    <i className="fa fa-shopping-cart me-3" style={{ width: '24px', textAlign: 'center' }}></i>Ventas
                                </Link>
                            )}
                            {moduleConfig.finances && (
                                <Link href="/admin/expenses" className={`nav-item nav-link d-flex align-items-center ${isActive('/admin/expenses') || isActive('/admin/purchases') || isActive('/admin/suppliers') ? 'active' : ''}`}>
                                    <i className="fa fa-wallet me-3" style={{ width: '24px', textAlign: 'center' }}></i>Finanzas
                                </Link>
                            )}
                            {moduleConfig.reports && (
                                <Link href="/admin/reports" className={`nav-item nav-link d-flex align-items-center ${isActive('/admin/reports')}`}>
                                    <i className="fa fa-chart-line me-3" style={{ width: '24px', textAlign: 'center' }}></i>Reportes
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
