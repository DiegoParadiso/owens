# Sistema de Gestión - Hamburguesería "Owens"

Sistema integral de gestión de inventario, producción gastronómica y punto de venta (POS) bajo metodología Proceso Unificado Ágil (AUP).

## Estructura del Repositorio (Arquitectura Modular)

El repositorio sigue un esquema monorepo modular inspirado en estándares de la industria:

```text
owens-system/
├── apps/
│   └── web/                 # Aplicación principal (Laravel 11 + React 19 + Inertia.js)
├── docs/                    # Documentación y memoria técnica formal (Capítulos 1 a 4)
│   ├── 0_Metodologia_y_Reglas/
│   ├── 1_Planificacion/
│   ├── 2_Requisitos_y_Arquitectura/
│   ├── 3_Especificacion_y_Diseno/
│   └── 4_Implementacion_y_Calidad/
├── tools/                   # Scripts de mantenimiento, formateo y utilitarios
├── cypress/                 # Suites de pruebas E2E automatizadas (BDD)
├── archive/                 # Código legado archivado (core-legacy)
└── .github/workflows/       # Integración continua (GitHub Actions CI)
```

## Tecnologías Principales

- Backend: [Laravel 11](https://laravel.com) (PHP ^8.2)
- Frontend: [React 19](https://react.dev)
- Puente SPA: [Inertia.js v2](https://inertiajs.com)
- Estilos: [Tailwind CSS](https://tailwindcss.com) & [Bootstrap 5](https://getbootstrap.com)
- Persistencia: PostgreSQL 16 (Neon Serverless)
- Aseguramiento de Calidad: Cypress (BDD / E2E) & PHPUnit

## Módulos del Sistema

- **Dashboard:** Métricas claves, facturación diaria y alertas.
- **Punto de Venta (POS):** Atención en mostrador, arqueo con cierre ciego y venta offline.
- **Cocina (KDS):** Pantalla interactiva en tiempo real para elaboración de comandas.
- **Recetas e Inventario:** Deducción de materias primas por receta (BOM) y registro de mermas.
- **Compras y RFQ:** Cotización automatizada y recepción de mercadería con remito digital.
- **Fidelización:** Reactivación de clientes inactivos con cupones vía mensajería.
- **Auditoría:** Bitácora inmutable de transacciones críticas del sistema.

## Instalación y Configuración Local

Ingresar a la aplicación web:

```bash
cd apps/web
```

Instalar dependencias de backend y frontend:

```bash
composer install
npm install
```

Configurar variables de entorno y generar clave:

```bash
cp .env.example .env
php artisan key:generate
```

Ejecutar migraciones y datos semilla:

```bash
php artisan migrate --seed
```

Iniciar entorno de desarrollo:

```bash
npm run dev
# En otra terminal:
php artisan serve
```

## Estrategia de Ramas

- `main`: Rama estable de entrega final y producción.
- `dev`: Rama activa de integración y desarrollo.
- `docs`: Rama dedicada a la memoria técnica y artefactos metodológicos.

## Licencia

Software propietario desarrollado para Owens Fast-Food. Todos los derechos reservados.
