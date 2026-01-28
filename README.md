# Sistema de Gestión - Hamburguesería "Owens"

Sistema integral de gestión de inventario, producción y punto de venta (POS).

## Tecnologías

*   **Backend Framework:** [Laravel 11](https://laravel.com) (PHP ^8.2)
*   **Frontend Framework:** [React 19](https://react.dev)
*   **Gestor de Interfaz:** [Inertia.js v2](https://inertiajs.com) (Server-driven UI)
*   **Estilos:** [Tailwind CSS](https://tailwindcss.com) & [Bootstrap 5](https://getbootstrap.com)
*   **Build Tool:** [Vite](https://vitejs.dev)
*   **Base de Datos:** postgreSQL (Neon)
*   **Reportes:** DOMPDF (PDFs) & Chart.js (Gráficos)

## Módulos del Sistema

El sistema cuenta con los siguientes módulos funcionales:

*   **Dashboard**: Resumen general de métricas claves del negocio.
*   **Ventas (POS)**: Punto de venta con gestión de caja y tickets.
*   **Productos e Inventario**: Gestión detallada de stock, categorías y unidades.
*   **Producción**: Control de recetas y transformación de insumos en productos finales.
*   **Compras**: Gestión de proveedores y registro de adquisiciones.
*   **Gastos**: Control de gastos y categorías de gastos.
*   **Reportes**: Generación de reportes detallados y visualización de datos.
*   **Configuración**: Ajustes generales del sistema y gestión de usuarios.

## 🛠️ Requisitos Previos

Asegúrate de tener instalado en tu entorno de desarrollo:

*   PHP >= 8.2
*   Composer
*   Node.js & NPM

## ⚡ Instalación y Configuración

Sigue estos pasos para levantar el proyecto localmente:

1.  **Instalar dependencias de PHP:**
    ```bash
    composer install
    ```

2.  **Instalar dependencias de JavaScript:**
    ```bash
    npm install
    ```

3.  **Configurar variables de entorno:**
    Copia el archivo de ejemplo y configura tu base de datos:
    ```bash
    cp .env.example .env
    ```
    *Edita el archivo `.env` con tus credenciales de base de datos.*

4.  **Generar clave de aplicación:**
    ```bash
    php artisan key:generate
    ```

5.  **Ejecutar migraciones:**
    ```bash
    php artisan migrate
    ```

6.  **Iniciar servidor de desarrollo:**
    ```bash
    composer run dev
    ```
    *O ejecutar manualmente en dos terminales:*
    ```bash
    npm run dev
    php artisan serve
    ```

## Licencia

Este proyecto es software propietario. Todos los derechos reservados.
