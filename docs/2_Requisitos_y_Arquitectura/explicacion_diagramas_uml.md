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
*   **<<include>> (Inclusión obligatoria):** Cuando se registra una venta (UC-02), el sistema *obligatoriamente* debe validar el comprobante (UC-47) contra la AFIP. No puede existir una venta sin esta validación, por eso la flecha es un `<<include>>`.
*   **Autenticación Implícita:** Para no llenar el gráfico de flechas apuntando a un "Login", se asume por regla de negocio que todos los actores humanos requieren iniciar sesión para acceder a sus respectivos paquetes (con excepción del Cliente).

## 4. Actores Externos (Sistemas)
Para cumplir con las reglas UP (Proceso Unificado) y evitar jerga técnica, los sistemas con los que nos integramos se diagraman como actores, pero con nombres de negocio:
*   En lugar de "Cron", usamos **Planificador Autónomo**.
*   En lugar de "API de WhatsApp", usamos **Plataforma de Mensajería**.
*   En lugar de "SMTP", usamos **Servicio de Correo**.
*   En lugar de "Web Service", usamos **Entidad Fiscal (AFIP)**.

## 5. Decisiones del Modelo de Datos (Esquema Relacional)
Cuando el tribunal analiza el DER (Diagrama Entidad-Relación) o Modelo de Datos, suele buscar "omisiones" típicas. Aquí te explico por qué ciertas cosas NO están o están modeladas de forma particular:

### 5.1. ¿Por qué no hay tablas separadas de "Roles" y "Permisos"?
*   **Pregunta del tribunal:** *"Si usan RBAC, ¿dónde están las tablas de Roles, Permisos y Usuario_Rol?"*
*   **Defensa:** Para este sistema en particular, los roles son estáticos y están bien definidos por el dominio del negocio (Administrador, Cajero, Encargado, Auditor). En lugar de sobre-ingeniar con 3 tablas adicionales que casi nunca cambiarán dinámicamente, se desnormalizó de forma controlada agregando un campo `rol` (string) en la tabla `usuarios`. La lógica de qué puede hacer cada rol reside en la capa de aplicación (middlewares de seguridad y autorizadores), no en la base de datos. Esto optimiza las consultas y simplifica el mantenimiento.

### 5.2. ¿Por qué no hay tablas de "Auditoría" para todo? (Solo hay de Stock)
*   **Pregunta del tribunal:** *"¿Cómo auditan quién modificó una venta o los datos de un cliente?"*
*   **Defensa:** El sistema utiliza **Borrado Lógico (Soft Deletes)** (`fecha_eliminacion`) en las entidades principales. No borramos registros, los ocultamos. Además, entidades transaccionales como ventas, compras y sesiones de caja son *inmutables* por diseño del negocio (una vez cerradas, no se editan; si hay un error, se anulan o se hace una nota de crédito). Solo se implementó una tabla dedicada de `auditoria_stock` porque el inventario es el único elemento altamente mutable y crítico para la prevención de mermas y robos en un entorno gastronómico.

### 5.3. ¿Dónde está el "Carrito de Compras" o las tablas temporales?
*   **Pregunta del tribunal:** *"Mientras el cajero arma el pedido, ¿dónde se guarda?"*
*   **Defensa:** El estado temporal del carrito se maneja en la memoria de la aplicación cliente (frontend) o en memoria volátil de sesión, no en la base de datos relacional. Recién cuando el pedido se confirma y se paga, se impacta en las tablas `ventas` y `detalle_ventas` en una única transacción atómica (ACID). Persistir estados temporales incompletos en el motor relacional saturaría la base de datos con operaciones de I/O innecesarias y dejaría datos basura si el usuario abandona la compra.

### 5.4. Integración con AFIP (Facturación Electrónica)
*   **Pregunta del tribunal:** *"¿Por qué no hay una tabla de 'Facturas'?"*
*   **Defensa:** A nivel de datos, la facturación es simplemente la confirmación fiscal de una venta. Por eso, se agregaron los campos `afip_cae` y `afip_vencimiento` directamente a la tabla `ventas`. La comunicación con AFIP es un servicio externo (Web Service); no necesitamos replicar su modelo de datos localmente, solo necesitamos almacenar el comprobante legal (CAE) que certifica que la transacción fue autorizada e informada con éxito.

## 6. Speech de Defensa (El "Elevator Pitch")
Si el tribunal te pide que resumas o justifiques tu arquitectura de software y el modelado, podés usar este speech como guía:

> *"El diseño del sistema Owens prioriza la escalabilidad y la mantenibilidad sin caer en la sobre-ingeniería. En los **diagramas de Casos de Uso**, definimos actores basados en **roles**, lo que nos permite escalar desde un dueño único hasta una plantilla completa de empleados usando exactamente el mismo sistema de permisos, sin tocar una línea de código.*
> 
> *A nivel de **Modelo de Datos**, aplicamos la Tercera Forma Normal, pero tomamos decisiones pragmáticas justificadas. Por ejemplo, en lugar de crear un entramado de tablas de permisos dinámicos, gestionamos los roles en la capa de aplicación. Implementamos **Borrado Lógico** en las tablas maestras para mantener la integridad histórica sin duplicar datos en tablas de log, y diseñamos las transacciones (como las ventas) como entidades inmutables.* 
> 
> *La recursividad de las recetas (materias primas vs productos elaborados) y el control atómico del stock (con su respectiva tabla de auditoría) son el núcleo duro de la base de datos, garantizando que el costeo y el inventario sean precisos. Todo lo que es externo, como AFIP o el bot de mensajería, se maneja como interfaces o servicios periféricos, impactando mínimamente en nuestro modelo de dominio central."*