export class CashRegisterPage {
    visit() {
        cy.visit('/admin/cash-register');
        cy.get('.container-fluid', { timeout: 10000 }).should('exist');
    }

    openRegister(amount) {
        cy.intercept('POST', '/admin/cash-register').as('openRegisterReq');
        cy.contains('button', 'Abrir Caja').click();
        cy.get('input#opening_amount', { timeout: 5000 }).should('be.visible').clear().type(String(amount));
        cy.get('.drawer-footer').contains('button', 'Abrir Caja').click();
        return cy.wait('@openRegisterReq');
    }

    registerManualMovement(type, amount, description) {
        cy.intercept('POST', '/admin/cash-register/*/movement').as('movementReq');
        cy.contains('button', 'Movimiento Manual').click();
        cy.get('select#mov_type', { timeout: 5000 }).should('be.visible').select(type);
        cy.get('input#mov_amount').clear().type(String(amount));
        cy.get('textarea#mov_description').clear().type(description);
        cy.get('.drawer-panel.open .drawer-footer').contains('button', 'Guardar Movimiento').click();
        return cy.wait('@movementReq');
    }

    openCloseDrawer() {
        cy.contains('button', 'Cerrar Caja').click();
        cy.get('input#closing_amount', { timeout: 5000 }).should('be.visible');
    }

    closeRegisterBlindly(amount) {
        cy.intercept('POST', '/admin/cash-register/*/close').as('closeRegisterReq');
        this.openCloseDrawer();
        cy.contains('Arqueo con Cierre Ciego').should('exist');
        cy.get('#closeRegisterForm').should('not.contain', 'Saldo Esperado');
        cy.get('input#closing_amount').type(String(amount));
        cy.get('.drawer-footer').contains('button', 'Confirmar Cierre').click();
        return cy.wait('@closeRegisterReq');
    }
}
