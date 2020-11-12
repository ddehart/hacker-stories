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

  test('logs events to the console when typing into the search input', () => {
    const consoleSpy = jest.spyOn(console, 'log');

    userEvent.type(screen.getByRole('textbox', {name: 'Search:'}), 'test');

    expect(consoleSpy).toBeCalledTimes(4);
  });
});
