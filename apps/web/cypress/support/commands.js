/**
 * Custom Commands oficiales de Cypress para Owens System.
 */

Cypress.Commands.add('loginAsAdmin', () => {
    cy.session('admin-session', () => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.visit('/admin');
        cy.get('input[type="email"]').should('not.be.disabled').type('admin@owens.com');
        cy.get('input[type="password"]').should('not.be.disabled').type('password');
        cy.get('button[type="submit"]').click();
        cy.url({ timeout: 15000 }).should('include', '/dashboard');
    });
});

Cypress.Commands.add('ensureCashRegisterOpen', () => {
    cy.visit('/admin/cash-register');
    cy.get('body').then(($body) => {
        if ($body.find('button:contains("Abrir Caja")').length > 0) {
            cy.intercept('POST', '/admin/cash-register').as('openRegister');
            cy.contains('button', 'Abrir Caja').click();
            cy.get('input#opening_amount', { timeout: 5000 }).should('be.visible').type('10000');
            cy.get('.drawer-footer').contains('button', 'Abrir Caja').click();
            cy.wait('@openRegister').its('response.statusCode').should('be.oneOf', [200, 302, 303]);
            cy.contains('La caja se ha abierto correctamente', { timeout: 8000 }).should('exist');
        }
    });
});

Cypress.Commands.add('ensureCashRegisterClosed', () => {
    cy.visit('/admin/cash-register');
    cy.get('body').then(($body) => {
        if ($body.find('button:contains("Cerrar Caja")').length > 0) {
            cy.intercept('POST', '/admin/cash-register/*/close').as('closeRegister');
            cy.contains('button', 'Cerrar Caja').click();
            cy.get('input#closing_amount', { timeout: 5000 }).should('be.visible').type('0');
            cy.get('.drawer-footer').contains('button', 'Confirmar Cierre').click();
            cy.wait('@closeRegister').its('response.statusCode').should('be.oneOf', [200, 302, 303]);
            cy.contains('button', 'Abrir Caja', { timeout: 8000 }).should('exist');
        }
    });
});

Cypress.Commands.add('confirmOwensModal', (buttonText) => {
    cy.get('#owens-confirm-modal', { timeout: 5000 }).should('be.visible');
    cy.get('#owens-confirm-modal').contains('button', buttonText).click();
});
