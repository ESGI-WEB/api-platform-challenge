import React from 'react'
import OrganisationLocation from './OrganisationLocation'

describe('<OrganisationLocation />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<OrganisationLocation organisation={{
      latitude: "46.4238650000000000",
      longitude: "4.7509580000000000"
    }}/>)
  })
})