import React from 'react';
import { render, screen } from '@testing-library/react';

import Item from '../item';

const item = {
  objectId: 1,
  url: 'https://www.roadtoreact.com/',
  title: 'Road to React',
  author: 'Robin Wieruch',
  num_comments: 5,
  points: 10,
};

describe('The Item component', () => {
  test('renders all properties', () => {

    render(<Item item={item} />);

    expect(screen.getByRole('link', {name: item.title})).toBeInTheDocument();
    expect(screen.getByRole('link', {name: item.title})).toHaveAttribute('href', item.url);
    expect(screen.getByText(item.author)).toBeInTheDocument();
    expect(screen.getByText(item.num_comments.toString())).toBeInTheDocument();
    expect(screen.getByText(item.points.toString())).toBeInTheDocument();
  });

  test('renders a clickable button', () => {
    render(<Item item={item} /> );

    expect(screen.getByRole('button', {name: 'Dismiss'})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Dismiss'})).toBeEnabled();
  });

  test('calls the callback handler upon clicking the button', () => {
    const handleRemoveItem = jest.fn();

    render(<Item item={item} onRemoveItem={handleRemoveItem} />);

    screen.getByRole('button', {name: 'Dismiss'}).click();

    expect(handleRemoveItem).toHaveBeenCalledWith(item);
  });
});
