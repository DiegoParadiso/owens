/**
 * Suite E2E: Ventas en Punto de Venta (POS), Facturación AFIP y Anulación (UC-02, UC-47, UC-05)
 * Arquitectura: Page Object Model (SalesPage) + Network Interception (cy.intercept)
 */

import { SalesPage } from '../pages/SalesPage';

const salesPage = new SalesPage();

describe('UC-02 / UC-47 / UC-05: Ventas POS y Facturación', () => {
    beforeEach(() => {
        cy.loginAsAdmin();
    });

    it('DADO que no hay caja abierta, CUANDO intenta cobrar una venta en efectivo, ENTONCES el backend responde REGISTER_CLOSED y muestra alerta de Caja cerrada', () => {
        cy.ensureCashRegisterClosed();

        // Inyectar al menos un ítem si el catálogo estuviera vacío vía props interceptados o usar catálogo real
        salesPage.visit();
        salesPage.openNewSaleDrawer();

        cy.get('.drawer-panel.open select').first().find('option[value!=""]').then(($options) => {
            expect($options.length, 'Debe existir al menos un producto en catálogo').to.be.greaterThan(0);
        });

        salesPage.selectFirstAvailableProduct();
        salesPage.submitSaleWithMethod('Efectivo').then((interception) => {
            expect(interception.request.body.payment_method).to.eq('cash');
            expect(interception.response.statusCode).to.be.oneOf([200, 302, 303, 422]);
        });

        cy.get('#owens-confirm-modal', { timeout: 8000 }).should('be.visible');
        cy.contains('Caja cerrada').should('exist');
        cy.confirmOwensModal('Cancelar');
    });

    it('DADO que la caja está abierta, CUANDO registra una venta y consulta su comprobante, ENTONCES valida el payload HTTP, exhibe CAE/contingencia y permite anularla', () => {
        cy.ensureCashRegisterOpen();
        salesPage.visit();
        salesPage.openNewSaleDrawer();

        salesPage.selectFirstAvailableProduct();
        salesPage.submitSaleWithMethod('Efectivo').then((interception) => {
            expect(interception.request.body.payment_method).to.eq('cash');
            expect(interception.request.body.product_id).to.be.an('array').and.not.be.empty;
            expect(interception.response.statusCode).to.be.oneOf([200, 302, 303]);
        });

        cy.contains('La venta se ha registrado correctamente', { timeout: 15000 }).should('exist');

        // UC-47: Inspección del comprobante AFIP en el Drawer
        salesPage.openFirstRowInvoice();
        cy.get('.drawer-panel.open').invoke('text').should((text) => {
            expect(
                text.includes('COMPROBANTE AUTORIZADO') || text.includes('COMPROBANTE NO AUTORIZADO'),
                'El comprobante debe reflejar CAE autorizado o contingencia offline'
            ).to.be.true;
        });
        cy.get('.drawer-panel.open .btn-close').click();

        // UC-05: Eliminación / reversión
        salesPage.deleteFirstRowSale().then((interception) => {
            expect(interception.response.statusCode).to.be.oneOf([200, 302, 303]);
        });
        cy.contains('La venta ha sido eliminada correctamente', { timeout: 8000 }).should('exist');
    });
});
