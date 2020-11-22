import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Search from '../search';

const onSearchInput = jest.fn();
const onSearchSubmit = jest.fn();

describe('The Search component', () => {
  test('renders a search form with a search field and a submit button', () => {
    render(<Search />);

    const searchForm = screen.queryByRole('form', {name: 'Search Form'})

    expect(searchForm).toBeInTheDocument();
    expect(within(searchForm).getByLabelText('Search:')).toBeInTheDocument();
    expect(within(searchForm).getByRole('button', {name: 'Submit'})).toBeInTheDocument();
    expect(within(searchForm).getByRole('button', {name: 'Submit'}))
      .toHaveAttribute('type', 'submit')
  });

  test('renders a search form with the search value populated given a search term', () => {
    render(<Search searchTerm={'search'} onSearchInput={onSearchInput}/>);

    expect(screen.getByLabelText('Search:')).toHaveValue('search');
  });

  test('renders a search form with no search value populated given no search term', () => {
    render(<Search />);

    expect(screen.getByLabelText('Search:')).toHaveValue('');
  });

  test('calls the callback handler on typing into the search field', () => {
    render(<Search onSearchInput={onSearchInput} />);

    userEvent.type(screen.getByLabelText('Search:'), 'search');

    expect(onSearchInput).toHaveBeenCalledTimes(6);
  });

  test('renders with the search field focused', () => {
    render(<Search />);

    expect(screen.getByLabelText('Search:')).toHaveFocus();
  });

  test('renders an enabled button given an initial search term', () => {
    render(<Search searchTerm={'search'} onSearchInput={onSearchInput} />);

    expect(screen.getByRole('button', {name: 'Submit'})).toBeEnabled();
  });

  test('renders a disabled button given no search term', () => {
    render(<Search />);

    expect(screen.getByRole('button', {name: 'Submit'})).toBeDisabled();
  });

  test('calls the callback handler when submitting the form', () => {
    onSearchSubmit.mockImplementation(
      /**
       *
       * @param event {Event}
       */
      event => {
      event.preventDefault();
    });

    render(<Search searchTerm={'search'} onSearchInput={onSearchInput} onSearchSubmit={onSearchSubmit} />);

    screen.getByRole('button', {name: 'Submit'}).click();

    // Note to future self; this works without the mockImplementation:
    // fireEvent.submit(screen.getByRole('form', {name: 'Search Form'}));

    expect(onSearchSubmit).toHaveBeenCalledTimes(1);
  });
});
