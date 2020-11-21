import axios from 'axios';
import React from 'react';
import {render, screen, waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

jest.mock('axios');

describe('The App', () => {
  let reactStories = require('../../cypress/fixtures/react-stories.json');
  let vueStories = require('../../cypress/fixtures/vue-stories.json');
  let searchBox;

  const storiesRendered = (stories) => (
    /**
     * @property {object} story
     * @property {string} story.title
     * @property {string} story.url
     * @property {string} story.author
     * @property {number} story.num_comments
     * @property {number} story.points
     */
    stories.filter(story => (
        screen.queryByText(story.title) &&
        screen.queryByText(story.title).getAttribute('href') === story.url &&
        screen.queryAllByText(story.author) &&
        screen.queryAllByText(story.num_comments.toString()) &&
        screen.queryAllByText(story.points.toString())
      )
    )
  );

  const promiseWithDelay = (json, delay=0) =>
    new Promise(resolve =>
      setTimeout(
        () => resolve({
          data: json
        }), delay
      )
    );

  const mockAPI = (response, json={}, delay=0) => {
    switch (response) {
      case 'resolve':
        axios.get.mockImplementationOnce(() =>
          promiseWithDelay(json, delay)
        );
        break;

      case 'reject':
        axios.get.mockImplementationOnce(() =>{
          return Promise.reject();
        });
        break;

      default:
        throw new Error();
    }
  };

  const setUpListRender = async (fixture) => {
    mockAPI('resolve', fixture);

    render(<App />);

    searchBox = screen.getByRole('textbox', {name: 'Search:'});

    await waitFor(() =>
      expect(document.querySelector('div.story')).toBeInTheDocument()
    );
  };

  describe('given a data loading delay', () => {
    test('renders a loading message and then a list of stories', async () => {
      mockAPI('resolve', reactStories, 50);

      render(<App />);

      expect(screen.getByText('Loading ...')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.queryByTestId('stories-list')).toBeInTheDocument();
      });
    });
  });

  describe('given a data loading error', () => {
    test('renders an error message after loading',  async () => {
      mockAPI('reject');

      render(<App />);

      await waitFor(() => {
        expect(screen.queryByText('Something went wrong ...')).toBeInTheDocument();
      });
    });
  });

  describe('given a response with React data', () => {
    beforeEach(async () => {
      await setUpListRender(reactStories);
    });

    test('renders Hacker Stories heading', () => {
      expect(screen.getByRole('heading')).toHaveTextContent('Hacker Stories');
    });

    test('renders search text input with an initial value', () => {
      expect(searchBox).toBeInTheDocument();
      expect(searchBox).toHaveValue('React');
    });

    test('renders search text input with focus', () => {
      expect(searchBox).toHaveFocus();
    });

    test('renders an enabled search button', () => {
      expect(screen.getByRole('button', {name: 'Submit'})).toBeInTheDocument();
      expect(screen.getByRole('button', {name: 'Submit'})).toBeEnabled();
    });

    test('renders stories based on the initial value of the text input', () => {
      expect(storiesRendered(reactStories.hits)).toEqual(reactStories.hits);
    });

    test('renders a Dismiss button next to each story', () => {
      userEvent.clear(searchBox);

      for(const story of reactStories.hits) {
        const storyDiv = screen.getByText(story.points.toString()).parentElement;
        expect(within(storyDiv).getByRole('button', {name: 'Dismiss'})).toBeInTheDocument();
      }
    });

    test('removes an item from the list upon clicking the Dismiss button', () => {
      const dismissDiv = screen.getByText('dwwoelfel').parentElement;
      within(dismissDiv).getByRole('button', {name: 'Dismiss'}).click();

      expect(screen.queryByText('dwwoelfel')).not.toBeInTheDocument();
    });

    test('disables the button with no value in the text input', () => {
      userEvent.clear(searchBox);

      expect(screen.getByRole('button', {name: 'Submit'})).toBeDisabled();
    });

    test('renders a list of stories based on the search term submitted', async () => {
      mockAPI('resolve', vueStories);

      userEvent.clear(searchBox);
      await userEvent.type(searchBox, 'vue');
      userEvent.click(screen.getByRole('button', {name: 'Submit'}));

      await waitFor(() =>
        expect(document.querySelector('div.story')).toBeInTheDocument()
      );

      expect(storiesRendered(vueStories.hits)).toEqual(vueStories.hits);
    });
  });

  describe('given a response with Vue data', () => {
    beforeEach(async () => {
      await setUpListRender(vueStories);
    });

    test('sets the search term in local storage', () => {
      userEvent.clear(searchBox);
      userEvent.type(searchBox, 'vue');

      let localStorageSearch = localStorage.getItem('search');

      expect(localStorageSearch).toBe('vue');
    });

    test('gets the initial search term from local storage', () => {
      let localStorageSearch = localStorage.getItem('search');

      expect(localStorageSearch).toBe('vue');
      expect(searchBox).toHaveValue('vue');
    });
  });
});
