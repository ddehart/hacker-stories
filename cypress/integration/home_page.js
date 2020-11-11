describe('The home page', () =>{
  it('loads', () => {
    cy.visit('/');
  });

  it('has the React App title', () => {
    cy.title().should('equal', 'Hacker Stories');
  });

  it('has Hello React text', () => {
    cy.get('h1')
      .should('have.text', 'Hacker Stories')
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

  it('has a list of stories', () => {
    cy.fixture('stories.json').as('stories');

    cy.get('@stories')
      .then(stories => {
        for(const story of stories) {
          cy.get('a:contains("' + story.title + '")').should('have.attr', 'href', story.url);
          cy.get('span:contains("' + story.author + '")').should('exist');
          cy.get('span:contains("' + story.num_comments + '")').should('exist');
          cy.get('span:contains("' + story.points + '")').should('exist');
        }
      });
  });
});
