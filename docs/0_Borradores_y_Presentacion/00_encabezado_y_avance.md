<div align="right">Apóstoles, Misiones, 17 de noviembre de 2026</div>

**Cátedra Trabajo Final (ASC) / Proyecto de Software (LSI)**

### <div align="center"><u>Estado de Avance de Trabajo Final / Proyecto de Software</u></div>

* **Materia:** Proyecto de Software (LSI) / Trabajo Final (ASC)
* **Apellido y nombre del alumno/a:** Paradiso, Diego
* **Nombre del Proyecto:** Owens – Sistema de Gestión Gastronómica
* **Fecha de Inicio del Proyecto:** 31/08/2026
* **Estado de Avance:** 68 % (En Fase de Construcción)

---

## Índice del Informe de Estado de Avance

1. **[1- Estado de avance en el desarrollo del producto](#1--estado-de-avance-en-el-desarrollo-del-producto)**
   * [1.a. Síntesis General: Bases del Producto Construidas vs. Documentación y Cierre Pendiente](#1a-síntesis-general-bases-del-producto-construidas-vs-documentación-y-cierre-pendiente)
   * [1.b. Estado de Avance Desglosado por Módulos del Producto](#1b-estado-de-avance-desglosado-por-módulos-del-producto)
   * [1.c. Estado de Avance de la Documentación de Ingeniería de Software](#1c-estado-de-avance-de-la-documentación-de-ingeniería-de-software)
   * [1.d. Contraste con el Calendario del Proyecto (Metodología UP): ¿Por qué se continúa en Construcción en lugar de iniciar Transición?](#1d-contraste-con-el-calendario-del-proyecto-metodología-up-por-qué-se-continúa-en-construcción-en-lugar-de-iniciar-transición)
2. **[2- Problemas detectados que han podido retrasar el desarrollo del proyecto](#2--problemas-detectados-que-han-podido-retrasar-el-desarrollo-del-proyecto)**
   * [2.a. Reingeniería Arquitectónica del Motor de Inventario, Recetas Versionadas y Trazabilidad de Lotes](#2a-reingeniería-arquitectónica-del-motor-de-inventario-recetas-versionadas-y-trazabilidad-de-lotes)
   * [2.b. Complejidad Técnica en Servicios Externos (AFIP SOAP / Certificados X.509) y Procesos en Segundo Plano](#2b-complejidad-técnica-en-servicios-externos-afip-soap--certificados-x509-y-procesos-en-segundo-plano)
   * [2.c. Desfase entre Evolución del Código, Documentación Formal UP y Pruebas Automatizadas E2E](#2c-desfase-entre-evolución-del-código-documentación-formal-up-y-pruebas-automatizadas-e2e)
3. **[3- Avances previstos para las próximas 4 semanas](#3--avances-previstos-para-las-próximas-4-semanas)**
   * [3.a. Semana 1 (18/11 al 24/11): Culminación de la Fase de Construcción y Alcance del Hito ID 15](#3a-semana-1-1811-al-2411-culminación-de-la-fase-de-construcción-y-alcance-del-hito-id-15)
   * [3.b. Semana 2 (25/11 al 01/12): Cierre de Documentación Pendiente y Manuales de Usuario (Tarea ID 16)](#3b-semana-2-2511-al-0112-cierre-de-documentación-pendiente-y-manuales-de-usuario-tarea-id-16)
   * [3.c. Semana 3 (02/12 al 07/12): Verificación, Validación y Pruebas Automatizadas (Tarea ID 17)](#3c-semana-3-0212-al-0712-verificación-validación-y-pruebas-automatizadas-tarea-id-17)
   * [3.d. Semana 4 (08/12 al 11/12): Simulación de Despliegue, Memoria Final y Lanzamiento (Tareas ID 18 a 20)](#3d-semana-4-0812-al-1112-simulación-de-despliegue-memoria-final-y-lanzamiento-tareas-id-18-a-20)

---

## 1- Estado de avance en el desarrollo del producto

### 1.a. Síntesis General: Bases del Producto Construidas vs. Documentación y Cierre Pendiente

   a. Actualmente el proyecto **Owens – Sistema de Gestión Gastronómica** cuenta con **sus cimientos arquitectónicos y el núcleo operativo del producto software ya construidos y funcionales**, alcanzando un **68 % de avance global**. La arquitectura de 3 capas (**Laravel 11** en el Backend, **React 19 + Inertia.js** en el Frontend SPA y **PostgreSQL** como motor relacional) se encuentra plenamente establecida y operativa.

   b. No obstante, es importante destacar que **el proyecto aún se encuentra transitando la Fase de Construcción** (cuando según la planificación original debería estar ingresando a la Fase de Transición) y que **todavía resta completar y consolidar parte de la documentación técnica y de usuario**, así como terminar de plasmar en el código fuente el rediseño de inventario por lotes físicos surgido de las últimas correcciones de la cátedra.

### 1.b. Estado de Avance Desglosado por Módulos del Producto

   a. **Módulo de Seguridad, Autenticación y Roles (RBAC) — [Completado: 90 %]:** Inicio de sesión funcional, protección de rutas mediante *middlewares*, control de permisos según perfil operativo (Administrador, Encargado, Cajero, Cocinero, Auditor) y renderizado dinámico del menú lateral.
   b. **Módulo de Operaciones, Caja y Punto de Venta (POS) — [Completado: 85 %]:** Apertura de sesión de caja con monto inicial, registro de movimientos manuales de ingreso/egreso, cierre y arqueo de caja (`CashRegisterController` / `CashRegisterService`), terminal interactiva de toma de pedidos (`BurgerSelector.jsx`, `SalesController`, `SaleService`) con múltiples medios de pago y cálculo de vueltos.
   c. **Módulo de Abastecimiento, Proveedores y Gastos Operativos — [Completado: 80 %]:** ABM completo de proveedores (`SupplierController`), registro de compras de mercadería con impacto en stock (`PurchaseController`), categorización y registro de gastos operativos del local (`ExpenseController`, `ExpenseCategoryController`).
   d. **Módulo de Gerencia y Reportes Estadísticos — [Completado: 75 %]:** Tablero de comando interactivo (`DashboardController`, `Dashboard.jsx`) con indicadores clave de rendimiento (KPIs) y generación de reportes parametrizados por rangos de fechas (`ReportController`, `ReportService`).
   e. **Módulo de Logística, Insumos, Recetas Versionadas y Lotes — [En Construcción: 55 %]:** Si bien el CRUD inicial de productos y descuento básico de stock ya funciona en la aplicación (`ProductController`, `StockService`), actualmente se está migrando la capa de persistencia en el código para reflejar el nuevo modelo consensuado con el profesor: unificación bajo el concepto *"Todo es Insumo"*, plantillas abiertas de recetas con versiones y vigencias, y trazabilidad física de lotes (`insumo_existencias` e `insumo_insumos`).
   f. **Módulo de Interfaces Externas y Procesos Automatizados (Módulos Inteligentes) — [En Construcción: 50 %]:** Se encuentra programada la base del servicio SOAP para facturación electrónica con AFIP (`AfipService.php`), el servicio de códigos de barra (`BarcodeService.php`) y la estructura de mensajería externa (WhatsApp). Resta cerrar la ejecución desatendida mediante tareas programadas (*Cron Jobs*) para el Reabastecimiento Predictivo con solicitud de cotizaciones a proveedores y el envío automatizado de cupones de fidelización por inactividad.

### 1.c. Estado de Avance de la Documentación de Ingeniería de Software

   a. **Fase de Inicio y Planificación (Capítulo 1) — [Completado: 95 %]:** Planteo del problema, objetivos, límites y alcance, análisis de viabilidad, gestión de riesgos, calendario UP, especificación de actores, subsistemas y catálogo depurado de Casos de Uso en lenguaje de negocio.
   b. **Requisitos, Arquitectura y Modelo Conceptual (Capítulo 2) — [Completado: 90 %]:** Requisitos no funcionales, matriz de rastreabilidad, arquitectura de 3 capas, Modelo Conceptual de Datos (ERD) y Diagrama de Clases Conceptual (DCD) ya actualizados al paradigma de la cátedra (*Composite* de insumos, versiones de recetas y lotes físicos).
   c. **Especificación y Diseño Detallado (Capítulos 3 y 4) — [En Consolidación: 75 %]:** Se redactaron y actualizaron las especificaciones de los casos de uso centrales (incluyendo `UC-15: Asignar Receta a Insumo` y `UC-16: Registrar Producción Interna` sin jerga técnica), Diagramas de Secuencia del Sistema (DSS), Contratos de Operación, Diagramas de Secuencia de Diseño (DSD), restricciones formales en OCL y el Modelo Relacional físico en 3FN. **Falta completar** la revisión cruzada de algunos casos de uso secundarios y actualizar capturas de prototipos de interfaz tras el cambio del modelo de recetas.
   d. **Codificación, Pruebas, Implantación y Manuales (Capítulos 5 a 9) — [En Desarrollo: 45 %]:** Se cuenta con la estructura base de estrategias de prueba (caja blanca, caja negra, integración) y el esqueleto del Manual de Usuario y Técnico, pero **aún falta documentar** la corrida completa de pruebas sobre el nuevo esquema de lotes, las capturas definitivas paso a paso del sistema terminado y el video de presentación final.

### 1.d. Contraste con el Calendario del Proyecto (Metodología UP): ¿Por qué se continúa en Construcción en lugar de iniciar Transición?

A continuación se expone el calendario original planificado bajo las 4 fases del Proceso Unificado (Inicio, Elaboración, Construcción y Transición), incorporando una columna de **Estado Real a la fecha (17/11/2026)**:

| ID | Nombre de Tarea / Fase | Inicio | Fin | Duración (días) | Predecesores | Estado Real al 17/11/2026 |
| :---: | :--- | :---: | :---: | :---: | :---: | :--- |
| **-** | **Inicio (Fase)** | **31/08/2026** | **04/09/2026** | **-** | **-** | **✅ Completada (100 %)** |
| 1 | Relevamiento de datos y análisis preliminar | 31/08/2026 | 01/09/2026 | 2 | - | ✅ Completada |
| 2 | Definición del alcance, objetivos y limitaciones | 02/09/2026 | 03/09/2026 | 2 | 1 | ✅ Completada |
| 3 | Análisis de viabilidad y Gestión de Riesgos | 02/09/2026 | 04/09/2026 | 3 | 1 | ✅ Completada |
| 4 | *Hito de Objetivos del Ciclo de Vida* | 07/09/2026 | 07/09/2026 | 0 | 2, 3 | ✅ Hito Alcanzado |
| **-** | **Elaboración (Fase)** | **07/09/2026** | **30/09/2026** | **-** | **-** | **🔄 Reabierta y Ajustada (90 %)** |
| 5 | Análisis de Requerimientos: Definición | 07/09/2026 | 15/09/2026 | 7 | 4 | ✅ Completada |
| 6 | Especificación y diseño: Definición de Casos de Uso | 16/09/2026 | 24/09/2026 | 7 | 5 | 🔄 Recién reestructurada (Iteración 3 y 4) |
| 7 | Diseño del Modelo de Base de Datos | 16/09/2026 | 22/09/2026 | 5 | 5 | 🔄 Recién reestructurada (Iteración 1 y 2) |
| 8 | Diseño de Interfaz de Usuario (Prototipado) | 23/09/2026 | 24/09/2026 | 2 | 7 | 🔄 En ajuste por nuevas pantallas de lotes |
| 9 | Configuración de la arquitectura | 25/09/2026 | 30/09/2026 | 4 | 6, 8 | ✅ Completada |
| 10 | *Hito de Arquitectura del Ciclo de Vida* | 01/10/2026 | 01/10/2026 | 0 | 9 | ✅ Hito Alcanzado (con refactorización) |
| **-** | **Construcción (Fase)** | **02/10/2026** | **17/11/2026** | **-** | **-** | **⚠️ EN CURSO (Fase Actual Real - 65 %)** |
| 11 | Implementación del módulo POS de Ventas | 02/10/2026 | 16/10/2026 | 11 | 10 | ✅ Completada (POS, Caja, Compras, Gastos) |
| 12 | Desarrollo del motor de inventario y recetas | 19/10/2026 | 30/10/2026 | 10 | 11 | ⚠️ En refactorización hacia modelo de lotes |
| 13 | Programación de Procesos Inteligentes | 02/11/2026 | 10/11/2026 | 7 | 12 | ⚠️ En progreso (ajustando Cron Jobs) |
| 14 | Integración de Facturación Electrónica | 11/11/2026 | 17/11/2026 | 5 | 13 | ⚠️ En progreso (`AfipService` creado, falta cierre) |
| 15 | *Hito de Capacidad Operativa Inicial* | 18/11/2026 | 18/11/2026 | 0 | 14 | ⏳ Postergado (pendiente de tareas 12, 13 y 14) |
| **-** | **Transición (Fase)** | **19/11/2026** | **11/12/2026** | **-** | **-** | **⏳ Pendiente de Inicio (Avance preliminar)** |
| 16 | Diseño de manuales de usuario | 19/11/2026 | 25/11/2026 | 5 | 15 | 📝 Estructura redactada (faltan capturas finales) |
| 17 | Verificación y Validación: Pruebas Automatizadas | 26/11/2026 | 04/12/2026 | 7 | 16 | 📝 Parcial (Cypress en Caja/Login; falta resto) |
| 18 | Simulación de despliegue y configuración | 07/12/2026 | 09/12/2026 | 3 | 17 | ⏳ Pendiente |
| 19 | Puesta a punto, redacción de Memoria Final | 10/12/2026 | 11/12/2026 | 2 | 18 | ⏳ Pendiente |
| 20 | *Hito de Lanzamiento del Producto* | 11/12/2026 | 11/12/2026 | 0 | 19 | ⏳ Pendiente |

**Explicación del desfase entre el calendario teórico y el estado real:**
Según la planificación original, el día **17/11/2026** debía finalizar la **Fase de Construcción** para alcanzar mañana (**18/11/2026**) el *Hito de Capacidad Operativa Inicial (ID 15)* y dar comienzo el **19/11/2026** a la **Fase de Transición**. Sin embargo, en la práctica **el proyecto continúa dentro de la Fase de Construcción**. Esto se debe a que durante el desarrollo del motor de inventario y recetas (**Tarea ID 12**) fue necesario realizar una iteración correctiva hacia atrás sobre las **Tareas ID 6 y ID 7** de la Fase de Elaboración para rediseñar el modelo de datos y los casos de uso bajo el esquema de trazabilidad por lotes propuesto por la cátedra. Dado que las **Tareas ID 13 y ID 14** tienen dependencia secuencial directa (`Predecesores: 12 y 13`), el cierre de la Fase de Construcción se desplazó aproximadamente dos semanas, manteniendo las bases del sistema listas pero postergando la entrada formal a la Fase de Transición.

---

## 2- Problemas detectados que han podido retrasar el desarrollo del proyecto

### 2.a. Reingeniería Arquitectónica del Motor de Inventario, Recetas Versionadas y Trazabilidad de Lotes

   a. En el diseño e implementación inicial del sistema (`apps/web`), se había adoptado un esquema clásico que separaba las entidades `Producto` (artículo de venta) e `Insumo` (materia prima) con un descuento directo y plano de cantidades sobre el stock general.

   b. A partir de las devoluciones académicas en clase, se comprendió que dicho enfoque no permitía resolver problemáticas reales de la industria gastronómica como las **sub-recetas multinivel** (por ejemplo, una *Hamburguesa completa* que lleva un *Medallón de carne casero*, el cual a su vez se elabora con *Carne molida*, *Huevo*, *Cebolla* y *Ajo*) ni la **trazabilidad bromatológica de lotes** (saber exactamente con qué lote de carne y de qué fecha de origen se armó una hamburguesa determinada).

   c. Adaptar el proyecto a este paradigma implicó detener el avance lineal de la codificación para rediseñar íntegramente el modelo en dos capas desacopladas:
      * **Capa de Configuración Teórica:** Unificación de todo el catálogo en la entidad `insumos` (patrón *Composite*), creación de `recetas`, `receta_versiones` (con vigencia temporal `fecha_desde` y `fecha_hasta` para no alterar costos ni composiciones históricas) y `receta_insumos` (con rangos de tolerancia de cantidad mínima y máxima, donde un mínimo de $0$ modela ingredientes opcionales).
      * **Capa de Existencia Física:** Creación de `insumo_existencias` (lotes físicos con fecha de origen, vencimiento y vínculo opcional a la versión de receta con la que fue elaborado) e `insumo_insumos` (tabla recursiva padre-hijo que vincula el lote elaborado con los lotes exactos de ingredientes consumidos).

   d. Este cambio estructural obligó a reescribir el Modelo Conceptual (Cap. 2.4), el Modelo Relacional 3FN (Cap. 4.7), los Diagramas de Clases (Cap. 2.5 y 4.6), el Catálogo y Especificaciones de Casos de Uso (eliminando nombres compuestos y términos técnicos de base de datos), los DSS, Contratos de Operación, DSD y restricciones OCL, consumiendo parte del tiempo que estaba asignado al cierre de la Fase de Construcción.

### 2.b. Complejidad Técnica en Servicios Externos (AFIP SOAP / Certificados X.509) y Procesos en Segundo Plano

   a. En la **Tarea ID 14 (Integración de Facturación Electrónica)**, la comunicación con los Web Services SOAP de AFIP (WSAA y WSFEv1) presentó dificultades técnicas vinculadas a la generación y firmado criptográfico de tickets de acceso (TRA) mediante certificados X.509 (`OpenSSL` / `CMS`) en el entorno local de desarrollo, así como el manejo de excepciones cuando los servidores de homologación de AFIP presentan intermitencias.

   b. En la **Tarea ID 13 (Programación de Procesos Inteligentes)**, dado que el módulo de Reabastecimiento Predictivo depende directamente del cálculo de existencias críticas de insumos, su lógica de disparo automático debe ajustarse para consultar la sumatoria de lotes vigentes en `insumo_existencias` en lugar de un único atributo plano de stock en la tabla de productos.

### 2.c. Desfase entre Evolución del Código, Documentación Formal UP y Pruebas Automatizadas E2E

   a. Al tratarse de un proyecto desarrollado de forma individual (donde el 100 % del análisis, diseño, codificación, testing y documentación recae sobre un único alumno), mantener sincronizados los 10 capítulos de documentación bajo el estándar riguroso del Proceso Unificado mientras se refactoriza el código fuente generó cuellos de botella en la redacción de los capítulos finales.

   b. Adicionalmente, al ejecutar las pruebas automatizadas de extremo a extremo (E2E) con **Cypress** sobre el módulo de Caja (`caja.cy.js`), se detectaron fallos intermitentes causados por el middleware `ThrottleRequests` de Laravel, el cual devolvía el código de error `HTTP 429 (Too Many Requests)` al intentar autenticar al usuario repetidas veces en los bloques `beforeEach`, sumado a diferencias de sincronización con animaciones asíncronas (`Lottie`) en el DOM.

---

## 3- Avances previstos para las próximas 4 semanas

Con el objetivo de completar el porcentaje restante del desarrollo, cerrar formalmente la **Fase de Construcción** y ejecutar de forma intensiva la **Fase de Transición**, se planifica el siguiente cronograma de trabajo para las próximas 4 semanas:

### 3.a. Semana 1 (18/11 al 24/11): Culminación de la Fase de Construcción y Alcance del Hito ID 15

   a. **Migración de Base de Datos y Backend al Modelo de Lotes (Cierre de Tarea ID 12):** Crear y ejecutar las migraciones de Laravel para las tablas `insumos`, `recetas`, `receta_versiones`, `receta_insumos`, `insumo_existencias` e `insumo_insumos`, adaptando `ProductService` y `StockService` para gestionar el alta de versiones de recetas y el registro de lotes de producción interna con descuento FEFO (*First Expired, First Out*).
   b. **Finalización de los 3 Procesos Automatizados (Cierre de Tareas ID 13 y 14):** Dejar operativos y parametrizables los comandos programados (*Laravel Scheduler / Cron*):
      1. *Reabastecimiento Automático (UC-46):* Detección de stock crítico por lotes y envío de solicitud de cotización por correo electrónico a los proveedores vinculados en `proveedor_insumos_precios`.
      2. *Validación Fiscal Diferida AFIP (UC-47):* Procesamiento en segundo plano de comprobantes pendientes y almacenamiento de CAE.
      3. *Fidelización de Clientes Inactivos (UC-48):* Detección de clientes sin compras en el período parametrizado y despacho de cupón promocional por mensajería externa.

### 3.b. Semana 2 (25/11 al 01/12): Cierre de Documentación Pendiente y Manuales de Usuario (Tarea ID 16)

   a. **Completitud Documental (Capítulos 3, 4 y 5):** Finalizar la revisión de especificaciones restantes, actualizar los prototipos y capturas de pantalla de entrada/salida (Cap. 4.1 y 4.2) para que coincidan exactamente con las vistas finales de React/Inertia.
   b. **Edición Final del Manual de Usuario y Manual Técnico (Capítulo 9):** Incorporar las capturas reales anotadas con llamadas numéricas correlativas para cada rol (Cajero, Cocinero, Encargado, Administrador) y la guía de instalación y resguardo (`pg_dump`).

### 3.c. Semana 3 (02/12 al 07/12): Verificación, Validación y Pruebas Automatizadas (Tarea ID 17)

   a. **Estabilización de Pruebas E2E en Cypress y Unitarias en PHPUnit:** Configurar `cy.session()` en Cypress para reutilizar la sesión autenticada sin disparar bloqueos `HTTP 429`, completar las pruebas automatizadas sobre apertura/cierre de caja, ventas POS y registro de lotes de producción, y documentar los resultados en el **Capítulo 6 (Prueba y Depuración)**.
   b. **Pistas de Auditoría (UC-41):** Verificar el registro inmutable de eventos críticos (anulaciones, ajustes de lotes, cambios de versiones de recetas y cierres de caja).

### 3.d. Semana 4 (08/12 al 11/12): Simulación de Despliegue, Memoria Final y Lanzamiento (Tareas ID 18 a 20)

   a. **Simulación de Despliegue y Puesta a Punto (Tareas ID 18 y 19):** Verificar el entorno completo en limpio con datos de prueba realistas (semillas/*seeders* con recetas multinivel de hamburguesas, medallones caseros, lotes y proveedores), compilar la Memoria Final unificada y grabar el **Video de Presentación y Defensa del Sistema** logrando el **Hito de Lanzamiento del Producto (ID 20)**.
