import OrganisationAddress from './OrganisationAddress'

describe('<OrganisationAddress />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<OrganisationAddress organisation={{
      name: "orga",
      address: "327 rue de la paix",
      zipcode: 75000,
      city: "Paris"
    }} />)
  })
  it('renders with icon', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<OrganisationAddress organisation={{
      name: "orga",
      address: "327 rue de la paix",
      zipcode: 75000,
      city: "Paris"
    }} withIcon />)
    cy.get("i").should('have.class', 'ri-map-pin-2-line')
  })
})