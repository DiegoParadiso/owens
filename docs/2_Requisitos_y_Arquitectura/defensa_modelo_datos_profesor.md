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
3. **Alineación con el Dominio Gastronómico Industrial:** Implementación de la arquitectura de manufactura por capas: **Capa de Configuración (Fórmulas Teóricas y Versionado)** disociada tajantemente de la **Capa de Existencia Física (Lotes y Trazabilidad Bromatológica)**, bajo la premisa ontológica de que *"todo es insumo"*.

---

## 2. Los Ejes Clave del Modelo de Datos Owens

```
========================================================================================
1. CAPA DE CONFIGURACIÓN (Plantillas Abiertas y Versionadas - Fórmulas Teóricas)
========================================================================================
┌──────────────┐ 1      0..* ┌──────────────┐ 1      1..* ┌──────────────────┐
│   insumos    ├────────────►│   recetas    ├────────────►│ receta_versiones │
│ (Catálogo    │             │ (Fórmula     │             │ (Vigencia temporal│
│  Unificado)  │◄────────────┤  asociada)   │             │  fecha_desde/has)│
└──────┬───────┘ 1 (producido)└──────────────┘             └─────────┬────────┘
       │                                                             │ 1
       │ 1 (ingrediente)                                             │
       │                                                             │ 1..*
       │                     ┌──────────────────┐                    │
       └────────────────────►│  receta_insumos  │◄───────────────────┘
                             │ (cant_min/max)   │
                             └──────────────────┘

========================================================================================
2. CAPA DE EXISTENCIA FÍSICA Y TRAZABILIDAD BROMATOLÓGICA (Instanciación de Lotes)
========================================================================================
                             ┌──────────────────────┐
                             │  insumo_existencias  │◄───── (Respaldado por receta_versión
                             │ (Lotes con fecha de  │        o remito de compra)
                             │  origen y vencim.)   │
                             └──────────┬───────────┘
                                        │ 1 (padre)  ▲ 0..* (hijo)
                                        │            │
                             ┌──────────▼────────────┴┐
                             │     insumo_insumos     │
                             │ (Árbol genealógico de  │
                             │  manufactura por lote) │
                             └────────────────────────┘
```

---

### Eje 1: Unificación Ontológica ("Todo es Insumo") y la Capa de Configuración

* **Fundamento:** En gastronomía real, un restaurante no solo compra lechuga y vende hamburguesas; realiza **producción intermedia (*mise en place*)**. El cocinero elabora un lote de 40 *Medallones de carne caseros* a las 11:00 AM mezclando carne picada, huevo, cebolla y ajo; a las 14:00 PM, ese medallón se utiliza para ensamblar una *Hamburguesa Completa*.
* **Defensa Técnica ante el Profesor:**
  1. Si tuviéramos una tabla `productos` y otra `insumos`, el medallón casero quedaría atrapado en una contradicción: no se compra a proveedores (no es materia prima pura) ni se vende solo en el menú (no es producto comercial).
  2. En Owens, **todo ítem físico es un `insumo`** (`insumos`). Aquellos comercializables al comensal llevan la bandera `es_comercializable = true`, `precio_venta` y `alicuota_iva`.
  3. La tabla `recetas` define la fórmula teórica del insumo elaborado (`id_insumo_producido`).
  4. La tabla `receta_versiones` parametriza la evolución de la fórmula con sellos temporales (`fecha_desde`, `fecha_hasta`), resolviendo cambios estacionales de ingredientes sin romper la historia contable.
  5. La tabla `receta_insumos` modela la **plantilla abierta**: permite rangos operativos (`cantidad_minima`, `cantidad_maxima`) para soportar ingredientes opcionales (donde la cantidad mínima es 0, ej. pepinos o aderezos).

---

### Eje 2: Capa de Existencia Física y Trazabilidad Bromatológica (`insumo_existencias` e `insumo_insumos`)

* **Fundamento:** Un contador numérico abstracto de stock (`stock: integer`) no sirve en gastronomía porque los alimentos son perecederos y están sujetos a normativas de bromatología y sanidad alimentaria.
* **Defensa Técnica ante el Profesor:**
  1. La tabla `insumo_existencias` modela los lotes físicos reales acopiados en heladera o estantería. Posee `fecha_origen` (cuándo se recibió o elaboró), `fecha_vencimiento` (calculada dinámicamente según `duracion_cerrado` o `duracion_abierto`) y `cantidad` remanente.
  2. La tabla asociativa recursiva `insumo_insumos` preserva el árbol genealógico completo de manufactura:
     > *"La existencia #4580 de Hamburguesa Completa del 04/11/2026 fue armada a partir de la existencia #1024 de Medallón Casero (elaborado el 01/11/2026), el cual a su vez provino de la existencia #205 de Carne Molida del lote proveedor #L-998".*
  3. Esta estructura permite auditoría bromatológica ascendente y descendente inmediata ante cualquier reporte de inocuidad alimentaria o auditoría sanitaria.

---

### Eje 3: Ciclo de Vida y Arqueo en Turnos de Caja (`sesiones_caja` y `transacciones_caja`)

* **Atributos Clave:**
  * `monto_cierre : decimal(10,2) <<N>>` (efectivo real contado a ciegas en gaveta física).
  * `fecha_apertura : timestamp` y `fecha_cierre : timestamp <<N>>` (sellos de tiempo que cruzan la medianoche).
* **Defensa Técnica:**
  * **Uso de `TIMESTAMP`:** En gastronomía los turnos cruzan la medianoche (ej. de 20:00 a 04:00). El uso de `TIMESTAMP` evita la pérdida del día calendario del arqueo.
  * **Arqueo Ciego (UC-03 y UC-29):** El cajero declara el efectivo físico sin conocer el saldo teórico del sistema. El sistema computa la diferencia:
    $$\Delta_{\text{caja}} = \text{monto\_cierre} - (\text{monto\_apertura} + \sum \text{ventas\_efectivo} + \sum \text{ingresos\_manuales} - \sum \text{retiros})$$

---

### Eje 4: Simetría Contable en Compras (`compras`) y Normalización 3FN en Pagos (`pagos_ventas`)

* **Compras:** La cabecera `compras` posee `fecha_compra : timestamp`, desacoplándose de los metadatos de framework (`created_at`) y permitiendo contrastar ventas vs. compras en una ventana idéntica para reportes de rentabilidad bruta (UC-30 y UC-31).
* **Pagos Divididos (Split Payments):** La relación `ventas 1 -- 1..* pagos_ventas` vinculada a la tabla maestra `metodos_pago` permite cobrar una comanda con múltiples medios de pago (ej. $10.000 en efectivo y $15.000 con QR/transferencia), garantizando cumplimiento estricto de la 3FN.

---

### Eje 5: Auditoría Global Inmutable Polimórfica (`logs_auditoria_sistema`) y Borrado Lógico

* **Estructura:** Centraliza en una única tabla polimórfica: `id_usuario`, `tabla_afectada`, `registro_id`, `valores_anteriores (JSON)`, `valores_nuevos (JSON)`, `fecha_hora` e `ip_origen`.
* **Defensa Técnica:**
  * Evita la proliferación de tablas redundantes de auditoría.
  * Combinado con `fecha_eliminacion` (*Soft Deletes*), garantiza que ningún comprobante fiscal, venta o insumo sea destruido físicamente de la base de datos (Codd, 1970).

---

## 3. Matriz Rápida de Respuestas para la Mesa de Examen

| Si el Profesor Caballero pregunta... | Tu respuesta técnica concisa |
| :--- | :--- |
| **"¿Por qué unificaron productos e insumos en una sola entidad?"** | *"Porque en manufactura culinaria existe producción intermedia (semielaborados como medallones caseros o aderezos). Unificar en `insumos` permite que cualquier ítem pueda ser tanto materia prima de una receta como producto final de otra mediante el patrón Composite."* |
| **"¿Cómo modelan que una receta cambie con el tiempo?"** | *"Mediante la entidad `receta_versiones`. Cada versión tiene `fecha_desde` y `fecha_hasta`. Las ventas y producciones pasadas quedan vinculadas históricamente a la versión con la que fueron elaboradas, impidiendo que la edición de una fórmula distorsione el histórico."* |
| **"¿Cómo soportan ingredientes opcionales o proporciones variables?"** | *"En `receta_insumos`, definimos `cantidad_minima` y `cantidad_maxima`. Si un ingrediente es opcional (como pepinos o cebolla), su cantidad mínima es 0."* |
| **"¿Dónde está el stock físico real si no hay un campo `stock` en `insumos`?"** | *"El stock reside en `insumo_existencias`, donde cada lote tiene su fecha de elaboración, fecha de vencimiento y remanente. Se totaliza mediante funciones agregadas (`SUM(cantidad)`) filtrando lotes vigentes bajo política FEFO."* |
| **"¿Cómo garantizan la trazabilidad bromatológica si hay un lote de carne en mal estado?"** | *"A través de la tabla recursiva `insumo_insumos`. Permite una consulta de grafo que recorre desde el lote de carne molida del proveedor hasta cada lote de medallón casero y cada hamburguesa vendida a comensales en una fecha determinada."* |
