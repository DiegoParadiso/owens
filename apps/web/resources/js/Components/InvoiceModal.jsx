import React from 'react';
import { Modal } from 'react-bootstrap';

export default function InvoiceModal({ show, onHide, sale }) {
    if (!sale) return null;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
        }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-AR');
    };

    const isAfipAuthorized = sale.afip_cae && sale.afip_resultado === 'A';

    return (
        <Modal show={show} onHide={onHide} size="lg" centered className="invoice-modal">
            <Modal.Header closeButton className="border-0 pb-0">
                <Modal.Title className="fw-bold">Visualizar Comprobante</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
                <div className="invoice-container p-4 border rounded bg-white shadow-sm" id="printable-invoice">
                    {/* Header Fiscal */}
                    <div className="d-flex justify-content-between border-bottom pb-3 mb-3">
                        <div className="company-info">
                            <h2 className="fw-bold mb-0">OWENS</h2>
                            <p className="mb-0 text-muted small">Owens Burguer & Beer</p>
                            <p className="mb-0 small">Calle Falsa 123, Buenos Aires</p>
                            <p className="mb-0 small">IVA Responsable Inscripto</p>
                        </div>
                        <div className="invoice-type text-center border px-3 py-2 bg-light">
                            <h1 className="mb-0 fw-bold">C</h1>
                            <span className="small text-uppercase fw-bold">Cod. 011</span>
                        </div>
                        <div className="invoice-info text-end">
                            <h5 className="fw-bold mb-1">FACTURA</h5>
                            <p className="mb-0 small"><strong>Nº:</strong> {String(sale.afip_cbte_nro || '0').padStart(8, '0')}</p>
                            <p className="mb-0 small"><strong>Fecha:</strong> {formatDate(sale.created_at)}</p>
                            <p className="mb-0 small"><strong>CUIT:</strong> 20453390153</p>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="customer-info mb-4">
                        <p className="mb-1"><strong>Cliente:</strong> Consumidor Final</p>
                        <p className="mb-1"><strong>Condición IVA:</strong> Consumidor Final</p>
                        <p className="mb-1"><strong>Método de Pago:</strong> {sale.payment_method}</p>
                    </div>

                    {/* Table */}
                    <table className="table table-sm table-bordered mb-4">
                        <thead className="bg-light">
                            <tr>
                                <th>Descripción</th>
                                <th className="text-center" style={{ width: '80px' }}>Cant.</th>
                                <th className="text-end" style={{ width: '120px' }}>P. Uni</th>
                                <th className="text-end" style={{ width: '120px' }}>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sale.sale_details && sale.sale_details.map((detail, idx) => (
                                <tr key={idx}>
                                    <td>{detail.product.name}</td>
                                    <td className="text-center">{parseInt(detail.quantity)}</td>
                                    <td className="text-end">{formatCurrency(detail.price)}</td>
                                    <td className="text-end">{formatCurrency(detail.subtotal)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="3" className="text-end fw-bold">TOTAL</td>
                                <td className="text-end fw-bold bg-light">{formatCurrency(sale.total_price)}</td>
                            </tr>
                        </tfoot>
                    </table>

                    {/* Footer Fiscal AFIP */}
                    {isAfipAuthorized ? (
                        <div className="afip-footer border-top pt-3 mt-4">
                            <div className="d-flex justify-content-between align-items-end">
                                <div className="qr-sim">
                                    <div style={{ width: '80px', height: '80px', background: '#f8f9fa', border: '1px solid #ddd' }} className="d-flex align-items-center justify-content-center">
                                        <i className="bi bi-qr-code" style={{ fontSize: '2rem' }}></i>
                                    </div>
                                    <p className="mb-0 mt-1" style={{ fontSize: '10px' }}>Comprobante Autorizado por AFIP</p>
                                </div>
                                <div className="cae-info text-end">
                                    <p className="mb-0"><strong>CAE:</strong> {sale.afip_cae}</p>
                                    <p className="mb-0"><strong>Vto. CAE:</strong> {formatDate(sale.afip_cae_fch_vto)}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="alert alert-warning py-2 small mb-0 mt-4">
                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                            Este comprobante no ha sido autorizado electrónicamente por AFIP aún.
                        </div>
                    )}
                </div>
            </Modal.Body>
            <Modal.Footer className="border-0 pt-0">
                <button className="btn btn-secondary" onClick={onHide}>Cerrar</button>
                <button className="btn btn-primary" onClick={() => window.print()}>
                    <i className="bi bi-printer me-2"></i>Imprimir
                </button>
            </Modal.Footer>
        </Modal>
    );
}
