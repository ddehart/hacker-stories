describe('The home page', () =>{
  const validateStoryExists = (story) => {
    cy.get('a:contains("' + story.title + '")').should('have.attr', 'href', story.url);
    cy.get('span:contains("' + story.author + '")').should('exist');
    cy.get('span:contains("' + story.num_comments + '")').should('exist');
    cy.get('span:contains("' + story.points + '")').should('exist');
  };

  const filterStories = (stories, filter) =>
    stories.filter(
      story => story.title.includes(filter)
    );

  beforeEach(() => {
    cy.fixture('stories.json').as('stories');
  });

  it('loads', () => {
    cy.visit('/');
  });

  it('has a loading indicator before the list has loaded', () => {
    cy.get('p:contains("Loading ...")').should('exist');
  });

  it('does not display an error', () => {
    cy.get('p:contains("Something went wrong ...")').should('not.exist');
  });

  it('has the React App title', () => {
    cy.title().should('equal', 'Hacker Stories');
  });

  it('has the Hacker Stories header', () => {
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

  it('is immediately focused on the search box', () => {
    cy.get('#search').should('have.focus');
  });

  it('has a search button', () => {
    cy.get('button#search-button').should('exist');
  });

  it('has a list of stories based on the initial value in the search box', () => {
    cy.get('@stories')
      .then(stories => {
        const filteredStories = filterStories(stories.hits, 'React');

        for(const story of filteredStories) {
          validateStoryExists(story);
        }
      });
  });

  it('lists all stories with no value in the search box', () => {
    cy.get('#search').clear();

    cy.get('@stories')
      .then(stories => {
        for(const story of stories.hits) {
          validateStoryExists(story);
        }
      });
  });

  it('has a dismiss button next to each story', () => {
    cy.get('@stories').then(stories => {
      for(const story of stories.hits) {
        cy.get('div.story:contains("' + story.title + '")').within(() => {
          cy.get('button').should('have.text', 'Dismiss');
        });
      }
    });
  });

  it('filters the list of stories given text in the search textbox', () => {
    cy.get('#search').clear();
    cy.get('#search').type('redux');

    cy.get('@stories')
      .then(stories => {
        const filteredStories = filterStories(stories.hits, 'redux');

        for(const story of filteredStories) {
          validateStoryExists(story);
        }
      });
  });

  it('retains the last search term on reload', () => {
    cy.get('#search').clear();

    cy.get('#search').type('vue');

    cy.reload();

    cy.get('@stories')
      .then(stories => {
        const filteredStories = filterStories(stories.hits, 'vue');

        for(const story of filteredStories) {
          validateStoryExists(story);
        }
      });
  });

  it('removes a story from the list upon clicking the Dismiss button', () => {
    cy.get('#search').clear();

    cy.get('div.story:contains("simulo")').within(() => {
      cy.get('button').click();
    });

    cy.get('div:contains("simulo")').should('not.exist');
  });
});
