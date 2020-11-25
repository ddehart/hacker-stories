import { sortBy } from 'lodash';

describe('The home page', () =>{
  const renderedStoryArray = () => {
    const renderedStories = [];

    cy.findByTestId('list-items').children().each(item => {
      const spans = item.children();
      renderedStories.push({
        title: spans[0].innerText,
        author: spans[1].innerText,
        num_comments: spans[2].innerText,
        points: spans[3].innerText,
      })
    });

    return cy.wrap(renderedStories);
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
    cy.get('@react-stories').then(stories => {
      const sortedTitles = sortBy(stories.hits, 'title').map(story => story.title);
      const sortByAuthor = sortBy(stories.hits, 'author').map(story => story.author);
      const sortByComments = sortBy(stories.hits, 'num_comments').reverse().map(story => story.num_comments.toString());
      const sortByPoints = sortBy(stories.hits, 'points').reverse().map(story => story.points.toString());

      cy.findByRole('button', {name: 'Title'}).click();

      renderedStoryArray().then((renderedStories) => {
        const renderedTitles = renderedStories.map(story => story.title);

        expect(renderedTitles, 'sorted titles').to.deep.equal(sortedTitles);
      });

      cy.findByRole('button', {name: 'Author'}).click();

      renderedStoryArray().then((renderedStories) => {
        const renderedAuthors = renderedStories.map(story => story.author);

        expect(renderedAuthors, 'sorted authors').to.deep.equal(sortByAuthor);
      });

      cy.findByRole('button', {name: 'Comments'}).click();

      renderedStoryArray().then((renderedStories) => {
        const renderedComments = renderedStories.map(story => story.num_comments);

        expect(renderedComments, 'sorted comments').to.deep.equal(sortByComments);
      });

      cy.findByRole('button', {name: 'Points'}).click();

      renderedStoryArray().then((renderedStories) => {
        const renderedPoints = renderedStories.map(story => story.points);

        expect(renderedPoints, 'sorted points').to.deep.equal(sortByPoints);
      });
    });
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
