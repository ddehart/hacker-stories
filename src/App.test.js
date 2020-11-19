import axios from 'axios';
import React from 'react';
import {render, screen, waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

jest.mock('axios');

describe('The App', () => {
  let reactStories = require('../cypress/fixtures/react-stories.json');
  let vueStories = require('../cypress/fixtures/vue-stories.json');
  let searchBox;

  const storiesRendered = (stories) => (
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

  describe('given a data loading delay', () => {
    beforeEach( () => {
      axios.get.mockImplementationOnce(() =>
        promiseWithDelay(reactStories, 50)
      );

      render(<App />);
    });

    test('renders a loading message', async () => {
      expect(screen.getByText('Loading ...')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.queryByTestId('stories-list')).toBeInTheDocument();
      });
    });
  });

  describe('given a data loading error', () => {
    beforeEach(async () => {
      axios.get.mockImplementationOnce(() => {
        return Promise.reject();
      });

      await waitFor(() => render(<App />));
    });

    test('renders an error message', () => {
      expect(screen.getByText('Something went wrong ...')).toBeInTheDocument();
    });
  });

  describe('given a response with React data', () => {
    beforeEach(async () => {
      axios.get.mockImplementationOnce(() =>
        promiseWithDelay(reactStories, 0)
      );

      render(<App />);

      searchBox = screen.getByRole('textbox', {name: 'Search:'});

      await waitFor(() =>
        expect(document.querySelector('div.story')).toBeInTheDocument()
      );
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
      const renderedStories = storiesRendered(reactStories.hits);

      expect(renderedStories).toEqual(reactStories.hits);
    });

    test('renders a Dismiss button next to each story', () => {
      userEvent.clear(searchBox);

      for(const story of reactStories.hits) {
        const storyDiv = screen.getByText(story.points.toString()).parentElement;
        expect(within(storyDiv).getByRole('button', {name: 'Dismiss'})).toBeInTheDocument();
      }
    });

    test('removes an item from the list upon clicking the Dismiss button', () => {
      const dismissDiv = screen.getByText('2280').parentElement;
      within(dismissDiv).getByRole('button', {name: 'Dismiss'}).click();

      expect(screen.queryByText('Redux')).not.toBeInTheDocument();
    });

    test('disables the button with no value in the text input', () => {
      userEvent.clear(searchBox);

      expect(screen.getByRole('button', {name: 'Submit'})).toBeDisabled();
    });
  });

  describe('given a response with Vue data', () => {
    beforeEach(async () => {
      axios.get.mockImplementationOnce(() =>
        promiseWithDelay(vueStories, 0)
      );

      render(<App />);

      searchBox = screen.getByRole('textbox', {name: 'Search:'});

      await waitFor(() =>
        expect(document.querySelector('div.story')).toBeInTheDocument()
      );
    });

    test('renders a list of stories based on the search term submitted', () => {
      userEvent.clear(searchBox);
      userEvent.type(searchBox, 'vue');

      const renderedStories = storiesRendered(vueStories.hits);

      expect(renderedStories).toEqual(vueStories.hits);
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
