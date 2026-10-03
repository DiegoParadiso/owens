# Auditoría del Proyecto Owens frente a la Rúbrica

> [!NOTE]
> **Fuente de Datos:** El estado de cumplimiento general se ha cruzado con `reglas_catedra_rubrica.md` y con la documentación del diseño actual (Objetivos, Actores y Casos de Uso).

Este documento certifica el cumplimiento del diseño arquitectónico y documental del Sistema Owens contra las pautas de evaluación de la cátedra universitaria.

## Estado de Cumplimiento General

| Criterio Evaluado | Estado | Módulo / Documento que lo cubre |
| :--- | :---: | :--- |
| Diseño en Capas | ✅ CUMPLE | Código estructurado bajo el paradigma MVC. |
| Multiusuario con Roles | ✅ CUMPLE | Documento de Actores: Administrador, Encargado, Cajero, Cocinero, Auditor. |
| Base de Datos Relacional | ✅ CUMPLE | Esquema relacional en 3FN para ventas, productos, compras y control de stock. |
| Metodología Documental | ✅ CUMPLE | Uso de Metodología UP (Casos de uso, Objetivos, Actores formales). |
| Gestión de Archivos | ✅ CUMPLE | UC-21 (Registro de Ingreso) adjunta comprobantes digitales. |
| Informes Parametrizados | ✅ CUMPLE | UC-27 permite filtrar los reportes de ventas por múltiples rangos. |
| Mínimo 2 Informes Estadísticos| ✅ CUMPLE | UC-26 consolida KPIs en un Tablero (Dashboard) interactivo. |
| Pistas de Auditoría | ✅ CUMPLE | UC-41 permite consultar la bitácora inmutable de eventos. |

## Auditoría de los 3 Módulos Inteligentes Obligatorios

Se exige un mínimo de 3 procesos automatizados que generen valor, sean parametrizables y no formen parte del PMV (Producto Mínimo Viable).

### 1. Módulo de Compras: Reabastecimiento Automático
*   **Referencia:** UC-46 (Generar Alerta de Reabastecimiento)
*   **Inteligencia:** Verifica el inventario periódicamente y, si los niveles alcanzan un mínimo paramétrico, solicita cotizaciones mediante el Servicio de Correo a proveedores sin intervención humana.
*   **Estado:** ✅ APROBADO (Ejemplo directo de la cátedra).

### 2. Módulo Legal: Facturación Automatizada AFIP
*   **Referencia:** UC-47 (Validar Comprobante Fiscal)
*   **Inteligencia:** Envía los paquetes de datos de la venta al Web Service de AFIP en segundo plano, recibiendo el CAE y timbrando el comprobante.
*   **Estado:** ✅ APROBADO (Integración con tecnología de terceros válida según rúbrica).

### 3. Módulo Marketing: Enviar Cupón de Fidelización
*   **Referencia:** UC-48 (Enviar Cupón de Fidelización)
*   **Inteligencia:** Revisa el historial de los clientes diariamente. Si un cliente está inactivo por un plazo configurable (ej. 60 días) **y el local se encuentra operando**, envía un cupón promocional a través de la Plataforma de Mensajería Externa.
*   **Estado:** ✅ APROBADO (Genera ganancias recuperando clientes y usa API de terceros).
