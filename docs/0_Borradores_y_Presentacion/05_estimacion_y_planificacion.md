# 7. Estimación de Tamaño por Módulo

Se expresa en porcentaje con respecto al total del producto, calculado en proporción a la cantidad de funcionalidades relevadas para cada módulo (49 Casos de Uso en total). Dado que el proyecto es de autoría individual, la totalidad de la carga de diseño, programación y pruebas recae sobre el tesista.

| Subsistema | % Participación | Responsable |
| :--- | :---: | :--- |
| Subsistema de Operaciones y Ventas | 25% | Paradiso, Diego |
| Subsistema de Logística e Inventario | 25% | Paradiso, Diego |
| Subsistema de Gerencia y Contabilidad | 15% | Paradiso, Diego |
| Subsistema de Seguridad y Auditoría | 15% | Paradiso, Diego |
| Subsistema de Interfaces Externas | 20% | Paradiso, Diego |
| **TOTAL** | **100%** | **Paradiso, Diego** |

# 8. Entorno Tecnológico y Metodológico

Para garantizar la escalabilidad y el mantenimiento del sistema, se adoptó un estilo arquitectónico de **3-Capas** combinado con un enfoque de diseño **API-First**:
*   **Capa de Presentación (Frontend):** Construida como una Single Page Application (SPA) utilizando **React 19**. La renderización y enrutamiento se gestionan sin recargar la página gracias a **Inertia.js**, brindando velocidad nativa.
*   **Capa de Lógica (Backend):** Soportada por el framework **Laravel 11** (PHP). Aquí se implementa el patrón Modelo-Vista-Controlador (MVC), validando reglas de negocio e integrándose con web services externos mediante SOAP y protocolos criptográficos X.509 (AFIP).
*   **Capa de Persistencia:** Implementada sobre el motor relacional **PostgreSQL**, lo que asegura el cumplimiento estricto de las propiedades ACID. La interacción se realiza mediante el ORM Eloquent previniendo ataques de inyección SQL.

*(Nota: Se recomienda insertar aquí el Diagrama de Arquitectura de 3-Capas generado en PlantUML).*

## 8.1 Gestión de Riesgos Tempranos y Mitigación

Para asegurar la viabilidad del proyecto durante su operación continua en un entorno de alta demanda (local gastronómico), se identificaron los principales riesgos técnicos tempranos y se establecieron planes de contingencia críticos.

| Riesgo Identificado | Impacto | Estrategia de Mitigación |
| :--- | :---: | :--- |
| **Corte de Internet Local (ISP)** | Alto | El módulo POS continuará operando internamente en la red local para imprimir comandas de preparación en la cocina. La validación del comprobante con AFIP quedará encolada para su procesamiento automático al restablecerse la conexión. |
| **Caída del Web Service de AFIP** | Alto | Habilitar el registro de la venta en estado pendiente, permitiendo entregar un ticket de control interno al cliente y facturar por lotes posteriormente. |
| **Pérdida de datos del servidor** | Alto | Ejecución de un Plan de Contingencia con políticas de copias de seguridad automatizadas (Backups) de la base de datos PostgreSQL. |
| **Accesos no autorizados y fugas** | Medio | Auditoría invisible (Spatie), seguridad basada en roles e inclusión de la metaetiqueta `noindex` para bloquear la indexación de la URL del sistema en motores de búsqueda. |

# 9. Calendario del Proyecto (Metodología UP)

A continuación se presenta un calendario de las principales tareas del proyecto. El proceso iterativo e incremental de UP está caracterizado por la realización en paralelo de todas las disciplinas de desarrollo, haciendo énfasis en distintas áreas según el avance.

El cronograma sigue las fases de UP (Inicio, Elaboración, Construcción, Transición), alineado a la tabla de planificación de Sommerville.

| ID | Nombre de Tarea / Fase | Inicio | Fin | Duración (días) | Predecesores |
| :---: | :--- | :--- | :--- | :---: | :---: |
| **1** | **Inicio (Fase)** | **31/08/2026** | **04/09/2026** | **-** | **-** |
| 2 | Relevamiento de datos y análisis preliminar | 31/08/2026 | 01/09/2026 | 2 | - |
| 3 | Definición del alcance, objetivos y limitaciones | 02/09/2026 | 03/09/2026 | 2 | 2 |
| 4 | Investigación y prueba de viabilidad | 02/09/2026 | 04/09/2026 | 3 | 2 |
| 5 | *Hito de Objetivos del Ciclo de Vida* | 07/09/2026 | 07/09/2026 | 0 | 3, 4 |
| **6** | **Elaboración (Fase)** | **07/09/2026** | **30/09/2026** | **-** | **-** |
| 7 | Análisis de Requerimientos: Definición | 07/09/2026 | 15/09/2026 | 7 | 5 |
| 8 | Especificación y diseño: Definición de Casos de Uso | 16/09/2026 | 24/09/2026 | 7 | 7 |
| 9 | Diseño del Modelo de Base de Datos | 16/09/2026 | 22/09/2026 | 5 | 7 |
| 10 | Configuración de la arquitectura | 25/09/2026 | 30/09/2026 | 4 | 8, 9 |
| 11 | *Hito de Arquitectura del Ciclo de Vida* | 01/10/2026 | 01/10/2026 | 0 | 10 |
| **12** | **Construcción (Fase)** | **02/10/2026** | **17/11/2026** | **-** | **-** |
| 13 | Implementación del módulo POS de Ventas | 02/10/2026 | 16/10/2026 | 11 | 11 |
| 14 | Desarrollo del motor de inventario y recetas | 19/10/2026 | 30/10/2026 | 10 | 13 |
| 15 | Programación de Procesos Inteligentes | 02/11/2026 | 10/11/2026 | 7 | 14 |
| 16 | Integración de Facturación Electrónica | 11/11/2026 | 17/11/2026 | 5 | 15 |
| 17 | *Hito de Capacidad Operativa Inicial* | 18/11/2026 | 18/11/2026 | 0 | 16 |
| **18** | **Transición (Fase)** | **19/11/2026** | **11/12/2026** | **-** | **-** |
| 19 | Diseño de manuales de usuario | 19/11/2026 | 25/11/2026 | 5 | 17 |
| 20 | Verificación y Validación: Diseño de Pruebas | 26/11/2026 | 04/12/2026 | 7 | 19 |
| 21 | Simulación de despliegue y configuración | 07/12/2026 | 09/12/2026 | 3 | 20 |
| 22 | Puesta a punto, redacción de Memoria Final | 10/12/2026 | 11/12/2026 | 2 | 21 |
| 23 | *Hito de Lanzamiento del Producto* | 11/12/2026 | 11/12/2026 | 0 | 22 |
