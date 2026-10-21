import React from 'react';
import Drawer from './Drawer';

export default function InvoiceDrawer({ isOpen, onClose, sale, config = {} }) {
    if (!sale) return null;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 2
        }).format(amount);
    };

    const formatDate = (dateString, showTime = false) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-AR', showTime ? { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' } : {});
    };

    const isAfipAuthorized = sale.afip_cae && sale.afip_resultado === 'A';

    const businessName = config.business_name || 'OWENS BURGUER';
    const businessAddress = config.business_address || 'Av. Cabildo 123, CABA';
    const businessCuit = config.business_cuit || '20453390153';
    const businessIva = config.business_iva || 'Responsable Inscripto';
    const businessIibb = config.business_iibb || '20453390153';
    const businessStartDate = config.business_start_date || '01/01/2024';
    const puntoVenta = config.punto_venta || 1;

    let qrUrl = '';
    if (isAfipAuthorized) {
        const qrData = {
            ver: 1,
            fecha: sale.created_at ? sale.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
            cuit: parseInt(businessCuit.replace(/\D/g, '')),
            ptoVta: parseInt(puntoVenta),
            tipoCmp: parseInt(sale.afip_cbte_tipo) || 11,
            nroCmp: parseInt(sale.afip_cbte_nro),
            importe: parseFloat(sale.total_price),
            moneda: 'PES',
            ctz: 1,
            tipoDocRec: 99,
            nroDocRec: 0,
            tipoCodAut: 'E',
            codAut: parseInt(sale.afip_cae)
        };
        const base64Qr = btoa(JSON.stringify(qrData));
        qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://www.afip.gob.ar/fe/qr/?p=${base64Qr}`;
    }

    const handlePrint = () => {
        const content = document.getElementById('printable-invoice').innerHTML;
        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.width = '0px';
        iframe.style.height = '0px';
        iframe.style.border = 'none';
        document.body.appendChild(iframe);

        const doc = iframe.contentWindow.document;
        doc.open();
        doc.write(`
            <html>
                <head>
                    <title>Factura ${sale.afip_cbte_nro || ''}</title>
                    <style>
                        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; margin: 0; padding: 20px; color: #212529; }
                        * { box-sizing: border-box; }
                        h2, h4 { margin-top: 0; }
                        p { margin: 0; }
                        .mb-0 { margin-bottom: 0 !important; }
                        .mb-1 { margin-bottom: 0.25rem !important; }
                        .mb-4 { margin-bottom: 1.5rem !important; }
                        .mt-1 { margin-top: 0.25rem !important; }
                        .mt-2 { margin-top: 0.5rem !important; }
                        .mt-4 { margin-top: 1.5rem !important; }
                        .mt-5 { margin-top: 3rem !important; }
                        .pt-1 { padding-top: 0.25rem !important; }
                        .pt-2 { padding-top: 0.5rem !important; }
                        .pt-3 { padding-top: 1rem !important; }
                        .pb-1 { padding-bottom: 0.25rem !important; }
                        .pb-3 { padding-bottom: 1rem !important; }
                        .px-3 { padding-left: 1rem !important; padding-right: 1rem !important; }
                        .p-2 { padding: 0.5rem !important; }
                        .py-2 { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
                        .p-4 { padding: 1.5rem !important; }
                        .fw-black { font-weight: 900 !important; }
                        .fw-bold { font-weight: 700 !important; }
                        .fw-semibold { font-weight: 600 !important; }
                        .fw-medium { font-weight: 500 !important; }
                        .text-muted { color: #6c757d !important; }
                        .text-dark { color: #212529 !important; }
                        .text-uppercase { text-transform: uppercase !important; }
                        .text-center { text-align: center !important; }
                        .text-end { text-align: right !important; }
                        .small { font-size: 0.875em !important; }
                        .fs-5 { font-size: 1.25rem !important; }
                        .fs-6 { font-size: 1rem !important; }
                        .d-flex { display: flex !important; }
                        .flex-column { flex-direction: column !important; }
                        .justify-content-center { justify-content: center !important; }
                        .justify-content-between { justify-content: space-between !important; }
                        .justify-content-end { justify-content: flex-end !important; }
                        .align-items-start { align-items: flex-start !important; }
                        .align-items-center { align-items: center !important; }
                        .gap-2 { gap: 0.5rem !important; }
                        .gap-3 { gap: 1rem !important; }
                        .position-relative { position: relative !important; }
                        .position-absolute { position: absolute !important; }
                        .start-50 { left: 50% !important; }
                        .translate-middle-x { transform: translateX(-50%) !important; }
                        .border { border: 1px solid #dee2e6 !important; }
                        .border-2 { border-width: 2px !important; }
                        .border-dark { border-color: #212529 !important; }
                        .border-bottom { border-bottom: 1px solid #dee2e6 !important; }
                        .border-top { border-top: 1px solid #dee2e6 !important; }
                        .border-start { border-left: 1px solid #dee2e6 !important; }
                        .border-dark-subtle { border-color: #ced4da !important; }
                        .rounded { border-radius: 0.375rem !important; }
                        .rounded-2 { border-radius: 0.5rem !important; }
                        .bg-light { background-color: #f8f9fa !important; }
                        .bg-light-subtle { background-color: #f8f9fa !important; }
                        
                        /* Layout Structure */
                        .row { display: flex; flex-wrap: wrap; margin-left: -0.5rem; margin-right: -0.5rem; }
                        .col-5 { flex: 0 0 auto; width: 41.66666667%; padding-left: 0.5rem; padding-right: 0.5rem; }
                        .col-7 { flex: 0 0 auto; width: 58.33333333%; padding-left: 0.5rem; padding-right: 0.5rem; }
                        .flex-grow-1 { flex-grow: 1 !important; }
                        .w-100 { width: 100% !important; }
                        
                        /* Table Styles */
                        table { width: 100%; border-collapse: collapse; }
                        th { background-color: #f8f9fa; border-bottom: 2px solid #dee2e6; color: #495057; font-size: 11px; text-transform: uppercase; font-weight: 700; padding: 0.5rem; text-align: left; }
                        td { border-bottom: 1px solid #f1f3f5; font-size: 13px; color: #343a40; padding: 10px 8px; }
                        .invoice-total-row { border-top: 2px solid #343a40 !important; font-size: 15px; }
                        
                        /* Icons */
                        .bi { display: inline-block; font-family: bootstrap-icons; font-style: normal; font-weight: normal; line-height: 1; vertical-align: -.125em; }
                        
                        .no-print { display: none !important; }

                        @page { margin: 0; size: A4; }
                    </style>
                </head>
                <body>
                    <div style="padding: 1cm; box-sizing: border-box; width: 100%; max-width: 100%;">
                        ${content}
                    </div>
                </body>
            </html>
        `);
        doc.close();

        // Wait a tiny bit for resources (if any) to load
        setTimeout(() => {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();

            // Clean up
            setTimeout(() => {
                document.body.removeChild(iframe);
            }, 500);
        }, 300);
    };

    const handlePrintTicket = () => {
        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.left = '-1000px'; // completely off-screen
        iframe.style.width = '300px'; // Must match the fixed ticket width for accurate text wrapping and height calculation
        iframe.style.height = '0px';
        iframe.style.border = 'none';
        document.body.appendChild(iframe);

        const doc = iframe.contentWindow.document;
        doc.open();
        doc.write(`
            <html>
                <head>
                    <title>Ticket ${sale.afip_cbte_nro || ''}</title>
                    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
                    <style>
                        body { font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; margin: 0; padding: 5px; color: #000; background: white; width: 300px; max-width: 100%; font-size: 11px; line-height: 1.2; }
                        * { box-sizing: border-box; }
                        h2 { margin: 0 0 4px 0; font-weight: 900; text-align: center; font-size: 16px; text-transform: uppercase; letter-spacing: -0.5px; }
                        h3 { margin: 0 0 4px 0; font-weight: bold; text-align: center; font-size: 13px; }
                        p { margin: 0; }
                        hr { border: 0; border-top: 1px dashed #000; margin: 6px 0; }
                        .text-center { text-align: center; }
                        .text-right { text-align: right; }
                        .text-left { text-align: left; }
                        .flex-row { display: flex; justify-content: space-between; }
                        .flex-center { display: flex; justify-content: center; align-items: center; gap: 10px; }
                        .fw-bold { font-weight: bold; }
                        .items-table { width: 100%; margin-top: 6px; margin-bottom: 6px; border-collapse: collapse; }
                        .items-table td { text-align: left; padding: 3px 0; vertical-align: top; border-bottom: 1px dotted #ccc; }
                        .total-row { font-size: 14px; font-weight: bold; margin-top: 6px; padding-top: 3px; border-top: 1px dashed #000; }
                        .qr-container img { width: 25mm; height: 25mm; }
                        .afip-data { font-size: 9px; text-align: left; }
                        
                        @media print {
                            html, body { height: auto !important; margin: 0; padding: 0; }
                            body { width: 80mm; margin: 0 auto; }
                            @page { margin: 0; width: 80mm; }
                        }
                    </style>
                </head>
                <body>
                    <div style="width: 100%; max-width: 100%;">
                        <h2>${businessName}</h2>
                        <div class="text-center" style="font-size: 10px;">
                            <p>${businessAddress}</p>
                            ${isAfipAuthorized ? `<p>CUIT: ${businessCuit} | IIBB: ${businessIibb}</p><p>Inicio Act: ${businessStartDate} | ${businessIva}</p>` : ''}
                        </div>
                        
                        <hr />
                        <h3>${isAfipAuthorized ? 'FACTURA C' : 'PRESUPUESTO'}</h3>
                        <p class="text-center fw-bold" style="font-size: 12px;">${isAfipAuthorized ? `Nº ${String(puntoVenta).padStart(5, '0')}-${String(sale.afip_cbte_nro || '0').padStart(8, '0')}` : `Ticket #${sale.id}`}</p>
                        <p class="text-center" style="font-size: 10px;">Fecha: ${formatDate(sale.created_at, true)}</p>
                        <hr />
                        
                        <div style="font-size: 10px;">
                            <p><strong>Cliente:</strong> Consumidor Final</p>
                            <p><strong>Cond. IVA:</strong> Consumidor Final</p>
                        </div>
                        
                        <table class="items-table">
                            <tbody>
                                ${sale.sale_details ? sale.sale_details.map(detail => `
                                    <tr>
                                        <td style="width: 15%;">${parseInt(detail.quantity)}x</td>
                                        <td style="width: 55%;">${detail.product.name}</td>
                                        <td style="width: 30%; text-align: right;" class="fw-bold">${formatCurrency(detail.subtotal)}</td>
                                    </tr>
                                `).join('') : ''}
                            </tbody>
                        </table>
                        
                        <div class="flex-row total-row">
                            <span>TOTAL</span>
                            <span>${formatCurrency(sale.total_price)}</span>
                        </div>
                        <div class="text-right" style="margin-top: 2px; font-size: 10px;">
                            <span>Pago: ${sale.payment_method === 'cash' ? 'EFECTIVO' : sale.payment_method.toUpperCase()}</span>
                        </div>

                        ${isAfipAuthorized ? `
                            <hr />
                            <p class="text-center fw-bold" style="font-size: 10px; margin-bottom: 4px;">COMPROBANTE AUTORIZADO</p>
                            <div class="flex-center">
                                ${qrUrl ? `
                                    <div class="qr-container">
                                        <img src="${qrUrl}" alt="QR" />
                                    </div>
                                ` : ''}
                                <div class="afip-data">
                                    <p><strong>CAE:</strong><br/>${sale.afip_cae}</p>
                                    <p style="margin-top: 4px;"><strong>Vto CAE:</strong><br/>${formatDate(sale.afip_cae_fch_vto)}</p>
                                </div>
                            </div>
                        ` : `
                            <hr />
                            <div class="text-center" style="margin-top: 10px; border: 1px dashed #000; padding: 5px;">
                                <p class="fw-bold" style="font-size: 11px;">DOCUMENTO NO VÁLIDO COMO FACTURA</p>
                                <p style="font-size: 9px;">Comprobante de uso interno</p>
                            </div>
                        `}
                        
                        <p class="text-center" style="font-size: 9px; margin-top: 12px;">Owen's POS</p>
                        <p class="text-center" style="font-size: 9px; margin-top: 10px; color: white;">.</p>
                    </div>
                </body>
            </html>
        `);
        doc.close();

        // Dynamically calculate the precise height of the content to force the print preview paper size
        setTimeout(() => {
            const bodyEndHeight = doc.body.scrollHeight;
            const style = doc.createElement('style');
            // Adding a small buffer (approx 10px) to prevent cutting off the last pixel
            style.innerHTML = `@page { size: 80mm ${bodyEndHeight + 10}px; margin: 0; }`;
            doc.head.appendChild(style);

            iframe.contentWindow.focus();
            iframe.contentWindow.print();
            
            // Clean up
            setTimeout(() => {
                document.body.removeChild(iframe);
            }, 500);
        }, 150);
    };

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            title="Detalle del Comprobante"
            width="650px"
            footer={
                <div className="d-flex justify-content-end align-items-center w-100 no-print gap-3">
                    <button className="btn btn-secondary d-flex align-items-center gap-2 px-4 shadow-sm border-0" onClick={handlePrint} style={{ backgroundColor: '#6c757d' }}>
                        <span className="material-symbols-outlined fs-5">description</span> Factura A4
                    </button>
                    <button className="btn btn-primary d-flex align-items-center gap-2 px-4 shadow-sm fw-bold border-0" onClick={handlePrintTicket}>
                        <span className="material-symbols-outlined fs-5">receipt_long</span> Imprimir Ticket
                    </button>
                </div>
            }
        >
            <div className="invoice-outer-container">
                <style dangerouslySetInnerHTML={{
                    __html: `
                    .fw-black { font-weight: 900; }
                    .table-invoice thead th { background-color: var(--bg-body) !important; border-bottom: 2px solid var(--border-color); color: var(--text-main); font-size: 11px; text-transform: uppercase; font-weight: 700; padding: 12px 8px; opacity: 0.8; }
                    .table-invoice tbody td { border-bottom: 1px solid var(--border-color); font-size: 13px; color: var(--text-main); padding: 14px 8px; }
                    .invoice-total-row { border-top: 2px solid var(--text-main) !important; font-size: 15px; }
                ` }} />

                <div className="invoice-printable p-4 border rounded-3 bg-white" id="printable-invoice" style={{ minHeight: '650px', display: 'flex', flexDirection: 'column' }}>

                    {/* Header: Business & Invoice Type */}
                    <div className="d-flex justify-content-between align-items-start mb-4 pb-3 border-bottom position-relative">
                        <div className="business-header" style={{ flex: 1 }}>
                            <h2 className="fw-black mb-0 text-dark" style={{ letterSpacing: '-1px' }}>{businessName}</h2>
                            <div className="mt-2" style={{ fontSize: '11px', lineHeight: '1.4' }}>
                                <div className="text-muted">Razón Social: {businessName}</div>
                                <div className="text-muted">Domicilio Comercial: {businessAddress}</div>
                                <div className="text-muted">Condición frente al IVA: {businessIva}</div>
                            </div>
                        </div>

                        {/* Invoice Type Icon 'C' */}
                        <div className="invoice-type-box border border-2 text-center position-absolute start-50 translate-middle-x d-flex flex-column align-items-center justify-content-center"
                            style={{ 
                                width: '50px', height: '54px', top: '0', zIndex: 10,
                                backgroundColor: 'var(--bg-card)',
                                borderColor: 'var(--text-main) !important',
                                color: 'var(--text-main)'
                            }}>
                            <h2 className="mb-0 fw-bold" style={{ lineHeight: 1 }}>C</h2>
                            <div style={{ fontSize: '8px', marginTop: '2px' }} className="fw-bold">COD. 11</div>
                        </div>

                        <div className="invoice-header-right text-end" style={{ flex: 1 }}>
                            <h4 className="fw-bold mb-1 text-dark">FACTURA</h4>
                            <div className="mt-1" style={{ fontSize: '13px' }}>
                                <div className="fw-bold fs-5 mb-1">Nº {String(puntoVenta).padStart(5, '0')}-{String(sale.afip_cbte_nro || '0').padStart(8, '0')}</div>
                                <div className="text-muted mb-2">Fecha: <span className="fw-semibold text-dark">{formatDate(sale.created_at)}</span></div>
                                <div className="mt-1 fw-bold small text-uppercase">CUIT: <span className="fw-normal">{businessCuit}</span></div>
                                <div className="mt-1 fw-bold small text-uppercase">Ingresos Brutos: <span className="fw-normal">{businessIibb}</span></div>
                                <div className="mt-1 fw-bold small text-uppercase">Inicio de Actividades: <span className="fw-normal">{businessStartDate}</span></div>
                            </div>
                        </div>
                    </div>

                    {/* Customer Row */}
                    <div className="row mb-4 g-0 py-2 border-bottom border-top rounded small" style={{ backgroundColor: 'var(--table-header-bg)' }}>
                        <div className="col-7 p-2">
                            <span className="text-muted text-uppercase fw-bold d-block mb-1" style={{ fontSize: '10px' }}>Señor(es):</span>
                            <span className="fw-semibold text-dark">Consumidor Final</span>
                        </div>
                        <div className="col-5 p-2">
                            <span className="text-muted text-uppercase fw-bold d-block mb-1" style={{ fontSize: '10px' }}>Condición Frente al IVA:</span>
                            <span className="fw-semibold text-dark">Consumidor Final</span>
                        </div>
                    </div>

                    {/* Main Table */}
                    <div className="flex-grow-1">
                        <table className="table table-invoice table-sm mb-0">
                            <thead>
                                <tr>
                                    <th style={{ width: '60%' }}>Detalle del Producto</th>
                                    <th className="text-center" style={{ width: '10%' }}>Cant.</th>
                                    <th className="text-end" style={{ width: '15%' }}>P. Uni</th>
                                    <th className="text-end" style={{ width: '15%' }}>Importe</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sale.sale_details && sale.sale_details.map((detail, idx) => (
                                    <tr key={idx}>
                                        <td className="fw-medium">{detail.product.name}</td>
                                        <td className="text-center">{parseInt(detail.quantity)}</td>
                                        <td className="text-end font-tabular">{formatCurrency(detail.price)}</td>
                                        <td className="text-end font-tabular fw-semibold">{formatCurrency(detail.subtotal)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals Section */}
                    <div className="mt-4 pt-2">
                        <div className="row justify-content-end">
                            <div className="col-5">
                                <div className="d-flex justify-content-between py-2 invoice-total-row">
                                    <span className="fw-bold text-uppercase" style={{ fontSize: '12px' }}>Total Neto</span>
                                    <span className="fw-black fs-4 text-dark">{formatCurrency(sale.total_price)}</span>
                                </div>
                                <div className="text-end text-muted mt-2 d-flex justify-content-end align-items-center gap-1" style={{ fontSize: '12px' }}>
                                    <span className="material-symbols-outlined fs-6" style={{ verticalAlign: 'middle' }}>payments</span>
                                    Condición de Venta: <span className="fw-bold text-dark text-uppercase">{sale.payment_method === 'cash' ? 'Efectivo' : sale.payment_method}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AFIP Section */}
                    <div className="mt-5 border-top border-2 border-dark-subtle pt-3 text-start">
                        {isAfipAuthorized ? (
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="afip-qr-section d-flex align-items-center gap-3">
                                    <div className="p-1 border rounded d-flex align-items-center justify-content-center" style={{ width: '90px', height: '90px', backgroundColor: '#fff' }}>
                                        {qrUrl ? (
                                            <img src={qrUrl} alt="AFIP QR" style={{ width: '100%', height: '100%', mixBlendMode: 'multiply' }} />
                                        ) : (
                                            <span className="material-symbols-outlined text-dark" style={{ fontSize: '3.5rem', opacity: 0.8 }}>qr_code_2</span>
                                        )}
                                    </div>
                                    <div className="afip-stamp">
                                        <img src="https://www.afip.gob.ar/images/logo_afip.png" alt="AFIP" style={{ height: '22px', marginBottom: '8px', opacity: 0.7 }} />
                                        <p className="mb-0 text-muted fw-bold" style={{ fontSize: '9px', letterSpacing: '0.5px' }}>COMPROBANTE AUTORIZADO</p>
                                    </div>
                                </div>
                                <div className="afip-cae-box text-end p-2 px-3 border-start">
                                    <div className="mb-1 fw-bold fs-6 font-tabular">CAE: {sale.afip_cae}</div>
                                    <div className="text-muted small">Vencimiento CAE: <span className="fw-semibold">{formatDate(sale.afip_cae_fch_vto)}</span></div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-3 bg-warning bg-opacity-10 border border-warning rounded-2 d-flex align-items-center gap-3 no-print" style={{ textAlign: 'left' }}>
                                <span className="material-symbols-outlined text-dark fs-3">warning</span>
                                <div className="small text-warning-emphasis">
                                    <strong className="d-block" style={{ fontSize: '11px' }}>COMPROBANTE NO AUTORIZADO</strong>
                                    Este comprobante aún no posee código CAE de AFIP. (Esto puede deberse a que es una venta previa a la integración, o a que ocurrió un error de conexión durante su creación).
                                </div>
                            </div>
                        )}
                        <div className="text-center mt-3 text-muted no-print" style={{ fontSize: '10px', width: '100%' }}>
                            Software de Facturación Owens
                        </div>
                    </div>
                </div>
            </div>
        </Drawer>
    );
}
