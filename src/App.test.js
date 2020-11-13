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

  test('renders search text input with an initial value', () => {
    const searchBox = screen.getByRole('textbox', {name: 'Search:'});

    expect(searchBox).toBeInTheDocument();
    expect(searchBox).toHaveValue('React');
  });

  test('renders a story based on the initial value of the text input', () => {
    stories = require('../cypress/fixtures/stories.json');
    const filteredStories = stories.filter(story =>
      story.title.includes('React')
    );

    for(const story of filteredStories) {
      expect(screen.getByText(story.title)).toHaveAttribute('href', story.url);
      screen.getByText(story.author);
      screen.getByText(story.num_comments.toString());
      screen.getByText(story.points.toString());
    }
  });

  test('renders all stories with no value in the text input', () => {
    const searchBox = screen.getByRole('textbox', {name: 'Search:'});
    stories = require('../cypress/fixtures/stories.json');

    userEvent.clear(searchBox);

    for(const story of stories) {
      expect(screen.getByText(story.title)).toHaveAttribute('href', story.url);
      screen.getByText(story.author);
      screen.getByText(story.num_comments.toString());
      screen.getByText(story.points.toString());
    }
  });

  test('renders the list of stories based on text typed into the search textbox', () => {
    const searchBox = screen.getByRole('textbox', {name: 'Search:'});
    userEvent.clear(searchBox);

    userEvent.type(searchBox, 'react');
    expect(screen.queryByText('React')).toBeInTheDocument();
    expect(screen.queryByText('Redux')).not.toBeInTheDocument();
  });
});
