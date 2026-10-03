# 1. Planificación

## 1.1 Introducción y Objetivos del Sistema

### 1.1.1 Introducción
El presente proyecto tiene por objetivo el desarrollo e implementación de "Owens", un sistema web integral de gestión y facturación diseñado específicamente para una hamburguesería que opera bajo el modelo de atención rápida por mostrador (Fast-Food). Actualmente, los locales gastronómicos de este rubro enfrentan el desafío de mantener la trazabilidad entre lo que compran, lo que producen y lo que venden, lidiando frecuentemente con procesos manuales, mermas de inventario y cargas administrativas duplicadas tanto operativas como fiscales. La meta de este proyecto consiste en centralizar toda la información del local en una única plataforma robusta, desarrollada con Laravel 11, React 19 y PostgreSQL. Esto permitirá automatizar el descuento de inventario a través de un sistema de recetas, gestionar compras de forma digital y agilizar la toma de decisiones mediante procesos inteligentes y reportes estadísticos.

Específicamente, el sistema cuenta con tres procesos automatizados de fondo que aportan valor agregado sin intervención humana: alertas predictivas por bajo stock enviadas por correo, envío de cupones de fidelización vía WhatsApp a clientes inactivos, y la autorización fiscal automática en tiempo real mediante integración con AFIP.

### 1.1.2 Objetivo del Sistema
Desarrollar un sistema de software integral que soporte y automatice el proceso de compras, producción de menú, ventas y control administrativo de la hamburguesería "Owens", brindando herramientas inteligentes para el mantenimiento de la rentabilidad y garantizando el cumplimiento fiscal.

### 1.1.3 Objetivos Específicos del Sistema
Para alcanzar el objetivo general propuesto, se establecen las siguientes metas específicas:

**Tabla 1**
*Objetivo Específico OBJ-01*
| Campo | Detalle |
| :--- | :--- |
| **OBJ–01** | **Optimizar la atención en el Punto de Venta (POS)** |
| Descripción | Agilizar el proceso de toma de pedidos y cobro en el mostrador mediante un módulo POS de interfaz rápida, con el fin de reducir los tiempos de espera de los clientes y mejorar el flujo de ventas. |
| Estabilidad | Alta |
| Comentarios | Ninguno |

**Tabla 2**
*Objetivo Específico OBJ-02*
| Campo | Detalle |
| :--- | :--- |
| **OBJ–02** | **Controlar el inventario mediante recetas** |
| Descripción | Automatizar la trazabilidad de la materia prima mediante un modelo de ingeniería de menú que descuente insumos en unidades enteras al concretar una venta, con el propósito de mantener el stock actualizado en tiempo real y prevenir mermas. |
| Estabilidad | Alta |
| Comentarios | Ninguno |

**Tabla 3**
*Objetivo Específico OBJ-03*
| Campo | Detalle |
| :--- | :--- |
| **OBJ–03** | **Digitalizar la gestión de compras** |
| Descripción | Administrar el registro de ingresos de mercadería habilitando la carga y almacenamiento digital de comprobantes físicos de proveedores, con el objetivo de centralizar la documentación contable y respaldar los gastos operativos. |
| Estabilidad | Alta |
| Comentarios | Ninguno |

**Tabla 4**
*Objetivo Específico OBJ-04*
| Campo | Detalle |
| :--- | :--- |
| **OBJ–04** | **Automatizar el reabastecimiento de insumos críticos** |
| Descripción | Garantizar la disponibilidad de materia prima implementando un proceso inteligente que envíe solicitudes de cotización a proveedores al alcanzar el punto de pedido, con el fin de evitar quiebres de stock que frenen la producción. |
| Estabilidad | Alta |
| Comentarios | Ninguno |

**Tabla 5**
*Objetivo Específico OBJ-05*
| Campo | Detalle |
| :--- | :--- |
| **OBJ–05** | **Garantizar el cumplimiento fiscal (AFIP)** |
| Descripción | Asegurar la validez legal de las operaciones integrando el sistema con los servicios de la entidad fiscal (AFIP), con el propósito de emitir comprobantes electrónicos automáticos y eliminar la doble carga administrativa. |
| Estabilidad | Alta |
| Comentarios | Ninguno |

**Tabla 6**
*Objetivo Específico OBJ-06*
| Campo | Detalle |
| :--- | :--- |
| **OBJ–06** | **Facilitar la toma de decisiones gerenciales** |
| Descripción | Proveer un módulo de inteligencia de negocios (Dashboard) que consolide las métricas de ventas e inventario, con el fin de generar reportes exportables y medir el rendimiento comercial y financiero del establecimiento. |
| Estabilidad | Alta |
| Comentarios | Ninguno |

**Tabla 7**
*Objetivo Específico OBJ-07*
| Campo | Detalle |
| :--- | :--- |
| **OBJ–07** | **Garantizar la seguridad, integridad y auditoría de los datos** |
| Descripción | Implementar controles de acceso basados en roles jerárquicos, registros inmutables de actividad (pistas de auditoría) y planes de resguardo (Backups), con el propósito de prevenir fraudes, mitigar riesgos y asegurar la trazabilidad de todas las operaciones. |
| Estabilidad | Alta |
| Comentarios | Ninguno |

**Tabla 8**
*Objetivo Específico OBJ-08*
| Campo | Detalle |
| :--- | :--- |
| **OBJ–08** | **Fidelización automatizada de clientes** |
| Descripción | Implementar un módulo inteligente que detecte la inactividad de compra de clientes frecuentes y envíe cupones de descuento automáticamente mediante la plataforma de mensajería externa, con el objetivo de recuperar ventas y aumentar la retención. |
| Estabilidad | Alta |
| Comentarios | Ninguno |

### 1.1.4 Alcance y Límites del Sistema
El sistema "Owens" abarca la gestión integral del ciclo comercial del establecimiento, operando sobre el modelo de atención rápida por mostrador. Su alcance funcional cubre la toma de pedidos en el Punto de Venta, la visualización de comandas en tiempo real para producción, el descuento automático de inventario mediante explosión de recetas, la digitalización de compras, la facturación electrónica, la emisión de reportes estadísticos y el control estricto mediante pistas de auditoría inmutables.

Adicionalmente, el alcance del sistema contempla la parametrización integral de catálogos base. Aunque estas operaciones no se detallan como Casos de Uso transaccionales complejos, el sistema provee las interfaces y controladores necesarios para administrar: Categorías de Productos, Categorías de Gastos, Métodos de Pago y Unidades de Medida.

Para acotar el proyecto a un marco viable y evitar desviaciones funcionales, se establecen los siguientes límites (funcionalidades fuera de alcance):
*   **Gestión de Mesas Físicas:** Al estar orientado al modelo Fast-Food, el sistema no contempla un mapa interactivo para ruteo o asignación de mesas en el salón.
*   **Procesamiento de pagos:** El sistema asienta el medio de cobro, pero no procesa transacciones nativas con tarjetas; esto dependerá de terminales externas.
*   **Logística de Envíos:** No contempla un módulo de ruteo o seguimiento GPS para repartidores. 
*   **Recursos Humanos:** No se incluye la liquidación de sueldos, diagramación de turnos ni control de presentismo del personal.

## 1.2 Plan de las Fases
El desarrollo se llevará a cabo en base a fases con una o más iteraciones en cada una de ellas. La siguiente tabla muestra la distribución de tiempos y el número de iteraciones de cada fase (para las fases de Construcción y Transición es sólo una aproximación preliminar).

**Tabla 9**
*Distribución de iteraciones y duración por fase*
| Fase | Nro. Iteraciones | Duración |
| :--- | :--- | :--- |
| Fase de Inicio | 1 | 1 Semana |
| Fase de Elaboración | 2 | 3 Semanas |
| Fase de Construcción | 3 | 4 Semanas |
| Fase de Transición | 1 | 2 Semanas |

Los hitos que marcan el final de cada fase se describen en la siguiente tabla, enfocados en los objetivos funcionales y arquitectónicos de "Owens":

**Tabla 10**
*Hitos de finalización por fase*
| Fase | Hito |
| :--- | :--- |
| **Inicio** | • Se presentará el plan de proyecto junto con la planificación de la primera iteración.<br>• Se identificarán los Casos de Uso principales de alto nivel (Gestión de Ventas POS, Control de Producción e Inventario, Informes y Seguridad).<br>• Se realizará la investigación y prueba de viabilidad de los Web Services de AFIP para la facturación electrónica. |
| **Elaboración** | • Se analizarán los requisitos detallados y se establecerá la arquitectura base (Backend en Laravel 11 y Frontend en React 19 vía Inertia.js).<br>• Al final de esta fase, los Casos de Uso críticos (Toma de pedidos y Descuento automático por recetas) estarán diseñados en el Modelo de Análisis/Diseño y el Modelo de Base de Datos (PostgreSQL en 3FN) estará consolidado. |
| **Construcción** | • Durante esta fase se construyen y refinan los procesos inteligentes: la integración fiscal, el flujo de cotización a proveedores y el log de auditoría.<br>• Se programan los reportes parametrizados (DOMPDF) y el Dashboard estadístico (Chart.js).<br>• El hito que marca el fin de esta fase es la versión Release 1.0, con capacidad operacional total (Beta) lista para pruebas de estrés y validación del circuito de compra-producción-venta. |
| **Transición** | • Se preparará la versión final para su implementación simulada y despliegue.<br>• Se ejecutarán y documentarán las pruebas automatizadas (E2E mediante Playwright/Cypress) sobre los flujos críticos (POS, Inventario, AFIP).<br>• Entrega de la Memoria Técnica, demostración del Plan de Contingencia y presentación formal ante la cátedra. |

## 1.3 Gestión de Riesgos y Mitigación
Para asegurar la viabilidad del proyecto durante su operación continua en un entorno de alta demanda (local gastronómico), se identificaron los posibles riesgos técnicos y se establecieron planes de contingencia críticos.

**Tabla 11**
*Matriz de Riesgos y Mitigación*
| Riesgo Identificado | Impacto | Estrategia de Mitigación |
| :--- | :--- | :--- |
| Corte de Internet Local (ISP) | Alto | El módulo POS continuará operando internamente en la red local para imprimir comandas de preparación en la cocina. La validación del comprobante con AFIP quedará encolada para su procesamiento automático al restablecerse la conexión. |
| Caída del Web Service de AFIP | Alto | Habilitar el registro de la venta en estado pendiente, permitiendo entregar un ticket de control interno al cliente y facturar por lotes posteriormente. |
| Pérdida de datos del servidor | Alto | Ejecución de un Plan de Contingencia con políticas de copias de seguridad automatizadas (Backups) de la base de datos PostgreSQL. |
| Accesos no autorizados y fugas | Medio | Auditoría invisible (Spatie), seguridad basada en roles e inclusión de la metaetiqueta noindex para bloquear la indexación de la URL del sistema en motores de búsqueda. |

*(Nota: Las secciones 1.4, 1.5 y 1.6 de Actores y Casos de Uso se mantienen idénticas en tu anexo según lo definido en el texto original, omitidas aquí para abreviar formato Markdown, pero revisadas y aprobadas en su completitud).*

---

# 2. Requisitos y Arquitectura

## 2.1 Requisitos No Funcionales y Seguridad

**Tabla 52**
*NFR-01: Rendimiento y Tiempos de Respuesta*
| Categoría | Rendimiento (Performance) |
| :--- | :--- |
| **Descripción** | El módulo de Punto de Venta (POS) debe procesar la adición de productos al carrito y el cálculo de totales en un tiempo menor a 1 segundo para no retrasar la atención al cliente. |
| **Justificación** | En un entorno Fast-Food, la velocidad de despacho es crítica para la rentabilidad. |

**Tabla 53**
*NFR-02: Continuidad Operativa (Tolerancia a Fallos)*
| Categoría | Confiabilidad (Reliability) |
| :--- | :--- |
| **Descripción** | Ante una desconexión temporal con los servidores de AFIP, el sistema debe permitir guardar las ventas en estado "Pendiente" e imprimir un ticket de control interno, encolando la facturación para su posterior procesamiento por lotes al restablecerse la conexión. |
| **Justificación** | El local físico no puede detener su atención por fallos de proveedores de internet o caídas de los servicios gubernamentales. |

**Tabla 54**
*NFR-03: Seguridad de Acceso y Datos*
| Categoría | Seguridad (Security) |
| :--- | :--- |
| **Descripción** | El sistema debe implementar un control de acceso basado en roles (RBAC). Las contraseñas deben ser almacenadas mediante algoritmos de encriptación unidireccional (Bcrypt). Todas las acciones sensibles de modificación o eliminación deben quedar registradas en una pista de auditoría inmutable indicando fecha, usuario y valores alterados. |
| **Justificación** | Prevención de fraudes internos y garantía de transparencia financiera. |

**Tabla 55**
*NFR-04: Usabilidad e Interfaz Adaptativa*
| Categoría | Usabilidad (Usability) |
| :--- | :--- |
| **Descripción** | La interfaz de usuario del sistema debe ser completamente responsiva (Mobile-First / Web-App), garantizando su correcta visualización y operatividad tanto en monitores de PC tradicionales como en tablets utilizadas por los cajeros o comensales (Menú Digital). |
| **Justificación** | Flexibilidad de hardware para el negocio y mejora en la experiencia del cliente final. |

**Tabla 56**
*NFR-05: Restricciones de Implementación (Soporte)*
| Categoría | Soporte (Supportability) |
| :--- | :--- |
| **Descripción** | El sistema debe ser construido utilizando una arquitectura basada en tecnologías web de código abierto. Específicamente, el backend debe desarrollarse en el framework Laravel (PHP), el frontend en React JS, y utilizar PostgreSQL como motor de base de datos relacional. |
| **Justificación** | Garantiza la sostenibilidad del proyecto, evitando licencias costosas y facilitando la búsqueda de desarrolladores para futuro mantenimiento. |

**Tabla 57**
*NFR-06: Cumplimiento Legal y Normativo*
| Categoría | Restricciones de Diseño (+ Compliance) |
| :--- | :--- |
| **Descripción** | El sistema debe comunicarse exclusivamente mediante certificados digitales X.509 firmados criptográficamente al consumir los Web Services de Facturación Electrónica (WSFEv1) de AFIP. |
| **Justificación** | Obligación legal para la emisión de comprobantes fiscales válidos en el territorio nacional. |


## 2.2 Arquitectura del Sistema (3-Capas, API-First)
Para garantizar la escalabilidad, el mantenimiento y la seguridad del sistema "Owens", se adoptó un estilo arquitectónico de 3-Capas combinado con un enfoque de diseño API-First. Esta arquitectura separa claramente las responsabilidades del sistema en tres capas lógicas distintas, tal como se ilustra a continuación.

**Figura 8**
*Arquitectura del Sistema Owens*
*(Insertar diagrama de 3-Capas)*

### 2.2.1 Descripción de Capas
*   **Capa de Presentación (Frontend):** Construida como una Single Page Application (SPA) utilizando React 19. Esta capa se encarga exclusivamente de la interfaz de usuario, la captura de eventos (clics, ingresos por teclado) y la renderización dinámica de los datos sin recargar la página. Para la comunicación fluida entre el servidor y el cliente mediante peticiones asíncronas, se emplea Inertia.js.
*   **Capa de Lógica de Negocio (Backend):** Soportada por el framework Laravel 11 (PHP). Esta capa actúa como el núcleo del sistema. Aquí se implementa el patrón MVC (Modelo-Vista-Controlador). Los controladores procesan las peticiones HTTP entrantes, validan las credenciales (Middlewares), aplican las reglas de negocio (como el descuento recursivo de inventario) y se comunican con los servicios externos (Web Services de AFIP).
*   **Capa de Persistencia de Datos:** Implementada sobre PostgreSQL. Se encarga de almacenar de forma segura y consistente la información operativa. La interacción con la base de datos se realiza a través de Eloquent ORM, lo que previene ataques de inyección SQL y facilita las transacciones atómicas.

## 2.3 Modelo de Datos
La persistencia de la información en el sistema Owens está sustentada por una base de datos relacional implementada en PostgreSQL. El diseño del modelo de datos fue concebido bajo estrictos criterios de integridad referencial y normalización.

Para estructurar la base de datos, se aplicaron las reglas de la Tercera Forma Normal (3FN), eliminando la redundancia de datos. A nivel arquitectónico, el modelo destaca por el uso de los siguientes patrones de diseño:
*   **Ingeniería de Menú (Productos y Recetas):** Se implementó una relación de muchos a muchos (M:N) resuelta mediante tablas intermedias. Esto permite que un Producto Final esté compuesto por múltiples Materias Primas, y que una Materia Prima pertenezca a múltiples recetas.
*   **Trazabilidad y Auditoría (Soft Deletes):** En lugar de eliminar registros físicamente (lo cual destruiría el historial contable), se implementó el patrón Borrado Lógico. El registro permanece en la base de datos pero se marca con un `deleted_at`.
*   **Control de Concurrencia:** La estructura relacional permite que las transacciones de ventas y ajustes de stock se ejecuten de manera atómica (ACID).

**Figura 9**
*Diagrama Entidad-Relación del Sistema Owens*
*(Insertar DER)*


## 2.4 Diagrama de Clases del Dominio
A diferencia del Modelo de Datos (orientado a la persistencia), este diagrama expone la lógica de negocio mediante Programación Orientada a Objetos (POO). 

El diseño se enfoca exclusivamente en el comportamiento y la taxonomía, aplicando el principio de ocultamiento de información de **Parnas**. Por ello, se omiten deliberadamente los métodos de acceso banales (getters/setters) para garantizar un verdadero encapsulamiento, exponiendo solo interfaces públicas estables. 

Destacan los siguientes patrones (GRASP y SOLID), abarcando los 5 subsistemas principales:
*   **Polimorfismo y Herencia:** Los roles (`Cajero`, `Administrador`) heredan de la clase abstracta `Usuario`. El inventario se bifurca en `Insumo` y `Producto`. 
*   **Alta Cohesión y Bajo Acoplamiento (GRASP):** Se omiten los rombos de agregación/composición por generar ambigüedad semántica (Fowler, *UML Distilled*). Se utilizan asociaciones simples con flechas de navegabilidad explícita para delegar responsabilidades según el patrón *Experto en Información*.
*   **Inversión de Dependencias (SOLID):** La clase `Venta` depende de una abstracción estable (`IServicioFiscal`) y no de una implementación concreta, aislando al núcleo del sistema de los detalles tecnológicos del Web Service de AFIP.

**Figura 10**
*Diagrama UML del Sistema Owens*
*(Insertar Diagrama de Clases StarUML)*


## 2.5 Procesos Inteligentes del Sistema
Una característica distintiva de la arquitectura del sistema Owens es su capacidad para ejecutar tareas autónomas (procesos en lote) sin intervención humana. Estos "procesos inteligentes" operan en segundo plano (background) para garantizar la proactividad del negocio, sin degradar el rendimiento ni el tiempo de respuesta (NFR-01) de los cajeros.

A nivel de software, este submódulo arquitectónico se apoya en el Programador de Tareas (Task Scheduler) nativo de Laravel y en su sistema de colas (Queues). A nivel de infraestructura, es invocado por el sistema operativo del servidor mediante un único Cronjob maestro.

**Figura 11**
*Flujo de Procesamiento Asíncrono y Tareas Programadas*
*(Insertar Flujo)*

Los procesos inteligentes más críticos definidos en la arquitectura de Owens son:
*   **Reabastecimiento Predictivo:** Un proceso programado que audita diariamente los niveles de stock físico contra los "puntos de pedido". Si un insumo crítico cae por debajo del umbral, el sistema despacha automáticamente una alerta por correo electrónico (SMTP) al encargado de compras.
*   **Fidelización por Inactividad:** El sistema realiza un barrido estadístico diario sobre el padrón de clientes. Al detectar inactividad mayor a 60 días, invoca la API externa de mensajería (WhatsApp) para enviar cupones de descuento personalizados.
*   **Mantenimiento y Resguardo:** Para asegurar la confidencialidad y disponibilidad de la información, el programador autónomo ejecuta volcados completos (dumps) de la base de datos en horarios de nula concurrencia (ej. 4:00 AM).

**Justificación Arquitectónica:** La delegación de estas pesadas lógicas de negocio a procesos asíncronos en segundo plano es lo que le otorga al sistema su verdadero valor agregado. Permite que Owens evolucione de ser un mero "registro de transacciones" a convertirse en una herramienta gerencial proactiva (Data-Driven), capaz de tomar decisiones logísticas y de marketing comercial sin requerir la interacción constante de un usuario humano.
