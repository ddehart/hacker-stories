describe('The home page', () =>{
  const validateStoryExists = (story) => {
    cy.get('a:contains("' + story.title + '")').should('have.attr', 'href', story.url);
    cy.get('span:contains("' + story.author + '")').should('exist');
    cy.get('span:contains("' + story.num_comments + '")').should('exist');
    cy.get('span:contains("' + story.points + '")').should('exist');
  };

  beforeEach(() => {
    cy.fixture('stories.json').as('stories');
  });

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
      .should('contain.text', 'Search')
      .and('have.attr', 'for', 'search');
  });

  it('has a search box with an initial value', () => {
    cy.get('#search')
      .should('have.attr', 'type', 'text')
      .and('have.value', 'React');
  });

  it('has a list of stories based on the initial value in the search box', () => {
    cy.get('@stories')
      .then(stories => {
        const filteredStories = stories.filter(story =>
          story.title.includes('React')
        );

        for(const story of filteredStories) {
          validateStoryExists(story);
        }
      });
  });

  it('lists all stories with no value in the search box', () => {
    cy.get('#search').clear();

    cy.get('@stories')
      .then(stories => {
        for(const story of stories) {
          validateStoryExists(story);
        }
      });
  });

  it('filters the list of stories given text in the search textbox', () => {
    cy.get('#search').clear();
    cy.get('#search').type('redux');

    cy.get('div:contains("Redux")').should('exist');
    cy.get('div:contains("React")').should('not.exist');
  });

  it('retains the last search term on reload', () => {
    cy.get('#search').clear();

    cy.get('#search').type('redux');

    cy.reload();

    cy.get('#search').should('have.value', 'redux');
    cy.get('div:contains("Redux")').should('exist');
    cy.get('div:contains("React")').should('not.exist');
  });
});
