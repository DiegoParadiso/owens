/**
 * Suite E2E: Gerencia y Reportes (UC-26, UC-27, UC-29 / CU-29)
 * Arquitectura: Page Object Model (ReportsPage) + Deterministic Inertia Interception
 */

import { ReportsPage } from '../pages/ReportsPage';

const reports = new ReportsPage();

describe('UC-26: Consultar Tablero de Métricas (Dashboard)', () => {
    beforeEach(() => {
        cy.loginAsAdmin();
        reports.visitDashboard();
    });

    it('DADO el Dashboard, CUANDO el Administrador accede, ENTONCES exhibe los 4 KPIs, 2 gráficos estadísticos y la tabla de ventas recientes', () => {
        cy.contains('Sección en Construcción').should('not.exist');
        cy.contains('Ventas hoy', { timeout: 10000 }).should('exist');
        cy.contains('Ventas totales').should('exist');
        cy.contains('Ingresos hoy').should('exist');
        cy.contains('Ingresos totales').should('exist');
        cy.contains('Ventas Globales').should('exist');
        cy.contains('Ventas e Ingresos').should('exist');
        cy.get('canvas').should('have.length.at.least', 2);
        cy.contains('Ventas Recientes').should('exist');
    });
});

describe('UC-27 / UC-29: Reportes Consolidados e Historial de Sesiones de Caja', () => {
    beforeEach(() => {
        cy.loginAsAdmin();
        reports.visitReports();
    });

    it('DADO Reportes, CUANDO el usuario ingresa una Fecha Desde posterior a Fecha Hasta, ENTONCES bloquea la consulta sin llamar al servidor', () => {
        cy.intercept('GET', '/admin/reports*').as('blockedQuery');
        reports.setDateRange('2026-12-20', '2026-12-01');
        cy.contains('button', 'Consultar').click();

        cy.contains('La "Fecha Desde" no puede ser posterior a la "Fecha Hasta"', { timeout: 5000 }).should('exist');
        cy.get('@blockedQuery.all').should('have.length', 0);
    });

    it('DADO Reportes, CUANDO consulta un rango válido con sesiones cerradas, ENTONCES habilita exportación PDF/CSV y permite inspeccionar el balance de la sesión', () => {
        reports.interceptReportsWithGuaranteedClosure('reportsQuery');

        reports.setDateRange('2026-01-01', '2026-12-31');
        cy.contains('button', 'Consultar').click();
        cy.wait('@reportsQuery').its('response.statusCode').should('eq', 200);

        cy.contains('a', 'Exportar a PDF').should('not.have.class', 'disabled');
        cy.contains('a', 'Exportar a CSV').should('not.have.class', 'disabled');

        // UC-29 Paso 5-6: Inspección determinística del detalle de sesión cerrada
        cy.get('button[title="Inspeccionar Balance"]').first().click();
        cy.contains('Saldo Teórico Esperado', { timeout: 5000 }).should('be.visible');
        cy.contains('Movimientos de la Sesión').should('exist');
        cy.contains('Descargar PDF Oficial').should('exist');
        cy.get('.drawer-panel.open .btn-close').click();
    });
});
