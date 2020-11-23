import React from 'react';
import { render, screen } from '@testing-library/react';

import List from '../list';

const list = [
  {
    objectID: 1,
    url: 'https://www.roadtoreact.com/',
    title: 'Road to React',
    author: 'Robin Wieruch',
    num_comments: 5,
    points: 10,
  },
  {
    objectID: 2,
    url: 'https://www.roadtoredux.com/',
    title: 'Road to Redux',
    author: 'Robin Wieruch',
    num_comments: 27,
    points: 42,
  },
];

describe('The List component', () => {
  test('renders a list of items with headers', () => {
    render(<List list={ list } />);

    expect(screen.getByRole('button', {name: 'Title'})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Author'})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Comments'})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Points'})).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();

    expect(screen.getByText('Road to React')).toBeInTheDocument();
    expect(screen.getByText('Road to Redux')).toBeInTheDocument();
  });

  test('calls the callback handler upon clicking an Item button', () => {
    const handleRemoveItem = jest.fn();

    render(<List list={list} onRemoveItem={handleRemoveItem} /> );

    const buttons = screen.getAllByRole('button', {name: 'Dismiss'});
    buttons[0].click();

    expect(handleRemoveItem).toHaveBeenCalledWith(list[0]);
  });
});
