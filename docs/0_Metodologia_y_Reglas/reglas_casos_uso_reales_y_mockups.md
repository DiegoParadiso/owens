# Reglas y Estándares para Casos de Uso Reales y Diseño de Interfaces (Mockups)

Este documento establece la normativa metodológica, la estructura documental y los patrones de diseño visual exigidos por la cátedra para el desarrollo del **Diseño de Interfaz Humano-Computadora (IHC)** y los **Casos de Uso Reales (Real Use Cases)**, adaptando los lineamientos de Craig Larman (Proceso Unificado) a las pautas de evaluación oficiales.

---

## 1. Fundamentación y Comparativa: Clásica vs. Cátedra

### ¿Por qué se omite el DCD (Diagrama de Clases de Diseño)?
Craig Larman (*Applying UML and Patterns*) y Scott Ambler (*Agile Modeling*) advierten explícitamente contra la sobrecarga burocrática de diagramas (*"Don't overload with diagrams"*). En un desarrollo con arquitectura moderna (como Laravel + React/Inertia):
* El DCD estático suele convertirse en un artefacto redundante y costoso de mantener frente al código vivo.
* **Decisión de la Cátedra:** Se prioriza el **Diseño de Interfaz (Entrada/Salida)** y la **especificación de Casos de Uso Reales**, ya que validan directamente la ergonomía, la usabilidad y la interacción física del usuario con el software.

### La Estrategia Anti-Sobrecarga: Pantallas Maestras Unificadas
El alumno no debe crear una pantalla aislada por cada caso de uso. La cátedra exige agrupar operaciones relacionadas en **Pantallas Maestras de Gestión**:
* Una única pantalla de **"Gestión de Cartelera"** resuelve 3 Casos de Uso a la vez: Alta (CU-01), Modificación (CU-03) y Baja (CU-05), alternando entre la **Tabla Principal** y un **Área de Trabajo Desplegable**.
* Para Owens, una pantalla de **"Gestión de Menú y Recetas"** resuelve el catálogo, la edición de precios y la asignación de materias primas en una sola interfaz integral.

---

## 2. Jerarquía y Estructura Documental

El capítulo de Diseño de Interfaces se organiza obligatoriamente en tres grandes bloques correlativos:

```text
4.1 Diseño de Salida (Output Design)
    4.1.1 CU-XX: [Nombre del Reporte / Salida]
          a) Diseño de Salida por Pantalla (Descripción + [Link al CU Real])
          b) Diseño de Salida Impresa (PDF / Ticket + Figura N° xxxx)

4.2 Diseño de Entrada (Input Design / Mockups de Gestión)
    4.2.1 CU-01: Alta de [Entidad]  [Link al CU Real]
    4.2.2 CU-03: Modificación de [Entidad]  [Link al CU Real]
    4.2.3 CU-05: Baja de [Entidad]  [Link al CU Real]
          - Descripción del flujo de la pantalla (Secciones)
          - Dinámica del flujo operacional
          - Explicación de componentes visuales [1], [2], [3]...
          - Pantallas de retroalimentación [Pantalla A], [Pantalla B]...
          - Figura N° xxxx (Mockup completo de la pantalla)
          - Figura N° xxxx (Modales y Alertas)

4.3 Casos de Uso Reales (Real Use Cases)
    4.3.1 CU-01: Alta de [Entidad]  [Link al Diseño]
    4.3.2 CU-02: [Nombre]  [Link al Diseño]
          - Formato tabular formal
          - Secuencia Normal referenciando [1], [2], [Pantalla A]...
          - Excepciones referenciando [N] y [Pantalla B..F]
          - Rendimiento, Frecuencia, Estabilidad y Comentarios
```

---

## 3. Anatomía del Diseño de Entrada (Sección 4.2)

Cada pantalla maestra de gestión debe descomponerse obligatoriamente en cuatro secciones descriptivas:

### 3.1. División Arquitectónica de la Pantalla
1. **Encabezado de Operación (Sección Superior):** Muestra el breadcrumb/ruta (`Módulo de Administración > Productos`), barra de búsqueda rápida y selectores de filtros dinámicos.
2. **Sección Principal ("Catálogo Histórico" / Vista de Datos):** Tabla o matriz de datos que expone los registros actuales. Cada fila contiene botones de acción contextual (Lápiz para editar, Papelera para baja). En la base se ubica el botón principal de Alta.
3. **Sección "Área de Trabajo" (Vista Desplegable Inferior o Panel Lateral):** Oculta por defecto. Se revela al presionar "Alta" o al hacer clic en el "Lápiz" de una fila. Contiene los formularios de entrada, selects, zonas de carga de archivos y botones de confirmación/cancelación.
4. **Dinámica del Flujo Operacional:** Párrafo narrativo que explica cómo se abre la pantalla, cómo busca el operador, cómo se despliega el formulario, qué ocurre al presionar Cancelar y cómo el servidor actualiza la tabla tras el éxito transaccional.

### 3.2. Catálogo Estandarizado de Componentes Visuales `[1]..[N]`
Los componentes visuales del mockup se etiquetan con números entre corchetes, los cuales son invocados textualmente en el Caso de Uso Real:

| Etiqueta | Componente | Descripción |
| :---: | :--- | :--- |
| `[1]` | **Control de Navegación** | Opción en la barra lateral (Sidebar) que carga la vista principal. |
| `[2]` | **Barra de Búsqueda** | Input superior de filtrado dinámico en tiempo real sobre la tabla. |
| `[3]` | **Formulario de Metadatos** | Contenedor de inputs específicos que se despliega al solicitar alta o edición. |
| `[4]` | **Selector / Combobox** | Menú desplegable para categorías, estados o tipos. |
| `[5]` / `[6]` | **Carga de Archivos / Imágenes** | Zona de drag-and-drop o selector de archivos/comprobantes. |
| `[7]` | **Botón de Acción Principal** | Botón para iniciar el alta (ej. `+ Alta de Producto`), revelando el formulario. |
| `[8]` | **Botón de Confirmación** | Control transaccional (`Guardar` / `Confirmar`). Muta su texto según sea Alta o Edición. |
| `[9]` | **Tabla Principal de Datos** | Matriz estructurada con filas y columnas donde se listan los registros. |
| `[10]` | **Botón Cancelar** | Oculta el área de trabajo, limpia los campos y retorna a la tabla. |
| `[11]` | **Ícono de Edición (Lápiz)** | Control por fila que precarga los datos del registro en el formulario `[3]`. |
| `[12]` | **Ícono de Eliminación (Papelera)** | Control por fila que dispara el flujo modal de confirmación de baja. |
| `[13]` | **Filtros Adicionales** | Filtros secundarios en encabezado (por estado, rango de fecha, etc.). |

### 3.3. Catálogo Estandarizado de Pantallas de Retroalimentación `[Pantalla A]..[Pantalla F]`
Toda acción del sistema que requiera feedback visual al usuario se cataloga con letras entre corchetes:

| Letra | Modal / Alerta | Comportamiento en la Interfaz |
| :---: | :--- | :--- |
| `[Pantalla A]` | **Alerta de Éxito Transaccional** | Toast/Banner verde en esquina superior notificando persistencia exitosa. |
| `[Pantalla B]` | **Alerta de Validación de Campos** | Bordes de inputs vacíos en rojo y mensaje de campos requeridos faltantes. |
| `[Pantalla C]` | **Alerta de Incompatibilidad / Conflicto** | Notificación de error de formato, archivo inválido o colisión horaria/regla de negocio. |
| `[Pantalla D]` | **Alerta de Registro Duplicado** | Alerta indicando que el registro (código/nombre) ya existe en la base de datos. |
| `[Pantalla E]` | **Modal de Confirmación de Operación** | Diálogo modal emergente con botones `ACEPTAR` y `CANCELAR` antes de persistir. |
| `[Pantalla F]` | **Modal de Confirmación de Eliminación** | Diálogo emergente de advertencia para confirmar la baja lógica de un registro. |

---

## 4. Anatomía del Caso de Uso Real (Sección 4.3)

A diferencia del Caso de Uso Esencial, el **Caso de Uso Real** describe la interacción física, ergonómica y tecnológica exacta con los widgets de la interfaz.

### 4.1. Reglas Estrictas de Redacción:
1. **Invocación Obligatoria de Tags:** Toda acción del usuario que interactúe con un control debe incluir su tag numérico (ej: `...selecciona la opción Menú [1]...`, `...presiona el botón Guardar [8]...`).
2. **Invocación Obligatoria de Modales/Alertas:** Todo mensaje o cuadro del sistema debe referenciar su tag de pantalla (ej: `...despliega el Modal de Confirmación [Pantalla E]...`, `...emite la Alerta de Éxito [Pantalla A]...`).
3. **Flujo de Confirmación en Dos Tiempos:** Para operaciones transaccionales sensibles (altas, bajas, cobros), el sistema valida, interrumpe el flujo y muestra el Modal `[Pantalla E]`. El paso siguiente describe al operador presionando `ACEPTAR` en dicho modal.
4. **Resolución de Cancelación:** El botón `CANCELAR` del modal `[Pantalla E]` debe estar explícitamente documentado como excepción en la tabla inferior, devolviendo al usuario al formulario intacto.

### 4.2. Plantilla Formal de Caso de Uso Real

```markdown
### 4.3.X. CU-[NN] [Nombre del Caso de Uso]
[Ir al Diseño](#seccion-4-2)

| Metadato | Valor |
| :--- | :--- |
| **Caso de Uso** | CU-[NN]: [Nombre del Caso de Uso] |
| **Objetivos asociados** | OBJ-01, OBJ-E02 |
| **Requisitos asociados** | RF-01, RNF-02 |
| **Descripción** | Descripción sintética del flujo y propósito operativo. |
| **Precondición** | - El usuario inició sesión con privilegios de [Rol].<br>- [Estado previo consolidado]. |

#### Secuencia Normal

| Paso | Acción |
| :---: | :--- |
| **1** | El caso de uso inicia cuando el [Actor] selecciona la opción [Módulo] [1] en la barra de navegación lateral. |
| **2** | El operador presiona el botón de acción principal "[Acción]" [7] ubicado debajo de la tabla. |
| **3** | El sistema despliega el Formulario [3] en la sección inferior de la pantalla, posicionando el cursor en el campo [Primer Campo]. |
| **4** | El operador completa los campos obligatorios en el formulario [3] con los datos correspondientes. |
| **5** | El operador define el estado a través del selector [4]. |
| **6** | El operador presiona el botón de confirmación "[Guardar]" [8]. |
| **7** | El sistema valida que los campos del formulario [3] contengan valores válidos. Al resultar exitoso, despliega el Modal de Confirmación [Pantalla E]. |
| **8** | El operador presiona el botón "ACEPTAR" dentro del Modal de Confirmación [Pantalla E]. |
| **9** | El sistema registra de manera definitiva la información, emite la Alerta de Éxito Transaccional [Pantalla A], oculta el área de trabajo y actualiza la Tabla Principal [9] incorporando la nueva fila. |

#### Postcondición
El registro queda asentado en el sistema y visible en la tabla principal.

#### Excepciones

| Paso | Acción |
| :---: | :--- |
| **4-6** | Si el usuario presiona el botón "Cancelar" [10] del formulario, el sistema detiene el flujo, descarta los datos y oculta el formulario volviendo a la tabla principal. |
| **7** | Si falta completar algún campo obligatorio del formulario [3], el sistema resalta los contornos en rojo, detiene el guardado y emite la Alerta de Validación de Campos [Pantalla B]. |
| **7** | Si el sistema detecta que el registro ya existe en el sistema, aborta la operación y emite la Alerta de Registro Duplicado [Pantalla D]. |
| **8** | Si en el Modal de Confirmación [Pantalla E] el operador presiona "CANCELAR", el sistema cierra el diálogo emergente y mantiene al operador en el formulario [3] con todos los datos intactos. |

#### Métricas y Estabilidad

| Paso | Cota de tiempo |
| :---: | :--- |
| **3** | Despliegue del formulario < 1 segundo. |
| **9** | Persistencia y actualización de grilla < 2 segundos. |

*   **Frecuencia:** Diaria.
*   **Estabilidad:** Alta.
*   **Comentarios:** [Observación sobre impacto operativo o validaciones clave].
```

---

## 5. Estrategia de Pantallas Maestras para Owens

Para optimizar el esfuerzo de documentación y evitar sobrecarga burocrática, el Sistema Owens se estructura en **4 Pantallas Maestras**:

1. **Pantalla Maestra 1: Gestión de Menú y Catálogo (Productos / Recetas)**
   - *Resuelve:* UC-15 (Asignar Receta) y el CRUD de Productos.
   - *Estructura:* Tabla principal de productos con precios y receta asignada; formulario inferior desplegable con BOM (lista de insumos y cantidades).
2. **Pantalla Maestra 2: Terminal de Punto de Venta (TPV / POS)**
   - *Resuelve:* UC-02 (Registrar Venta) y UC-49 (Pedido Digital).
   - *Estructura:* Grilla visual de productos por categorías a la izquierda; comanda/ticket activo a la derecha; modal emergente de cobro con cálculo de vuelto y CAE.
3. **Pantalla Maestra 3: Control y Arqueo de Caja**
   - *Resuelve:* UC-01 (Abrir Caja), UC-03 (Cerrar Caja con Cierre Ciego) y UC-04 (Movimientos Manuales).
   - *Estructura:* Indicador de estado de turno; formulario de conteo físico; modal de arqueo comparativo.
4. **Pantalla Maestra 4 (Diseño de Salida): Tablero KDS e Informes Gerenciales**
   - *Resuelve:* UC-10 (KDS Cocina) y UC-29 / Reportes Financieros en PDF.
   - *Estructura:* Timeline interactivo de comandas en preparación y plantilla A4 de reporte contable exportable.
