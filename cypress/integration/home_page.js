import { sortBy } from 'lodash';

describe('The home page', () =>{
  const renderedStoryArray = () => {
    const renderedStories = [];

    cy.findByTestId('list-items').children().each(item => {
      const spans = item.children();
      renderedStories.push({
        title: spans[0].innerText,
        author: spans[1].innerText,
        comments: spans[2].innerText,
        points: spans[3].innerText,
      })
    });

    return renderedStories;
  };

  const validateStoryExists = (story) => {
    cy.findByRole('link', {name: story.title}).parent().parent().within(() => {
      cy.findByRole('link', {name: story.title}).should('have.attr', 'href', story.url);
      cy.findByText(story.author).should('exist');
      cy.findByText(story.num_comments.toString()).should('exist');
      cy.findByText(story.points.toString()).should('exist');
      cy.findByRole('button', {name: 'Dismiss'}).should('exist');
    });
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
    cy.findByText('Loading ...').should('exist');
  });

  it('does not display an error', () => {
    cy.findByText('Something went wrong ...').should('not.exist');
  });

  it('has the Hacker Stories title', () => {
    cy.title().should('equal', 'Hacker Stories');
  });

  it('has the Hacker Stories header', () => {
    cy.findByRole('heading', {level: 1}).should('have.text', 'Hacker Stories');
  });

  it('has a search box with an initial value', () => {
    cy.findByLabelText('Search:')
      .should('have.attr', 'type', 'text')
      .and('have.value', 'React');
  });

  it('is immediately focused on the search box', () => {
    cy.findByLabelText('Search:').should('have.focus');
  });

  it('has an enabled search button', () => {
    cy.findByRole('button', {name: 'Submit'})
      .should('exist')
      .and('be.enabled');
  });

  it('has column headings describing story information', () => {
    cy.findByRole('button', {name: 'Title'}).should('exist');
    cy.findByRole('button', {name: 'Author'}).should('exist');
    cy.findByRole('button', {name: 'Comments'}).should('exist');
    cy.findByRole('button', {name: 'Points'}).should('exist');
    cy.findByText('Actions').should('exist');
  });

  it('has a list of stories based on the initial value in the search box', () => {
    validateStoriesExist('@react-stories');
  });

  it('sorts stories by the right piece of information when clicking on the column headings', () => {
    cy.findByRole('link', {name: 'Relicensing React, Jest, Flow, and Immutable.js'});

    const renderedStories = renderedStoryArray();

    console.log(renderedStories);

    const sortedStories = sortBy(renderedStories, 'title');

    console.log(sortedStories);

    const fakeStories = [
      {
        title: "something",
        author: "someone",
        num_comments: 5,
        points: 15,
      },
      {
        title: "abc",
        author: "xyz",
        num_comments: 13,
        points: 3,
      },
      {
        title: "something else",
        author: "someone else",
        num_comments: 7,
        points: 42,
      },
    ];

    const sortedFakeStories = sortBy(fakeStories, 'title');

    console.log(sortedFakeStories);

    cy.findByRole('button', {name: 'Title'}).click();
  });

  it('removes a story from the list upon clicking the Dismiss button', () => {
    cy.findByRole('link', {name: 'Relicensing React, Jest, Flow, and Immutable.js'})
      .parent().parent().within(() => {
        cy.findByRole('button', {name: 'Dismiss'}).click();
    });

    cy.findByRole('link', {name: 'Relicensing React, Jest, Flow, and Immutable.js'}).should('not.exist');
  });

  it('disables the search button with no value in the search box', () => {
    cy.findByLabelText('Search:').clear()
    cy.findByRole('button', {name: 'Submit'}).should('be.disabled');
  });

  it('displays different stories after submitting a new search term', () => {
    cy.findByLabelText('Search:').clear();
    cy.findByLabelText('Search:').type('vue');
    cy.findByRole('button', {name: 'Submit'}).click();

    validateStoriesExist('@vue-stories');
  });

  it('retains the last search term on reload', () => {
    localStorage.setItem('search', 'vue');

    cy.reload();

    cy.findByLabelText('Search:').should('have.value', 'vue');

    validateStoriesExist('@vue-stories');
  });
});
