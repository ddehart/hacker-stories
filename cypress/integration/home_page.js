describe('The home page', () =>{
  it('loads', () => {
    cy.visit('/');
  });

  it('has the React App title', () => {
    cy.title().should('equal', 'React App');
  });

  it('has the generic React App text', () => {
    cy.contains('Edit src/App.js and save to reload.');
  });
});