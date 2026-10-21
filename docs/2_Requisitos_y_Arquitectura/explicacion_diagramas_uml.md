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

### 5.5. Explicación Estratégica de las Relaciones (DER)
Si el tribunal te pide explicar cómo están conectadas las entidades, enfocate en estos 3 ejes estructurales que diseñaste en el modelo:

1.  **Centralidad de la Autoría y Seguridad (Tabla `usuarios`):**
    *   La tabla `usuarios` es el eje de control. Si te fijás, casi todas las tablas transaccionales u operativas (`ventas`, `compras`, `gastos`, `sesiones_caja`, `auditoria_stock`) tienen una relación de pertenencia (1:N) con ella.
    *   **¿Por qué?** Porque ninguna operación que mueva dinero o modifique inventario puede ser anónima. Cada ingreso, retiro, venta o gasto debe quedar "firmado" por el ID del usuario responsable. Es un requisito innegociable de auditoría.

2.  **El Núcleo Operativo (Caja y Ventas):**
    *   Una **Venta** está correctamente normalizada en Cabecera (`ventas`) y Detalle (`detalle_ventas`).
    *   Los pagos se desacoplaron en `pago_ventas` para permitir **pagos múltiples** (ej. cobrar una parte en efectivo y otra con QR), apoyándose en la tabla maestra `metodos_pago`.
    *   El efectivo físico se encapsula en las `sesiones_caja` (turnos). Una sesión abierta agrupa `transacciones_caja` (retiros para pagar proveedores o ingresos manuales) asegurando el control del flujo de caja.

3.  **La Composición de Menú e Inventario (Patrón Estructural BOM):**
    *   A diferencia de modelos simplistas, separamos la lógica de negocio en dos tablas fundamentales: `productos` (menú de venta final, con precio) e `insumos` (materia prima acopiada, con lote, vencimiento, costo y stock).
    *   La tabla `recetas` actúa como puente de una relación de Muchos a Muchos (M:N) resolviendo la lista de materiales (BOM - Bill of Materials).
    *   **¿Qué significa?** La tabla `recetas` vincula un `id_producto` (el producto terminado) con múltiples `id_insumo` (sus ingredientes). Esta estructura estricta evita catálogos "híbridos" confusos y permite la famosa *explosión de materiales* al vender, deduciendo el stock de la materia prima real que compone al menú sin mezclar la naturaleza de las entidades.

### 5.6. ¿Cómo leer las líneas del diagrama (Notación "Pata de Gallo")?
El tribunal puede señalar una línea específica del diagrama ER y preguntarte *"¿Qué significa esta relación?"*. El diagrama utiliza la notación **Crow's Foot (Pata de Gallo)**. Así es como debés leer los símbolos en los extremos de cada línea:

*   **Dos rayitas verticales (`||`):** Significa **"Uno y solo uno"** (Obligatorio).
    *   *Ejemplo (`ventas` a `usuarios`):* Del lado de Usuarios hay `||`. Se lee: *"Toda venta obligatoriamente tiene que haber sido registrada por un, y solo un, usuario"*.
*   **Pata de gallo con una rayita (`|<`):** Significa **"Uno a Muchos"** (Obligatorio).
    *   *Ejemplo (`ventas` a `detalle_ventas`):* Del lado del Detalle hay `|<`. Se lee: *"Una venta tiene que tener al menos un detalle de producto, o puede tener muchos"*.
*   **Pata de gallo con un círculo (`O<`):** Significa **"Cero a Muchos"** (Opcional).
    *   *Ejemplo (`usuarios` a `ventas`):* Del lado de Ventas hay `O<`. Se lee: *"Un usuario en el sistema puede no haber registrado ninguna venta (cero), o puede haber registrado muchísimas (muchas)"*.
*   **Círculo con una rayita (`O|`):** Significa **"Cero o Uno"** (Opcional).

**Regla de oro para la lectura verbal:** Siempre leé la relación en ambas direcciones. Por ejemplo, la relación entre **Categorías de Gastos** y **Gastos** se lee así:
> *"Una categoría puede agrupar a **cero o muchos** gastos (`O<`), pero un gasto pertenece a **una y solo una** categoría (`||`)."*

### 5.7. Registro Temporal y Arqueo en Turnos de Caja (`sesiones_caja`) y Compras (`compras`)
*   **Pregunta del tribunal:** *"¿Dónde queda registrado el dinero con el que el cajero cerró el turno y en qué momento se produjo la apertura y el cierre? ¿Y cómo calculan los balances temporales de compras?"*
*   **Defensa:**
    1.  **Arqueo y Cierre de Turno (UC-03 / UC-29):** La entidad `sesiones_caja` no solo almacena el `monto_apertura` y `estado`, sino que incorpora `monto_cierre`, `fecha_apertura` y `fecha_cierre` (coincidiendo exactamente con la implementación en código en `cash_sessions`: `opening_amount`, `closing_amount`, `opened_at`, `closed_at`). Esto permite que al ejecutar el arqueo de caja (UC-29), el sistema calcule la diferencia matemática entre el dinero esperado (apertura + ventas en efectivo + ingresos manuales - egresos) y el efectivo real declarado por el cajero al cerrar el turno.
    2.  **Simetría Contable y Balances (UC-30 / UC-31):** Al igual que `ventas` posee su `fecha_venta`, la tabla `compras` cuenta con `fecha_compra TIMESTAMP`. Sin este atributo temporal en la cabecera, sería imposible contrastar los ingresos devengados contra los egresos por compras de insumos dentro de un rango de fechas en los reportes de balance y rentabilidad del negocio.

### 5.8. Depuración de "Líneas Fantasma" o Conexiones Espurias en el Diagrama
En un modelo físico de base de datos relacional (DER), **toda línea representa una clave foránea (Foreign Key) explícita**. Cualquier conector que no corresponda a una columna FK es una "conexión espuria" que confunde la semántica del sistema:

*   **Línea `clientes` — `usuarios` (Eliminada):** 
    *   *Por qué no debe estar:* Ni `clientes` tiene `id_usuario`, ni `usuarios` tiene `id_cliente`. Vincularlos con una línea implicaría erróneamente una relación de dependencia existencial o herencia. La interacción entre un usuario (ej. cajero) y un cliente ocurre exclusivamente **en el contexto de una transacción** (`ventas`), donde coinciden `id_usuario` e `id_cliente`. La autoría de creación de un cliente se audita de forma no invasiva a través de `logs_auditoria_sistema`.
*   **Línea `movimientos_inventario` — `productos` (Eliminada):**
    *   *Por qué no debe estar:* En gastronomía bajo el patrón BOM, el inventario real y los movimientos de stock (Kardex) se gestionan **a nivel de materias primas e insumos** (`insumos`). La tabla `movimientos_inventario` solo posee la FK `id_insumo`. La deducción de stock por la venta de un producto terminado se realiza mediante la **explosión de materiales** definida en la tabla intermedia `recetas`. Conectar directamente `movimientos_inventario` con `productos` sin una clave foránea violaría la normalización y duplicaría erróneamente la lógica de recetas.

## 6. Speech de Defensa (El "Elevator Pitch")
Si el tribunal te pide que resumas o justifiques tu arquitectura de software y el modelado, podés usar este speech como guía:

> *"El diseño del sistema Owens prioriza la escalabilidad y la mantenibilidad sin caer en la sobre-ingeniería. En los **diagramas de Casos de Uso**, definimos actores basados en **roles**, lo que nos permite escalar desde un dueño único hasta una plantilla completa de empleados usando exactamente el mismo sistema de permisos, sin tocar una línea de código.*
> 
> *A nivel de **Modelo de Datos**, aplicamos la Tercera Forma Normal, pero tomamos decisiones pragmáticas justificadas. Por ejemplo, gestionamos los roles en la capa de aplicación en lugar de crear un entramado de tablas de permisos dinámicos. Para la seguridad y trazabilidad, combinamos **Borrado Lógico** con una tabla centralizada de **Auditoría (Audit Trail) Polimórfica**, capaz de registrar de forma inmutable quién, cuándo y qué modificó (valores viejos y nuevos) en cualquier tabla del dominio.*
> 
> *La composición estricta de las recetas (separando físicamente insumos de productos) y el control atómico del stock mediante un Kardex propio (`movimientos_inventario`) son nuestro núcleo duro, garantizando costeo e inventario precisos. Todo lo externo, como AFIP o el bot de mensajería, se maneja como interfaces o servicios periféricos, impactando mínimamente en el core."* 