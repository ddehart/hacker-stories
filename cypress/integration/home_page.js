import { sortBy } from 'lodash';

describe('The home page', () =>{
  const getRenderedStories = () => {
    const renderedStories = [];

    Cypress.$('[data-testid="list-items"]').children().each((index, element) => {
      const spans = element.children;

      renderedStories.push({
        title: spans[0].textContent,
        author: spans[1].textContent,
        num_comments: spans[2].textContent,
        points: spans[3].textContent,
      })
    });

    return renderedStories;
  };

  const mapDataToRender = (story) => {
    return ({
      title: story.title,
      author: story.author,
      num_comments: story.num_comments.toString(),
      points: story.points.toString(),
    });
  };

  const reactStoriesData = require('../fixtures/react-stories.json');
  const reactStories = reactStoriesData.hits.map(story => mapDataToRender(story));

  const vueStoriesData = require('../fixtures/vue-stories.json');
  const vueStories = vueStoriesData.hits.map(story => mapDataToRender(story));

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
    const renderedStories = getRenderedStories();
    expect(renderedStories).to.deep.equal(reactStories);
  });

  it('sorts stories by the right piece of information when clicking on the column headings', () => {
    cy.findByRole('button', {name: 'Title'}).click().then(() => {
      const sortByTitle = sortBy(reactStories, 'title');
      const renderedStories = getRenderedStories();

      expect(renderedStories, 'sorted titles').to.deep.equal(sortByTitle);
    });

    cy.findByRole('button', {name: 'Author'}).click().then(() => {
      const sortByAuthor = sortBy(reactStories, 'author');
      const renderedStories = getRenderedStories();

      expect(renderedStories, 'sorted authors').to.deep.equal(sortByAuthor);
    });

    cy.findByRole('button', {name: 'Comments'}).click().then(() => {
      const sortByComments = sortBy(reactStories, (object) => parseInt(object.num_comments)).reverse();
      const renderedStories = getRenderedStories();

      expect(renderedStories, 'sorted comments').to.deep.equal(sortByComments);
    });

    cy.findByRole('button', {name: 'Points'}).click().then(() => {
      const sortByPoints = sortBy(reactStories, (object) => parseInt(object.points)).reverse();
      const renderedStories = getRenderedStories();

      expect(renderedStories, 'sorted points').to.deep.equal(sortByPoints);
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
    cy.findByRole('button', {name: 'Submit'}).click()
      .then(() => {
        cy.findByText('Loading ...').should('not.exist');
      })
      .then(() => {
        const renderedStories = getRenderedStories();
        expect(renderedStories).to.deep.equal(vueStories);
      });
  });

  it('retains the last search term on reload', () => {
    localStorage.setItem('search', 'vue');

    cy.reload(true)
      .then(() => {
        cy.findByLabelText('Search:').should('have.value', 'vue')
        cy.findByText(vueStories[0].title).should('exist');
      })
      .then(() => {
        const renderedStories = getRenderedStories();
        expect(renderedStories).to.deep.equal(vueStories);
      });
  });
});
