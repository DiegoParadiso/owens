# Reglas y Estándares para Diagramas de Secuencia de Sistema (DSS)

Este documento establece las normativas obligatorias para el diseño de Diagramas de Secuencia del Sistema (DSS) dentro del proyecto Owens, basándose estrictamente en la "GUÍA DE CONSULTA PRÁCTICA TP 08" y los lineamientos de Craig Larman.

## 1. Naturaleza y Propósito del DSS
*   **Enfoque de Caja Negra:** El sistema se modela como un único objeto (ej. `:Sistema`). No se debe mostrar la lógica interna, ni controladores, ni bases de datos.
*   **Eventos Significativos:** El DSS solo captura operaciones que el sistema debe ejecutar como respuesta a una interacción que tiene *valor operativo e institucional*.
*   **Trazabilidad 1 a 1:** Debe existir exactamente un (1) DSS por cada Caso de Uso especificado.

## 2. Definición de Eventos vs. Acciones Internas
*   **El ingreso de datos NO es un evento:** Que el usuario complete un formulario o tipee información es una acción interna del actor. El evento solo ocurre cuando el actor envía o confirma esa información hacia el sistema (ej. presionar "Guardar").
*   **Ejemplo Incorrecto:** `ingresarDatosCliente()` -> `ingresarDireccion()`.
*   **Ejemplo Correcto:** `unCliente = registrarCliente(datosPersonales, direccion)`.

## 3. Sintaxis y Convenciones Gráficas Obligatorias
Para alinear los diagramas generados en PlantUML con los ejemplos de la cátedra, se debe respetar la siguiente nomenclatura para los mensajes (flechas):

1.  **Formato de Asignación (Forward Arrow):** 
    En lugar de usar flechas punteadas (`-->`) de retorno para cada dato, la cátedra exige usar la notación de asignación de variables sobre la misma flecha de ida:
    `[nro_paso]: [valor_retorno] = [nombreOperacion]([argumentos_entrada])`

2.  **Ejemplo Práctico:**
    ```plantuml
    Actor -> Sistema : 1: comandaActiva = iniciarNuevaOrden()
    Actor -> Sistema : 2: subtotal = ingresarItem(idProducto, cantidad)
    ```

3.  **Análisis Previo (Entradas y Salidas):**
    Antes de diagramar, se debe extraer del Caso de Uso:
    *   **Entrada:** Los parámetros que viajan hacia el sistema.
    *   **Salida:** La instancia o valor que el sistema retorna al actor.
    *   **Operación:** El verbo descriptivo (ej. `buscarOrigen()`, `calcularCosto()`).

## 4. Agrupación y Complejidad
*   Se permite agrupar operaciones (ej. agrupar cálculo de subtotal y cálculo de impuestos en `calcularTotal()`) siempre que simplifique el diseño sin perder trazabilidad técnica.
*   El orden cronológico de las operaciones debe ser idéntico al flujo normal / flujo de eventos del Caso de Uso extendido.
