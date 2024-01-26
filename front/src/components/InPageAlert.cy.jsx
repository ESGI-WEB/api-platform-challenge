import React from 'react'
import InPageAlert from './InPageAlert'

describe('<InPageAlert />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<InPageAlert alert={{
      closable: true,
      description: "aze",
      title: "titre",
      classname: "fr-mb-2w"
    }}/>)
  })
})