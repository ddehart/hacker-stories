import axios from 'axios';
import React from 'react';

const endpoint = 'https://hn.algolia.com/api/v1/search?query=';

const storiesReducer = (state, action) => {
  switch (action.type) {
    case 'stories_fetch_init':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'stories_fetch_success':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case 'stories_fetch_failure':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case 'remove_story':
      return {
        ...state,
        data: state.data.filter(
          story => action.payload.objectID !== story.objectID
        ),
      };
    default:
      throw new Error();
  }
};

/**
 * @param {string} key
 * @param {string} initialState
 */
const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue];
}

const App = () => {
  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React');

  const [url, setUrl] = React.useState(
    `${endpoint}${searchTerm}`
  );

  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    {
      data: [],
      isLoading: false,
      isError: false,
    }
  );

  const handleSearchInput = event => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = event => {
    setUrl(`${endpoint}${searchTerm}`);

    event.preventDefault();
  };

  const handleFetchStories = React.useCallback(async () => {
    dispatchStories({ type: 'stories_fetch_init' });

    try {
      const result = await axios.get(url);

      dispatchStories({
        type: 'stories_fetch_success',
        payload: result.data.hits,
      })
    } catch {
      dispatchStories({ type: 'stories_fetch_failure' });
    }
  }, [url]);

  React.useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleRemoveStory = item => {
    dispatchStories({
      type: 'remove_story',
      payload: item,
    });
  };

  return (
    <div>
      <h1>Hacker Stories</h1>

      <SearchForm searchTerm={searchTerm} onSearchInput={handleSearchInput} onSearchSubmit={handleSearchSubmit}/>

      <hr/>

      {stories.isError && <p>Something went wrong ...</p>}

      {stories.isLoading ? (
        <p>Loading ...</p>
      ) : (
      <div data-testid='stories-list'>
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      </div>
      )}
    </div>
  );
};

const SearchForm = ({searchTerm, onSearchInput, onSearchSubmit}) => (
  <form onSubmit={onSearchSubmit}>
    <InputWithLabel id={'search'} value={searchTerm} isFocused onInputChange={onSearchInput}>
      <strong>Search:</strong>
    </InputWithLabel>

    <button id='search-button' type='submit' disabled={!searchTerm}>
      Submit
    </button>
  </form>
);

const InputWithLabel = ({ id, value, type = 'text', onInputChange, isFocused, children }) => {
  const inputRef = React.useRef();

  React.useEffect(() => {
    if (isFocused) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <label htmlFor={id}>{children}</label>
      <input
        ref={inputRef}
        id={id}
        type={type}
        name='story-search'
        autoComplete='story-search'
        value={value}
        onChange={onInputChange}
      />
    </>
  );
};

const List = ({ list, onRemoveItem }) =>
  list.map(item =>
    <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
  );

const Item = ({ item, onRemoveItem }) => (
  <div className='story'>
    <span>
      <a href={item.url}>{item.title}</a>
    </span>
    <span>{item.author}</span>
    <span>{item.num_comments}</span>
    <span>{item.points}</span>
    <span>
      <button type='button' onClick={() => onRemoveItem(item)}>Dismiss</button>
    </span>
  </div>
);

export default App;
