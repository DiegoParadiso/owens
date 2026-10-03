# 2. Análisis del Entorno y Eventos del Negocio (TP 05)

Como parte de la ingeniería de requisitos basada en la metodología UP (Unified Process), y para dar fundamento al modelado de Casos de Uso, se presenta el relevamiento de los procesos operativos actuales de la hamburguesería y la identificación de los eventos críticos del negocio que justifican la automatización.

## 2.1. Análisis de Procesos Actuales

El siguiente cuadro detalla cómo se opera actualmente en el establecimiento (sin el sistema Owens), los problemas detectados en dicho flujo y la funcionalidad esperada para resolverlos.

**Tabla - Análisis de Procesos Actuales**
| Proceso Actual | Problema Operativo Detectado | Funcionalidad Esperada del Sistema | Caso de Uso Derivado | Justificación Funcional |
| :--- | :--- | :--- | :--- | :--- |
| El cajero anota el pedido en papel o memoria, calcula el total con calculadora y emite un ticket fiscal a mano. | Lentitud en mostrador, alta propensión a errores matemáticos y demoras en la entrega del vuelto. | Registro digital del pedido con cálculo automático de totales y comunicación con AFIP. | **UC-02:** Registrar Venta | Acelera el flujo de atención al cliente (Fast-Food) y elimina el error humano en el cobro. |
| El cajero le grita el pedido a la cocina o pasa un papelito que puede mancharse o perderse. | Pérdida de comandas, desorden en la prioridad de preparación y clientes insatisfechos por demoras. | Cola de trabajo visual y digital en el área de producción (KDS). | **UC-10:** Visualizar Comandas de Producción | Garantiza que la cocina prepare los pedidos en el orden exacto en que fueron cobrados. |
| El encargado revisa la cámara frigorífica visualmente para decidir si debe hacer pedidos a los proveedores. | Riesgo de quiebres de stock sorpresivos que frenan la producción de menús clave (ej. falta de pan). | Monitoreo del nivel mínimo de stock con envío de correos automáticos. | **UC-46:** Generar Alerta de Reabastecimiento | Evita depender de la memoria visual del empleado y profesionaliza la relación con proveedores. |
| Al finalizar el turno, el cajero cuenta el dinero y si hay un faltante, es imposible rastrear en qué momento se perdió. | Falta de responsabilidad individual, riesgo de fraude interno (anulaciones sin permiso). | Cierre ciego de caja, roles estrictos y registro inmutable de acciones. | **UC-03:** Cerrar Sesión<br>**UC-41:** Auditoría | Obliga al empleado a responsabilizarse por su recaudación y permite auditar cualquier desvío. |

---

## 2.2. Revisión de Eventos del Negocio

Los sistemas no se diseñan en abstracto, sino para responder a eventos que ocurren en el mundo real. La siguiente tabla identifica los eventos clave del negocio que disparan la ejecución de los Casos de Uso principales de Owens.

**Tabla - Revisión de Eventos del Negocio**
| Evento del Negocio | Actor que lo Inicia | Necesidad Funcional del Sistema | Caso de Uso Propuesto | Justificación Funcional |
| :--- | :--- | :--- | :--- | :--- |
| Un comensal llega al mostrador y dicta su orden. | Cliente (Pasivo) / Cajero | Registrar los productos solicitados, cobrar y descontar ingredientes. | **UC-02:** Registrar Venta | Es el punto de entrada principal que alimenta económicamente a toda la organización. |
| Llega el camión del frigorífico a descargar mercadería. | Encargado de Depósito | Asentar la factura del proveedor y sumar la cantidad física al stock. | **UC-21:** Registrar Ingreso de Mercadería | Centraliza la documentación contable (remitos) y actualiza el inventario real. |
| El gerente necesita conocer el margen de ganancia de la semana. | Administrador | Consolidar las ventas y los gastos operativos en un formato visual fácil de leer. | **UC-26:** Consultar Tablero de Métricas | Transforma datos transaccionales brutos en información valiosa para la toma de decisiones. |
| Un cajero cobra mal un pedido y el cliente exige la devolución de su dinero. | Administrador | Revertir el cobro, reponer el stock y anular la factura de AFIP. | **UC-05:** Anular Venta | Formaliza el proceso de contingencia, exigiendo credenciales gerenciales para prevenir robos. |
| El servidor alcanza la medianoche del domingo (hora de mantenimiento). | Planificador Autónomo | Realizar un volcado completo de la información para evitar pérdida de datos. | **UC-42:** Ejecutar Copia de Seguridad | Cumple con el plan de contingencia técnico garantizando la continuidad del negocio. |
