export class FinancesPage {
    visitCategories() {
        cy.visit('/admin/expense-categories');
        cy.contains('Categorías de Gastos', { timeout: 10000 }).should('exist');
    }

    visitExpensesViaSidebar() {
        cy.visit('/admin/dashboard');
        cy.get('.sidebar').contains('Finanzas').click();
        cy.url({ timeout: 8000 }).should('include', '/admin/expenses');
    }

    visitSuppliers() {
        cy.visit('/admin/suppliers');
        cy.contains('Listado de Proveedores', { timeout: 10000 }).should('exist');
    }

    visitPurchases() {
        cy.visit('/admin/purchases');
        cy.contains('Listado de Compras', { timeout: 10000 }).should('exist');
    }

    createCategory(name, type = 'variable') {
        cy.intercept('POST', '/admin/expense-categories').as('storeCategoryReq');
        cy.contains('button', 'Nueva Categoría').click();
        cy.get('input#name', { timeout: 5000 }).should('be.visible').type(name);
        cy.get('select#type').select(type);
        cy.get('.drawer-footer').contains('button', 'Guardar Categoría').click();
        return cy.wait('@storeCategoryReq');
    }

    updateCategory(oldName, newName, newType = 'fixed') {
        cy.intercept('PUT', '/admin/expense-categories/*').as('updateCategoryReq');
        cy.contains('tr', oldName).find('button[title="Editar"]').click();
        cy.get('input#name', { timeout: 5000 }).should('be.visible').clear().type(newName);
        cy.get('select#type').select(newType);
        cy.get('.drawer-footer').contains('button', 'Actualizar Categoría').click();
        return cy.wait('@updateCategoryReq');
    }

    deleteCategory(name) {
        cy.intercept('DELETE', '/admin/expense-categories/*').as('deleteCategoryReq');
        cy.contains('tr', name).find('button[title="Eliminar"]').click();
        cy.confirmOwensModal('Eliminar');
        return cy.wait('@deleteCategoryReq');
    }

    createExpense(description, amount, categoryName, methodLabel = 'Transferencia') {
        cy.intercept('POST', '/admin/expenses').as('storeExpenseReq');
        cy.contains('button', 'Registrar Gasto').click();
        cy.get('input#description', { timeout: 5000 }).should('be.visible').type(description);
        cy.get('input#amount').type(String(amount));
        cy.get('select#category_id').select(categoryName);
        cy.contains('button', methodLabel).click();
        cy.get('.drawer-footer').contains('button', 'Guardar Gasto').click();
        return cy.wait('@storeExpenseReq');
    }

    annulExpense(description) {
        cy.intercept('DELETE', '/admin/expenses/*').as('annulExpenseReq');
        cy.contains('tr', description).find('button[title="Eliminar"]').click();
        cy.contains('Anular Gasto Operativo', { timeout: 5000 }).should('be.visible');
        cy.confirmOwensModal('Anular');
        return cy.wait('@annulExpenseReq');
    }
}
