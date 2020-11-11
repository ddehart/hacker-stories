describe('The home page', () =>{
  it('loads', () => {
    cy.visit('/');
  });

  it('has the React App title', () => {
    cy.title().should('equal', 'Hello World');
  });

  it('has Hello React text', () => {
    cy.get('h1')
      .should('have.text', 'Hello React')
  });

  it('has a search label', () => {
    cy.get('label')
      .should('contain.text', 'Search:')
      .and('have.attr', 'for', 'search');
  });

  it('has a search input', () => {
    cy.get('#search')
      .should('have.attr', 'type', 'text');
  });
});
