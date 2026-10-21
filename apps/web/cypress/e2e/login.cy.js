/**
 * Suite E2E: Autenticación de Usuarios
 *
 * Cubre UC-36 — Flujos de autenticación positivo y negativo.
 *
 * Metodología: BDD (Behavior-Driven Development) con Cypress.
 * Escenarios expresados en lenguaje Dado/Cuando/Entonces para
 * alineación directa con los Casos de Uso documentados (SDD).
 *
 * @see docs/4_Implementacion_y_Calidad/4.1_estrategia_calidad_qa.md
 */

describe('UC-36: Autenticación de Usuarios', () => {

    const urlAdmin = '/admin';
    const emailAdmin = 'admin@owens.com';
    const password = 'password';

    beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
    });

    /**
     * Escenario Negativo
     * DADO que un usuario intenta ingresar al sistema
     * CUANDO ingresa credenciales inválidas
     * ENTONCES el sistema NO DEBE conceder acceso y DEBE mantenerlo en el login
     */
    it('DADO que el usuario ingresa credenciales inválidas, CUANDO intenta autenticarse, ENTONCES el sistema NO DEBE conceder acceso al dashboard', () => {
        // DADO
        cy.visit(urlAdmin);

        // CUANDO
        cy.get('input[type="email"]').type('falso@owens.com');
        cy.get('input[type="password"]').type('123456');
        cy.get('button[type="submit"]').click();

        // ENTONCES
        cy.url({ timeout: 10000 }).should('include', '/admin');
        cy.url().should('not.include', '/dashboard');
    });

    /**
     * Escenario Positivo — Actor: Administrador
     * DADO que el Administrador tiene credenciales válidas
     * CUANDO las ingresa en el formulario de login
     * ENTONCES el sistema DEBE redirigirlo al dashboard y mostrar las opciones de administración
     */
    it('DADO que el Administrador tiene credenciales válidas, CUANDO se autentica, ENTONCES el sistema DEBE redirigirlo al dashboard con acceso completo', () => {
        // DADO
        cy.visit(urlAdmin);

        // CUANDO
        cy.get('input[type="email"]').should('not.be.disabled').type(emailAdmin);
        cy.get('input[type="password"]').should('not.be.disabled').type(password);
        cy.get('button[type="submit"]').click();

        // ENTONCES: Inertia debe terminar de cargar y mostrar el Dashboard con opciones de admin
        cy.url({ timeout: 15000 }).should('include', '/dashboard');
        cy.contains('Configuración', { timeout: 10000 }).should('exist');
        cy.contains('Reportes').should('exist');
    });

});
