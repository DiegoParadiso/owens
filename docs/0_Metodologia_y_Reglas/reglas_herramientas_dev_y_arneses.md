# Reglas Arquitectónicas para Herramientas de Desarrollo y Arneses Aislados (`/dev`)

## 1. Propósito y Filosofía
Este documento establece el estándar técnico para el diseño, organización y automatización de **Arneses de Desarrollo Aislados (*Development Harnesses*)**. 

El objetivo es proveer entornos locales donde probar, previsualizar y capturar componentes críticos (alertas, formatos de impresión, estados límite) **sin ensuciar las vistas de producción, sin registrar datos basura en la base de datos y sin depender de servicios externos**.

Estas reglas son **agnósticas** y están diseñadas para ser transferidas e implementadas en cualquier stack tecnológico (Laravel + Inertia, Next.js, Vite + React, etc.).

---

## 2. Separación por Intención Técnica

Para evitar componentes monolíticos y páginas de prueba inmanejables, las herramientas de desarrollo se segregan estrictamente por su dominio funcional:

```
/dev/
├── retroalimentaciones/   --> Toasts, alertas y modales de confirmación (Feedback UI)
├── ticket/                --> Formato térmico de comandas e impresión física (80mm / 58mm)
├── tokens/                --> Identidad visual, paleta institucional y tipografías
├── estados/               --> Edge cases, tablas vacías (empty states) y skeleton loaders
└── mocks/                 --> Simuladores de webhooks y servicios externos (AFIP, Pasarelas de Pago)
```

### Especificación de cada herramienta:

1. **`/dev/retroalimentaciones` (Feedback UI)**
   - **Alcance:** Renderizado y prueba en vivo de los componentes de notificación:
     - `Toast` (Éxito, Error de Validación, Inconsistencia de Negocio, Advertencia).
     - `ConfirmDialog` (Confirmación transaccional y ratificación de baja lógica).
   - **Uso dual:** 
     - *Modo interactivo:* Disparo de alertas y modales mediante clics para QA visual a 60 FPS nativos.
     - *Modo aislado (`?component=X&static=1`):* Renderizado aislado de un componente individual en reposo para capturas automáticas de alta resolución.

2. **`/dev/ticket` (Formato Térmico e Impresión)**
   - **Alcance:** Previsualización exacta de comprobantes de comanda y tickets fiscales:
     - Anchuras fijas de papel térmico continuo (80 mm y 58 mm).
     - Tipografía monospace, contrastes puros en blanco y negro (sin gradientes ni sombras).
     - Pruebas de desbordamiento de texto, ítems múltiples, descuentos y códigos QR.
     - Botón de disparo `window.print()` para calibración de corte y márgenes sin gastar consumibles físicos.

3. **`/dev/tokens` (Identidad Visual y Paleta)**
   - **Alcance:** Muestrario de los cimientos del sistema de diseño (*Design Tokens*):
     - Muestras de color con códigos HEX, RGB y variables CSS (`var(--bg-card)`, `var(--primary)`).
     - Escala tipográfica institucional (`fontSize`, `fontWeight`, `lineHeight`).
     - Íconos oficiales del sistema.
   - **Propósito documental:** Exportar figuras nítidas para el capítulo de diseño de la memoria técnica.

4. **`/dev/estados` (Edge Cases & Empty States)**
   - **Alcance:** Inspección de componentes en estados difíciles de reproducir en producción:
     - Grillas vacías (*"No se encontraron ventas para este turno"* + ilustración).
     - Estados de carga (*Skeleton Loaders* con shimmer).
     - Estado sin conexión a internet (*Offline Mode* para terminales de caja).

5. **`/dev/mocks` (Simulación de Integraciones)**
   - **Alcance:** Pruebas de dependencias externas sin consumir cuotas de API ni requerir túneles públicos:
     - Webhook entrante de cobro QR (Mercado Pago / Clover).
     - Respuesta simulada del Web Service de Facturación Electrónica (AFIP WSFE).

---

## 3. Aplicación del Principio YAGNI (*You Aren't Gonna Need It*)

> **Regla de oro:** No crear rutas ni páginas vacías de forma anticipada.

1. **Estado actual en Owens:**
   - La ruta `/dev/retroalimentaciones` resuelve el 100% de la retroalimentación visual del sistema, permitiendo desinstalar librerías externas pesadas (`sweetalert2`) y alimentar tanto los módulos reales como las capturas documentales.
   - Es autónoma, limpia y cumple exactamente su objetivo actual.

2. **Criterio de activación futura:**
   - La ruta `/dev/ticket` se creará **únicamente cuando se maquete el módulo de impresión de comandas**.
   - La ruta `/dev/tokens` se creará **únicamente si la cátedra o el cliente exige una lámina formal de paleta cromática**.
   - Tener este mapa arquitectónico claro permite saber de antemano el lugar exacto donde construir cada herramienta sin improvisar.

---

## 4. Regla de Aislamiento y Seguridad en Producción

Las rutas bajo el prefijo `/dev` son herramientas técnicas internas y **bajo ninguna circunstancia deben ser accesibles en un entorno de producción**.

### Implementación en Laravel (`routes/web.php`):
```php
if (app()->environment('local', 'testing')) {
    Route::prefix('dev')->name('dev.')->group(function () {
        Route::get('/retroalimentaciones', function () {
            return Inertia::render('Dev/RetroalimentacionesShowcase');
        })->name('retroalimentaciones');
        
        // Rutas técnicas adicionales se incorporan aquí bajo demanda
    });
}
```

En cualquier entorno productivo (`production`), cualquier petición a `/dev/*` responderá de inmediato con un código `404 Not Found` nativo.

---

## 5. Criterio de Automatización: Evitar la Sobreingeniería ("Automatitis")

La industria equilibra la automatización frente al costo de mantenimiento siguiendo tres directivas:

1. **La Verdad Documental es Estática:**
   - Para memorias técnicas, manuales y normas académicas (APA 7), las figuras requeridas son **capturas estáticas deterministas en reposo (100% de opacidad y escala final)**.
   - Los documentos formales se exportan a PDF o se imprimen; los formatos animados (GIF, WebP animado) no tienen soporte en estándares de preservación como PDF/A.

2. **No Simular Video con Chrome Headless:**
   - La captura secuencial de cuadros mediante tiempos de espera artificiales (`--virtual-time-budget`) genera animaciones entrecortadas (5 FPS) que no reflejan los 60 FPS reales de la aplicación y resultan altamente frágiles ante fluctuaciones de CPU.
   - Las animaciones vivas se validan en el **Dev Playground interactivo** o se registran en video nativo con herramientas especializadas (Playwright Video, CleanShot, QuickTime).

3. **Consistencia de Movimiento (*Motion Language*):**
   - Todos los componentes de una misma categoría (ej. Toasts) deben compartir la misma física de entrada y salida (tiempo y curva Bézier).
   - Lo que varía entre alertas es su **semántica** (icono, color de acento, mensaje de negocio), nunca su coreografía de movimiento.

---

## 6. Checklist de Implementación para Nuevos Proyectos

Para replicar esta arquitectura en cualquier nuevo proyecto:

- [ ] **Paso 1:** Crear el namespace `/dev` condicionado al entorno local (`APP_ENV=local`).
- [ ] **Paso 2:** Diseñar componentes UI atómicos agnósticos (`Toast.jsx`, `ConfirmDialog.jsx`) que reciban variantes tipificadas (`danger`, `warning`, `info`).
- [ ] **Paso 3:** Exponer un proveedor/contexto global (`ToastContext`, `ConfirmContext`) para invocar las alertas desde cualquier controlador o vista sin duplicar código.
- [ ] **Paso 4:** Montar la vista técnica `/dev/{herramienta}` con botones de prueba directa y modo aislado (`?component=X&static=1`).
- [ ] **Paso 5:** Escribir un script CLI ligero de captura (`capture.cjs`) que utilice Chrome Headless para generar automáticamente los PNGs de la documentación sin intervención manual.
