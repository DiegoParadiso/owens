/**
 * Suite E2E: Gestión de Personal, Roles y Configuración (UC-37, UC-40, UC-45, UC-38, UC-31)
 * Arquitectura: Page Object Model (SettingsPage) + Network Interception (cy.intercept)
 */

import { SettingsPage } from '../pages/SettingsPage';

const settings = new SettingsPage();

describe('UC-37 / UC-40 / UC-45 / UC-38 / UC-31: Personal y Configuración', () => {
    beforeEach(() => {
        cy.loginAsAdmin();
    });

    it('DADO Personal en Configuración, CUANDO da de alta un Cajero, lo asciende a Auditor y le da de baja, ENTONCES valida los payloads de roles reales y la revocación', () => {
        const suffix = Date.now();
        const empName = `Cajero ${suffix}`;
        const empEmail = `cajero_${suffix}@owens.test`;

        settings.visitProfilesViaSidebar();

        settings.createUser(empName, empEmail, 'password123', 'cajero').then((interception) => {
            expect(interception.request.body).to.include({ email: empEmail, role: 'cajero' });
            expect(interception.response.statusCode).to.be.oneOf([200, 302, 303]);
        });
        cy.contains('tr', empEmail, { timeout: 8000 }).should('contain', 'Cajero');

        settings.updateUserRole(empEmail, 'auditor').then((interception) => {
            expect(interception.request.body.role).to.eq('auditor');
            expect(interception.response.statusCode).to.be.oneOf([200, 302, 303]);
        });
        cy.contains('tr', empEmail, { timeout: 8000 }).should('contain', 'Auditor');

        settings.deleteUser(empEmail).then((interception) => {
            expect(interception.response.statusCode).to.be.oneOf([200, 302, 303]);
        });
        cy.contains('El acceso del usuario ha sido revocado correctamente', { timeout: 8000 }).should('exist');
        cy.contains(empEmail).should('not.exist');
    });

    it('DADO Configuración -> Sistema, CUANDO alterna la gestión de stock, ENTONCES envía la petición al endpoint correspondiente', () => {
        settings.visitSystemTab();

        cy.intercept('POST', '/admin/settings/stock').as('toggleStock');
        cy.get('input[role="switch"]').click();
        cy.wait('@toggleStock').its('response.statusCode').should('be.oneOf', [200, 302, 303]);
        cy.contains('Configuración de stock actualizada correctamente', { timeout: 8000 }).should('exist');

        // Restaurar estado original del switch
        cy.get('input[role="switch"]').click();
        cy.wait('@toggleStock');
    });
});
