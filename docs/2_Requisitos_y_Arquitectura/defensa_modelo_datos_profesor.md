# Guía de Defensa Técnica del Modelo de Datos (DER) frente a la Cátedra

> **Documento de Apoyo para Defensa y Examen Final**  
> **Proyecto:** Sistema de Gestión Gastronómica (Owens)  
> **Cátedra:** Proyecto de Software / Trabajo Final (FCEQyN - UNaM)  
> **Docente a Cargo:** Lic. Sergio Daniel Caballero  
> **Marco Metodológico:** Proceso Unificado Ágil (AUP) + Arquitectura Monolito Moderno (Laravel + PostgreSQL en 3FN).

---

## 1. Introducción y Fundamento Teórico

Cuando el tribunal evaluador analiza el **Diagrama Entidad-Relación (DER Físico)** del Sistema Owens, evalúa tres pilares innegociables de la ingeniería de software:
1. **Integridad Referencial Estricta:** Cada relación física (línea) debe corresponderse unívocamente con una Clave Foránea (`FK`) real en la base de datos relacional.
2. **Normalización en Tercera Forma Normal (3FN):** Ausencia de redundancias, eliminación de anomalías de actualización y desacople de entidades operativas.
3. **Alineación con el Dominio Gastronómico:** Separación estricta entre **Materia Prima** (compras, lotes, vencimientos) y **Menú Comercial** (precios de venta, comandas), resuelta mediante el patrón de Lista de Materiales (**BOM - Bill of Materials**).

A continuación se detallan las decisiones de modelado, las adiciones realizadas a partir de las observaciones de cátedra y el razonamiento exacto para defender cada una.

---

## 2. Los 6 Ejes Clave Agregados y Corregidos en el DER

```
                  ┌───────────────────────────────────────────────┐
                  │                 usuarios                      │
                  └──────┬──────────────────┬─────────────────────┘
                         │ 1                │ 1
                         │                  │
                         │ 0..*             │ 0..*
                  ┌──────▼────────┐  ┌──────▼────────┐
                  │ sesiones_caja │  │    compras    │
                  └──────┬────────┘  └──────┬────────┘
                         │ 1                │ 1
                         │                  │
                         │ 0..*             │ 1..*
                  ┌──────▼───────────┐┌─────▼──────────┐
                  │transacciones_caja││ detalle_compras│
                  └──────────────────┘└─────┬──────────┘
                                            │ 0..*
                                            │
                                     ┌──────▼────────┐
                                     │    insumos    │
                                     └──────┬────────┘
                                            │ 0..*
                                            │
                                     ┌──────▼────────┐
                                     │    recetas    │◄──── 1:N ──── productos
                                     └───────────────┘
```

---

### Eje 1: Ciclo de Vida y Arqueo en Turnos de Caja (`sesiones_caja`)

* **Atributos Clave Agregados:**
  * `monto_cierre : decimal(10,2) <<N>>` (efectivo real contado en la gaveta física al cerrar el turno).
  * `fecha_apertura : timestamp` (sello de tiempo de habilitación del turno).
  * `fecha_cierre : timestamp <<N>>` (sello de tiempo de clausura del turno).
* **Pregunta Típica del Profesor:**
  > *"¿Dónde queda asentado el dinero con el que el cajero cerró su turno? ¿Y cómo calculan sobrantes o faltantes si el local abre a las 20:00 del viernes y cierra a las 04:00 del sábado?"*
* **Defensa Técnica:**
  1. **Uso de `TIMESTAMP` en lugar de `TIME`:** En gastronomía, la mayoría de los turnos cruzan la medianoche. Si usáramos tipo `TIME`, las 04:00 sería menor a las 20:00, impidiendo calcular la duración real del turno y perdiendo la fecha calendario del arqueo. Con `TIMESTAMP` se preserva la fecha y la hora exacta.
  2. **Ecuación del Arqueo (UC-03 y UC-29):** El sistema calcula la diferencia matemática de gaveta física:
     $$\Delta_{\text{caja}} = \text{monto\_cierre} - (\text{monto\_apertura} + \sum \text{ventas\_efectivo} + \sum \text{ingresos\_manuales} - \sum \text{retiros})$$
  3. **Trazabilidad en Código:** Coincide 1:1 con la migración real en Laravel (`cash_sessions`: `opening_amount`, `closing_amount`, `opened_at`, `closed_at`).

---

### Eje 2: Simetría Contable y Balances Periódicos (`compras`)

* **Atributo Clave Agregado:**
  * `fecha_compra : timestamp` en la cabecera de la tabla `compras`.
* **Pregunta Típica del Profesor:**
  > *"Si la tabla `ventas` tiene `fecha_venta`, ¿por qué la tabla `compras` no tenía fecha de compra? ¿Cómo obtienen el flujo de caja (Cash Flow) mensual en el módulo de reportería?"*
* **Defensa Técnica:**
  1. **Simetría Temporal:** Para emitir balances contables y reportes de rentabilidad bruta (UC-26 y UC-27), el sistema debe contrastar ingresos devengados vs. egresos de mercadería en una ventana temporal idéntica.
  2. **Independencia del Framework:** No se debe depender del atributo técnico `created_at` de Eloquent/Laravel para la lógica de negocio contable, ya que una compra puede ser asentada con fecha de factura/remito retroactiva. La `fecha_compra` es un atributo de negocio explícito.

---

### Eje 3: Eliminación de Líneas "Fantasma" (Conexiones Espurias)

En versiones preliminares del diagrama existían dos líneas que conectaban tablas sin claves foráneas:
1. Línea `clientes` — `usuarios`.
2. Línea `movimientos_inventario` — `productos`.

* **Pregunta Típica del Profesor:**
  > *"Veo una línea conectando Clientes con Usuarios, pero en la tabla Clientes no veo ningún `id_usuario`, ni en Usuarios veo `id_cliente`. ¿Qué significa esa relación en una base de datos relacional física?"*
* **Defensa Técnica:**
  * **La regla relacional:** En un DER físico formal, **toda línea entre dos entidades representa obligatoriamente una Clave Foránea (`FK`)**. Si no hay FK, no existe relación física en PostgreSQL y la línea es una conexión espuria que confunde la semántica.
  * **Por qué `clientes` no se conecta con `usuarios`:** Un cliente no pertenece a un empleado particular; pertenece a la empresa. El punto de convergencia entre el cajero (`usuarios`) y el comensal (`clientes`) ocurre en el contexto transaccional de una venta (`ventas.id_usuario` y `ventas.id_cliente`). La autoría de creación o edición de un cliente se registra de forma limpia en la bitácora de auditoría (`logs_auditoria_sistema`).
  * **Por qué `movimientos_inventario` no se conecta con `productos`:** En gastronomía bajo el patrón BOM, el stock físico real reside en las **materias primas** (`insumos`). `movimientos_inventario` representa el Kardex de insumos (entradas, salidas por venta, mermas). El producto comercial es una entidad abstracta cuya composición de insumos se resuelve dinámicamente mediante la tabla `recetas`. Conectar movimientos directamente a productos duplicaría erróneamente la lógica de recetas.

---

### Eje 4: Corrección de Claves Foráneas en Compras e Inventario

* **Ajustes:**
  * En `detalle_compras`: la columna foránea se llama **`id_insumo BIGINT (FK)`** (en lugar de `id_producto`).
  * En `movimientos_inventario`: la columna foránea se llama **`id_insumo BIGINT (FK)`** (en lugar del remanente erróneo `id_consumo`).
* **Pregunta Típica del Profesor:**
  > *"¿Por qué la orden de compra adquiere insumos y no productos terminados?"*
* **Defensa Técnica:**
  * Un restaurante adquiere materia prima (harina, queso, carne, verduras) a proveedores mayoristas mediante órdenes de compra (`detalle_compras.id_insumo`).
  * Luego, mediante el caso de uso `UC-15 (Asignar Receta)` y la explosión de materiales al vender (`UC-02`), esa materia prima se descuenta automáticamente. Comprar "productos de venta" rompería el desacople del patrón BOM.

---

### Eje 5: Normalización 3FN en Medios de Pago (`pago_ventas` y `metodos_pago`)

* **Ajustes:**
  * `metodos_pago`: Posee `id BIGINT (PK)`, `nombre VARCHAR(255)`, `activo BOOLEAN`.
  * `pago_ventas`: Contiene `id_metodo_pago BIGINT (FK)` apuntando a la tabla maestra, `id_venta BIGINT (FK)` y `monto DECIMAL(10,2)`.
* **Pregunta Típica del Profesor:**
  > *"¿Cómo soporta el sistema un cobro mixto donde un cliente abona una parte en efectivo y el resto por transferencia o código QR?"*
* **Defensa Técnica:**
  * La cabecera `ventas` no guarda un string estático `metodo_pago`.
  * Al normalizar en 3FN mediante la tabla intermedia `pago_ventas`, se soporta una cardinalidad `ventas 1 -- 1..* pago_ventas`. Una comanda de $25.000 puede tener dos registros de pago: $10.000 asociados a `id_metodo_pago = 1` (Efectivo) y $15.000 asociados a `id_metodo_pago = 2` (Mercado Pago QR), garantizando consistencia contable exacta.

---

### Eje 6: Auditoría Global Inmutable Polimórfica (`logs_auditoria_sistema`)

* **Estructura:**
  * `id BIGINT (PK)`
  * `id_usuario BIGINT (FK, N)` (usuario responsable del evento).
  * `tabla_afectada VARCHAR(255)` (nombre de la tabla: 'clientes', 'insumos', 'recetas', etc.).
  * `registro_id BIGINT` (ID de la fila impactada).
  * `valores_anteriores JSON` y `valores_nuevos JSON` (estado del registro antes y después).
  * `fecha_hora TIMESTAMP` y `ip_origen VARCHAR(45)`.
* **Pregunta Típica del Profesor:**
  > *"¿Cómo auditan qué cajero o administrador modificó un precio, borró un cliente o alteró una receta sin llenar la base de datos de tablas auxiliares de auditoría?"*
* **Defensa Técnica:**
  1. **Patrón Audit Trail Polimórfico:** En lugar de sobre-ingeniar creando 15 tablas redundantes (`auditoria_clientes`, `auditoria_productos`, etc.), se utiliza una tabla polimórfica única desacoplada que almacena snapshots en formato JSON (`valores_anteriores` y `valores_nuevos`).
  2. **Combinación con Borrado Lógico (*Soft Deletes*):** Las entidades maestras poseen `fecha_eliminacion TIMESTAMP`. Si un registro se "borra", no se destruye físicamente de la base de datos (preservando la integridad de compras y ventas pasadas según Codd, 1970), y simultáneamente se graba la traza inmutable en `logs_auditoria_sistema`.

---

## 3. Matriz Rápida de Respuestas para la Mesa de Examen

| Si el Profesor Caballero pregunta... | Tu respuesta técnica concisa |
| :--- | :--- |
| **"¿Por qué no hay una tabla `facturas` separada de `ventas`?"** | *"Porque la facturación en este dominio es la confirmación fiscal de la comanda. Agregamos `afip_cae` y `afip_vencimiento` directamente a `ventas` (1:1), evitando joins innecesarios hacia una tabla satélite que tendría exactamente el mismo ciclo de vida."* |
| **"¿Por qué `recetas` es una tabla asociativa con atributo?"** | *"Porque resuelve la relación Muchos a Muchos (M:N) del patrón BOM entre `productos` e `insumos`. Su atributo `cantidad DECIMAL(10,4)` permite modelar las proporciones exactas de cada ingrediente (ej. 0.150 kg de queso por hamburguesa) para la explosión de stock."* |
| **"¿Por qué separaron `alicuotas_iva`?"** | *"Para cumplir estrictamente con la 3FN y las normativas fiscales argentinas de AFIP. Centraliza los porcentajes (21%, 10.5%, 0%) vinculándolos tanto a productos de venta como a insumos de compra, evitando anomalías si la legislación modifica una alícuota."* |
| **"¿Dónde está el carrito de compras en la base de datos?"** | *"El carrito de compras temporal se mantiene en la memoria volátil de la sesión del cliente (frontend/estado de React). Persistir pedidos incompletos en PostgreSQL saturaría el motor de base de datos con operaciones de I/O innecesarias; solo impacta en tablas relacionales bajo transacción atómica (ACID) cuando la orden es confirmada."* |

---

*Este documento refleja fielmente el esquema físico implementado en las migraciones de PostgreSQL y el archivo [`docs/2_Requisitos_y_Arquitectura/2.4_modelo_de_datos.md`](file:///Users/diego/Documents/builds/owens-system/docs/2_Requisitos_y_Arquitectura/2.4_modelo_de_datos.md).*
