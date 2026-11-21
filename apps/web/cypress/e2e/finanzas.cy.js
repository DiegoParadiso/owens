/**
 * Suite E2E: Módulo de Finanzas (UC-18..22, UC-28, UC-30, UC-33..35)
 * Arquitectura: Page Object Model (FinancesPage) + Network Interception (cy.intercept)
 */

import { FinancesPage } from '../pages/FinancesPage';

const finances = new FinancesPage();

describe('UC-33 / UC-34 / UC-35: Categorías de Gastos', () => {
    beforeEach(() => {
        cy.loginAsAdmin();
        finances.visitCategories();
    });

    it('DADO el módulo de Finanzas, CUANDO crea, modifica y elimina una categoría de gasto, ENTONCES valida cada petición HTTP y su impacto en la tabla', () => {
        const suffix = Date.now();
        const catName = `Cat ${suffix}`;
        const updatedName = `Cat Editada ${suffix}`;

        finances.createCategory(catName, 'variable').then((interception) => {
            expect(interception.request.body).to.include({ name: catName, type: 'variable' });
            expect(interception.response.statusCode).to.be.oneOf([200, 302, 303]);
        });
        cy.contains('La categoría ha sido guardada correctamente', { timeout: 8000 }).should('exist');

        finances.updateCategory(catName, updatedName, 'fixed').then((interception) => {
            expect(interception.request.body).to.include({ name: updatedName, type: 'fixed' });
            expect(interception.response.statusCode).to.be.oneOf([200, 302, 303]);
        });
        cy.contains('La categoría ha sido actualizada correctamente', { timeout: 8000 }).should('exist');

        finances.deleteCategory(updatedName).then((interception) => {
            expect(interception.response.statusCode).to.be.oneOf([200, 302, 303]);
        });
        cy.contains('La categoría ha sido eliminada correctamente', { timeout: 8000 }).should('exist');
    });
});

describe('UC-28 / UC-30: Gastos Operativos y Navegación Unificada de Finanzas', () => {
    beforeEach(() => {
        cy.loginAsAdmin();
    });

    it('DADO Finanzas, CUANDO registra y anula un gasto por transferencia, ENTONCES el payload limpia correctamente el formato moneda ($4.500 -> 4500) y ejecuta anulación compensatoria', () => {
        const suffix = Date.now();
        const catName = `Cat Gasto ${suffix}`;
        const expenseDesc = `Luz ${suffix}`;

        finances.visitCategories();
        finances.createCategory(catName, 'fixed');

        finances.visitExpensesViaSidebar();
        cy.contains('.nav-link', 'Gastos').should('exist');
        cy.contains('.nav-link', 'Categorías de Gastos').should('exist');
        cy.contains('.nav-link', 'Compras').should('exist');
        cy.contains('.nav-link', 'Proveedores').should('exist');

        finances.createExpense(expenseDesc, 4500, catName, 'Transferencia').then((interception) => {
            expect(interception.request.body.description).to.eq(expenseDesc);
            expect(interception.request.body.amount).to.eq(4500);
            expect(interception.request.body.payment_method).to.eq('transfer');
            expect(interception.response.statusCode).to.be.oneOf([200, 302, 303]);
        });
        cy.contains(expenseDesc, { timeout: 8000 }).should('exist');

        finances.annulExpense(expenseDesc).then((interception) => {
            expect(interception.response.statusCode).to.be.oneOf([200, 302, 303]);
        });
        cy.contains('El gasto ha sido anulado y revertido correctamente', { timeout: 8000 }).should('exist');

        finances.visitCategories();
        finances.deleteCategory(catName);
    });
});

describe('UC-18 / UC-19 / UC-20 / UC-21 / UC-22: Proveedores y Compras', () => {
    beforeEach(() => {
        cy.loginAsAdmin();
    });

    it('DADO Proveedores, CUANDO registra, edita y da de baja un proveedor, ENTONCES confirma los requests HTTP correspondientes', () => {
        const suffix = Date.now();
        const supName = `Proveedor ${suffix}`;
        const supUpdated = `Proveedor Editado ${suffix}`;

        finances.visitSuppliers();

        cy.intercept('POST', '/admin/suppliers').as('storeSup');
        cy.contains('button', 'Agregar Proveedor').click();
        cy.get('input#name', { timeout: 5000 }).should('be.visible').type(supName);
        cy.get('textarea#contact_info').type('Tel: 3758-400100');
        cy.get('.drawer-footer').contains('button', 'Guardar Proveedor').click();
        cy.wait('@storeSup').its('response.statusCode').should('be.oneOf', [200, 302, 303]);
        cy.contains(supName, { timeout: 8000 }).should('exist');

        cy.intercept('PUT', '/admin/suppliers/*').as('updateSup');
        cy.contains('tr', supName).find('button[title="Editar"]').click();
        cy.get('input#name', { timeout: 5000 }).should('be.visible').clear().type(supUpdated);
        cy.get('.drawer-footer').contains('button', 'Actualizar Proveedor').click();
        cy.wait('@updateSup').its('response.statusCode').should('be.oneOf', [200, 302, 303]);
        cy.contains(supUpdated, { timeout: 8000 }).should('exist');

        cy.intercept('DELETE', '/admin/suppliers/*').as('deleteSup');
        cy.contains('tr', supUpdated).find('button[title="Eliminar"]').click();
        cy.confirmOwensModal('Eliminar');
        cy.wait('@deleteSup').its('response.statusCode').should('be.oneOf', [200, 302, 303]);
        cy.contains('El proveedor ha sido eliminado correctamente', { timeout: 8000 }).should('exist');
    });

    it('DADO Compras, CUANDO registra una compra con un ítem por transferencia y luego la anula, ENTONCES verifica el costo unitario numérico enviado y revierte', () => {
        const productName = `Insumo Compra ${Date.now()}`;

        finances.visitPurchases();

        cy.intercept('POST', '/admin/purchases').as('storePurchase');
        cy.contains('button', 'Registrar Compra').click();
        cy.get('.drawer-panel.open', { timeout: 5000 }).should('have.class', 'open');
        cy.get('button[title="Crear nuevo producto"]').first().click();
        cy.get('input[placeholder="Nombre del Nuevo Producto"]').type(productName);
        cy.get('.drawer-panel.open input[data-type="currency"]').first().type('1500');
        cy.get('.drawer-panel.open').contains('button', 'Transferencia').click();
        cy.get('.drawer-footer').contains('button', 'Registrar Compra').click();

        cy.wait('@storePurchase').then((interception) => {
            expect(interception.request.body.unit_cost[0]).to.eq(1500);
            expect(interception.response.statusCode).to.be.oneOf([200, 302, 303]);
        });
        cy.contains(productName, { timeout: 8000 }).should('exist');

        cy.intercept('DELETE', '/admin/purchases/*').as('deletePurchase');
        cy.contains('tr', productName).find('button[title="Eliminar"]').click();
        cy.confirmOwensModal('Eliminar');
        cy.wait('@deletePurchase').its('response.statusCode').should('be.oneOf', [200, 302, 303]);
        cy.contains('La compra ha sido eliminada correctamente', { timeout: 8000 }).should('exist');
    });
});
