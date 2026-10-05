# Defensa de Casos de Uso - Sistema Owens

Este documento complementa la explicación arquitectónica centrándose específicamente en las decisiones tomadas para el modelado de los **Casos de Uso**, respondiendo a las preguntas más comunes o críticas que suele hacer un tribunal.

---

## 1. La cantidad de Casos de Uso (CRUD y Búsquedas)
*   **Pregunta del tribunal:** *"Tienen 59 casos de uso. ¿Por qué separaron 'Alta', 'Baja', 'Modificación' y 'Búsqueda' en lugar de hacer un solo caso de uso 'Gestionar Cliente' o 'Gestionar Producto'?"*
*   **Defensa:** La separación granular es una decisión arquitectónica basada en la seguridad y el modelo **RBAC (Control de Acceso Basado en Roles)**. En el mundo real de la gastronomía, un `Cajero` tiene permiso para dar de Alta a un cliente (para facturarle), pero bajo ningún punto de vista debería tener permiso para darlo de Baja o eliminarlo; eso es potestad del `Administrador`. Si hiciéramos un macro-caso de uso "Gestionar Cliente", perderíamos la capacidad de trazar los permisos por roles en el diagrama. Lo mismo aplica para las búsquedas (UC-51 al UC-59), que son operaciones de *solo lectura* permitidas para roles como el `Auditor`.

## 2. El Login (UC-36: Autenticar Usuario)
*   **Pregunta del tribunal:** *"Si 'Registrar Venta' requiere estar logueado, ¿por qué no hay una flecha `<<include>>` desde todas las operaciones hacia 'Autenticar Usuario'?"*
*   **Defensa:** Si pusiéramos un `<<include>>` desde los 50 casos de uso operativos hacia el Login, el diagrama se convertiría en un "anti-patrón de telaraña" (un gráfico ilegible). En Ingeniería de Software, es una práctica estándar (validada por UML) manejar la sesión como una **precondición implícita** del sistema para los actores que representan empleados. Se documenta en el flujo de los casos de uso, pero no se ensucia el diagrama visualmente.

## 3. Recetas vs Producción (UC-15 vs UC-16)
*   **Pregunta del tribunal:** *"¿Cuál es la diferencia entre 'Asignar Receta a Producto' y 'Registrar Producción Interna'? ¿No es lo mismo?"*
*   **Defensa:** No, representan momentos completamente distintos en el negocio.
    *   **UC-15 (Asignar Receta):** Es *parametrización*. El Encargado define la estructura (ej: 1 Hamburguesa = 1 Pan + 1 Medallón). Esto no mueve stock físico, solo guarda la fórmula (metadata).
    *   **UC-16 (Registrar Producción):** Es *operación física*. Se ejecuta en la cocina (ej: pre-cocinar 20 medallones al inicio del turno). Este caso de uso toma la fórmula y efectivamente **descuenta** las materias primas del inventario para aumentar el stock del producto semielaborado.

## 4. Ventas y la AFIP (UC-02 y UC-47)
*   **Pregunta del tribunal:** *"¿Por qué 'Validar Comprobante' es un `<<include>>` de 'Registrar Venta'?"*
*   **Defensa:** Porque según las reglas de negocio y los requisitos legales, **no existe** una venta exitosa en blanco en el sistema si la AFIP rechaza la operación. El `<<include>>` denota obligatoriedad; el flujo de la venta se interrumpe y se revierte (rollback) si el actor externo (Entidad Fiscal) no otorga el CAE.

## 5. Actores Autónomos y Módulos Inteligentes
*   **Pregunta del tribunal:** *"Veo un actor llamado 'Planificador Autónomo', pero un actor debe ser un rol humano o un sistema externo. ¿Qué es esto?"*
*   **Defensa:** UML permite que los sistemas temporizados internos actúen como instigadores primarios de un caso de uso (cron jobs). Casos como **UC-46 (Generar Solicitud de Cotización RFQ)** o **UC-48 (Enviar Cupón de Fidelización)** no esperan el click de un humano. El "Planificador Autónomo" es la representación del motor de *background jobs* que evalúa constantemente los umbrales de stock mínimo o los cumpleaños de los clientes para disparar acciones sin intervención humana.

## 6. Herencia de Actores
*   **Pregunta del tribunal:** *"El Administrador no tiene flechas a casos críticos como 'Registrar Venta', ¿significa que el dueño no puede cobrar?"*
*   **Defensa:** Sí puede. Como se observa en los diagramas, el actor `Administrador` tiene flechas de **generalización (herencia)** apuntando al `Cajero` y al `Encargado de Depósito`. Esto significa que el Administrador hereda *todos* los casos de uso de esos roles, sumándole además sus casos de uso exclusivos (como Anular Venta o dar de Baja). Esto simplifica el diagrama y representa fielmente cómo los permisos de sistema se acumulan de forma jerárquica.

---
**Tip para la Defensa:** Si te acorralan con la complejidad del sistema de stock, aferrate siempre al par **UC-15/UC-16**; explicar la diferencia entre la fórmula (receta) y la ejecución de la misma demuestra un dominio técnico y funcional avanzado.
