import{j as t,r as w,b as nt,u as at,H as it,a as E,R as ot}from"./app-rnaItXdD.js";import{M as rt}from"./MainLayout-BshWRTco.js";import{D as U}from"./Drawer-tXe7Zm1d.js";import{S as B}from"./sweetalert2.esm.all-B3GDCxSY.js";import{P as lt}from"./Pagination-BDS1UjyY.js";import"./lottie-react.esm-CjbFXfvE.js";function ct({isOpen:g,onClose:C,sale:o,config:y={}}){if(!o)return null;const h=r=>new Intl.NumberFormat("es-AR",{style:"currency",currency:"ARS",minimumFractionDigits:2}).format(r),m=(r,l=!1)=>r?new Date(r).toLocaleDateString("es-AR",l?{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"}:{}):"",p=o.afip_cae&&o.afip_resultado==="A",b=y.business_name||"OWENS BURGUER",z=y.business_address||"Av. Cabildo 123, CABA",S=y.business_cuit||"20453390153",I=y.business_iva||"Responsable Inscripto",k=y.business_iibb||"20453390153",c=y.business_start_date||"01/01/2024",d=y.punto_venta||1;let N="";if(p){const r={ver:1,fecha:o.created_at?o.created_at.split("T")[0]:new Date().toISOString().split("T")[0],cuit:parseInt(S.replace(/\D/g,"")),ptoVta:parseInt(d),tipoCmp:parseInt(o.afip_cbte_tipo)||11,nroCmp:parseInt(o.afip_cbte_nro),importe:parseFloat(o.total_price),moneda:"PES",ctz:1,tipoDocRec:99,nroDocRec:0,tipoCodAut:"E",codAut:parseInt(o.afip_cae)};N=`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://www.afip.gob.ar/fe/qr/?p=${btoa(JSON.stringify(r))}`}const T=()=>{const r=document.getElementById("printable-invoice").innerHTML,l=document.createElement("iframe");l.style.position="fixed",l.style.width="0px",l.style.height="0px",l.style.border="none",document.body.appendChild(l);const x=l.contentWindow.document;x.open(),x.write(`
            <html>
                <head>
                    <title>Factura ${o.afip_cbte_nro||""}</title>
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
                        ${r}
                    </div>
                </body>
            </html>
        `),x.close(),setTimeout(()=>{l.contentWindow.focus(),l.contentWindow.print(),setTimeout(()=>{document.body.removeChild(l)},500)},300)},R=()=>{const r=document.createElement("iframe");r.style.position="fixed",r.style.left="-1000px",r.style.width="300px",r.style.height="0px",r.style.border="none",document.body.appendChild(r);const l=r.contentWindow.document;l.open(),l.write(`
            <html>
                <head>
                    <title>Ticket ${o.afip_cbte_nro||""}</title>
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
                        <h2>${b}</h2>
                        <div class="text-center" style="font-size: 10px;">
                            <p>${z}</p>
                            ${p?`<p>CUIT: ${S} | IIBB: ${k}</p><p>Inicio Act: ${c} | ${I}</p>`:""}
                        </div>
                        
                        <hr />
                        <h3>${p?"FACTURA C":"PRESUPUESTO"}</h3>
                        <p class="text-center fw-bold" style="font-size: 12px;">${p?`Nº ${String(d).padStart(5,"0")}-${String(o.afip_cbte_nro||"0").padStart(8,"0")}`:`Ticket #${o.id}`}</p>
                        <p class="text-center" style="font-size: 10px;">Fecha: ${m(o.created_at,!0)}</p>
                        <hr />
                        
                        <div style="font-size: 10px;">
                            <p><strong>Cliente:</strong> Consumidor Final</p>
                            <p><strong>Cond. IVA:</strong> Consumidor Final</p>
                        </div>
                        
                        <table class="items-table">
                            <tbody>
                                ${o.sale_details?o.sale_details.map(x=>`
                                    <tr>
                                        <td style="width: 15%;">${parseInt(x.quantity)}x</td>
                                        <td style="width: 55%;">${x.product.name}</td>
                                        <td style="width: 30%; text-align: right;" class="fw-bold">${h(x.subtotal)}</td>
                                    </tr>
                                `).join(""):""}
                            </tbody>
                        </table>
                        
                        <div class="flex-row total-row">
                            <span>TOTAL</span>
                            <span>${h(o.total_price)}</span>
                        </div>
                        <div class="text-right" style="margin-top: 2px; font-size: 10px;">
                            <span>Pago: ${o.payment_method==="cash"?"EFECTIVO":o.payment_method.toUpperCase()}</span>
                        </div>

                        ${p?`
                            <hr />
                            <p class="text-center fw-bold" style="font-size: 10px; margin-bottom: 4px;">COMPROBANTE AUTORIZADO</p>
                            <div class="flex-center">
                                ${N?`
                                    <div class="qr-container">
                                        <img src="${N}" alt="QR" />
                                    </div>
                                `:""}
                                <div class="afip-data">
                                    <p><strong>CAE:</strong><br/>${o.afip_cae}</p>
                                    <p style="margin-top: 4px;"><strong>Vto CAE:</strong><br/>${m(o.afip_cae_fch_vto)}</p>
                                </div>
                            </div>
                        `:`
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
        `),l.close(),setTimeout(()=>{const x=l.body.scrollHeight,D=l.createElement("style");D.innerHTML=`@page { size: 80mm ${x+10}px; margin: 0; }`,l.head.appendChild(D),r.contentWindow.focus(),r.contentWindow.print(),setTimeout(()=>{document.body.removeChild(r)},500)},150)};return t.jsx(U,{isOpen:g,onClose:C,title:"Detalle del Comprobante",width:"650px",footer:t.jsxs("div",{className:"d-flex justify-content-end align-items-center w-100 no-print gap-3",children:[t.jsxs("button",{className:"btn btn-secondary d-flex align-items-center gap-2 px-4 shadow-sm border-0",onClick:T,style:{backgroundColor:"#6c757d"},children:[t.jsx("span",{className:"material-symbols-outlined fs-5",children:"description"})," Factura A4"]}),t.jsxs("button",{className:"btn btn-primary d-flex align-items-center gap-2 px-4 shadow-sm fw-bold border-0",onClick:R,children:[t.jsx("span",{className:"material-symbols-outlined fs-5",children:"receipt_long"})," Imprimir Ticket"]})]}),children:t.jsxs("div",{className:"invoice-outer-container",children:[t.jsx("style",{dangerouslySetInnerHTML:{__html:`
                    .fw-black { font-weight: 900; }
                    .table-invoice thead th { background-color: var(--bg-body) !important; border-bottom: 2px solid var(--border-color); color: var(--text-main); font-size: 11px; text-transform: uppercase; font-weight: 700; padding: 12px 8px; opacity: 0.8; }
                    .table-invoice tbody td { border-bottom: 1px solid var(--border-color); font-size: 13px; color: var(--text-main); padding: 14px 8px; }
                    .invoice-total-row { border-top: 2px solid var(--text-main) !important; font-size: 15px; }
                `}}),t.jsxs("div",{className:"invoice-printable p-4 border rounded-3 bg-white",id:"printable-invoice",style:{minHeight:"650px",display:"flex",flexDirection:"column"},children:[t.jsxs("div",{className:"d-flex justify-content-between align-items-start mb-4 pb-3 border-bottom position-relative",children:[t.jsxs("div",{className:"business-header",style:{flex:1},children:[t.jsx("h2",{className:"fw-black mb-0 text-dark",style:{letterSpacing:"-1px"},children:b}),t.jsxs("div",{className:"mt-2",style:{fontSize:"11px",lineHeight:"1.4"},children:[t.jsxs("div",{className:"text-muted",children:["Razón Social: ",b]}),t.jsxs("div",{className:"text-muted",children:["Domicilio Comercial: ",z]}),t.jsxs("div",{className:"text-muted",children:["Condición frente al IVA: ",I]})]})]}),t.jsxs("div",{className:"invoice-type-box border border-2 text-center position-absolute start-50 translate-middle-x d-flex flex-column align-items-center justify-content-center",style:{width:"50px",height:"54px",top:"0",zIndex:10,backgroundColor:"var(--bg-card)",borderColor:"var(--text-main) !important",color:"var(--text-main)"},children:[t.jsx("h2",{className:"mb-0 fw-bold",style:{lineHeight:1},children:"C"}),t.jsx("div",{style:{fontSize:"8px",marginTop:"2px"},className:"fw-bold",children:"COD. 11"})]}),t.jsxs("div",{className:"invoice-header-right text-end",style:{flex:1},children:[t.jsx("h4",{className:"fw-bold mb-1 text-dark",children:"FACTURA"}),t.jsxs("div",{className:"mt-1",style:{fontSize:"13px"},children:[t.jsxs("div",{className:"fw-bold fs-5 mb-1",children:["Nº ",String(d).padStart(5,"0"),"-",String(o.afip_cbte_nro||"0").padStart(8,"0")]}),t.jsxs("div",{className:"text-muted mb-2",children:["Fecha: ",t.jsx("span",{className:"fw-semibold text-dark",children:m(o.created_at)})]}),t.jsxs("div",{className:"mt-1 fw-bold small text-uppercase",children:["CUIT: ",t.jsx("span",{className:"fw-normal",children:S})]}),t.jsxs("div",{className:"mt-1 fw-bold small text-uppercase",children:["Ingresos Brutos: ",t.jsx("span",{className:"fw-normal",children:k})]}),t.jsxs("div",{className:"mt-1 fw-bold small text-uppercase",children:["Inicio de Actividades: ",t.jsx("span",{className:"fw-normal",children:c})]})]})]})]}),t.jsxs("div",{className:"row mb-4 g-0 py-2 border-bottom border-top rounded small",style:{backgroundColor:"var(--table-header-bg)"},children:[t.jsxs("div",{className:"col-7 p-2",children:[t.jsx("span",{className:"text-muted text-uppercase fw-bold d-block mb-1",style:{fontSize:"10px"},children:"Señor(es):"}),t.jsx("span",{className:"fw-semibold text-dark",children:"Consumidor Final"})]}),t.jsxs("div",{className:"col-5 p-2",children:[t.jsx("span",{className:"text-muted text-uppercase fw-bold d-block mb-1",style:{fontSize:"10px"},children:"Condición Frente al IVA:"}),t.jsx("span",{className:"fw-semibold text-dark",children:"Consumidor Final"})]})]}),t.jsx("div",{className:"flex-grow-1",children:t.jsxs("table",{className:"table table-invoice table-sm mb-0",children:[t.jsx("thead",{children:t.jsxs("tr",{children:[t.jsx("th",{style:{width:"60%"},children:"Detalle del Producto"}),t.jsx("th",{className:"text-center",style:{width:"10%"},children:"Cant."}),t.jsx("th",{className:"text-end",style:{width:"15%"},children:"P. Uni"}),t.jsx("th",{className:"text-end",style:{width:"15%"},children:"Importe"})]})}),t.jsx("tbody",{children:o.sale_details&&o.sale_details.map((r,l)=>t.jsxs("tr",{children:[t.jsx("td",{className:"fw-medium",children:r.product.name}),t.jsx("td",{className:"text-center",children:parseInt(r.quantity)}),t.jsx("td",{className:"text-end font-tabular",children:h(r.price)}),t.jsx("td",{className:"text-end font-tabular fw-semibold",children:h(r.subtotal)})]},l))})]})}),t.jsx("div",{className:"mt-4 pt-2",children:t.jsx("div",{className:"row justify-content-end",children:t.jsxs("div",{className:"col-5",children:[t.jsxs("div",{className:"d-flex justify-content-between py-2 invoice-total-row",children:[t.jsx("span",{className:"fw-bold text-uppercase",style:{fontSize:"12px"},children:"Total Neto"}),t.jsx("span",{className:"fw-black fs-4 text-dark",children:h(o.total_price)})]}),t.jsxs("div",{className:"text-end text-muted mt-2 d-flex justify-content-end align-items-center gap-1",style:{fontSize:"12px"},children:[t.jsx("span",{className:"material-symbols-outlined fs-6",style:{verticalAlign:"middle"},children:"payments"}),"Condición de Venta: ",t.jsx("span",{className:"fw-bold text-dark text-uppercase",children:o.payment_method==="cash"?"Efectivo":o.payment_method})]})]})})}),t.jsxs("div",{className:"mt-5 border-top border-2 border-dark-subtle pt-3 text-start",children:[p?t.jsxs("div",{className:"d-flex justify-content-between align-items-center",children:[t.jsxs("div",{className:"afip-qr-section d-flex align-items-center gap-3",children:[t.jsx("div",{className:"p-1 border rounded d-flex align-items-center justify-content-center",style:{width:"90px",height:"90px",backgroundColor:"#fff"},children:N?t.jsx("img",{src:N,alt:"AFIP QR",style:{width:"100%",height:"100%",mixBlendMode:"multiply"}}):t.jsx("span",{className:"material-symbols-outlined text-dark",style:{fontSize:"3.5rem",opacity:.8},children:"qr_code_2"})}),t.jsxs("div",{className:"afip-stamp",children:[t.jsx("img",{src:"https://www.afip.gob.ar/images/logo_afip.png",alt:"AFIP",style:{height:"22px",marginBottom:"8px",opacity:.7}}),t.jsx("p",{className:"mb-0 text-muted fw-bold",style:{fontSize:"9px",letterSpacing:"0.5px"},children:"COMPROBANTE AUTORIZADO"})]})]}),t.jsxs("div",{className:"afip-cae-box text-end p-2 px-3 border-start",children:[t.jsxs("div",{className:"mb-1 fw-bold fs-6 font-tabular",children:["CAE: ",o.afip_cae]}),t.jsxs("div",{className:"text-muted small",children:["Vencimiento CAE: ",t.jsx("span",{className:"fw-semibold",children:m(o.afip_cae_fch_vto)})]})]})]}):t.jsxs("div",{className:"p-3 bg-warning bg-opacity-10 border border-warning rounded-2 d-flex align-items-center gap-3 no-print",style:{textAlign:"left"},children:[t.jsx("span",{className:"material-symbols-outlined text-dark fs-3",children:"warning"}),t.jsxs("div",{className:"small text-warning-emphasis",children:[t.jsx("strong",{className:"d-block",style:{fontSize:"11px"},children:"COMPROBANTE NO AUTORIZADO"}),"Este comprobante aún no posee código CAE de AFIP. (Esto puede deberse a que es una venta previa a la integración, o a que ocurrió un error de conexión durante su creación)."]})]}),t.jsx("div",{className:"text-center mt-3 text-muted no-print",style:{fontSize:"10px",width:"100%"},children:"Software de Facturación Owens"})]})]})]})})}function ut({sales:g=[],products:C=[],afip_config:o={}}){const[y,h]=w.useState(!1),[m,p]=w.useState([]),[b,z]=w.useState(0),{system_mode:S,manage_stock:I}=nt().props,k=String(I)!=="false",{data:c,setData:d,post:N,processing:T,errors:R,reset:r}=at({items:[],total:0,payment_method:"cash",split_payments:[]}),[l,x]=w.useState(null),[D,O]=w.useState(!1),[V,L]=w.useState(!1),j=s=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:s%1===0?0:2,maximumFractionDigits:2}).format(s),H=s=>new Date(s).toLocaleString("es-ES",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"}),W=s=>({cash:"Efectivo",debit_card:"Débito",credit_card:"Crédito",transfer:"Transferencia",qr:"QR",multiple:"Múltiple"})[s]||s,$=(s,e,a)=>{const n=[...c.split_payments];n[s][e]=a,d("split_payments",n)},Q=()=>{d("split_payments",[...c.split_payments,{method:"cash",amount:""}])},G=s=>{d("split_payments",c.split_payments.filter((e,a)=>a!==s))},A=()=>c.split_payments.reduce((s,e)=>s+(parseFloat(e.amount)||0),0),Z=s=>{B.fire({text:"¿Eliminar esta venta?",showCancelButton:!0,confirmButtonColor:"#dc3545",cancelButtonColor:"#6c757d",confirmButtonText:"Eliminar",cancelButtonText:"Cancelar",buttonsStyling:!0,customClass:{popup:"swal-minimal",confirmButton:"btn btn-danger px-4",cancelButton:"btn btn-secondary px-4"}}).then(e=>{e.isConfirmed&&E.delete(route("sales.destroy",s),{preserveScroll:!0,onSuccess:()=>{window.toast.success("Venta eliminada","La venta ha sido eliminada correctamente.")}})})},q=(s,e)=>{if(!k)return{hasStock:!0,missingComponents:[]};const a=C.find(i=>i.id==s);if(!a)return{hasStock:!0,missingComponents:[]};const n=(i,u)=>{const v=[];return S==="normal"&&(i.category==="burger"||i.category==="extra")||(i.type==="combo"||i.components&&i.components.length>0?i.components.forEach(P=>{const M=P.child_product;if(M){const st=P.quantity*u;v.push(...n(M,st))}}):i.stock<u&&v.push({name:i.name,required:u,available:i.stock,missing:u-i.stock})),v},f=n(a,e);return{hasStock:f.length===0,missingComponents:f}},J=()=>{p([...m,{id:Date.now(),product_id:"",price:0,quantity:1,total:0}])},X=s=>{p(m.filter(e=>e.id!==s))},_=(s,e,a)=>{const n=m.map(f=>{if(f.id===s){const i={...f,[e]:a};if(e==="product_id"){const u=C.find(v=>v.id==a);if(u){i.price=u.price,i.total=u.price*i.quantity,i.productType=u.type;const v=q(a,i.quantity);i.stockWarning=!v.hasStock,i.missingComponents=v.missingComponents}else i.price=0,i.total=0,i.stockWarning=!1,i.missingComponents=[]}if(e==="quantity"&&(i.total=i.price*a,i.product_id)){const u=q(i.product_id,a);i.stockWarning=!u.hasStock,i.missingComponents=u.missingComponents}return i}return f});p(n)};w.useEffect(()=>{const s=m.reduce((e,a)=>e+a.total,0);z(s),d("items",m),d("total",s)},[m]);const Y=s=>{s.preventDefault();const e=m.filter(n=>n.product_id!=="");if(e.length===0){window.toast.warning("Advertencia","Debes agregar al menos un producto.");return}if(c.payment_method==="multiple"){const n=A();if(Math.abs(n-b)>.01){window.toast.error("Error en distribución",`La suma de los pagos (${j(n)}) debe ser igual al total (${j(b)})`);return}}const a={product_id:e.map(n=>n.product_id),quantity:e.map(n=>n.quantity),price:e.map(n=>n.price),total_price:e.map(n=>n.total),total:b,payment_method:c.payment_method};h(!1),E.post(route("sales.store"),a,{preserveScroll:!0,onSuccess:()=>{window.toast.success("Venta guardada","La venta se ha registrado correctamente."),p([]),r()},onError:n=>{if(n.register_closed){h(!1),B.fire({text:"No has abierto caja. ¿Deseas abrirla ahora?",showCancelButton:!0,confirmButtonText:"Abrir Caja",cancelButtonText:"Cancelar",confirmButtonColor:"#dc3545",cancelButtonColor:"#6c757d",buttonsStyling:!0,customClass:{popup:"swal-medium",confirmButton:"btn btn-primary px-4",cancelButton:"btn btn-secondary px-4"}}).then(i=>{i.isConfirmed?E.visit(route("cash_register.index")):h(!0)});return}h(!0),console.error("❌ ERROR! Errores:",n);const f=n.error||Object.values(n)[0]||"Error al registrar la venta";window.toast.error("Error",f)}})},K=()=>{h(!0),p([{id:Date.now(),product_id:"",price:0,quantity:1,total:0}])},F=()=>{h(!1),p([]),r()},tt=s=>{x(s),O(!0)},et=()=>{O(!1),x(null)};return t.jsxs(rt,{children:[t.jsx(it,{title:"Ventas"}),t.jsxs("div",{className:"container-fluid pt-4 px-4",children:[t.jsxs("div",{className:"d-flex justify-content-between align-items-center mb-4",children:[t.jsx("h4",{className:"mb-0 fw-bold",children:"Ventas"}),t.jsxs("button",{onClick:K,className:"btn btn-primary rounded-pill px-3",children:[t.jsx("i",{className:"bi bi-plus-lg me-2"}),"Nueva Venta"]})]}),t.jsxs("div",{className:"card-minimal",children:[t.jsx("div",{className:"table-responsive",children:t.jsxs("table",{className:"table-minimal align-top",children:[t.jsx("thead",{children:t.jsxs("tr",{children:[t.jsx("th",{scope:"col",style:{width:"140px"},children:"Fecha"}),t.jsx("th",{scope:"col",children:"Detalles"}),t.jsx("th",{scope:"col",style:{width:"130px"},className:"text-end",children:"Total"}),t.jsx("th",{scope:"col",style:{width:"130px"},children:"Método Pago"}),t.jsx("th",{scope:"col",style:{width:"100px"},className:"text-center",children:"Acciones"})]})}),t.jsxs("tbody",{children:[g.data.map((s,e)=>t.jsxs("tr",{children:[t.jsx("td",{children:H(s.created_at)}),t.jsx("td",{children:t.jsx("ul",{className:"list-unstyled mb-0 small",children:s.sale_details&&s.sale_details.length>0?s.sale_details.map((a,n)=>t.jsxs("li",{children:[t.jsxs("span",{className:"text-muted",children:[parseInt(a.quantity),"x"]})," ",a.product.name]},n)):t.jsx("li",{className:"text-muted fst-italic",children:"Sin detalles"})})}),t.jsx("td",{className:"font-tabular fw-semibold text-end",children:j(s.total_price)}),t.jsx("td",{children:t.jsx("span",{className:"badge bg-transparent border text-dark",children:W(s.payment_method)})}),t.jsx("td",{className:"text-center",children:t.jsxs("div",{className:"d-flex justify-content-center gap-1",children:[t.jsx("button",{className:"btn btn-icon-only btn-action-icon bg-transparent border-0",onClick:()=>tt(s),title:"Ver Factura",children:t.jsx("span",{className:"material-symbols-outlined text-primary",style:{fontSize:"22px"},children:"receipt_long"})}),t.jsx("button",{className:"btn btn-icon-only btn-action-icon bg-transparent border-0",onClick:()=>Z(s.id),title:"Eliminar",children:t.jsx("span",{className:"material-symbols-outlined",style:{fontSize:"22px",transform:"translateY(-1px)"},children:"delete"})})]})})]},s.id)),g.data.length===0&&t.jsx("tr",{children:t.jsx("td",{colSpan:"5",className:"text-center py-4 text-muted",children:"No hay datos de ventas"})})]})]})}),t.jsx(lt,{links:g.links,from:g.from,to:g.to,total:g.total,perPage:g.per_page,onPerPageChange:s=>{const e=new URL(window.location.href);e.searchParams.set("per_page",s),e.searchParams.set("page",1),E.get(e.toString(),{},{preserveState:!0,preserveScroll:!0})}})]})]}),t.jsx(U,{isOpen:y,onClose:F,title:"Nueva Venta",width:"900px",footer:t.jsxs(t.Fragment,{children:[t.jsx("button",{type:"button",className:"btn btn-light",onClick:F,children:"Cancelar"}),t.jsx("button",{type:"submit",form:"saleForm",className:"btn btn-primary",disabled:m.length===0||T,children:T?"Guardando...":"Guardar Venta"})]}),children:t.jsxs("form",{id:"saleForm",onSubmit:Y,children:[t.jsx("h6",{className:"mb-3",children:"Detalles de venta"}),t.jsx("div",{className:"table-responsive mb-4",children:t.jsxs("table",{className:"table table-sm",children:[t.jsx("thead",{children:t.jsxs("tr",{children:[t.jsx("th",{style:{width:"45%"},children:"Producto"}),t.jsx("th",{style:{width:"18%"},children:"Precio"}),t.jsx("th",{style:{width:"18%"},className:"text-center",children:"Cantidad"}),t.jsx("th",{style:{width:"14%"},children:"Total"}),t.jsx("th",{style:{width:"5%"}})]})}),t.jsx("tbody",{children:m.map(s=>t.jsxs(ot.Fragment,{children:[t.jsxs("tr",{children:[t.jsx("td",{children:t.jsxs("select",{className:"form-select form-select-sm input-clean",value:s.product_id,onChange:e=>_(s.id,"product_id",e.target.value),required:!0,children:[t.jsx("option",{value:"",children:"Seleccionar"}),(()=>{const e={combo:[],burger:[],extra:[],other:[]};C.forEach(n=>{n.type==="combo"?e.combo.push(n):n.category==="burger"?e.burger.push(n):n.category==="extra"?e.extra.push(n):e.other.push(n)});const a=(n,f)=>n.name.localeCompare(f.name);return e.combo.sort(a),e.burger.sort(a),e.extra.sort(a),e.other.sort(a),t.jsxs(t.Fragment,{children:[e.combo.length>0&&t.jsx("optgroup",{label:"Combos",children:e.combo.map(n=>t.jsx("option",{value:n.id,children:n.name},n.id))}),t.jsx("optgroup",{label:"Hamburguesas",children:e.burger.map(n=>t.jsx("option",{value:n.id,children:n.name},n.id))}),")",e.extra.length>0&&t.jsx("optgroup",{label:"Extras",children:e.extra.map(n=>t.jsx("option",{value:n.id,children:n.name},n.id))}),e.other.length>0&&t.jsx("optgroup",{label:"Otros / Individuales",children:e.other.map(n=>t.jsxs("option",{value:n.id,children:[n.name," ",k&&`(Stock: ${n.stock})`]},n.id))})]})})()]})}),t.jsx("td",{children:t.jsx("input",{type:"text",className:"form-control form-control-sm font-tabular input-clean",value:j(s.price),readOnly:!0})}),t.jsx("td",{children:t.jsxs("div",{className:"d-flex align-items-center justify-content-center gap-2",children:[t.jsx("button",{type:"button",className:"btn btn-sm text-muted p-0",onClick:()=>{let e=parseInt(s.quantity,10)||0;_(s.id,"quantity",e>1?e-1:1)},style:{width:"24px",height:"24px",fontSize:"1rem"},children:t.jsx("i",{className:"bi bi-dash"})}),t.jsx("input",{type:"text",className:"form-control form-control-sm text-center p-0 input-clean",style:{width:"50px",height:"28px"},value:s.quantity,onChange:e=>{let a=e.target.value.replace(/[-.,]/g,"");_(s.id,"quantity",a)},onBlur:e=>{let a=parseInt(e.target.value,10);isNaN(a)||a<=0?_(s.id,"quantity",1):_(s.id,"quantity",a)}}),t.jsx("button",{type:"button",className:"btn btn-sm text-muted p-0",onClick:()=>_(s.id,"quantity",(parseInt(s.quantity,10)||0)+1),style:{width:"24px",height:"24px",fontSize:"1rem"},children:t.jsx("i",{className:"bi bi-plus"})})]})}),t.jsx("td",{children:t.jsx("input",{type:"text",className:"form-control form-control-sm font-tabular fw-semibold input-clean",value:j(s.total),readOnly:!0})}),t.jsx("td",{className:"text-end",children:t.jsx("button",{onClick:()=>X(s.id),className:"btn btn-icon-only text-danger",type:"button",style:{width:"31px",height:"31px"},children:t.jsx("span",{className:"material-symbols-outlined",children:"delete"})})})]}),s.stockWarning&&s.missingComponents&&s.missingComponents.length>0&&t.jsx("tr",{children:t.jsx("td",{colSpan:"5",className:"py-2 px-3",style:{backgroundColor:"#fff3cd"},children:t.jsxs("div",{className:"d-flex align-items-start gap-2",children:[t.jsx("i",{className:"bi bi-exclamation-triangle-fill text-warning",style:{fontSize:"1.1rem"}}),t.jsxs("div",{className:"flex-grow-1",children:[t.jsx("strong",{className:"text-warning d-block mb-1",children:"Advertencia de stock:"}),t.jsx("ul",{className:"list-unstyled mb-0 small",children:s.missingComponents.map((e,a)=>t.jsxs("li",{className:"text-muted",children:["• ",t.jsx("strong",{children:e.name}),": ",e.available===0?"Sin stock":`Solo hay ${e.available} (necesitas ${e.required})`]},a))}),t.jsx("p",{className:"small text-muted mb-0 mt-2",children:"Si continúas, la venta se registrará solo con los componentes disponibles en stock."})]})]})})})]},s.id))}),t.jsx("tfoot",{children:t.jsxs("tr",{children:[t.jsx("td",{colSpan:"3",className:"text-end fw-bold small",children:"TOTAL"}),t.jsx("td",{colSpan:"2",children:t.jsx("input",{type:"text",className:"form-control form-control-sm font-tabular fw-bold input-clean",value:j(b),readOnly:!0})})]})})]})}),t.jsxs("button",{type:"button",className:"btn btn-outline-secondary btn-sm mb-4",onClick:J,children:[t.jsx("i",{className:"bi bi-plus-lg me-1"})," Agregar Producto"]}),t.jsxs("div",{className:"mb-4",children:[t.jsx("label",{className:"form-label fw-semibold",children:"Método de Pago"}),t.jsxs("div",{className:"d-flex gap-2 flex-wrap",children:[t.jsx("button",{type:"button",className:`btn btn-sm ${c.payment_method==="cash"?"btn-primary":"btn-outline-secondary"}`,onClick:()=>d("payment_method","cash"),children:"Efectivo"}),t.jsx("button",{type:"button",className:`btn btn-sm ${c.payment_method==="debit_card"?"btn-primary":"btn-outline-secondary"}`,onClick:()=>d("payment_method","debit_card"),children:"Débito"}),t.jsx("button",{type:"button",className:`btn btn-sm ${c.payment_method==="credit_card"?"btn-primary":"btn-outline-secondary"}`,onClick:()=>d("payment_method","credit_card"),children:"Crédito"}),t.jsx("button",{type:"button",className:`btn btn-sm ${c.payment_method==="transfer"?"btn-primary":"btn-outline-secondary"}`,onClick:()=>d("payment_method","transfer"),children:"Transferencia"}),t.jsx("button",{type:"button",className:`btn btn-sm ${c.payment_method==="qr"?"btn-primary":"btn-outline-secondary"}`,onClick:()=>d("payment_method","qr"),children:"QR"}),t.jsx("button",{type:"button",className:`btn btn-sm ${c.payment_method==="multiple"?"btn-primary":"btn-outline-secondary"}`,onClick:()=>{d("payment_method","multiple"),L(!0),c.split_payments.length===0&&d("split_payments",[{method:"cash",amount:""},{method:"debit_card",amount:""}])},children:"Múltiple"})]}),V&&c.payment_method==="multiple"&&t.jsxs("div",{className:"mt-3 p-3 border rounded",style:{backgroundColor:"var(--bg-card)"},children:[t.jsxs("div",{className:"d-flex justify-content-between align-items-center mb-3",children:[t.jsx("strong",{className:"small",children:"Distribución de Pago"}),t.jsxs("small",{className:"text-muted",children:["Total: ",j(b)]})]}),c.split_payments.map((s,e)=>t.jsxs("div",{className:"row mb-2 align-items-center",children:[t.jsx("div",{className:"col-5",children:t.jsxs("select",{className:"form-select form-select-sm input-clean",value:s.method,onChange:a=>$(e,"method",a.target.value),children:[t.jsx("option",{value:"cash",children:"Efectivo"}),t.jsx("option",{value:"debit_card",children:"Débito"}),t.jsx("option",{value:"credit_card",children:"Crédito"}),t.jsx("option",{value:"transfer",children:"Transferencia"}),t.jsx("option",{value:"qr",children:"QR"})]})}),t.jsx("div",{className:"col-6",children:t.jsx("input",{type:"number",step:"0.01",className:"form-control form-control-sm input-clean",placeholder:"Monto",value:s.amount,onChange:a=>$(e,"amount",a.target.value)})}),t.jsx("div",{className:"col-1",children:c.split_payments.length>1&&t.jsx("button",{type:"button",className:"border-0 bg-transparent p-0",onClick:()=>G(e),style:{color:"#dc3545",cursor:"pointer"},children:t.jsx("span",{className:"material-symbols-outlined",style:{fontSize:"20px"},children:"delete"})})})]},e)),t.jsxs("button",{type:"button",className:"btn btn-sm btn-outline-secondary mt-2",onClick:Q,children:[t.jsx("i",{className:"bi bi-plus-lg me-1"}),"Agregar Método"]}),Math.abs(A()-b)>.01&&t.jsxs("div",{className:"mt-3 p-2 rounded small border",style:{backgroundColor:"var(--bg-card)",color:"var(--text-primary)"},children:[t.jsxs("div",{className:"d-flex justify-content-between",children:[t.jsx("span",{children:"Suma actual:"}),t.jsx("strong",{children:j(A())})]}),t.jsxs("div",{className:"d-flex justify-content-between mt-1",children:[t.jsx("span",{children:"Diferencia:"}),t.jsxs("strong",{style:{color:"#dc3545"},children:[j(Math.abs(b-A())),A()<b?" (falta)":" (sobra)"]})]})]})]}),c.payment_method==="cash"&&t.jsxs("div",{className:"alert alert-info mt-2 mb-0 py-2 small",children:[t.jsx("i",{className:"bi bi-info-circle me-2"}),"Este monto se sumará al saldo de caja física"]}),c.payment_method!=="cash"&&c.payment_method!=="multiple"&&t.jsxs("div",{className:"alert alert-secondary mt-2 mb-0 py-2 small",children:[t.jsx("i",{className:"bi bi-info-circle me-2"}),"Esta venta se registrará, pero no afectará el saldo físico de caja"]})]})]})}),t.jsx(ct,{isOpen:D,onClose:et,sale:l,config:o})]})}export{ut as default};
