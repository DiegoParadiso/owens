import React from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function FinanceNavbar() {
    const { url } = usePage();

    const tabs = [
        { name: 'Gastos', route: '/admin/expenses', active: url.startsWith('/admin/expenses') },
        { name: 'Compras', route: '/admin/purchases', active: url.startsWith('/admin/purchases') },
        { name: 'Proveedores', route: '/admin/suppliers', active: url.startsWith('/admin/suppliers') },
    ];

    return (
        <div className="mb-4">
            <h4 className="mb-4 fw-bold">Finanzas</h4>

            <ul className="nav nav-tabs border-bottom-0">
                {tabs.map((tab) => (
                    <li className="nav-item" key={tab.route}>
                        <Link
                            href={tab.route}
                            className={`nav-link border-0 ${tab.active ? 'active fw-bold' : ''}`}
                            style={{
                                color: tab.active ? 'var(--text-main)' : 'var(--text-muted)',
                                backgroundColor: 'transparent',
                                borderBottom: tab.active ? '2px solid var(--primary)' : 'none'
                            }}
                        >
                            {tab.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
