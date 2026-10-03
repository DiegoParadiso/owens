# 4. Especificación de Subsistemas

## 4.1. Subsistemas Funcionales
El sistema Owens se encuentra dividido lógicamente en cinco grandes áreas funcionales que se comunican entre sí manteniendo una alta cohesión:

1.  **Subsistema de Operaciones y Ventas:** Encargado del núcleo transaccional. Gestiona las sesiones de caja, el catálogo al público y el registro de ventas (POS), interactuando con las pantallas de cocina (KDS).
2.  **Subsistema de Logística e Inventario:** Responsable del *Back-Office*. Maneja las compras a proveedores, los ajustes manuales de stock y la lógica matemática de la explosión de recetas.
3.  **Subsistema de Gerencia y Contabilidad:** Engloba la generación de reportes, tableros estadísticos, gestión de gastos operativos y configuración de parámetros del negocio.
4.  **Subsistema de Seguridad y Auditoría:** Su núcleo es la protección de los datos. Permite crear roles dinámicos (RBAC), gestionar los empleados, respaldar información (backups) y efectuar el seguimiento de eventos (pistas de auditoría).
5.  **Subsistema de Interfaces Externas:** Agrupa los servicios que se comunican con entidades ajenas al sistema (AFIP, Servidores de Correo, Plataformas de Mensajería Externa) y los procesos inteligentes programados.

# 5. Descripción de los Subsistemas

## 5.1. Subsistema de Operaciones y Ventas
Este módulo permite la apertura de la sesión comercial diaria. Soporta una alta concurrencia para el cobro rápido en mostrador. Incluye los casos de uso Críticos: Registrar Venta, Modificar Cliente, y Visualizar Comandas para la preparación inmediata.

## 5.2. Subsistema de Logística e Inventario
Administra todo lo que ocurre "detrás de escena". Permite dar de alta las materias primas, definir el factor de conversión métrico de las mismas y ensamblar "Recetas" (ej. una hamburguesa se compone de 1 pan, 150g de carne y 20g de aderezo). Registra los comprobantes de ingreso de mercadería para mantener el inventario al día.

## 5.3. Subsistema de Gerencia y Contabilidad
Se enfoca en el análisis financiero. Procesa los datos brutos de ventas para renderizar gráficos de rentabilidad e histórico de demanda para la toma de decisiones gerenciales, permitiendo además imputar gastos operativos fijos.

## 5.4. Subsistema de Seguridad y Auditoría
Garantiza que ninguna transacción financiera pueda ser vulnerada. Centraliza la administración de usuarios, asigna credenciales y asegura el rastro inmutable (Audit Trail) de todas las operaciones críticas.

## 5.5. Subsistema de Interfaces Externas
Gestiona la interoperabilidad. Actúa como adaptador (Adapter Pattern) para consumir APIs RESTful o servicios SOAP (como el de AFIP) mediante conexiones seguras HTTPS. Asimismo, alberga el "Cerebro" del planificador de tareas para los módulos inteligentes, garantizando que el sistema trabaje de manera asíncrona.
