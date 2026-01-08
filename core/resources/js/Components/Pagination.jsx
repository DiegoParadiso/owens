import React from 'react';
import { Link, router } from '@inertiajs/react';

export default function Pagination({ links, from, to, total, perPage, onPerPageChange }) {
    // Helper to get the actual URL for a page link
    const getUrl = (link) => {
        if (!link.url) return '#';
        // Ensure we preserve current query params (like search, per_page)
        const url = new URL(link.url);
        const params = new URLSearchParams(window.location.search);

        // Update page param from the link
        url.searchParams.forEach((value, key) => {
            params.set(key, value);
        });

        // Ensure per_page is preserved/set
        if (perPage) {
            params.set('per_page', perPage);
        }

        return `${window.location.pathname}?${params.toString()}`;
    };

    const handlePageClick = (e, link) => {
        e.preventDefault();
        if (!link.url || link.active) return;

        router.get(getUrl(link), {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    };

    return (
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-1 gap-3 px-2">
            {/* Rows per page selector & Counter */}
            <div className="d-flex align-items-center gap-3 small" style={{ color: 'var(--text-muted)' }}>
                <div className="d-flex align-items-center">
                    <span className="me-3">Mostrar</span>
                    <select
                        className="form-select form-select-sm border-0 shadow-none bg-transparent"
                        style={{
                            width: 'auto',
                            cursor: 'pointer',
                            paddingRight: '1.5rem',
                            color: 'var(--text-muted)',
                            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23a0a0a0' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e")`
                        }}
                        value={perPage}
                        onChange={(e) => onPerPageChange(e.target.value)}
                    >
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                    <span className="ms-1">registros</span>
                </div>
                <span className="border-start ps-3">
                    Mostrando {from || 0}-{to || 0} de {total || 0} resultados
                </span>
            </div>

            {/* Navigation Buttons */}
            {links.length > 3 && (
                <nav aria-label="Page navigation">
                    <ul className="pagination pagination-sm mb-0 align-items-center gap-0">
                        {/* First Page */}
                        <li className={`page-item ${!links[0].url ? 'disabled' : ''}`}>
                            <button
                                className="page-link border-0 d-flex align-items-center justify-content-center"
                                onClick={(e) => handlePageClick(e, links[0])}
                                disabled={!links[0].url}
                                style={{ width: '32px', height: '32px', backgroundColor: 'transparent', color: 'var(--text-muted)' }}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>chevron_backward</span>
                            </button>
                        </li>

                        {/* Page Numbers */}
                        {links.slice(1, -1).map((link, index) => {
                            return (
                                <li key={index} className="page-item">
                                    <button
                                        className={`page-link d-flex align-items-center justify-content-center ${link.active
                                            ? 'fw-bold'
                                            : ''
                                            }`}
                                        style={{
                                            width: '32px',
                                            height: '32px',
                                            fontSize: '0.9rem',
                                            backgroundColor: 'transparent',
                                            boxShadow: 'none',
                                            border: 'none',
                                            borderRadius: '0',
                                            color: link.active ? 'var(--text-main)' : 'var(--text-muted)'
                                        }}
                                        onClick={(e) => handlePageClick(e, link)}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    ></button>
                                </li>
                            );
                        })}

                        {/* Last Page */}
                        <li className={`page-item ${!links[links.length - 1].url ? 'disabled' : ''}`}>
                            <button
                                className="page-link border-0 d-flex align-items-center justify-content-center"
                                onClick={(e) => handlePageClick(e, links[links.length - 1])}
                                disabled={!links[links.length - 1].url}
                                style={{ width: '32px', height: '32px', backgroundColor: 'transparent', color: 'var(--text-muted)' }}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>chevron_forward</span>
                            </button>
                        </li>
                    </ul>
                </nav>
            )}
        </div>
    );
}
