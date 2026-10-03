# Análisis de Brechas Funcionales (Gap Analysis) - Owens System

Para garantizar un blindaje absoluto de la arquitectura funcional del sistema, se procedió a realizar una **Matriz CRUD (Create, Read, Update, Delete)** de todas las entidades operativas reales que componen un ERP/POS gastronómico profesional. 

El objetivo es detectar cualquier entidad que quede "huérfana" (ej. que se pueda modificar pero no crear, o crear pero no eliminar).

## Matriz de Entidades vs. Casos de Uso Actuales (1 al 48)

| Entidad (Módulo) | Creación (C) | Lectura/Uso (R) | Actualización (U) | Borrado/Baja (D) | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Ventas** | UC-02 | UC-11 (Regalo) | UC-08 (Dto) | UC-05 (Anular) | 🟢 COMPLETO |
| **Caja/Turnos** | UC-01 | UC-29 | UC-04 (Mov.) | UC-03 (Cerrar) | 🟢 COMPLETO |
| **Productos** | UC-12 | POS / Reportes | UC-14 | UC-13 | 🟢 COMPLETO |
| **Recetas** | UC-15 | Ventas / Prod. | UC-24 | UC-24 | 🟢 COMPLETO |
| **Proveedores** | UC-18 | Compras / Cron | UC-19 | UC-20 | 🟢 COMPLETO |
| **Compras/Stock** | UC-21 | Dashboard | UC-17 (Ajuste) | UC-22 (Anular) | 🟢 COMPLETO |
| **Gastos Op.** | UC-28 | Dashboard | (No aplica) | UC-30 (Anular) | 🟢 COMPLETO |
| **Cat. Gastos** | UC-33 | UC-28 (Registrar)| UC-34 | UC-35 | 🟢 COMPLETO |
| **Producción Int.**| UC-16 | Stock Log | (No aplica) | UC-23 (Anular) | 🟢 COMPLETO |
| **Roles/Permisos**| UC-39 | Todo el Sist. | UC-40 (Modif) | N/A | 🟢 COMPLETO |
| **Clientes** | UC-06 | UC-02 (Venta) | UC-07 | UC-09 | 🟢 COMPLETO |
| **Usuarios (Empleados)** | UC-37 | Todo el Sist. | UC-45 (Datos) / UC-40 (Rol) | UC-38 (Susp.) | 🟢 COMPLETO |
| **Seguridad/Acceso** | UC-36 (Login) | UC-41 (Audit) | N/A | UC-03 (Logout) | 🟢 COMPLETO |
| **Configuraciones** | UC-31 / UC-43 | Todo el Sist. | UC-32 (Reglas) | N/A | 🟢 COMPLETO |
| **Base de Datos** | UC-42 (Backup) | Todo el Sist. | UC-44 (Sync) | N/A | 🟢 COMPLETO |

---

## 🚨 Fugas Detectadas (Fundamentación de Huecos Operativos)

Al analizar la matriz de forma minuciosa y cruzada con estándares de Ingeniería de Software (Sommerville) y normativas comerciales reales, encontramos **5 brechas operativas** que requieren nuevos Casos de Uso inmediatos:

1. **Gestión de Personal (ABM de Usuarios):** 
   * *El Problema:* Tenemos UC-05 (Crear Rol) y UC-20 (Asignar Rol a alguien). Pero... ¿cómo entró ese "alguien" al sistema? Falta el mecanismo sistémico donde Recursos Humanos o el Gerente dan de alta la cuenta de un nuevo cajero y donde la suspenden si es despedido.
   * *Solución:* Agregar **Alta de Usuario (Empleado)** y **Suspensión de Cuenta (Baja)**.

2. **Acceso y Trazabilidad Inicial (Login):**
   * *El Problema:* El UC-01 es "Apertura de Caja" (el cajero ingresa plata a la caja). Pero para hacer eso, primero el sistema tuvo que haber validado su contraseña. El inicio de sesión (Autenticación) es el pilar de toda la pista de auditoría. Si no hay login, no hay trazabilidad.
   * *Solución:* Agregar **Autenticar Usuario (Login/Logout)**.

3. **Ley de Protección de Datos (Clientes):**
   * *El Problema:* Tenemos Alta y Modificación de Cliente. Por leyes de protección de datos personales (ej. RGPD o Ley 25.326), un cliente que pidió factura A tiene derecho a exigir que sus datos sean eliminados del padrón comercial si ya no opera con nosotros.
   * *Solución:* Agregar **Baja Lógica de Cliente**.

4. **El Riesgo N°1 (Pérdida de Datos):**
   * *El Problema:* En la sección "1.3 Gestión de Riesgos", pusiste explícitamente: *"Ejecución de un Plan de Contingencia con políticas de copias de seguridad (Backups) automatizadas"*. Si es una estrategia de mitigación crítica, DEBE tener un caso de uso que la accione (ya sea el Cron o el Administrador).
   * *Solución:* Agregar **Ejecutar Copia de Seguridad (Backup)**.
