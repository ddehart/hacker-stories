describe('The home page', () =>{
  const validateStoryExists = (story) => {
    cy.get('a:contains("' + story.title + '")').should('have.attr', 'href', story.url);
    cy.get('span:contains("' + story.author + '")').should('exist');
    cy.get('span:contains("' + story.num_comments + '")').should('exist');
    cy.get('span:contains("' + story.points + '")').should('exist');
  };

  const validateStoriesExist = (fixture) => {
    cy.get(fixture)
      .then(stories => {
        /**
         * @property {object} stories
         * @property {array} stories.hits
         */
        for (const story of stories.hits) {
          validateStoryExists(story);
        }
      });
  };
  beforeEach(() => {
    cy.fixture('react-stories.json').as('react-stories');
    cy.fixture('vue-stories.json').as('vue-stories');
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

  it('has the Hacker Stories title', () => {
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

  it('has an enabled search button', () => {
    cy.get('button#search-button').should('exist');
    cy.get('button#search-button').should('be.enabled');
  });

  it('has a list of stories based on the initial value in the search box', () => {
    validateStoriesExist('@react-stories');
  });

  it('has a dismiss button next to each story', () => {
    cy.get('@react-stories').then(stories => {
      /**
       * @property {object} stories
       * @property {array} stories.hits
       */
      for(const story of stories.hits) {
        cy.get('div.story:contains("' + story.title + '")').within(() => {
          cy.get('button').should('have.text', 'Dismiss');
        });
      }
    });
  });

  it('removes a story from the list upon clicking the Dismiss button', () => {
    cy.get('div.story:contains("Relicensing React")').within(() => {
      cy.get('button').click();
    });

    cy.get('div:contains("simulo")').should('not.exist');
  });

  it('disables the search button with no value in the search box', () => {
    cy.get('#search').clear();
    cy.get('button#search-button').should('be.disabled');
  });

  it('displays different stories after submitting a new search term', () => {
    cy.get('#search').clear();
    cy.get('#search').type('vue');

    cy.get('#search-button').click();

    validateStoriesExist('@vue-stories');
  });

  it('retains the last search term on reload', () => {
    localStorage.setItem('search', 'vue');

    cy.reload();

    cy.get('#search').should('have.value', 'vue');

    validateStoriesExist('@vue-stories');
  });
});
