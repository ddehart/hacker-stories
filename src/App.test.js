import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('The App', () => {
  let stories = require('../cypress/fixtures/stories.json');
  let searchBox;

  const storiesRendered = (stories) => (
    stories.filter(story => (
        screen.queryByText(story.title) &&
        screen.queryByText(story.title).getAttribute('href') === story.url &&
        screen.queryByText(story.author) &&
        screen.queryByText(story.num_comments.toString()) &&
        screen.queryByText(story.points.toString())
      )
    )
  );

  beforeEach(() => {
    render(<App />);

    searchBox = screen.getByRole('textbox', {name: 'Search:'});
  });

  test('renders Hello React heading', () => {
    expect(screen.getByRole('heading')).toHaveTextContent('Hacker Stories');
  });

  test('renders search text input with an initial value', () => {
    expect(searchBox).toBeInTheDocument();
    expect(searchBox).toHaveValue('React');
  });

  test('renders a story based on the initial value of the text input', () => {
    const filteredStories = stories.filter(story => story.title.includes('React'));
    const renderedStories = storiesRendered(filteredStories);

    expect(renderedStories).toEqual(filteredStories);
    expect(screen.queryByText('Redux')).not.toBeInTheDocument();
  });

  test('renders all stories with no value in the text input', () => {
    userEvent.clear(searchBox);

    const renderedStories = storiesRendered(stories);

    expect(renderedStories).toEqual(stories);
  });

  test('renders the list of stories based on text typed into the search textbox', () => {
    const filteredStories = stories.filter(story => story.title.toLowerCase().includes('redux'));

    userEvent.clear(searchBox);
    userEvent.type(searchBox, 'redux');

    const renderedStories = storiesRendered(filteredStories);

    expect(renderedStories).toEqual(filteredStories);
    expect(screen.queryByText('React')).not.toBeInTheDocument();
  });

  test('sets the search term in local storage', () => {
    userEvent.clear(searchBox);
    userEvent.type(searchBox, 'redux');

    let localStorageSearch = localStorage.getItem('search');

    expect(localStorageSearch).toBe('redux');
  });

  test('gets the initial search term from local storage', () => {
    let localStorageSearch = localStorage.getItem('search');

    expect(localStorageSearch).toBe('redux');
    expect(screen.queryByDisplayValue('redux')).toBeInTheDocument();
    expect(searchBox).toHaveValue('redux');
  });
});
