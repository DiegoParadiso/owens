# 1. Planteo del Problema

## 1.1.1 Introducción
El presente proyecto tiene por objetivo el desarrollo e implementación de "Owens", un sistema web integral de gestión y facturación diseñado específicamente para una hamburguesería que opera bajo el modelo de atención rápida por mostrador (Fast-Food). Actualmente, los locales gastronómicos de este rubro enfrentan el desafío de mantener la trazabilidad entre lo que compran, lo que producen y lo que venden, lidiando frecuentemente con procesos manuales, mermas de inventario y cargas administrativas duplicadas tanto operativas como fiscales. La meta de este proyecto consiste en centralizar toda la información del local en una única plataforma robusta, desarrollada con Laravel 11, React 19 y PostgreSQL. Esto permitirá automatizar el descuento de inventario a través de un sistema de recetas, gestionar compras de forma digital y agilizar la toma de decisiones mediante procesos inteligentes y reportes estadísticos. 

Específicamente, el sistema cuenta con tres procesos automatizados de fondo que aportan valor agregado sin intervención humana: generación automática de solicitudes de cotización en PDF enviadas a proveedores, envío de cupones de fidelización vía WhatsApp a clientes inactivos, y la autorización fiscal automática en tiempo real mediante integración con AFIP.

## 1.1. El crecimiento comercial y la crisis operativa en Posadas (Misiones)
El presente proyecto nace a partir de una necesidad real y concreta del establecimiento gastronómico "Owens", ubicado en la ciudad de Posadas, provincia de Misiones. Tras experimentar un crecimiento comercial acelerado, el volumen de pedidos diarios superó la capacidad de su infraestructura organizativa inicial.
La desconexión entre el Punto de Venta (POS) y el área de cocina comenzó a generar cuellos de botella, errores en el armado de los pedidos e insatisfacción de los clientes. Asimismo, el descontrol en la merma de ingredientes dejó en evidencia la falta de una "Ingeniería de Menú" automatizada, impidiendo conocer el inventario real y afectando directamente la rentabilidad del negocio.

## 1.2. Las barreras del software "enlatado"
Ante esta crisis operativa, el cliente evaluó soluciones genéricas en la nube (ej. *OlaClick*). Sin embargo, estas alternativas presentaron fuertes barreras de adopción:
*   **Modelo de Suscripción Limitante:** El esquema de pago constante obliga al cliente a atarse a planes predefinidos que restringen funcionalidades clave a medida que el negocio escala, impidiendo la soberanía tecnológica.
*   **Falta de Integración Fiscal (AFIP):** Al ser plataformas globales, carecen de conexión nativa con los Web Services de Argentina (WSFEv1), forzando al personal a una doble carga manual para emitir tickets legales.
*   **Control de Inventario Superficial:** Si bien resuelven la toma de pedidos, no soportan la "Ingeniería de Menú" profunda (explosión recursiva de recetas) necesaria para auditar con exactitud las mermas de materias primas.

## 1.3. La necesidad de una solución a medida, integral y proactiva
A raíz de estas limitaciones, surge la necesidad ineludible de desarrollar un Sistema de Gestión Gastronómica a medida. El establecimiento requiere una plataforma de su absoluta propiedad que no solo elimine los costos de suscripción, sino que unifique el ciclo comercial completo: registrando transacciones a alta velocidad, interactuando con la entidad fiscal de forma nativa, y operando de manera inteligente en segundo plano mediante automatizaciones de reabastecimiento y fidelización que los sistemas genéricos no ofrecen.

Adicionalmente, el modelo de negocios de Owens proyecta una expansión comercial a mediano plazo bajo el formato de **franquicias**. Por este motivo, el sistema se diseña desde sus cimientos siguiendo estándares corporativos e implementando una estricta "Ingeniería de Menús" (explosión de recetas), garantizando que el control de mermas y la operativa financiera puedan replicarse y auditarse con precisión milimétrica en múltiples sucursales futuras.
