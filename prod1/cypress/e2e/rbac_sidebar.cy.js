/**
 * Suite E2E: Control de Acceso Basado en Roles (RBAC) — Menú Lateral
 *
 * Cubre UC-36 — Hermetismo de la interfaz según el rol del actor autenticado.
 *
 * Metodología: TDD (ciclo Rojo-Verde-Refactor) + BDD con Cypress.
 * Cada escenario valida que el sistema filtre correctamente las opciones del
 * sidebar de acuerdo al rol, aplicando el principio de mínimo privilegio.
 *
 * @see docs/4_Implementacion_y_Calidad/4.1_estrategia_calidad_qa.md
 * @see docs/2_Requisitos_y_Arquitectura/defensa_casos_de_uso.md (sección RBAC)
 */

describe('UC-36: RBAC — Hermetismo de Opciones del Menú Lateral', () => {

    /**
     * Helper: autentica con un rol dado, verifica opciones del sidebar y hace logout.
     * Centraliza la lógica de login/logout para mantener cada it() enfocado
     * en el comportamiento observable del sistema (principio BDD).
     */
    const verificarAccesoSidebar = (email, opcionesVisibles, opcionesOcultas) => {
        cy.clearCookies();
        cy.clearLocalStorage();

        cy.visit('/admin');
        cy.get('input[type="email"]').should('not.be.disabled').type(email);
        cy.get('input[type="password"]').should('not.be.disabled').type('password');
        cy.get('button[type="submit"]').click();

        cy.url({ timeout: 10000 }).should('not.match', /\/admin$/);
        cy.get('.sidebar', { timeout: 10000 }).should('be.visible');

        // ENTONCES: opciones que el rol SÍ DEBE ver
        opcionesVisibles.forEach(opcion => {
            cy.get('.sidebar').contains(opcion, { matchCase: false }).should('exist');
        });

        // ENTONCES: opciones que el rol NO DEBE ver
        opcionesOcultas.forEach(opcion => {
            cy.get('.sidebar').contains(opcion, { matchCase: false }).should('not.exist');
        });

        cy.get('.sidebar').contains('Cerrar Sesión', { matchCase: false }).click();
        cy.url({ timeout: 10000 }).should('match', /\/admin$/);
    };

    /**
     * Escenario — Actor: Administrador
     * DADO que el Administrador se autentica en el sistema
     * CUANDO el sidebar se renderiza
     * ENTONCES el sistema DEBE mostrar todas las secciones disponibles sin restricción
     */
    it('DADO que el Administrador está autenticado, CUANDO accede al sistema, ENTONCES el sidebar DEBE mostrar todas las opciones de gestión', () => {
        const opcionesEsperadas = [
            'Dashboard', 'Caja', 'Inventario', 'Menú',
            'Ventas', 'Clientes', 'Cocina', 'Finanzas',
            'Reportes', 'Personal', 'Configuración'
        ];
        verificarAccesoSidebar('admin@owens.com', opcionesEsperadas, []);
    });

    /**
     * Escenario — Actor: Cajero
     * DADO que el Cajero (rol de menor privilegio operativo) se autentica
     * CUANDO el sidebar se renderiza
     * ENTONCES el sistema DEBE mostrar solo las secciones operativas de su rol
     * y NO DEBE exponer módulos de gerencia, inventario ni configuración
     */
    it('DADO que el Cajero está autenticado, CUANDO accede al sistema, ENTONCES el sidebar NO DEBE mostrar módulos de gerencia ni configuración', () => {
        const opcionesVisibles = ['Caja', 'Menú', 'Ventas', 'Clientes'];
        const opcionesOcultas = [
            'Dashboard', 'Inventario', 'Cocina',
            'Finanzas', 'Reportes', 'Personal', 'Configuración'
        ];
        verificarAccesoSidebar('cajero@owens.com', opcionesVisibles, opcionesOcultas);
    });

    /**
     * Escenario — Actor: Cocinero
     * DADO que el Cocinero (rol exclusivamente operativo de cocina) se autentica
     * CUANDO el sidebar se renderiza
     * ENTONCES el sistema DEBE mostrar solo el panel de Cocina
     * y NO DEBE exponer módulos financieros, de inventario ni administrativos
     */
    it('DADO que el Cocinero está autenticado, CUANDO accede al sistema, ENTONCES el sidebar DEBE mostrar solo el módulo de Cocina y ocultar los módulos administrativos', () => {
        const opcionesVisibles = ['Cocina'];
        const opcionesOcultas = [
            'Dashboard', 'Caja', 'Inventario', 'Finanzas',
            'Reportes', 'Personal', 'Configuración'
        ];
        verificarAccesoSidebar('cocinero@owens.com', opcionesVisibles, opcionesOcultas);
    });

});
