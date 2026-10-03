# Reglas de Cátedra para Casos de Uso (Basado en Correcciones)

A partir del análisis de las correcciones realizadas por la cátedra sobre los casos de uso de referencia (UC-02 de Alta de Función y Reservar Entrada), se han identificado las siguientes reglas estrictas de redacción y formato que deben aplicarse a todos nuestros casos de uso.

## 1. Tiempos Verbales en Precondiciones y Postcondiciones
Las precondiciones no deben redactarse como una "obligación" (con la palabra "debe"), sino como un **estado de hecho ya consolidado**.

*   **MAL (Precondición):** "El cliente debe acceder a la plataforma." / "El operador debe estar autenticado."
*   **BIEN (Precondición):** "El usuario accedió al sistema." / "El usuario inició sesión con privilegios de operador." / "Existe disponibilidad en la cartelera."
*   **BIEN (Postcondición):** "Se registró una reserva en el sistema y se bloqueó el espacio correspondiente."

## 2. Resolución Obligatoria de las Excepciones
El profesor dejó una nota clarísima: *"¿Cómo sigue el caso de uso, se vuelve a un paso y/o se termina el caso de uso?"*. 
Toda excepción (flujo alternativo) debe indicar explícitamente qué sucede con el flujo de eventos al terminar la acción del sistema. Las únicas dos resoluciones aceptadas son:

1.  **Retorno:** "... y el caso de uso regresa al paso X."
2.  **Finalización:** "... y el caso de uso finaliza."

*Ejemplo correcto:* "Si el usuario no ha seleccionado al menos un ticket, el sistema bloquea el avance y solicita la selección. **El caso de uso regresa al paso 2**".

## 3. Rango de Pasos en Excepciones
Las excepciones no solo ocurren en un paso aislado. Si una excepción de "tiempo de sesión expirado" o "botón de retroceso" puede ocurrir durante todo un proceso, se debe usar un **rango de pasos**.
*   *Ejemplo de la cátedra:* `Paso: 3-8 | Acción: Si el tiempo de sesión expira...`
*   *Ejemplo de la cátedra:* `Paso: 4-8 | Acción: Si el usuario solicita retroceder...`

## 4. Estricta Esencialidad (Cero Diseño)
El profesor remarcó: *"No deben incluir cuestiones de diseño en los casos de uso esenciales (interfaces, base de datos, etc.)"*.
Se penaliza el uso de términos que aludan a la interfaz de usuario.
*   **Penalizado:** "resalta la información faltante", "muestra un pop-up", "guarda en la base de datos".
*   **Aprobado:** "informa al usuario", "solicita su corrección", "registra los datos", "muestra el estado de disponibilidad".

## 5. El "Paso 1" Estructurado
El primer paso del flujo normal (Secuencia Normal) obedece a una estructura de redacción fija y formal.
*   **Fórmula:** *"El caso de uso inicia cuando el [Actor]..."*
*   *Ejemplo de la cátedra:* "El caso de uso inicia cuando el usuario selecciona una fecha y un horario..."

## 6. Numeración Lineal de la Secuencia Normal
En las correcciones (donde tachó `1` y puso `2`, etc.), se observa que la cátedra prefiere una numeración puramente **secuencial** (1, 2, 3, 4, 5...) donde cada paso alterna el sujeto narrativo, empezando siempre con la entidad (Actor o Sistema):
1.  El **caso de uso inicia cuando el usuario** selecciona...
2.  El **sistema** solicita...
3.  El **usuario** especifica...
4.  El **sistema** actualiza...
*(Nota: Nuestra tabla de dos columnas es excelente visualmente, pero debemos asegurar que la numeración `Paso` sea una lista única y continua, sin dejar celdas de números vacías).*
