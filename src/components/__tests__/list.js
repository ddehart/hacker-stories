import { sortBy } from 'lodash';
import React from 'react';
import { render, screen, within } from '@testing-library/react';

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
  {
    objectID: 3,
    url: 'https://www.roadtoreact.com/',
    title: 'Another Book',
    author: 'A Different Robin Wieruch',
    num_comments: 15,
    points: 23,
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
    expect(screen.getByText('Another Book')).toBeInTheDocument();
  });

  test('calls the callback handler upon clicking an Item button', () => {
    const handleRemoveItem = jest.fn();

    render(<List list={list} onRemoveItem={handleRemoveItem} /> );

    const buttons = screen.getAllByRole('button', {name: 'Dismiss'});
    buttons[0].click();

    expect(handleRemoveItem).toHaveBeenCalledWith(list[0]);
  });

  test('sorts items by title upon clicking the Title heading', () => {
    render(<List list={list} />);

    screen.getByRole('button', {name: 'Title'}).click();

    const listItems = screen.getAllByTestId('list-item');
    const titleSortedList = sortBy(list, 'title');

    listItems.forEach((item, index) => {
      expect(within(item).getByText(titleSortedList[index].title)).toBeInTheDocument();
    })
  });

  test('sorts items by author upon clicking the Author heading', () => {
    render(<List list={list} />);

    screen.getByRole('button', {name: 'Author'}).click();

    const listItems = screen.getAllByTestId('list-item');
    const authorSortedList = sortBy(list, 'author');

    listItems.forEach((item, index) => {
      expect(within(item).getByText(authorSortedList[index].title)).toBeInTheDocument();
    })
  });

  test('sorts items by comments upon clicking the Comments heading', () => {
    render(<List list={list} />);

    screen.getByRole('button', {name: 'Comments'}).click();

    const listItems = screen.getAllByTestId('list-item');
    const commentSortedList = sortBy(list, 'num_comments').reverse();

    listItems.forEach((item, index) => {
      expect(within(item).getByText(commentSortedList[index].title)).toBeInTheDocument();
    })
  });

  test('sorts items by points upon clicking the Points heading', () => {
    render(<List list={list} />);

    screen.getByRole('button', {name: 'Points'}).click();

    const listItems = screen.getAllByTestId('list-item');
    const commentSortedList = sortBy(list, 'points').reverse();

    listItems.forEach((item, index) => {
      expect(within(item).getByText(commentSortedList[index].title)).toBeInTheDocument();
    })
  });
});
