export class SettingsPage {
    visitProfilesViaSidebar() {
        cy.visit('/admin/dashboard');
        cy.get('.sidebar').contains('Personal').click();
        cy.url({ timeout: 8000 }).should('include', 'tab=profiles');
        cy.contains('Administrar Usuarios', { timeout: 8000 }).should('exist');
    }

    visitSystemTab() {
        cy.visit('/admin/settings?tab=system');
        cy.contains('Configuración del Sistema', { timeout: 8000 }).should('exist');
    }

    createUser(name, email, password, role) {
        cy.intercept('POST', '/admin/settings/users').as('storeUserReq');
        cy.contains('button', 'Nuevo Usuario').click();
        cy.get('.drawer-panel.open form').within(() => {
            cy.get('input[type="text"]').type(name);
            cy.get('input[type="email"]').type(email);
            cy.get('input[type="password"]').type(password);
            cy.get('select').select(role);
        });
        cy.get('.drawer-footer').contains('button', 'Guardar').click();
        return cy.wait('@storeUserReq');
    }

    updateUserRole(email, newRole) {
        cy.intercept('PUT', '/admin/settings/users/*').as('updateUserReq');
        cy.contains('tr', email).find('button[title="Editar"]').click();
        cy.get('.drawer-panel.open form select').select(newRole);
        cy.get('.drawer-footer').contains('button', 'Actualizar').click();
        return cy.wait('@updateUserReq');
    }

    deleteUser(email) {
        cy.intercept('DELETE', '/admin/settings/users/*').as('deleteUserReq');
        cy.contains('tr', email).find('button[title="Eliminar"]').click();
        cy.confirmOwensModal('Dar de Baja');
        return cy.wait('@deleteUserReq');
    }
}
