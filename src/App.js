import React from 'react';

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

const App = () => {
  const handleChange = event => {
    console.log(event)
  };

  return (
    <div>
      <h1>Hacker Stories</h1>

      <label htmlFor='search'>Search: </label>
      <input id='search' type='text' onChange={handleChange}/>

      <hr/>

      <List/>
    </div>
  );
}

const List = () =>
  stories.map(story => (
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
