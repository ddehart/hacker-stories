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

  test('renders the list of stories based on text typed into the search textbox', () => {
    const searchBox = screen.getByRole('textbox', {name: 'Search:'});

    userEvent.type(searchBox, 'react');
    expect(screen.queryByText('React')).toBeInTheDocument();
    expect(screen.queryByText('Redux')).not.toBeInTheDocument();
  });
});
