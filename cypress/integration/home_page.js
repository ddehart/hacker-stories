describe('The home page', () =>{
  it('loads', () => {
    cy.visit('/');
  });

  it('has the React App title', () => {
    cy.title().should('equal', 'Hello World');
  });

  it('has Hello World text', () => {
    cy.contains('Hello World');
  });
});
