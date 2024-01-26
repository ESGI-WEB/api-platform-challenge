import React from 'react';
import AppointmentStatusBadge, { AppointmentStatus } from './AppointmentStatusBadge';

describe('<AppointmentStatusBadge />', () => {
    it('renders a valid appointment badge', () => {
        cy.mount(<AppointmentStatusBadge status={AppointmentStatus.VALID} />);

        cy.get('.fr-badge')
            .should('exist')
            .should('have.class', 'fr-badge--success')
            .contains('appointment_status_valid');
    });

    it('renders a cancelled appointment badge', () => {
        cy.mount(<AppointmentStatusBadge status={AppointmentStatus.CANCELLED} />);

        cy.get('.fr-badge')
            .should('exist')
            .should('have.class', 'fr-badge--error')
            .contains('appointment_status_cancelled');
    });

    it('handles unknown status gracefully', () => {
        cy.mount(<AppointmentStatusBadge/>);

        cy.get('.fr-badge')
            .should('exist')
            .should('have.class', 'fr-badge--success')
            .contains('appointment_status_valid');
    });
});
