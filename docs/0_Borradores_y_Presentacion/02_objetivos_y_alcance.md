# 2. Objetivos

## 2.1. Objetivos Principales
El objetivo primario de este Trabajo Final es desarrollar un Sistema de Gestión Integral que optimice el ciclo comercial y operativo de establecimientos gastronómicos de atención rápida. Para lograrlo, se establecen los siguientes objetivos específicos:
*   **Agilizar el Punto de Venta:** Procesar órdenes y pagos de manera instantánea, minimizando los tiempos de espera del cliente final (NFR-01).
*   **Gestión de Inventario Recursiva:** Implementar un motor de "Ingeniería de Menús" (Recetas) que deduzca automáticamente las materias primas fraccionadas al momento de registrar una venta.
*   **Integración Fiscal:** Lograr la comunicación automatizada con los Web Services de la AFIP (WSFEv1) para la emisión y timbrado transparente de comprobantes electrónicos.
*   **Proactividad Comercial:** Automatizar el marketing y la logística mediante procesos en segundo plano (cronjobs), alertando faltantes de stock y fidelizando clientes sin requerir acción humana.

# 3. Alcance y Limitaciones

## 3.1. Alcance
El sistema "Owens" abarca la gestión integral del ciclo comercial del establecimiento. Su alcance funcional cubre:
*   La toma de pedidos en el Punto de Venta (POS).
*   La visualización de comandas en tiempo real para el sector de producción (KDS).
*   El descuento automático de inventario mediante explosión de recetas.
*   La digitalización de compras y gestión de proveedores.
*   La facturación electrónica mediante certificados digitales.
*   La emisión de reportes estadísticos y tableros de control (Dashboards).
*   El control estricto de las operaciones financieras mediante pistas de auditoría inmutables y cierres de caja.
*   La parametrización integral de catálogos base (ABMs).

## 3.2. Limitaciones
Para acotar el proyecto a un marco viable y asegurar su finalización exitosa, se establecen las siguientes limitaciones (funcionalidades fuera de alcance):
*   **Gestión de Mesas Físicas:** Al estar orientado al modelo Fast-Food, no se contempla un mapa interactivo para el ruteo o asignación de mesas.
*   **Procesamiento de pagos nativo:** El sistema asienta el medio de cobro, pero no actúa como pasarela de pagos con tarjetas de crédito; esto dependerá de terminales externas (Posnet/MercadoPago).
*   **Recursos Humanos:** No se incluye la liquidación de sueldos, diagramación de turnos ni control de presentismo.
*   **Logística de Envíos:** No contempla un módulo de seguimiento GPS para repartidores propios.
*   **Trazabilidad por Lotes:** No se llevará control de fechas de caducidad ni manejo de inventario bajo esquemas FIFO estrictos.
