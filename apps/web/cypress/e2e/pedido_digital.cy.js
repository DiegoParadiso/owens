/**
 * Suite E2E: Canal Público de Autoservicio Web (UC-49: Generar Pedido Digital)
 * Método: Stubbing de navegación externa (window.open) + Validación de payload URL.
 */

describe('UC-49: Generar Pedido Digital (Autoservicio Web)', () => {
    it('DADO el menú digital público, CUANDO arma una hamburguesa doble con extras y envío a domicilio, ENTONCES genera el enlace de despacho con los datos ingresados', () => {
        cy.visit('/hacer-pedido', {
            onBeforeLoad(win) {
                cy.stub(win, 'open').as('windowOpen');
            },
        });

        cy.contains('ELEGÍ TU HAMBURGUESA', { timeout: 10000 }).should('exist');

        cy.contains('button.size-btn', 'Doble').click().should('have.class', 'active');
        cy.contains('button.extra-btn', '+ Extra Bacon').click();
        cy.contains('button.extra-btn', '+ Extra Bacon').should('contain', '(1)');

        cy.contains('button.option-btn', 'Envío a Domicilio').click();
        cy.get('input[placeholder*="dirección"]').should('be.visible').type('Av. San Martín 450');
        cy.contains('button.option-btn', 'Efectivo').should('be.disabled');

        cy.get('button.fab-add').click();
        cy.get('.cart-modal-overlay', { timeout: 5000 }).should('be.visible');
        cy.get('.cart-count').should('contain', '1');

        cy.get('button.place-order-btn').contains('HACER PEDIDO').click();
        cy.get('@windowOpen').should('have.been.calledOnce');
        cy.get('@windowOpen').its('firstCall.args.0').should('include', 'api.whatsapp.com/send')
            .and('include', 'Doble')
            .and('include', 'Av.%20San%20Mart');
    });
});
