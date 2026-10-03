# Rúbrica y Pautas de Aprobación de la Cátedra

> [!NOTE]
> **Fuente de Datos:** Este documento ha sido extraído textualmente de las pautas de evaluación y rúbrica oficiales provistas por la cátedra para la presentación del proyecto de software final. Debe usarse como límite y alcance estricto del proyecto.

Este documento centraliza las reglas estrictas provistas por la cátedra para la aprobación del proyecto final de software. Debe servir como guía constante durante el diseño y la implementación.

## 1. Pautas Arquitectónicas y Estructurales
*   **Repositorio versionado (Git/SVN):** Todo el código y la documentación debe residir en un repositorio con su URL disponible.
*   **Arquitectura en Capas:** El diseño y la implementación del software deben seguir obligatoriamente un patrón de capas (ej. MVC).
*   **Multiusuario con roles:** El sistema debe soportar acceso concurrente de múltiples usuarios clasificados mediante un sistema de niveles/roles jerárquicos.
*   **Base de Datos Relacional (3FN) / NoSQL:** Debe implementarse un motor de persistencia de datos y el modelo lógico debe cumplir al menos con la Tercera Forma Normal (3FN).
*   **Uso de Metodología:** Se debe documentar la trazabilidad completa utilizando una metodología de desarrollo formal (ej. Proceso Unificado - UP).

## 2. Requerimientos Funcionales Obligatorios
El proyecto software debe incorporar nativamente soporte para:
*   **Gestión de Archivos:** Capacidad del sistema para manipular, subir, guardar o procesar documentos físicos/digitales.
*   **Informes Parametrizables:** Los reportes generados deben ofrecer al usuario la capacidad de filtrar datos (por fecha, usuario, categoría, etc.).
*   **Módulos Inteligentes:** Como mínimo **tres (3) procesos de datos inteligentes** (ver sección 3 para definiciones).
*   **Informes Estadísticos:** El sistema debe proveer como mínimo dos (2) informes estadísticos o KPIs visuales.
*   **Pistas y Log de Auditoría:** Registro inmutable de transacciones críticas para control interno.

## 3. Lineamientos de los Módulos Inteligentes
Un "Módulo Inteligente" no es una simple consulta SQL (Select/Order By). Debe cumplir las siguientes reglas:
1.  **Valor Agregado:** Debe automatizar un flujo que genere ganancias, recupere clientes o reduzca costos operativos.
2.  **No ser PMV:** No puede ser una función intrínseca o vital para que el sistema opere básicamente (ej. descontar stock en una venta NO es módulo inteligente, es básico).
3.  **Complejidad:** Debe exceder el CRUD básico, involucrando algoritmos secuenciales, bucles dinámicos o integraciones complejas.
4.  **Parametrizable:** Debe poder configurarse desde la interfaz (horarios, umbrales, días de tolerancia).
5.  **Tecnologías de Terceros:** El uso de APIs externas (AFIP, WhatsApp, MercadoPago, LLMs) cuenta como proceso automatizado válido (previa validación de cátedra).
6.  **Intervención Humana Estratégica:** Está permitido (y muchas veces recomendado) que el proceso prepare la información (ej. recolecte cotizaciones) pero delegue la decisión final (compra) a un operador humano.
    
## 4. Documentación y Entregables
Si el proyecto carece de alguna pauta, debe justificarse en la Nota de Presentación y ser aprobado por la cátedra. Entregables mínimos:
*   Documentación Completa (Metodología)
*   Elevator Pitch
*   Código Fuente (Programa)
*   Manual de Usuario
*   Informe de Pruebas Unitarias e Implementación
