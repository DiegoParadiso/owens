import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import Toast from '../../Components/Toast/Toast';
import ConfirmDialog from '../../Components/Modal/ConfirmDialog';

export const FEEDBACK_CATALOG = [
    {
        cu: 'cu15',
        code: 'CU-15',
        name: 'Asignar Receta a Producto (Alta de Ficha Técnica)',
        masterScreen: 'Pantalla Maestra 1: Gestión de Catálogo de Menú y Recetas BOM',
        items: {
            a: {
                kind: 'toast',
                type: 'success',
                label: '[Pantalla A] Alerta de Éxito Transaccional',
                title: 'Operación Exitosa',
                message: "El producto 'Bacon Burger Doble' ha sido registrado y publicado correctamente en el menú."
            },
            b: {
                kind: 'toast',
                type: 'error',
                label: '[Pantalla B] Alerta de Validación de Campos',
                title: 'Error de Validación',
                message: 'Faltan completar campos obligatorios exigidos por el sistema (Precio o Insumos).'
            },
            c: {
                kind: 'toast',
                type: 'error',
                label: '[Pantalla C] Alerta de Inconsistencia de Receta',
                title: 'Inconsistencia de Receta',
                message: 'La matriz BOM está vacía. Debe incorporar al menos una materia prima a la receta.'
            },
            d: {
                kind: 'toast',
                type: 'warning',
                label: '[Pantalla D] Alerta de Registro Duplicado',
                title: 'Advertencia de Duplicado',
                message: "Ya existe un producto o insumo registrado con la denominación 'Bacon Burger Doble'."
            },
            e: {
                kind: 'modal',
                variant: 'info',
                label: '[Pantalla E] Modal de Confirmación de Operación',
                category: 'Catálogo de Recetas BOM',
                title: 'Confirmar Registro de Receta',
                message: '¿Confirma la publicación de la receta comercial de Bacon Burger Doble? Se actualizarán los costos de insumos en el menú activo.',
                confirmText: 'PUBLICAR RECETA',
                cancelText: 'CANCELAR'
            }
        }
    },
    {
        cu: 'cu24',
        code: 'CU-24',
        name: 'Modificar Receta (Actualización de Fórmula y Metadatos)',
        masterScreen: 'Pantalla Maestra 1: Gestión de Catálogo de Menú y Recetas BOM',
        items: {
            a: {
                kind: 'toast',
                type: 'success',
                label: '[Pantalla A] Alerta de Éxito Transaccional',
                title: 'Receta Actualizada',
                message: "La fórmula y costos de 'Bacon Burger Doble' han sido actualizados exitosamente."
            },
            b: {
                kind: 'toast',
                type: 'error',
                label: '[Pantalla B] Alerta de Validación de Campos',
                title: 'Error de Validación',
                message: 'El precio de venta y las cantidades de los insumos deben ser mayores a cero.'
            },
            c: {
                kind: 'toast',
                type: 'error',
                label: '[Pantalla C] Alerta de Inconsistencia de Receta',
                title: 'Inconsistencia de Receta',
                message: 'No es posible guardar una receta sin materias primas asociadas en su fórmula.'
            },
            d: {
                kind: 'toast',
                type: 'warning',
                label: '[Pantalla D] Alerta de Registro Duplicado',
                title: 'Advertencia de Duplicado',
                message: 'La denominación modificada ya pertenece a otro producto activo en el catálogo.'
            },
            e: {
                kind: 'modal',
                variant: 'info',
                label: '[Pantalla E] Modal de Confirmación de Operación',
                category: 'Catálogo de Recetas BOM',
                title: 'Confirmar Actualización de Receta',
                message: '¿Confirma la actualización de la fórmula y precio de Bacon Burger Doble? Se recalculará el costo estándar para futuros pedidos.',
                confirmText: 'ACTUALIZAR RECETA',
                cancelText: 'CANCELAR'
            }
        }
    },
    {
        cu: 'cu25',
        code: 'CU-25',
        name: 'Dar de Baja Receta (Inactivación de Catálogo)',
        masterScreen: 'Pantalla Maestra 1: Gestión de Catálogo de Menú y Recetas BOM',
        items: {
            a: {
                kind: 'toast',
                type: 'success',
                label: '[Pantalla A] Alerta de Éxito Transaccional',
                title: 'Producto Inactivado',
                message: "El producto 'Cheese Burger Simple' ha sido inactivado correctamente del menú."
            },
            c: {
                kind: 'toast',
                type: 'error',
                label: '[Pantalla C] Alerta de Inconsistencia Operativa',
                title: 'Inconsistencia Operativa',
                message: 'Operación bloqueada: el producto forma parte de un Combo promocional activo.'
            },
            f: {
                kind: 'modal',
                variant: 'danger',
                label: '[Pantalla F] Modal de Confirmación de Inactivación',
                category: 'Inactivación',
                title: 'Inactivar Producto del Menú',
                message: '¿Confirma que desea inactivar Cheese Burger Simple? Esta acción impedirá su venta en mostrador y pausará su receta en cocina.',
                confirmText: 'INACTIVAR',
                cancelText: 'CANCELAR'
            }
        }
    },
    {
        cu: 'cu12',
        code: 'CU-12',
        name: 'Dar de Alta Insumo',
        masterScreen: 'Pantalla Maestra 2: Inventario de Insumos y Materias Primas',
        items: {
            a: {
                kind: 'toast',
                type: 'success',
                label: '[Pantalla A] Alerta de Éxito Transaccional',
                title: 'Insumo Registrado',
                message: "La materia prima 'Medallón Vacuno 120g' fue incorporada al depósito correctamente."
            },
            b: {
                kind: 'toast',
                type: 'error',
                label: '[Pantalla B] Alerta de Validación de Campos',
                title: 'Error de Validación',
                message: 'Complete la denominación, unidad de medida y un costo unitario mayor a cero.'
            },
            c: {
                kind: 'toast',
                type: 'error',
                label: '[Pantalla C] Alerta de Inconsistencia Operativa',
                title: 'Inconsistencia Operativa',
                message: 'Error de integridad transaccional al intentar registrar el insumo en almacén.'
            },
            d: {
                kind: 'toast',
                type: 'warning',
                label: '[Pantalla D] Alerta de Registro Duplicado',
                title: 'Advertencia de Duplicado',
                message: "La materia prima 'Medallón Vacuno 120g' ya se encuentra registrada en almacén."
            },
            e: {
                kind: 'modal',
                variant: 'info',
                label: '[Pantalla E] Modal de Confirmación de Operación',
                category: 'Inventario de Insumos',
                title: 'Confirmar Registro de Insumo',
                message: '¿Confirma el alta de la materia prima Medallón Vacuno 120g con su costo de reposición y umbral de seguridad en depósito?',
                confirmText: 'REGISTRAR INSUMO',
                cancelText: 'CANCELAR'
            }
        }
    },
    {
        cu: 'cu14',
        code: 'CU-14',
        name: 'Modificar Insumo',
        masterScreen: 'Pantalla Maestra 2: Inventario de Insumos y Materias Primas',
        items: {
            a: {
                kind: 'toast',
                type: 'success',
                label: '[Pantalla A] Alerta de Éxito Transaccional',
                title: 'Insumo Actualizado',
                message: "El costo de reposición y stock mínimo de 'Pan Brioche' fueron actualizados."
            },
            b: {
                kind: 'toast',
                type: 'error',
                label: '[Pantalla B] Alerta de Validación de Campos',
                title: 'Error de Validación',
                message: 'El costo unitario debe ser mayor a cero y el umbral de stock no negativo.'
            },
            c: {
                kind: 'toast',
                type: 'error',
                label: '[Pantalla C] Alerta de Inconsistencia Operativa',
                title: 'Conflicto Dimensional',
                message: 'No puede alterarse la unidad de medida de un insumo asignado a recetas activas.'
            },
            d: {
                kind: 'toast',
                type: 'warning',
                label: '[Pantalla D] Alerta de Registro Duplicado',
                title: 'Advertencia de Duplicado',
                message: 'La denominación ingresada colisiona con otro insumo existente en el depósito.'
            },
            e: {
                kind: 'modal',
                variant: 'info',
                label: '[Pantalla E] Modal de Confirmación de Operación',
                category: 'Inventario de Insumos',
                title: 'Confirmar Actualización de Insumo',
                message: '¿Confirma la actualización del costo unitario y umbral de seguridad de Pan Brioche? Se recalcularán las recetas asociadas.',
                confirmText: 'ACEPTAR',
                cancelText: 'CANCELAR'
            }
        }
    },
    {
        cu: 'cu13',
        code: 'CU-13',
        name: 'Dar de Baja Insumo',
        masterScreen: 'Pantalla Maestra 2: Inventario de Insumos y Materias Primas',
        items: {
            a: {
                kind: 'toast',
                type: 'success',
                label: '[Pantalla A] Alerta de Éxito Transaccional',
                title: 'Insumo Inactivado',
                message: "La materia prima 'Pan Brioche' ha sido inactivada en el depósito correctamente."
            },
            c: {
                kind: 'toast',
                type: 'error',
                label: '[Pantalla C] Alerta de Inconsistencia de Baja',
                title: 'Inconsistencia de Baja',
                message: 'Operación bloqueada: el insumo participa en recetas activas o posee stock físico.'
            },
            f: {
                kind: 'modal',
                variant: 'danger',
                label: '[Pantalla F] Modal de Confirmación de Inactivación',
                category: 'Inventario de Insumos',
                title: 'Inactivar Insumo de Almacén',
                message: '¿Confirma que desea inactivar Pan Brioche? Dejará de estar disponible para recepciones de compra y fórmulas de cocina.',
                confirmText: 'INACTIVAR',
                cancelText: 'CANCELAR'
            }
        }
    },
    {
        cu: 'cu02',
        code: 'CU-02',
        name: 'Registrar Venta en Punto de Venta (POS)',
        masterScreen: 'Pantalla Maestra 3: Terminal de Punto de Venta Mostrador (POS)',
        items: {
            a: {
                kind: 'toast',
                type: 'success',
                label: '[Pantalla A] Alerta de Éxito Transaccional',
                title: 'Venta Facturada con CAE',
                message: 'Factura B #0001-00004821 autorizada por AFIP y comanda enviada a cocina KDS.'
            },
            b: {
                kind: 'toast',
                type: 'error',
                label: '[Pantalla B] Alerta de Validación de Pago / Campos',
                title: 'Error de Validación en Cobro',
                message: 'El monto recibido es menor al total a cobrar o el CUIT ingresado es inválido.'
            },
            c: {
                kind: 'toast',
                type: 'error',
                label: '[Pantalla C] Alerta de Inconsistencia de Stock',
                title: 'Inconsistencia de Negocio',
                message: "Quiebre de stock. Materia prima 'Medallón de Carne Vacuna' insuficiente para elaborar la orden."
            },
            e: {
                kind: 'modal',
                variant: 'info',
                label: '[Pantalla E] Modal de Liquidación y Cobro',
                category: 'Terminal POS Mostrador',
                title: 'Confirmar Liquidación y Facturación',
                message: '¿Confirma el cobro de la orden por $23.000 (Efectivo) y la emisión del comprobante fiscal electrónico con CAE ante AFIP?',
                confirmText: 'CONFIRMAR PAGO Y FACTURAR',
                cancelText: 'CANCELAR COBRO'
            }
        }
    },
    {
        cu: 'cu05',
        code: 'CU-05',
        name: 'Anular Venta y Emitir Nota de Crédito AFIP',
        masterScreen: 'Pantalla Maestra 3: Terminal de Punto de Venta Mostrador (POS)',
        items: {
            a: {
                kind: 'toast',
                type: 'success',
                label: '[Pantalla A] Alerta de Éxito Transaccional',
                title: 'Venta Anulada Exitosamente',
                message: 'Nota de Crédito #0001-00000312 emitida en AFIP y stock restituido al almacén.'
            },
            b: {
                kind: 'toast',
                type: 'error',
                label: '[Pantalla B] Alerta de Validación de Campos',
                title: 'Datos de Anulación Incompletos',
                message: 'Ingrese un número de comprobante válido y redacte el motivo de anulación fiscal.'
            },
            c: {
                kind: 'toast',
                type: 'error',
                label: '[Pantalla C] Alerta de Inconsistencia Operativa',
                title: 'Autorización o Anulación Denegada',
                message: 'Clave de supervisor inválida o el comprobante ya registra Nota de Crédito emitida.'
            },
            f: {
                kind: 'modal',
                variant: 'danger',
                label: '[Pantalla F] Modal de Confirmación de Anulación',
                category: 'Facturación y Auditoría AFIP',
                title: 'Confirmar Anulación y Nota de Crédito',
                message: '¿Confirma la anulación irreversible del comprobante #0001-00004821? Se emitirá Nota de Crédito en AFIP y se restituirá el stock.',
                confirmText: 'CONFIRMAR ANULACIÓN',
                cancelText: 'CANCELAR ANULACIÓN'
            }
        }
    },
    {
        cu: 'cu01',
        code: 'CU-01',
        name: 'Iniciar Turno y Apertura de Caja',
        masterScreen: 'Pantalla Maestra 4: Módulo de Turno y Control de Caja',
        items: {
            a: {
                kind: 'toast',
                type: 'success',
                label: '[Pantalla A] Alerta de Éxito Transaccional',
                title: 'Caja Abierta',
                message: 'El turno de caja ha sido iniciado exitosamente con el fondo inicial declarado.'
            },
            b: {
                kind: 'toast',
                type: 'error',
                label: '[Pantalla B] Alerta de Validación de Fondos',
                title: 'Error de Validación de Fondos',
                message: 'El monto del fondo inicial de cambio debe ser numérico y mayor o igual a cero.'
            },
            c: {
                kind: 'toast',
                type: 'error',
                label: '[Pantalla C] Alerta de Inconsistencia Operativa',
                title: 'Inconsistencia de Turno',
                message: 'Ya existe una sesión de caja abierta en el puesto o carece de permisos de cajero.'
            },
            e: {
                kind: 'modal',
                variant: 'info',
                label: '[Pantalla E] Modal de Confirmación de Apertura',
                category: 'Gestión de Caja POS',
                title: 'Confirmar Apertura de Caja',
                message: '¿Confirma la apertura de turno en el puesto con un fondo inicial declarado de $15.000 en efectivo?',
                confirmText: 'ABRIR CAJA',
                cancelText: 'CANCELAR'
            }
        }
    },
    {
        cu: 'cu03',
        code: 'CU-03',
        name: 'Cierre de Turno y Arqueo Ciego de Caja',
        masterScreen: 'Pantalla Maestra 4: Módulo de Turno y Control de Caja',
        items: {
            a: {
                kind: 'toast',
                type: 'success',
                label: '[Pantalla A] Alerta de Éxito Transaccional',
                title: 'Turno Cerrado y Arqueo Registrado',
                message: 'El cierre ciego fue asentado correctamente. Reporte PDF de arqueo disponible.'
            },
            b: {
                kind: 'toast',
                type: 'error',
                label: '[Pantalla B] Alerta de Validación de Fondos',
                title: 'Validación de Conteo Físico',
                message: 'Ingrese un monto físico válido o redacte la justificación por desvío de arqueo.'
            },
            c: {
                kind: 'toast',
                type: 'error',
                label: '[Pantalla C] Alerta de Inconsistencia Operativa',
                title: 'Cierre de Caja Bloqueado',
                message: 'Existen comandas activas pendientes de cobro. Finalícelas antes del arqueo ciego.'
            },
            e: {
                kind: 'modal',
                variant: 'info',
                label: '[Pantalla E] Modal de Resultado de Arqueo Ciego',
                category: 'Arqueo Ciego de Tesorería',
                title: 'Resultado del Arqueo Ciego de Caja',
                message: 'Saldo Teórico: $148.500 | Efectivo Contado: $148.500 | Diferencia: $0,00 (Exacto). ¿Confirma la clausura definitiva del turno?',
                confirmText: 'CONFIRMAR CIERRE DE CAJA',
                cancelText: 'CANCELAR CIERRE'
            }
        }
    },
    {
        cu: 'cu04',
        code: 'CU-04',
        name: 'Registrar Movimiento Manual de Caja (Ingreso / Egreso)',
        masterScreen: 'Pantalla Maestra 4: Módulo de Turno y Control de Caja',
        items: {
            a: {
                kind: 'toast',
                type: 'success',
                label: '[Pantalla A] Alerta de Éxito Transaccional',
                title: 'Movimiento Manual Registrado',
                message: 'El egreso operativo por $4.500 fue asentado e imputado al turno de caja activo.'
            },
            b: {
                kind: 'toast',
                type: 'error',
                label: '[Pantalla B] Alerta de Validación de Fondos',
                title: 'Datos de Movimiento Incompletos',
                message: 'El importe debe ser mayor a cero y el motivo de justificación es obligatorio.'
            },
            c: {
                kind: 'toast',
                type: 'error',
                label: '[Pantalla C] Alerta de Inconsistencia Operativa',
                title: 'Fondos Insuficientes en Gaveta',
                message: 'El monto del egreso solicitado supera el saldo físico en efectivo disponible.'
            },
            e: {
                kind: 'modal',
                variant: 'info',
                label: '[Pantalla E] Modal de Confirmación de Movimiento',
                category: 'Tesorería y Turnos',
                title: 'Confirmar Movimiento Manual de Caja',
                message: "¿Confirma el asiento del Egreso Operativo por $4.500 en concepto de 'Reposición de hielo e insumos menores de salón'?",
                confirmText: 'GUARDAR MOVIMIENTO',
                cancelText: 'CANCELAR'
            }
        }
    },
    {
        cu: 'cu10',
        code: 'CU-10',
        name: 'Visualizar y Despachar Comandas en Cocina (KDS)',
        masterScreen: 'Pantalla Maestra 5: Monitor de Cocina en Tiempo Real (KDS)',
        items: {
            a: {
                kind: 'toast',
                type: 'success',
                label: '[Pantalla A] Alerta Sonora y Visual de Pedido Entrante',
                title: 'Nueva Comanda Entrante #104',
                message: 'Orden ingresada desde Mostrador POS (2x Bacon Burger Doble, 1x Papas Fritas).'
            },
            c: {
                kind: 'toast',
                type: 'error',
                label: '[Pantalla C] Alerta de Comanda Anulada',
                title: 'COMANDA #102 ANULADA',
                message: "Orden anulada en caja. Suspenda la cocción y presione 'Descartar Comanda Anulada'."
            }
        }
    },
    {
        cu: 'cu49',
        code: 'CU-49',
        name: 'Generar Pedido Digital',
        masterScreen: 'Pantalla Maestra 6: Menú Digital y Carrito de Autoservicio',
        items: {
            a: {
                kind: 'toast',
                type: 'success',
                label: '[Pantalla A] Notificación de Confirmación de Pedido Digital',
                title: '¡Pedido Digital #WEB-208 Confirmado!',
                message: 'Tu orden fue enviada a cocina. Tiempo estimado de preparación: 15 a 20 minutos.'
            },
            b: {
                kind: 'toast',
                type: 'error',
                label: '[Pantalla B] Alerta de Selección Incompleta',
                title: 'Selección o Datos Incompletos',
                message: 'Completá tu nombre, teléfono y dirección de entrega para confirmar el pedido.'
            },
            c: {
                kind: 'toast',
                type: 'error',
                label: '[Pantalla C] Alerta de Inconsistencia / Producto Agotado',
                title: 'Producto Temporalmente Agotado',
                message: 'Un ítem seleccionado acaba de agotarse en cocina. Tus productos siguen en carrito.'
            },
            e: {
                kind: 'modal',
                variant: 'info',
                label: '[Pantalla E] Modal de Confirmación de Pedido Digital',
                category: 'Canal de Autoservicio Digital',
                title: 'Confirmar Envío de Pedido Digital',
                message: '¿Confirmás el envío de tu pedido por $26.500 (Retiro en Mostrador)? Lo enviaremos directamente a la cocina para su preparación.',
                confirmText: 'HACER PEDIDO',
                cancelText: 'SEGUIR COMPRANDO'
            }
        }
    },
    {
        cu: 'cu29',
        code: 'CU-29',
        name: 'Generar Reporte Consolidado de Ventas y Rendición de Caja',
        masterScreen: 'Diseño de Salida 4.1.1: Reporte Consolidado de Ventas y Rendición de Caja',
        items: {
            a: {
                kind: 'toast',
                type: 'success',
                label: '[Pantalla A] Alerta de Éxito Transaccional',
                title: 'Reporte Consolidado Exportado',
                message: 'El documento oficial A4 con firma SHA-256 ha sido compilado y descargado con éxito.'
            },
            b: {
                kind: 'toast',
                type: 'error',
                label: '[Pantalla B] Alerta de Validación de Campos',
                title: 'Intervalo Cronológico Inválido',
                message: "La 'Fecha Desde' seleccionada no puede ser posterior a la 'Fecha Hasta' de corte."
            },
            c: {
                kind: 'toast',
                type: 'error',
                label: '[Pantalla C] Alerta de Inconsistencia Operativa',
                title: 'Error de Exportación Documental',
                message: 'El período filtrado no registra arqueos cerrados o expiró el motor de PDF.'
            }
        }
    }
];

const LEGACY_ALIASES = {
    a: 'cu15_a',
    toast_success: 'cu15_a',
    b: 'cu15_b',
    toast_error: 'cu15_b',
    c: 'cu02_c',
    toast_conflict: 'cu02_c',
    d: 'cu15_d',
    toast_warning: 'cu15_d',
    e: 'cu15_e',
    modal_confirm: 'cu15_e',
    f: 'cu25_f',
    modal_delete: 'cu25_f'
};

function resolveCaptureItem(rawKey) {
    if (!rawKey) return null;
    const normalized = LEGACY_ALIASES[rawKey] || rawKey;
    const match = normalized.match(/^(cu\d+)_([a-f])$/);
    if (!match) return null;
    const [, cuKey, screenKey] = match;
    const cuEntry = FEEDBACK_CATALOG.find((entry) => entry.cu === cuKey);
    if (!cuEntry || !cuEntry.items[screenKey]) return null;
    return { id: normalized, ...cuEntry.items[screenKey] };
}

export default function RetroalimentacionesShowcase() {
    const [component, setComponent] = useState(null);
    const [isStatic, setIsStatic] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const comp = (params.get('component') || params.get('isolate') || '').toLowerCase();
            const stat = params.get('static') === '1';

            if (comp) {
                setComponent(comp);
            }
            setIsStatic(stat);
        }
    }, []);

    const triggerToast = (type, title, message) => {
        if (window.toast && window.toast[type]) {
            window.toast[type](title, message);
        } else if (window.toast && window.toast.show) {
            window.toast.show(type, title, message);
        }
    };

    const triggerModalFlow = async (modalItem, successItem) => {
        if (window.confirmAction) {
            const ok = await window.confirmAction({
                title: modalItem.title,
                category: modalItem.category,
                message: modalItem.message,
                variant: modalItem.variant,
                confirmText: modalItem.confirmText,
                cancelText: modalItem.cancelText
            });
            if (ok && successItem) {
                triggerToast(successItem.type, successItem.title, successItem.message);
            }
        }
    };

    const isolatedItem = resolveCaptureItem(component);

    // Modo de captura aislada para snapshots limpios por Caso de Uso Real
    if (isolatedItem) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
                <Head title={`Captura ${isolatedItem.id}`} />
                {isStatic && (
                    <style dangerouslySetInnerHTML={{ __html: `
                        *, *::before, *::after {
                            animation: none !important;
                            transition: none !important;
                            transform: none !important;
                        }
                    `}} />
                )}
                {isolatedItem.kind === 'toast' && (
                    <Toast
                        id={`t-${isolatedItem.id}`}
                        type={isolatedItem.type}
                        title={isolatedItem.title}
                        message={isolatedItem.message}
                        duration={0}
                        onClose={() => {}}
                    />
                )}
                {isolatedItem.kind === 'modal' && (
                    <ConfirmDialog
                        isOpen={true}
                        variant={isolatedItem.variant}
                        category={isolatedItem.category}
                        title={isolatedItem.title}
                        message={isolatedItem.message}
                        confirmText={isolatedItem.confirmText}
                        cancelText={isolatedItem.cancelText}
                        freeze={true}
                    />
                )}
            </div>
        );
    }

    // Modo interactivo en pantalla: organizado por los 14 Casos de Uso Reales
    return (
        <div style={{ padding: '20px', fontSize: '13px', fontFamily: 'system-ui, sans-serif', maxWidth: '1100px', margin: '0 auto' }}>
            <Head title="Playground de Retroalimentaciones (14 Casos de Uso Reales)" />

            <h3 style={{ margin: '0 0 6px 0', fontSize: '16px' }}>
                Catálogo Interactivo de Pantallas de Retroalimentación — 14 Casos de Uso Reales
            </h3>
            <p style={{ margin: '0 0 18px 0', color: '#555' }}>
                Cada Caso de Uso Real dispone de sus propias notificaciones asíncronas (<code>[Pantalla A..D]</code>) y diálogos modales contextualizados (<code>[Pantalla E..F] &rarr; [Pantalla A]</code>):
            </p>

            <div style={{ display: 'grid', gap: '12px' }}>
                {FEEDBACK_CATALOG.map((entry) => (
                    <div
                        key={entry.cu}
                        style={{
                            border: '1px solid #cbd5e1',
                            borderRadius: '8px',
                            padding: '12px 14px',
                            backgroundColor: '#f8fafc'
                        }}
                    >
                        <div style={{ fontWeight: 700, marginBottom: '2px', color: '#0f172a' }}>
                            {entry.code}: {entry.name}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px' }}>
                            {entry.masterScreen}
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {Object.entries(entry.items).map(([letter, item]) => (
                                <button
                                    key={letter}
                                    type="button"
                                    onClick={() => {
                                        if (item.kind === 'toast') {
                                            triggerToast(item.type, item.title, item.message);
                                        } else {
                                            triggerModalFlow(item, entry.items.a);
                                        }
                                    }}
                                    style={{
                                        padding: '5px 10px',
                                        fontSize: '12px',
                                        borderRadius: '6px',
                                        border: '1px solid #94a3b8',
                                        background: item.kind === 'modal' ? '#e0f2fe' : '#ffffff',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {item.label} (<code>?component={entry.cu}_{letter}</code>)
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <p style={{ margin: '20px 0 0 0', color: '#777', fontSize: '12px' }}>
                Ejecutar captura automatizada de las 55 láminas para la documentación: <code>npm run capture:toasts</code>
            </p>
        </div>
    );
}
