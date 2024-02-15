import React from 'react'
import AppointmentCard from './AppointmentCard'

describe('<AppointmentCard />', () => {
  const appointment = {
    id: 1,
    service: {
      title: 'Test Service',
      description: 'Service Description',
      organisation: {
        name: 'Test Organisation',
        address: 'Test Address',
        city: 'Test City',
        zipcode: '12345',
      }
    },
    datetime: '2024-01-25T10:00:00Z',
    status: 'valid',
    provider: {
      firstname: 'John',
      lastname: 'Doe',
    },
  };

  it('renders with appointment details', () => {
    cy.mount(<AppointmentCard appointment={appointment} />);

    cy.contains('Test Service').should('exist');
    cy.contains('Service Description').should('exist');
    cy.get('.fr-badge').should('have.length', 3);
  });

  it('navigates to appointment details page on link click', () => {
    cy.mount(<AppointmentCard appointment={appointment} />);

    cy.get('.fr-card').click();
  });

  it('displays appropriate status badge', () => {
    cy.mount(<AppointmentCard appointment={{...appointment, status: 'cancelled'}} />);

    cy.get('.fr-badge').should('contain', 'appointment_status_cancelled');
  });
})