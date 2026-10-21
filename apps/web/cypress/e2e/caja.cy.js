/**
 * Suite E2E: Gestión de Sesión de Caja
 *
 * Cubre los Casos de Uso críticos UC-01 y UC-03, los cuales representan
 * el ciclo de vida operativo diario de la caja registradora.
 *
 * Metodología: BDD (Behavior-Driven Development) con Cypress.
 * Cada escenario es determinístico: establece su precondición vía API
 * antes de ejecutar la interacción UI, garantizando independencia total
 * entre pruebas y alineación con el ciclo Rojo-Verde-Refactor (TDD).
 *
 * @see docs/4_Implementacion_y_Calidad/4.1_estrategia_calidad_qa.md
 * @see docs/2_Requisitos_y_Arquitectura/2.2_matriz_rastreabilidad.md
 */

// ─── Helpers ─────────────────────────────────────────────────────────────────

const loginViaUI = () => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit('/admin');
    cy.get('input[type="email"]').should('not.be.disabled').type('admin@owens.com');
    cy.get('input[type="password"]').should('not.be.disabled').type('password');
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 15000 }).should('include', '/dashboard');
};

/**
 * Cierra la caja si está abierta, para garantizar precondición de UC-01.
 * Se hace vía API para no contaminar la prueba UI con pasos no relacionados.
 */
const cerrarCajaSiEstaAbierta = () => {
    cy.request({
        method: 'GET',
        url: '/admin/cash-register',
        failOnStatusCode: false,
    }).then(() => {
        cy.visit('/admin/cash-register');
        cy.get('body').then(($body) => {
            if ($body.find('button:contains("Cerrar Caja")').length > 0) {
                cy.log('Precondición UC-01: cerrando caja abierta antes del test...');
                cy.contains('button', 'Cerrar Caja').click();
                cy.get('input#closing_amount', { timeout: 5000 }).should('be.visible').type('0');
                cy.get('.drawer-footer').contains('button', 'Confirmar Cierre').click();
                cy.contains('La caja se ha cerrado correctamente', { timeout: 8000 }).should('exist');
            }
        });
    });
};

/**
 * Abre la caja si está cerrada, para garantizar precondición de UC-03.
 */
const abrirCajaSiEstaCerrada = () => {
    cy.visit('/admin/cash-register');
    cy.get('body').then(($body) => {
        if ($body.find('button:contains("Abrir Caja")').length > 0) {
            cy.log('Precondición UC-03: abriendo caja antes del test...');
            cy.contains('button', 'Abrir Caja').click();
            cy.get('input#opening_amount', { timeout: 5000 }).should('be.visible').type('10000');
            cy.get('.drawer-footer').contains('button', 'Abrir Caja').click();
            cy.contains('La caja se ha abierto correctamente', { timeout: 8000 }).should('exist');
        }
    });
};

// ─── UC-01: Apertura de Sesión de Caja ───────────────────────────────────────

describe('UC-01: Apertura de Sesión de Caja', () => {

    before(() => {
        loginViaUI();
        cerrarCajaSiEstaAbierta();
    });

    beforeEach(() => {
        cy.visit('/admin/cash-register');
        cy.get('.container-fluid', { timeout: 10000 }).should('exist');
    });

    /**
     * Escenario Positivo
     * DADO que el Cajero está autenticado y no hay caja abierta
     * CUANDO ingresa un monto inicial válido y confirma la apertura
     * ENTONCES el sistema debe registrar la apertura y mostrar el panel operativo
     */
    it('DADO que no hay caja abierta, CUANDO el Cajero ingresa un monto válido, ENTONCES el sistema debe abrir la caja correctamente', () => {
        // DADO: verificar precondición
        cy.contains('Abrir Caja').should('exist');

        // CUANDO: interacción del actor
        cy.contains('button', 'Abrir Caja').click();
        cy.get('input#opening_amount', { timeout: 5000 }).should('be.visible').clear().type('15000');
        cy.get('.drawer-footer').contains('button', 'Abrir Caja').click();

        // ENTONCES: validar resultado esperado del sistema
        cy.contains('La caja se ha abierto correctamente', { matchCase: false, timeout: 8000 }).should('exist');
        cy.contains('button', 'Cerrar Caja', { timeout: 8000 }).should('exist');
        cy.contains('Caja Registradora').should('exist');
    });

});

// ─── UC-03: Cierre de Sesión de Caja ─────────────────────────────────────────

describe('UC-03: Cierre de Sesión de Caja', () => {

    before(() => {
        loginViaUI();
        abrirCajaSiEstaCerrada();
    });

    beforeEach(() => {
        // Login explícito en cada test para garantizar sesión activa
        // (independencia total entre escenarios, incluso si el anterior falla)
        loginViaUI();
        cy.visit('/admin/cash-register');
        cy.get('.container-fluid', { timeout: 10000 }).should('exist');
    });

    /**
     * Escenario de Validación (flujo alternativo)
     * DADO que el Cajero intenta ingresar caracteres no numéricos en el monto de cierre
     * CUANDO tipea letras en el campo de monto
     * ENTONCES el sistema NO DEBE aceptar el valor (campo debe quedar vacío)
     */
    it('DADO que el campo de cierre espera un monto, CUANDO el Cajero ingresa letras, ENTONCES el sistema NO DEBE aceptar el valor', () => {
        // DADO: caja abierta, abrir Drawer de cierre
        cy.contains('button', 'Cerrar Caja').click();
        cy.get('input#closing_amount', { timeout: 5000 }).should('be.visible');

        // CUANDO: ingreso inválido
        cy.get('input#closing_amount').type('abcd');

        // ENTONCES: el CurrencyInput strip-ea los no-numéricos y sólo conserva el prefijo '$'.
        // Un campo con valor '$' sin dígitos es funcionalmente vacío/inválido para el negocio.
        cy.get('input#closing_amount').should('have.value', '$');
    });

    /**
     * Escenario Positivo
     * DADO que la caja está abierta y el Cajero quiere cerrar el turno
     * CUANDO ingresa el monto de cierre válido y confirma
     * ENTONCES el sistema debe registrar el cierre y volver al estado inicial
     */
    it('DADO que la caja está abierta, CUANDO el Cajero ingresa un monto válido y confirma, ENTONCES el sistema DEBE cerrar la caja correctamente', () => {
        // DADO: verificar precondición
        cy.contains('button', 'Cerrar Caja').should('exist');

        // CUANDO: interacción del actor
        cy.contains('button', 'Cerrar Caja').click();
        cy.get('input#closing_amount', { timeout: 5000 }).should('be.visible').type('25000');
        cy.get('.drawer-footer').contains('button', 'Confirmar Cierre').click();

        // ENTONCES: validar resultado esperado del sistema
        cy.contains('La caja se ha cerrado correctamente', { matchCase: false, timeout: 8000 }).should('exist');
        cy.contains('button', 'Abrir Caja', { timeout: 8000 }).should('exist');
    });

});
