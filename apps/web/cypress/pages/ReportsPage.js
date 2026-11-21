export class ReportsPage {
    visitDashboard() {
        cy.visit('/admin/dashboard');
    }

    visitReports() {
        cy.visit('/admin/reports');
        cy.contains('Reportes Consolidados y Auditoría de Caja', { timeout: 10000 }).should('exist');
    }

    setDateRange(from, to) {
        cy.get('input[type="date"]').eq(0).clear().type(from);
        cy.get('input[type="date"]').eq(1).clear().type(to);
    }

    interceptReportsWithGuaranteedClosure(aliasName = 'reportsQuery') {
        cy.intercept('GET', '/admin/reports*', (req) => {
            if (req.headers['x-inertia']) {
                req.continue((res) => {
                    if (res.body && res.body.props) {
                        const existing = res.body.props.closures || [];
                        if (existing.length === 0) {
                            res.body.props.closures = [
                                {
                                    id: 999,
                                    user: 'Cajero Simulado E2E',
                                    opened_at: '2026-11-20T09:00:00',
                                    closed_at: '2026-11-20T17:00:00',
                                    opening_amount: 10000,
                                    sales_total: 45000,
                                    manual_income: 0,
                                    total_income: 45000,
                                    total_expense: 5000,
                                    expected_balance: 50000,
                                    closing_amount: 50000,
                                    difference: 0,
                                    movements: [
                                        { id: 1, type: 'sale', amount: 45000, description: 'Venta mostrador', created_at: '2026-11-20T12:30:00' },
                                        { id: 2, type: 'expense', amount: 5000, description: 'Gasto hielo', created_at: '2026-11-20T14:00:00' },
                                    ],
                                },
                            ];
                        }
                    }
                    res.send();
                });
            }
        }).as(aliasName);
    }
}
