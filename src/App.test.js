import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('The App', () => {
  let stories = [];

  beforeEach(() => {
    render(<App />);
  });

  test('renders Hello React heading', () => {
    expect(screen.getByRole('heading')).toHaveTextContent('Hacker Stories');
  });

  test('renders search text input', () => {
    expect(screen.getByLabelText('Search:')).toHaveAttribute('type', 'text');
  });

  test('renders a list of stories', () => {
    stories = require('../cypress/fixtures/stories.json');

    for(const story of stories) {
      expect(screen.getByText(story.title)).toHaveAttribute('href', story.url);
      screen.getByText(story.author);
      screen.getByText(story.num_comments.toString());
      screen.getByText(story.points.toString());
    }
  });

  test('renders the searching for text when typing in the search textbox', () => {
    const searchBox = screen.getByRole('textbox', {name: 'Search:'});

    userEvent.type(searchBox, 'test');
    expect(screen.getByTestId('searching-for')).toHaveTextContent('Searching for test.');

    userEvent.type(searchBox, 'ing');
    expect(screen.getByTestId('searching-for')).toHaveTextContent('Searching for testing.');
  });

  test('logs to the console when typing in the search textbox', () => {
    const consoleSpy = jest.spyOn(console, 'log');

    userEvent.type(screen.getByRole('textbox', {name: 'Search:'}), 'test');

    expect(consoleSpy).toHaveBeenCalledTimes(4);
  });
});
