# 3.5. Actores del Sistema

Para delimitar las interacciones y responsabilidades dentro de Owens, se han identificado los siguientes perfiles de usuarios (Actores Humanos) y entidades autónomas (Actores de Sistema):

## Actores Humanos
*   **Administrador:** Posee acceso irrestricto (Superusuario). Gestiona la configuración global, define roles, audita el sistema y visualiza el tablero de rentabilidad.
*   **Encargado de Depósito:** Gestiona el back-office. Ingresa compras, ajusta inventarios y parametriza la "Ingeniería de Menú" (recetas).
*   **Cajero:** Actor crítico del front-end. Opera el Punto de Venta (POS), registra órdenes, cobra y emite facturación electrónica.
*   **Cocinero:** Interactúa exclusivamente con las pantallas de producción (KDS - Kitchen Display System) para visualizar y despachar comandas en tiempo real.
*   **Auditor:** Perfil de solo lectura. Revisa la bitácora de eventos y el historial de transacciones para garantizar la transparencia financiera.

## Actores de Sistema (Externos y Autónomos)
*   **Entidad Fiscal (AFIP):** Actor externo secundario. Recibe y autoriza las peticiones criptográficas (XML/SOAP) para emitir el Código de Autorización Electrónico (CAE).
*   **Planificador Autónomo (Cronjob):** Actor interno automatizado (Tiempo). Se encarga de disparar los módulos inteligentes en horarios programados de baja concurrencia.
