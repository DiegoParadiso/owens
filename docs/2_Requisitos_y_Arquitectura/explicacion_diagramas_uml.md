# Explicación del Diagrama UML - Sistema Owens

Este documento está diseñado para ayudarte a defender la arquitectura del sistema frente al tribunal. Aquí se explica el razonamiento detrás de los diagramas de Casos de Uso, los actores involucrados y cómo se relacionan con el mundo real.

## 1. El Concepto de "Actor" vs "Persona Física"
Una de las preguntas clásicas del tribunal es: *"¿Qué pasa si el dueño del local hace todo? ¿Para qué tantos actores?"*

La respuesta formal según la Ingeniería de Software es: **Un Actor en UML representa un ROL, no a una persona física.**
El sistema Owens está diseñado usando el patrón de seguridad **RBAC (Control de Acceso Basado en Roles)**. 
*   Si el local es atendido por una sola persona (ej. Diego), la cuenta de Diego tendrá asignado el rol de `Administrador`.
*   El rol `Administrador` engloba (hereda) los permisos de todos los demás roles operativos.
*   Si el negocio crece y Diego contrata a un empleado exclusivo para cobrar, le creará una cuenta y le asignará el rol de `Cajero`. Ese empleado solo podrá ejecutar los casos de uso asociados al actor Cajero en el diagrama.

El diagrama está preparado para escalar: soporta desde un emprendedor solitario hasta una franquicia con decenas de empleados, sin necesidad de modificar el código ni la arquitectura.

## 2. Estructura de Paquetes
Para evitar el "anti-patrón de telaraña" (un gráfico ilegible con líneas cruzadas por todos lados), los 48 casos de uso se organizaron en 5 subsistemas lógicos idénticos a los definidos en el alcance del proyecto:

1. **Subsistema de Operaciones y Ventas:** Contiene el flujo de caja, alta de clientes y toma de pedidos. Sus actores principales son el `Cajero` y el `Cliente`.
2. **Subsistema de Logística e Inventario:** Contiene el manejo de recetas, productos, proveedores y producción interna. Su actor principal es el `Encargado de Depósito`.
3. **Subsistema de Gerencia y Contabilidad:** Contiene los reportes, parámetros del negocio y gastos. Su actor principal es el `Administrador`.
4. **Subsistema de Seguridad y Auditoría:** Contiene la creación de empleados, roles y permisos, backup y revisión de la bitácora. Sus actores son el `Administrador` y el `Auditor`.
5. **Subsistema de Interfaces Externas:** Contiene los módulos inteligentes requeridos por la cátedra y facturación. Actúan el `Planificador Autónomo` y sistemas de terceros (`AFIP`, `Correo`, `Mensajería`).

## 3. Relaciones Especiales (Include y Extend)
*   **\<\<include\>\> (Inclusión obligatoria):** Cuando se registra una venta (UC-02), el sistema *obligatoriamente* debe validar el comprobante (UC-47) contra la AFIP. No puede existir una venta sin esta validación, por eso la flecha es un `<<include>>`.
*   **Autenticación Implícita:** Para no llenar el gráfico de flechas apuntando a un "Login", se asume por regla de negocio que todos los actores humanos requieren iniciar sesión para acceder a sus respectivos paquetes (con excepción del Cliente).

## 4. Actores Externos (Sistemas)
Para cumplir con las reglas UP (Proceso Unificado) y evitar jerga técnica, los sistemas con los que nos integramos se diagraman como actores, pero con nombres de negocio:
*   En lugar de "Cron", usamos **Planificador Autónomo**.
*   En lugar de "API de WhatsApp", usamos **Plataforma de Mensajería**.
*   En lugar de "SMTP", usamos **Servicio de Correo**.
*   En lugar de "Web Service", usamos **Entidad Fiscal (AFIP)**.
x