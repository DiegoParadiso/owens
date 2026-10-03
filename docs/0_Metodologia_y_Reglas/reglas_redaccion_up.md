# Reglas de Redacción para Casos de Uso (Metodología UP)

> [!NOTE]
> **Fuente de Datos:** Este documento se basa en los estándares formales de Ingeniería de Software (Metodología de Proceso Unificado - UP) y se nutre directamente de la arquitectura de actores definida en `actores_definitivos.md`.

Este documento establece las normativas de estilo para la redacción de Casos de Uso, Objetivos y Diagramas, garantizando que el diseño respete las buenas prácticas de Ingeniería de Software (Metodología UP).

## 1. Prohibición de Jerga Técnica
Los Casos de Uso son documentos orientados a **stakeholders del negocio** (gerentes, clientes, auditores), por lo tanto, no deben revelar detalles de implementación a nivel de código.

*   **INCORRECTO:** "El proceso hace una consulta SQL a la base de datos", "El sistema se conecta mediante un Webhook a la API de WhatsApp", "Se ejecuta un Cronjob para enviar por SMTP".
*   **CORRECTO:** "El sistema verifica el registro histórico", "El sistema despacha un mensaje a través de la plataforma de mensajería externa", "El proceso autónomo envía una alerta al servicio de correo".

## 2. Denominación de Actores Externos
Cualquier sistema externo que interactúe con el nuestro de forma autónoma debe tratarse como un **Actor**. Sus nombres deben ser formales y funcionales:
*   En lugar de "Cron", usar **Planificador**.
*   En lugar de "SMTP", usar **Servicio de Correo**.
*   En lugar de "API WhatsApp", usar **Plataforma de Mensajería (Externa)**.
*   En lugar de "AFIP WS", usar **Entidad Fiscal (AFIP)**.

## 3. Lógica de Negocio en Precondiciones
Las condiciones del entorno físico y operativo deben plasmarse en las Precondiciones para evitar inconsistencias en el mundo real.
*   *Ejemplo:* Si se va a enviar una promoción al cliente, validar no solo la "inactividad", sino también que "El establecimiento se encuentre operando actualmente (Sesión de Caja Abierta)".

## 4. Herencia de Actores (Diagramas UML)
Para evitar diagramas complejos (telarañas), se debe utilizar el concepto de Herencia (`<|--`).
*   Si el Administrador puede hacer lo mismo que el Cajero, se dibuja una flecha de herencia desde el Administrador hacia el Cajero, y solo el Cajero se conecta a los Casos de Uso operativos. Esto mantiene los diagramas limpios y profesionales.
