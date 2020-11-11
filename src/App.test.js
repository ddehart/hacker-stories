import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Hello React heading', () => {
  render(<App />);

  expect(screen.getByRole('heading')).toHaveTextContent('Hello React');
});

test('renders search text input', () => {
  render(<App />);

  expect(screen.getByLabelText('Search:')).toHaveAttribute('type', 'text');
});
