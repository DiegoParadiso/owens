export class SalesPage {
    visit() {
        cy.visit('/admin/sales');
        cy.contains('button', 'Nueva Venta', { timeout: 10000 }).should('exist');
    }

    openNewSaleDrawer() {
        cy.contains('button', 'Nueva Venta').click();
        cy.get('.drawer-panel.open', { timeout: 5000 }).should('have.class', 'open');
    }

    selectFirstAvailableProduct() {
        return cy.get('.drawer-panel.open select').first().then(($select) => {
            const firstOption = $select.find('option[value!=""]').first();
            expect(firstOption.length, 'Debe existir al menos un producto disponible').to.be.greaterThan(0);
            cy.wrap($select).select(firstOption.val());
            return cy.wrap(firstOption.val());
        });
    }

    submitSaleWithMethod(methodLabel) {
        cy.intercept('POST', '/admin/sales').as('storeSaleReq');
        cy.get('.drawer-panel.open').contains('button', methodLabel).click();
        cy.get('.drawer-footer').contains('button', 'Guardar Venta').click();
        return cy.wait('@storeSaleReq');
    }

    openFirstRowInvoice() {
        cy.get('tbody tr').first().find('button[title="Ver Factura"]').click();
        cy.contains('FACTURA', { timeout: 5000 }).should('be.visible');
    }

    deleteFirstRowSale() {
        cy.intercept('DELETE', '/admin/sales/*').as('deleteSaleReq');
        cy.get('tbody tr').first().find('button[title="Eliminar"]').click();
        cy.confirmOwensModal('Eliminar');
        return cy.wait('@deleteSaleReq');
    }
}
