import React from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function Sidebar({ isOpen, toggleSidebar, darkMode }) {
    const { url } = usePage();
    const user = { name: 'Admin User', role: 'Administrator' };

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
                        <Link href="/dashboard" className="d-flex justify-content-center w-100 mx-auto" style={{ marginBottom: '2.25rem' }}>
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
                                    AU
                                </div>
                                <div className="bg-success rounded-circle border-2 border-white position-absolute end-0 bottom-0 p-1">
                                </div>
                            </div>
                            <div className="ms-3">
                                <h6 className="mb-0">{user.name}</h6>
                                <span className="small text-muted">{user.role}</span>
                            </div>
                        </div>
                        <div className="navbar-nav w-100">
                            <Link href="/dashboard" className={`nav-item nav-link ${isActive('/dashboard')}`}>
                                <i className="fa fa-tachometer-alt me-2"></i>Dashboard
                            </Link>
                            <Link href="/cash-register" className={`nav-item nav-link ${isActive('/cash-register')}`}>
                                <i className="fa fa-cash-register me-2"></i>Caja
                            </Link>
                            <Link href="/products" className={`nav-item nav-link ${isActive('/products')}`}>
                                <i className="fa fa-box me-2"></i>Inventario
                            </Link>
                            <Link href="/combos" className={`nav-item nav-link ${isActive('/combos')}`}>
                                <i className="fa fa-utensils me-2"></i>Combos
                            </Link>
                            <Link href="/sales" className={`nav-item nav-link ${isActive('/sales')}`}>
                                <i className="fa fa-shopping-cart me-2"></i>Ventas
                            </Link>
                            <Link href="/suppliers" className={`nav-item nav-link ${isActive('/suppliers')}`}>
                                <i className="fa fa-truck me-2"></i>Proveedores
                            </Link>
                            <Link href="/purchases" className={`nav-item nav-link ${isActive('/purchases')}`}>
                                <i className="fa fa-shopping-bag me-2"></i>Compras
                            </Link>
                            <Link href="/expenses" className={`nav-item nav-link ${isActive('/expenses')}`}>
                                <i className="fa fa-money-bill-wave me-2"></i>Gastos
                            </Link>
                            <Link href="/reports" className={`nav-item nav-link ${isActive('/reports')}`}>
                                <i className="fa fa-chart-line me-2"></i>Reportes
                            </Link>
                        </div>
                    </div>

                    <div className="navbar-nav w-100 mt-auto">
                        <Link href="/logout" className="nav-item nav-link">
                            <i className="fa fa-sign-out-alt me-2"></i>Cerrar Sesión
                        </Link>
                    </div>
                </nav>
            </div>


        </>
    );

}
