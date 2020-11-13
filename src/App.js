import React from 'react';

const App = () => {
  const stories = [
    {
      title: 'React',
      url: 'https://reactjs.org/',
      author: 'Jordan Walke',
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: 'Redux',
      url: 'https://redux.js.org/',
      author: 'Dan Abramov, Andrew Clark',
      num_comments: 2,
      points: 5,
      objectID: 1,
    },
  ];

  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  };

  const searchedStories = stories.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>Hacker Stories</h1>

      <Search onSearch={handleSearch} />

      <hr/>

      <List list={searchedStories}/>
    </div>
  );
};

const Search = props => {
  return (
    <div>
      <label htmlFor='search'>Search: </label>
      <input id='search' type='text' name='story-search' autoComplete='story-search' onChange={props.onSearch}/>
    </div>
  );
};

const List = props =>
  props.list.map(story => (
    <div key={story.objectID}>
      <span>
        <a href={story.url}>{story.title}</a>
      </span>
      <span>{story.author}</span>
      <span>{story.num_comments}</span>
      <span>{story.points}</span>
    </div>
  ));

export default App;
