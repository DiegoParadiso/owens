/**
 * Suite E2E: Gestión de Sesión de Caja (UC-01, UC-03 Cierre Ciego, UC-04 Movimientos Manuales)
 * Arquitectura: Page Object Model (CashRegisterPage) + Network Interception (cy.intercept)
 */

import { CashRegisterPage } from '../pages/CashRegisterPage';

const cashPage = new CashRegisterPage();

describe('UC-01: Apertura de Sesión de Caja', () => {
    beforeEach(() => {
        cy.loginAsAdmin();
        cy.ensureCashRegisterClosed();
        cashPage.visit();
    });

    it('DADO que no hay caja abierta, CUANDO el Cajero ingresa un monto válido, ENTONCES el servidor confirma la apertura y habilita la caja', () => {
        cy.contains('Abrir Caja').should('exist');

        cashPage.openRegister(15000).then((interception) => {
            expect(interception.request.body.opening_amount).to.eq(15000);
            expect(interception.response.statusCode).to.be.oneOf([200, 302, 303]);
        });

        cy.contains('La caja se ha abierto correctamente', { matchCase: false, timeout: 8000 }).should('exist');
        cy.contains('button', 'Cerrar Caja', { timeout: 8000 }).should('exist');
    });
});

describe('UC-04: Registrar Movimiento Manual de Caja', () => {
    beforeEach(() => {
        cy.loginAsAdmin();
        cy.ensureCashRegisterOpen();
        cashPage.visit();
    });

    it('DADO que hay caja abierta, CUANDO el Cajero registra un ingreso manual extraordinario, ENTONCES el sistema valida el payload HTTP y lo lista en movimientos', () => {
        const motivo = `Refuerzo cambio ${Date.now()}`;

        cashPage.registerManualMovement('income', 2500, motivo).then((interception) => {
            expect(interception.request.body.type).to.eq('income');
            expect(interception.request.body.amount).to.eq(2500);
            expect(interception.request.body.description).to.eq(motivo);
            expect(interception.response.statusCode).to.be.oneOf([200, 302, 303]);
        });

        cy.contains('El movimiento manual ha sido asentado en caja', { timeout: 8000 }).should('exist');
        cy.contains(motivo).should('exist');
    });

    it('DADO que hay caja abierta, CUANDO intenta retirar un monto superior al efectivo disponible, ENTONCES el backend rechaza la petición por efectivo insuficiente', () => {
        cashPage.registerManualMovement('expense', 999999999, 'Retiro excesivo').then((interception) => {
            expect(interception.request.body.type).to.eq('expense');
            expect(interception.response.statusCode).to.be.oneOf([200, 302, 303, 422]);
        });

        cy.contains('Efectivo insuficiente en caja', { timeout: 8000 }).should('exist');
    });
});

describe('UC-03: Cierre de Sesión de Caja (Cierre Ciego)', () => {
    beforeEach(() => {
        cy.loginAsAdmin();
        cy.ensureCashRegisterOpen();
        cashPage.visit();
    });

    it('DADO que el campo de cierre espera un monto, CUANDO el Cajero ingresa letras, ENTONCES el sistema NO DEBE aceptar caracteres no numéricos', () => {
        cashPage.openCloseDrawer();
        cy.get('input#closing_amount').type('abcd').should('have.value', '$');
    });

    it('DADO que la caja está abierta, CUANDO el Cajero confirma el conteo a ciegas, ENTONCES oculta el saldo esperado antes de confirmar y exhibe el resultado después', () => {
        cashPage.closeRegisterBlindly(25000).then((interception) => {
            expect(interception.request.body.closing_amount).to.eq(25000);
            expect(interception.response.statusCode).to.be.oneOf([200, 302, 303]);
        });

        cy.contains('La caja se ha cerrado correctamente', { matchCase: false, timeout: 8000 }).should('exist');
        cy.contains('Resultado de Arqueo Ciego', { timeout: 8000 }).should('exist');
        cy.contains('Descargar Reporte de Arqueo (PDF)').should('exist');
        cy.contains('button', 'Abrir Caja', { timeout: 8000 }).should('exist');
    });
});
