import React from 'react';

import Input from './input';
import './search.css';

const Search = ({ searchTerm, onSearchInput, onSearchSubmit }) => (
  <form aria-label={'Search Form'} onSubmit={onSearchSubmit}>
    <Input
      id={'search'}
      value={searchTerm}
      onInputChange={onSearchInput}
      isFocused
    >
      Search:
    </Input>
    <button type={'submit'} disabled={!searchTerm}>
      Submit
    </button>
  </form>
);

export default Search;
